<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import alignmentsData from '$lib/data/alignments.json';

  onMount(() => {
    // Redirect root to /compare with first ID, or convert query params to dynamic route
    const idParam = $page.url.searchParams.get('id');
    if (idParam) {
      goto(`/compare/${idParam}`, { replaceState: true });
    } else {
      // Default to first correspondence
      const firstId = alignmentsData.correspondences[0].id;
      goto(`/compare/${firstId}`, { replaceState: true });
    }
  });
</script>

<div class="redirecting">
  Redirecting...
</div>

<style>
  .redirecting {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
  }
</style>
