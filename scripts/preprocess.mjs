/**
 * SCALE Align Data Preprocessor
 * Converts raw alignment files into optimized JSON for the web application
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const DATA_DIR = join(import.meta.dirname, '..', 'data');
const OUTPUT_DIR = join(import.meta.dirname, '..', 'src', 'lib', 'data');

// Parse alignment line format: [srcLines]:[tgtLines]:score
function parseAlignmentLine(line) {
  const match = line.match(/^\[([\d,]*)\]:\[([\d,]*)\]:([\d.]+)$/);
  if (!match) return null;

  const srcLines = match[1] ? match[1].split(',').map(Number) : [];
  const tgtLines = match[2] ? match[2].split(',').map(Number) : [];
  const score = parseFloat(match[3]);

  // Determine alignment type
  let type;
  if (srcLines.length === 0 || tgtLines.length === 0) {
    type = 'unmatched';
  } else if (srcLines.length === 1 && tgtLines.length === 1) {
    type = '1:1';
  } else if (srcLines.length === 1) {
    type = '1:N';
  } else if (tgtLines.length === 1) {
    type = 'N:1';
  } else {
    type = 'N:M';
  }

  // Sort key: minimum source line (or target if unmatched on source)
  const sortKey = srcLines.length > 0 ? Math.min(...srcLines) :
    tgtLines.length > 0 ? Math.min(...tgtLines) : Infinity;

  return { srcLines, tgtLines, score, type, sortKey };
}

// Load text file as array of lines (0-indexed)
function loadTextFile(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    return content.split(/\r?\n/).filter((line, idx, arr) => {
      return idx < arr.length - 1 || line.trim() !== '';
    });
  } catch (e) {
    console.warn(`Could not load: ${filePath}`);
    return [];
  }
}

// Natural sort comparator for codes like A0111, C101, S9020
function naturalCompare(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

// Main preprocessing
function preprocess() {
  const correspondenceFile = join(DATA_DIR, 'correspondence.json');
  const correspondences = JSON.parse(readFileSync(correspondenceFile, 'utf-8'));

  console.log(`Processing ${correspondences.length} correspondences...`);

  const result = {
    metadata: {
      source: { name: 'ISIC5', folder: 'txt-isic5' },
      target: { name: 'NACE21', folder: 'txt-nace21' },
      generatedAt: new Date().toISOString()
    },
    correspondences: []
  };

  for (const [srcCode, tgtCode] of correspondences) {
    const alignFile = join(DATA_DIR, 'align', `${srcCode}_${tgtCode}.txt`);
    const srcTextFile = join(DATA_DIR, 'txt-isic5', `${srcCode}.txt`);
    const tgtTextFile = join(DATA_DIR, 'txt-nace21', `${tgtCode}.txt`);

    const sourceText = loadTextFile(srcTextFile);
    const targetText = loadTextFile(tgtTextFile);

    // Parse and sort alignments by source line index (sentence order)
    let alignments = [];
    try {
      const alignContent = readFileSync(alignFile, 'utf-8');
      for (const line of alignContent.split(/\r?\n/)) {
        if (line.trim()) {
          const parsed = parseAlignmentLine(line.trim());
          if (parsed) {
            alignments.push(parsed);
          }
        }
      }
    } catch (e) {
      console.warn(`Could not load alignment: ${alignFile}`);
    }

    // Sort alignments by sortKey (index 0 appears first)
    alignments.sort((a, b) => a.sortKey - b.sortKey);

    // Remove sortKey from output (internal use only)
    alignments = alignments.map(({ sortKey, ...rest }) => rest);

    const alignedCount = alignments.filter(a => a.type !== 'unmatched').length;
    const avgScore = alignedCount > 0
      ? alignments.filter(a => a.score > 0).reduce((sum, a) => sum + a.score, 0) / alignedCount
      : 0;

    result.correspondences.push({
      id: `${srcCode}_${tgtCode}`,
      source: { code: srcCode },
      target: { code: tgtCode },
      sourceText,
      targetText,
      alignments,
      stats: {
        totalAlignments: alignments.length,
        alignedCount,
        avgScore: Math.round(avgScore * 1000) / 1000,
        types: {
          '1:1': alignments.filter(a => a.type === '1:1').length,
          '1:N': alignments.filter(a => a.type === '1:N').length,
          'N:1': alignments.filter(a => a.type === 'N:1').length,
          'N:M': alignments.filter(a => a.type === 'N:M').length,
          'unmatched': alignments.filter(a => a.type === 'unmatched').length
        }
      }
    });

    console.log(`  ✓ ${srcCode} ↔ ${tgtCode}: ${alignments.length} alignments`);
  }

  // Sort correspondences alphabetically by source code
  result.correspondences.sort((a, b) => naturalCompare(a.source.code, b.source.code));

  mkdirSync(OUTPUT_DIR, { recursive: true });

  const outputPath = join(OUTPUT_DIR, 'alignments.json');
  writeFileSync(outputPath, JSON.stringify(result, null, 2));
  console.log(`\nGenerated: ${outputPath}`);
  console.log(`Total: ${result.correspondences.length} correspondences (sorted alphabetically)`);
}

preprocess();
