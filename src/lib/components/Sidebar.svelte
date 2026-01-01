<script lang="ts">
  import { appState } from '$lib/state.svelte';
  
  let listContainer: HTMLElement;
  
  // Auto-scroll to selected item when it changes
  $effect(() => {
    if (appState.selectedId && listContainer) {
      // Find the element. We use data-id attribute.
      // Ideally we'd maintain a map of refs, but querySelector is fine for this list size.
      const item = listContainer.querySelector(`[data-id="${appState.selectedId}"]`) as HTMLElement;
      item?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  });

  function selectCorrespondence(id: string) {
    appState.selectedId = id;
  }
</script>

<aside class="sidebar">
  
  <div class="search-wrapper">
    <input
      type="text"
      class="search-input"
      placeholder="Search codes..."
      bind:value={appState.searchQuery}
    />
    {#if appState.searchQuery}
      <button class="search-clear" onclick={() => appState.searchQuery = ''}>×</button>
    {/if}
  </div>
  
  <div class="sort-toggle">
    <span class="sort-label">Sort by:</span>
    <button class="sort-btn" class:active={appState.sortBy === 'source'} onclick={() => appState.sortBy = 'source'}>
      ISIC
    </button>
    <button class="sort-btn" class:active={appState.sortBy === 'target'} onclick={() => appState.sortBy = 'target'}>
      NACE
    </button>
  </div>
  
  <nav class="list" bind:this={listContainer}>
    {#each appState.filteredCorrespondences as c (c.id)}
      <button
        class="list-item"
        class:selected={appState.selectedId === c.id}
        data-id={c.id}
        onclick={() => selectCorrespondence(c.id)}
      >
        <span class="codes">
          {#if appState.sortBy === 'source'}
            <span class="code-primary">{c.source.code}</span>
            <span class="code-sep">↔</span>
            <span class="code-secondary">{c.target.code}</span>
          {:else}
            <span class="code-primary">{c.target.code}</span>
            <span class="code-sep">↔</span>
            <span class="code-secondary">{c.source.code}</span>
          {/if}
        </span>
      </button>
    {:else}
      <p class="empty">No matches</p>
    {/each}
  </nav>
  
  <footer class="footer">
    <span class="hint">↑↓ Navigate</span>
  </footer>
</aside>

<style>
  .sidebar {
    width: 280px;
    height: 100%;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    background: var(--bg-secondary);
    border-right: 1px solid var(--border-subtle);
  }
  
  .search-wrapper {
    position: relative;
    padding: var(--spacing-sm) var(--spacing-md);
  }
  
  .search-input {
    width: 100%;
    padding: var(--spacing-sm) var(--spacing-md);
    background: var(--bg-tertiary);
    border-radius: var(--radius-sm);
    font-size: 13px;
  }
  
  .search-input::placeholder { color: var(--text-muted); }
  
  .search-clear {
    position: absolute;
    right: 24px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted);
    font-size: 16px;
  }
  
  .sort-toggle {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) var(--spacing-md);
    border-bottom: 1px solid var(--border-subtle);
  }
  
  .sort-label {
    font-size: 11px;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .sort-btn {
    padding: 4px 10px;
    font-size: 11px;
    font-weight: 500;
    border-radius: var(--radius-sm);
    color: var(--text-secondary);
    background: var(--bg-tertiary);
    transition: all var(--transition);
  }
  
  .sort-btn:hover {
    color: var(--text-primary);
  }
  
  .sort-btn.active {
    background: var(--accent-primary);
    color: white;
  }
  
  .list {
    flex: 1;
    overflow-y: auto;
    padding: var(--spacing-sm);
  }
  
  .list-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    width: 100%;
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--radius-sm);
    text-align: left;
    transition: background var(--transition);
  }
  
  .list-item:hover { background: var(--bg-tertiary); }
  
  .list-item.selected { background: var(--accent-source-bg); }
  
  .codes {
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
  }
  
  .code-primary {
    font-weight: 600;
    color: var(--text-primary);
  }
  
  .code-secondary {
    color: var(--text-secondary);
  }
  
  .code-sep {
    color: var(--text-muted);
    font-size: 10px;
  }
  
  .empty {
    padding: var(--spacing-lg);
    text-align: center;
    color: var(--text-muted);
    font-size: 13px;
  }
  
  .footer {
    padding: var(--spacing-sm) var(--spacing-md);
    border-top: 1px solid var(--border-subtle);
  }
  
  .hint {
    font-size: 11px;
    color: var(--text-muted);
  }
</style>
