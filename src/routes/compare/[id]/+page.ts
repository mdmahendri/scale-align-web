import alignmentsData from '$lib/data/alignments.json';
import type { AlignmentData } from '$lib/types';

export const prerender = true;

const data = alignmentsData as AlignmentData;

export function entries() {
    // Generate all possible ID combinations from alignments data
    return data.correspondences.map((corr) => ({
        id: corr.id
    }));
}
