/**
 * Types for SCALE Align Web
 */

export interface AlignmentData {
    metadata: {
        source: { name: string; folder: string };
        target: { name: string; folder: string };
        generatedAt: string;
    };
    correspondences: Correspondence[];
}

export interface Correspondence {
    id: string;
    source: { code: string };
    target: { code: string };
    sourceText: string[];
    targetText: string[];
    alignments: Alignment[];
    stats: CorrespondenceStats;
}

export interface Alignment {
    srcLines: number[];
    tgtLines: number[];
    score: number;
    type: AlignmentType;
}

export type AlignmentType = '1:1' | '1:N' | 'N:1' | 'N:M' | 'unmatched';

export interface CorrespondenceStats {
    totalAlignments: number;
    alignedCount: number;
    avgScore: number;
    types: Record<AlignmentType, number>;
}

export interface DiffSegment {
    text: string;
    type: 'match' | 'source-only' | 'target-only';
}

export interface DiffResult {
    source: DiffSegment[];
    target: DiffSegment[];
}
