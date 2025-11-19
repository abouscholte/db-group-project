<script lang="ts">
  import '../app.css';
  import { page } from '$app/state';
  import { teams } from '$lib/data/teams.js';
  import { players } from '$lib/data/players.js';
  import { matches } from '$lib/data/matches.js';
  import { leagues } from '$lib/data/leagues.js';

  import MagnifyingGlass from 'phosphor-svelte/lib/MagnifyingGlass';
  import Basketball from 'phosphor-svelte/lib/Basketball';
  import List from 'phosphor-svelte/lib/List';
  import X from 'phosphor-svelte/lib/X';
  import Users from 'phosphor-svelte/lib/Users';
  import Trophy from 'phosphor-svelte/lib/Trophy';

  type Props = {
    children: import('svelte').Snippet;
  };

  let { children }: Props = $props();

  const navLinks = [
    { href: '/', label: 'Today & Upcoming' },
    { href: '/players', label: 'Players' },
    { href: '/teams', label: 'Teams' }
  ];

  let menuOpen = $state(false);
  let searchOpen = $state(false);
  let searchQuery = $state('');
  let selectedIndex = $state(0);
  let searchInputRef: HTMLInputElement | null = $state(null);

  function createSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function createPlayerSlug(firstName: string, lastName: string): string {
    return `${firstName}-${lastName}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // Search results
  const searchResults = $derived(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query || query.length < 2) return { teams: [], players: [], matches: [] };

    const filteredTeams = teams
      .filter(t => 
        t.name.toLowerCase().includes(query) ||
        t.short_name.toLowerCase().includes(query) ||
        t.city.toLowerCase().includes(query)
      )
      .slice(0, 5)
      .map(t => ({
        ...t,
        slug: createSlug(t.name),
        type: 'team' as const
      }));

    const filteredPlayers = players
      .filter(p =>
        p.first_name.toLowerCase().includes(query) ||
        p.last_name.toLowerCase().includes(query) ||
        `${p.first_name} ${p.last_name}`.toLowerCase().includes(query)
      )
      .slice(0, 5)
      .map(p => ({
        ...p,
        slug: createPlayerSlug(p.first_name, p.last_name),
        team: teams.find(t => t.id === p.team_id),
        type: 'player' as const
      }));

    const filteredMatches = matches
      .filter(m => {
        const homeTeam = teams.find(t => t.id === m.home_team_id);
        const awayTeam = teams.find(t => t.id === m.away_team_id);
        const league = leagues.find(l => l.id === m.league_id);
        
        return homeTeam?.name.toLowerCase().includes(query) ||
               awayTeam?.name.toLowerCase().includes(query) ||
               league?.name.toLowerCase().includes(query);
      })
      .slice(0, 3)
      .map(m => ({
        ...m,
        homeTeam: teams.find(t => t.id === m.home_team_id),
        awayTeam: teams.find(t => t.id === m.away_team_id),
        league: leagues.find(l => l.id === m.league_id),
        type: 'match' as const
      }));

    return { teams: filteredTeams, players: filteredPlayers, matches: filteredMatches };
  });

  const allResults = $derived(() => {
    const results = searchResults();
    return [
      ...results.teams,
      ...results.players,
      ...results.matches
    ];
  });

  const hasResults = $derived(allResults().length > 0);

  function isActive(href: string, currentPath: string) {
    if (href === '/') {
      return currentPath === '/';
    }
    return currentPath.startsWith(href);
  }

  function toggleMenu() {
    menuOpen = !menuOpen;
    if (menuOpen) searchOpen = false;
  }

  function closeMenu() {
    menuOpen = false;
  }

  function toggleSearch() {
    searchOpen = !searchOpen;
    if (searchOpen) {
      menuOpen = false;
      selectedIndex = 0;
      setTimeout(() => searchInputRef?.focus(), 100);
    }
  }

  function closeSearch() {
    searchOpen = false;
    searchQuery = '';
    selectedIndex = 0;
  }

  function handleSearchKeydown(e: KeyboardEvent) {
    const results = allResults();
    if (!results.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = Math.min(selectedIndex + 1, results.length - 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = Math.max(selectedIndex - 1, 0);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = results[selectedIndex];
      navigateToResult(selected);
    } else if (e.key === 'Escape') {
      closeSearch();
    }
  }

  function navigateToResult(result: any) {
    if (result.type === 'team') {
      window.location.href = `/teams/${result.slug}`;
    } else if (result.type === 'player') {
      window.location.href = `/players/${result.slug}`;
    } else if (result.type === 'match') {
      window.location.href = '/';
    }
    closeSearch();
  }
</script>

<header>
  <div class="container">
    <button class="menu-button" aria-label="Toggle menu" onclick={toggleMenu}>
      {#if menuOpen}
        <X size={24} />
      {:else}
        <List size={24} />
      {/if}
    </button>
    <div class="center-section">
      <a href="/" class="logo" onclick={closeMenu}>
        <Basketball size={32} />
        <span>Scores</span>
      </a>
    </div>
    <button class="search-button" aria-label="Search" onclick={toggleSearch}>
      {#if searchOpen}
        <X size={24} />
      {:else}
        <MagnifyingGlass size={24} />
      {/if}
    </button>
  </div>
  <nav class="navigation-menu" class:visible={menuOpen}>
    <div class="nav-content">
      {#each navLinks as link, index}
        <a 
          href={link.href} 
          class:active={isActive(link.href, page.url.pathname)} 
          onclick={closeMenu}
          style="--delay: {0.2 + index * 0.04}s"
        >
          {link.label}
        </a>
      {/each}
    </div>
  </nav>
  <div class="search-menu" class:visible={searchOpen}>
    <div class="search-content">
      <div class="search-input-wrapper">
        <MagnifyingGlass size={20} weight="bold" />
        <input
          type="text"
          placeholder="Search teams, players, leagues..."
          bind:value={searchQuery}
          bind:this={searchInputRef}
          class="search-input"
          onkeydown={handleSearchKeydown}
          autocomplete="off"
        />
      </div>
      
      {#if searchQuery.trim().length >= 2}
        <div class="search-results">
          {#if hasResults}
            {#if searchResults().teams.length > 0}
              <div class="results-section">
                <div class="results-header">
                  <Trophy size={16} weight="bold" />
                  <span>Teams</span>
                </div>
                {#each searchResults().teams as team, index}
                  {@const globalIndex = index}
                  <a 
                    href="/teams/{team.slug}"
                    class="result-item"
                    class:selected={selectedIndex === globalIndex}
                    onclick={closeSearch}
                  >
                    <img src={team.logo_url} alt={team.name} class="result-logo" />
                    <div class="result-info">
                      <div class="result-name">{team.name}</div>
                      <div class="result-meta">{team.city}{team.state ? `, ${team.state}` : ''}</div>
                    </div>
                  </a>
                {/each}
              </div>
            {/if}

            {#if searchResults().players.length > 0}
              {@const teamOffset = searchResults().teams.length}
              <div class="results-section">
                <div class="results-header">
                  <Users size={16} weight="bold" />
                  <span>Players</span>
                </div>
                {#each searchResults().players as player, index}
                  {@const globalIndex = teamOffset + index}
                  <a 
                    href="/players/{player.slug}"
                    class="result-item"
                    class:selected={selectedIndex === globalIndex}
                    onclick={closeSearch}
                  >
                    <div class="result-number">#{player.jersey_number}</div>
                    <div class="result-info">
                      <div class="result-name">{player.first_name} {player.last_name}</div>
                      <div class="result-meta">{player.position} • {player.team?.short_name || 'Unknown Team'}</div>
                    </div>
                  </a>
                {/each}
              </div>
            {/if}

            {#if searchResults().matches.length > 0}
              {@const matchOffset = searchResults().teams.length + searchResults().players.length}
              <div class="results-section">
                <div class="results-header">
                  <Basketball size={16} weight="bold" />
                  <span>Matches</span>
                </div>
                {#each searchResults().matches as match, index}
                  {@const globalIndex = matchOffset + index}
                  <a 
                    href="/"
                    class="result-item"
                    class:selected={selectedIndex === globalIndex}
                    onclick={closeSearch}
                  >
                    <div class="match-teams">
                      <img src={match.homeTeam?.logo_url} alt={match.homeTeam?.name} class="result-logo-small" />
                      <span class="vs">vs</span>
                      <img src={match.awayTeam?.logo_url} alt={match.awayTeam?.name} class="result-logo-small" />
                    </div>
                    <div class="result-info">
                      <div class="result-name">{match.homeTeam?.short_name} vs {match.awayTeam?.short_name}</div>
                      <div class="result-meta">{match.league?.short_name} • {match.status}</div>
                    </div>
                  </a>
                {/each}
              </div>
            {/if}
          {:else}
            <div class="no-results">
              <p>No results found for "{searchQuery}"</p>
            </div>
          {/if}
        </div>
      {/if}
    </div>
  </div>
</header>

<div class="main-container">
  {@render children()}
</div>

<style>
  header {
    background-color: white;
    position: sticky;
    top: 0;
    z-index: 100;
  }

  header .container {
    max-width: var(--breakpoint-md);
    margin: 0 auto;
    padding: var(--spacing-md);
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
  }

  .menu-button {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: var(--spacing-sm) 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-light);
    transition: color 0.2s ease;
    z-index: 1;
  }

  .menu-button:hover {
    color: var(--color-text);
  }

  .center-section {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);

    a {
        color: var(--color-text);
    }
    span {
        margin-left: var(--spacing-xs);
    }
  }

  .logo {
    display: inline-flex;
    align-items: center;
    text-decoration: none;
    transition: opacity 0.2s ease;
  }

  .logo:hover {
    opacity: 0.8;
  }

  .logo :global(svg) {
    color: var(--color-text);
  }

  .search-button {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: var(--spacing-sm) 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-light);
    transition: color 0.2s ease;
  }

  .search-button:hover {
    color: var(--color-text);
  }

  .navigation-menu {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100vw;
    transform: translateY(-8px);
    display: flex;
    flex-direction: column;
    background-color: white;
    opacity: 0;
    pointer-events: none;
    z-index: 10;
    transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1), 
                transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 8px 12px -6px rgba(0, 0, 0, 0.1);
  }

  .navigation-menu.visible {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }

  .nav-content {
    max-width: var(--breakpoint-md);
    margin: 0 auto;
    width: 100%;
    padding: var(--spacing-sm) var(--spacing-md);
    padding-top: 0;
    display: flex;
    flex-direction: column;
  }

  .navigation-menu a {
    font-weight: 500;
    text-decoration: none;
    color: var(--color-text-light);
    padding: var(--spacing-md) 0;
    opacity: 0;
    transform: translateX(-15px);
    transition: opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1),
                transform 0.15s cubic-bezier(0.4, 0, 0.2, 1),
                color 0.2s ease;
    transition-delay: 0s;
  }

  .navigation-menu.visible a {
    opacity: 1;
    transform: translateX(0);
    transition-delay: var(--delay, 0s);
    transition-duration: 0.35s, 0.35s, 0.2s;
  }

  .navigation-menu a:hover {
    color: var(--color-text);
  }

  .navigation-menu a.active {
    color: var(--color-text);
    font-weight: 600;
  }

  .search-menu {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100vw;
    display: flex;
    flex-direction: column;
    background-color: white;
    opacity: 0;
    margin-top: -8px;
    pointer-events: none;
    z-index: 10;
    transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1), 
                transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 8px 12px -6px rgba(0, 0, 0, 0.1);
  }

  .search-menu.visible {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }

  .search-content {
    max-width: var(--breakpoint-md);
    margin: 0 auto;
    width: 100%;
    padding: var(--spacing-md);
  }

  .search-input-wrapper {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) var(--spacing-md);
    background: var(--color-bg-secondary);
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-border);
    transition: border-color 0.2s ease;
  }

  .search-input-wrapper:focus-within {
    border-color: var(--color-primary);
  }

  .search-input-wrapper :global(svg) {
    color: var(--color-text-light);
    flex-shrink: 0;
  }

  .search-input {
    flex: 1;
    border: none;
    background: transparent;
    outline: none;
    font-size: var(--font-size-base);
    color: var(--color-text);
    padding: var(--spacing-xs) 0;
  }

  .search-input::placeholder {
    color: var(--color-text-light);
  }

  .search-results {
    margin-top: var(--spacing-md);
    background: white;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    max-height: 400px;
    overflow-y: auto;
  }

  .results-section {
    border-bottom: 1px solid var(--color-border-light);
  }

  .results-section:last-child {
    border-bottom: none;
  }

  .results-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    padding: var(--spacing-sm) var(--spacing-md);
    background: var(--color-bg-secondary);
    font-size: var(--font-size-xs);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-text-light);
    position: sticky;
    top: 0;
    z-index: 1;
  }

  .results-header :global(svg) {
    color: var(--color-primary);
  }

  .result-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    cursor: pointer;
    transition: background 0.15s ease;
    text-decoration: none;
    color: inherit;
  }

  .result-item:hover,
  .result-item.selected {
    background: var(--color-bg-secondary);
  }

  .result-logo {
    width: 2rem;
    height: 2rem;
    object-fit: contain;
    flex-shrink: 0;
  }

  .result-logo-small {
    width: 1.25rem;
    height: 1.25rem;
    object-fit: contain;
  }

  .result-number {
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--font-size-sm);
    font-weight: 800;
    color: var(--color-primary);
    background: var(--color-bg-secondary);
    border-radius: var(--radius-sm);
    flex-shrink: 0;
  }

  .match-teams {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    flex-shrink: 0;
  }

  .match-teams .vs {
    font-size: var(--font-size-xs);
    font-weight: 600;
    color: var(--color-text-light);
  }

  .result-info {
    flex: 1;
    min-width: 0;
  }

  .result-name {
    font-size: var(--font-size-base);
    font-weight: 600;
    color: var(--color-text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .result-meta {
    font-size: var(--font-size-sm);
    color: var(--color-text-light);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .no-results {
    padding: var(--spacing-xl);
    text-align: center;
  }

  .no-results p {
    color: var(--color-text-light);
    font-style: italic;
    margin: 0;
  }
</style>

