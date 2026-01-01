import alignmentsData from '$lib/data/alignments.json';

export const prerender = true;

interface Correspondence {
    id: string;
}

interface AlignmentsData {
    correspondences: Correspondence[];
}

const data = alignmentsData as AlignmentsData;

export function entries() {
    // Generate all possible ID combinations from alignments data
    return data.correspondences.map((corr) => ({
        id: corr.id
    }));
}
