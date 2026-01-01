/**
 * Word-level diff algorithm for comparing aligned sentences
 * Uses neutral colors to compare parallel standards (not insertion/deletion)
 */

import type { DiffResult, DiffSegment } from './types';

/**
 * Tokenize text into words, preserving punctuation as separate tokens
 */
function tokenize(text: string): string[] {
    return text.split(/(\s+|[.,;:!?()[\]{}"-])/).filter(t => t.trim().length > 0);
}

/**
 * Normalize word for comparison (lowercase, trim)
 */
function normalize(word: string): string {
    return word.toLowerCase().trim();
}

/**
 * Compute Longest Common Subsequence indices
 */
function lcs(a: string[], b: string[]): [number, number][] {
    const m = a.length;
    const n = b.length;

    // Build LCS table
    const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (normalize(a[i - 1]) === normalize(b[j - 1])) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    // Backtrack to find matching pairs
    const matches: [number, number][] = [];
    let i = m, j = n;

    while (i > 0 && j > 0) {
        if (normalize(a[i - 1]) === normalize(b[j - 1])) {
            matches.unshift([i - 1, j - 1]);
            i--; j--;
        } else if (dp[i - 1][j] > dp[i][j - 1]) {
            i--;
        } else {
            j--;
        }
    }

    return matches;
}

/**
 * Compute word-level diff between source and target text
 */
export function wordDiff(source: string, target: string): DiffResult {
    const srcTokens = tokenize(source);
    const tgtTokens = tokenize(target);

    const matches = lcs(srcTokens, tgtTokens);
    const srcMatched = new Set(matches.map(m => m[0]));
    const tgtMatched = new Set(matches.map(m => m[1]));

    const srcResult: DiffSegment[] = srcTokens.map((text, i) => ({
        text,
        type: srcMatched.has(i) ? 'match' : 'source-only'
    }));

    const tgtResult: DiffSegment[] = tgtTokens.map((text, i) => ({
        text,
        type: tgtMatched.has(i) ? 'match' : 'target-only'
    }));

    // Merge consecutive segments of the same type
    return {
        source: mergeSegments(srcResult),
        target: mergeSegments(tgtResult)
    };
}

function mergeSegments(segments: DiffSegment[]): DiffSegment[] {
    if (segments.length === 0) return [];

    const merged: DiffSegment[] = [];
    let current = { ...segments[0] };

    for (let i = 1; i < segments.length; i++) {
        const seg = segments[i];
        if (seg.type === current.type) {
            current.text += ' ' + seg.text;
        } else {
            merged.push(current);
            current = { ...seg };
        }
    }
    merged.push(current);

    return merged;
}

/**
 * Compute similarity ratio (0-1) between two strings
 */
export function textSimilarity(source: string, target: string): number {
    const srcTokens = tokenize(source);
    const tgtTokens = tokenize(target);

    if (srcTokens.length === 0 && tgtTokens.length === 0) return 1;
    if (srcTokens.length === 0 || tgtTokens.length === 0) return 0;

    const matches = lcs(srcTokens, tgtTokens);
    return (2 * matches.length) / (srcTokens.length + tgtTokens.length);
}
