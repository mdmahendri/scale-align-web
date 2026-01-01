<script lang="ts">
  import type { Alignment, Correspondence } from '$lib/types';
  import { wordDiff } from '$lib/diff';
  
  let { correspondence }: { correspondence: Correspondence } = $props();
  
  function getSourceText(alignment: Alignment): string {
    return alignment.srcLines
      .map(line => correspondence.sourceText[line] || '')
      .filter(t => t)
      .join(' ');
  }
  
  function getTargetText(alignment: Alignment): string {
    return alignment.tgtLines
      .map(line => correspondence.targetText[line] || '')
      .filter(t => t)
      .join(' ');
  }
  
  // Only show diff for well-matched pairs
  function shouldShowDiff(alignment: Alignment): boolean {
    return alignment.score >= 0.85 && alignment.type === '1:1';
  }
  
  // Get diff segments for an alignment
  function getDiff(alignment: Alignment) {
    const src = getSourceText(alignment);
    const tgt = getTargetText(alignment);
    return wordDiff(src, tgt);
  }
  
  // Filter to only show meaningful alignments
  let visibleAlignments = $derived(correspondence.alignments.filter(a => {
    if (a.type !== 'unmatched') return true;
    return a.srcLines.length > 0 || a.tgtLines.length > 0;
  }));
</script>

<article class="alignment-view">
  <header class="view-header">
    <h1 class="title">
      <span class="code source">{correspondence.source.code}</span>
      <span class="separator">↔</span>
      <span class="code target">{correspondence.target.code}</span>
    </h1>
    <div class="legend">
      <span class="legend-item">
        <span class="legend-color source"></span>
        ISIC5
      </span>
      <span class="legend-item">
        <span class="legend-color target"></span>
        NACE21
      </span>
    </div>
  </header>
  
  <div class="alignments">
    {#each visibleAlignments as alignment}
      {@const showDiff = shouldShowDiff(alignment)}
      {@const diff = showDiff ? getDiff(alignment) : null}
      
      <div class="row">
        <div class="comparison">
          <!-- Source column (ISIC5) -->
          <div class="side source" class:empty={alignment.srcLines.length === 0}>
            {#if alignment.srcLines.length > 0}
              {#if showDiff && diff}
                {#each diff.source as segment}
                  <span class={segment.type === 'source-only' ? 'diff-source' : ''}>{segment.text}</span>{' '}
                {/each}
              {:else}
                {getSourceText(alignment)}
              {/if}
            {:else}
              <span class="empty-label">No match in ISIC5</span>
            {/if}
          </div>
          
          <!-- Target column (NACE21) -->
          <div class="side target" class:empty={alignment.tgtLines.length === 0}>
            {#if alignment.tgtLines.length > 0}
              {#if showDiff && diff}
                {#each diff.target as segment}
                  <span class={segment.type === 'target-only' ? 'diff-target' : ''}>{segment.text}</span>{' '}
                {/each}
              {:else}
                {getTargetText(alignment)}
              {/if}
            {:else}
              <span class="empty-label">No match in NACE21</span>
            {/if}
          </div>
        </div>
      </div>
    {/each}
  </div>
</article>

<style>
  .alignment-view {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  
  .view-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-lg) var(--spacing-xl);
    border-bottom: 1px solid var(--border-subtle);
    background: var(--bg-secondary);
  }
  
  .title {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    font-family: 'JetBrains Mono', monospace;
    font-size: 18px;
    font-weight: 600;
  }
  
  .code.source { color: var(--accent-source); }
  .code.target { color: var(--accent-target); }
  .separator { color: var(--text-muted); font-weight: 400; }
  
  .legend {
    display: flex;
    gap: var(--spacing-md);
  }
  
  .legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--text-secondary);
  }
  
  .legend-color {
    width: 12px;
    height: 3px;
    border-radius: 2px;
  }
  
  .legend-color.source { background: var(--accent-source); }
  .legend-color.target { background: var(--accent-target); }
  
  .alignments {
    flex: 1;
    overflow-y: auto;
    padding: var(--spacing-lg) var(--spacing-xl);
  }
  
  .row {
    margin-bottom: var(--spacing-md);
  }
  
  .comparison {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-md);
  }
  
  .side {
    padding: var(--spacing-md);
    background: var(--bg-tertiary);
    border-radius: var(--radius-sm);
    font-size: 14px;
    line-height: 1.7;
    word-wrap: break-word;
    color: var(--text-primary);
  }
  
  .side.source {
    border-left: 3px solid var(--accent-source);
  }
  
  .side.target {
    border-left: 3px solid var(--accent-target);
  }
  
  /* Empty side - shows gap clearly with dashed border */
  .side.empty {
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-secondary);
    border-style: dashed;
    border-width: 1px;
    border-color: var(--border-medium);
  }
  
  .side.source.empty {
    border-left: 3px dashed var(--accent-source);
  }
  
  .side.target.empty {
    border-left: 3px dashed var(--accent-target);
  }
  
  .empty-label {
    font-size: 12px;
    font-style: italic;
    color: var(--text-muted);
  }
</style>
