<script lang="ts">
  import { appState } from '$lib/state.svelte';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import AlignmentGrid from '$lib/components/AlignmentGrid.svelte';
  
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onMount, onDestroy } from 'svelte';
  
  let sidebarComponent: Sidebar;
  let isInitialLoad = true;
  
  // Handle deep linking via ?id= param on load
  onMount(() => {
    // We only read from URL if we are mounting (initial load of this view)
    const idParam = $page.url.searchParams.get('id');
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
       const currentId = $page.url.searchParams.get('id');
       if (currentId !== appState.selectedId) {
          const newUrl = new URL($page.url);
          newUrl.searchParams.set('id', appState.selectedId);
          goto(newUrl.toString(), { replaceState: true, keepFocus: true, noScroll: true });
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
