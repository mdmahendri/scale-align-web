import alignmentData from './data/alignments.json';
import type { AlignmentData } from './types';

// Natural sort comparator
function naturalCompare(a: string, b: string): number {
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

class AppState {
    data: AlignmentData = alignmentData as AlignmentData;
    selectedId = $state<string | null>(null);
    searchQuery = $state<string>('');
    sortBy = $state<'source' | 'target'>('source');

    filteredCorrespondences = $derived.by(() => {
        let items = this.data.correspondences;
        const q = this.searchQuery.trim().toLowerCase();

        if (q) {
            items = items.filter(c =>
                c.source.code.toLowerCase().includes(q) ||
                c.target.code.toLowerCase().includes(q)
            );
        }

        return [...items].sort((a, b) => {
            if (this.sortBy === 'source') {
                return naturalCompare(a.source.code, b.source.code);
            } else {
                return naturalCompare(a.target.code, b.target.code);
            }
        });
    });

    selectedCorrespondence = $derived.by(() => {
        if (!this.selectedId) return null;
        return this.data.correspondences.find(c => c.id === this.selectedId) || null;
    });

    navigateList(direction: 'up' | 'down') {
        const items = this.filteredCorrespondences;
        if (items.length === 0) return;

        if (!this.selectedId) {
            this.selectedId = items[0].id;
            return;
        }

        const idx = items.findIndex(c => c.id === this.selectedId);
        if (idx === -1) {
            this.selectedId = items[0].id;
            return;
        }

        const newIdx = direction === 'up'
            ? Math.max(0, idx - 1)
            : Math.min(items.length - 1, idx + 1);

        this.selectedId = items[newIdx].id;
    }
}

export const appState = new AppState();
