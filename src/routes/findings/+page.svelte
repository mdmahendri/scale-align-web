<script lang="ts">
  // Findings page - displays findings data provided by user
  // The findings data can be edited in src/lib/data/findings.json
  
  import findingsData from '$lib/data/findings.json';
  
  interface Finding {
    id: string;
    correspondence: string;
    description: string;
    // Optional fields kept for type compatibility but not displayed
    type?: string;
    sourceText?: string;
    targetText?: string;
    priority?: string;
    status?: string;
  }
  
  const findings: Finding[] = findingsData.findings;
  
  function getCompareLink(correspondenceStr: string): string {
    // Parse "Code1 ↔ Code2" to "Code1_Code2"
    const parts = correspondenceStr.split(' ↔ ');
    if (parts.length === 2) {
      return `/compare?id=${parts[0]}_${parts[1]}`;
    }
    return '/compare';
  }
</script>

<div class="findings-page">
  <header class="page-header">
    <h1>Findings</h1>
    <p class="subtitle">Review detected differences and enrichment opportunities</p>
    <p class="edit-hint">Edit findings in <code>src/lib/data/findings.json</code></p>
  </header>
  
  <div class="findings-grid">
    {#if findings.length === 0}
      <div class="empty-state">
        <p>No findings yet.</p>
        <p class="hint">Add findings to <code>src/lib/data/findings.json</code></p>
      </div>
    {:else}
      {#each findings as finding (finding.id)}
        <article class="finding-card">
          <a href={getCompareLink(finding.correspondence)} class="card-link">
            <span class="correspondence-code">{finding.correspondence}</span>
            <span class="link-icon">↗</span>
          </a>
          
          <p class="finding-description">{finding.description}</p>
        </article>
      {/each}
    {/if}
  </div>
</div>

<style>
  .findings-page {
    height: 100%;
    overflow-y: auto;
    padding: var(--spacing-xl);
  }
  
  .page-header {
    margin-bottom: var(--spacing-xl);
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .page-header h1 {
    font-size: 28px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: var(--spacing-xs);
  }
  
  .subtitle {
    color: var(--text-secondary);
    font-size: 14px;
  }
  
  .edit-hint {
    margin-top: var(--spacing-sm);
    font-size: 12px;
    color: var(--text-muted);
  }
  
  .edit-hint code {
    background: var(--bg-tertiary);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
  }
  
  /* Dense Grid Layout */
  .findings-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: var(--spacing-md);
    max-width: 1600px; /* Allow it to get quite wide but not infinite */
    margin: 0 auto;
  }
  
  .finding-card {
    padding: var(--spacing-lg);
    background: var(--bg-secondary);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-subtle);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    transition: transform var(--transition), box-shadow var(--transition);
  }
  
  .finding-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    border-color: var(--border-medium);
  }
  
  .card-link {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-xs);
    text-decoration: none;
    align-self: flex-start;
  }
  
  .card-link:hover .correspondence-code {
    color: var(--accent-primary);
    text-decoration: underline;
  }
  
  .correspondence-code {
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
  }
  
  .link-icon {
    font-size: 12px;
    color: var(--text-muted);
  }
  
  .finding-description {
    font-size: 14px;
    line-height: 1.6;
    color: var(--text-secondary);
  }
  
  .empty-state {
    grid-column: 1 / -1;
    text-align: center;
    padding: var(--spacing-xl);
    color: var(--text-muted);
  }
</style>
