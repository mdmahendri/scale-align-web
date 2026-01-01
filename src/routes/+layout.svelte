<script lang="ts">
  import '../app.css';
  import { page } from '$app/stores';
  
  let { children } = $props();
  
  let theme = $state<'light' | 'dark'>('dark');
  
  // Apply theme to document
  $effect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  });
</script>

<div class="app-root">
  <nav class="navbar">
    <div class="nav-brand">
      <span class="nav-icon">⚖</span>
      <span class="nav-title">SCALE Align</span>
    </div>
    <div class="nav-links">
      <a href="/" class="nav-link" class:active={$page.url.pathname === '/' || $page.url.pathname.startsWith('/compare')}>Compare</a>
      <a href="/findings" class="nav-link" class:active={$page.url.pathname === '/findings'}>Findings</a>
    </div>
    <button class="theme-btn" onclick={() => theme = theme === 'light' ? 'dark' : 'light'}>
      {#if theme === 'light'}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      {:else}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="5"/>
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>
      {/if}
    </button>
  </nav>
  
  <main class="main-area">
    {@render children()}
  </main>
  
  <footer class="footer">
    <span>Built by Mahendri Dwicahyo</span>
    <span class="footer-divider">·</span>
    <a href="https://github.com/mdmahendri/scale-align" target="_blank" rel="noopener">GitHub (Package)</a>
    <span class="footer-divider">·</span>
    <a href="https://github.com/mdmahendri/scale-align-web" target="_blank" rel="noopener">GitHub (Web)</a>
  </footer>
</div>

<style>
  .app-root {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
  }
  
  .navbar {
    display: flex;
    align-items: center;
    gap: var(--spacing-lg);
    padding: 0 var(--spacing-lg);
    height: 52px;
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border-subtle);
    flex-shrink: 0;
  }
  
  .nav-brand {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }
  
  .nav-icon { font-size: 20px; }
  
  .nav-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
  }
  
  .nav-links {
    display: flex;
    gap: var(--spacing-xs);
    margin-left: var(--spacing-md);
  }
  
  .nav-link {
    padding: 6px 14px;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-secondary);
    text-decoration: none;
    border-radius: var(--radius-sm);
    transition: all var(--transition);
  }
  
  .nav-link:hover {
    background: var(--bg-tertiary);
    color: var(--text-primary);
  }
  
  .nav-link.active {
    background: var(--accent-source-bg);
    color: var(--accent-source);
  }
  
  .theme-btn {
    margin-left: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: var(--radius-sm);
    color: var(--text-secondary);
    transition: all var(--transition);
  }
  
  .theme-btn:hover {
    background: var(--bg-tertiary);
    color: var(--text-primary);
  }
  
  .main-area {
    flex: 1;
    overflow: hidden;
  }
  
  .footer {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) var(--spacing-lg);
    font-size: 12px;
    color: var(--text-muted);
    background: var(--bg-secondary);
    border-top: 1px solid var(--border-subtle);
    flex-shrink: 0;
  }
  
  .footer a {
    color: var(--text-secondary);
    text-decoration: none;
    transition: color var(--transition);
  }
  
  .footer a:hover {
    color: var(--accent-source);
  }
  
  .footer-divider {
    opacity: 0.5;
  }
</style>
