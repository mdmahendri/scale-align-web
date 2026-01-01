<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  onMount(() => {
    // Redirect root to /compare, preserving query params (e.g. ?id=...)
    goto('/compare' + $page.url.search, { replaceState: true });
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
