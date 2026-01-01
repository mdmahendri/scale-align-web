<script lang="ts">
  import { appState } from '$lib/state.svelte';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import AlignmentGrid from '$lib/components/AlignmentGrid.svelte';
  
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  
  let isInitialLoad = true;
  
  // Handle deep linking via dynamic route param on load
  onMount(() => {
    // Read from URL param
    const idParam = $page.params.id;
    if (idParam) {
      appState.selectedId = idParam;
    } else if (appState.filteredCorrespondences.length > 0 && !appState.selectedId) {
       // Default selection if no ID provided and no selection exists
       appState.selectedId = appState.filteredCorrespondences[0].id;
    }
    isInitialLoad = false;
  });

  // Sync URL when selectedId changes
  $effect(() => {
    // Only update if it changed and we are not in initial load phase
    if (appState.selectedId && !isInitialLoad) {
       const currentId = $page.params.id;
       if (currentId !== appState.selectedId) {
          goto(`/compare/${appState.selectedId}`, { replaceState: true, keepFocus: true, noScroll: true });
       }
    }
  });
  
  // Centralized keyboard handler (only place handling arrow keys)
  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      const direction = e.key === 'ArrowUp' ? 'up' : 'down';
      appState.navigateList(direction);
      // Sidebar auto-scrolls via its own effect
    }
  }

</script>

<svelte:head>
  <title>Compare ISIC {$page.params.id?.split('_')[0]} ↔ NACE {$page.params.id?.split('_')[1]} | SCALE Align</title>
  <meta name="description" content="View the correspondence between ISIC Rev.5 code {$page.params.id?.split('_')[0]} and NACE Rev.2.1 code {$page.params.id?.split('_')[1]}. Explore semantic alignment and mapping details." />
  <meta property="og:title" content="Compare ISIC {$page.params.id?.split('_')[0]} ↔ NACE {$page.params.id?.split('_')[1]}" />
  <meta property="og:description" content="View the correspondence between ISIC Rev.5 and NACE Rev.2.1 classification codes." />
  <meta property="og:url" content="https://scale-align.pages.dev/compare/{$page.params.id}/" />
  <link rel="canonical" href="https://scale-align.pages.dev/compare/{$page.params.id}/" />
</svelte:head>

<svelte:window onkeydown={handleKeydown} />

<div class="compare-layout">
  <Sidebar />
  
  <div class="compare-content">
    {#if appState.selectedCorrespondence}
      {#key appState.selectedCorrespondence.id}
        <AlignmentGrid correspondence={appState.selectedCorrespondence} />
      {/key}
    {:else}
      <div class="empty-state">
        <p>Select a correspondence</p>
      </div>
    {/if}
  </div>
</div>

<style>
  .compare-layout {
    display: flex;
    height: 100%;
  }
  
  .compare-content {
    flex: 1;
    overflow: hidden;
    background: var(--bg-primary);
  }
  
  .empty-state {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
  }
</style>
