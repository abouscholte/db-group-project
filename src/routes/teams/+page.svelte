<script lang="ts">
    import { teams } from '$lib/data/teams.js';
    import { matches } from '$lib/data/matches.js';
    import { leagues } from '$lib/data/leagues.js';
    import LeaguePills from '$lib/components/LeaguePills.svelte';
    import MagnifyingGlass from 'phosphor-svelte/lib/MagnifyingGlass';

    let searchQuery = '';
    let selectedLeagueId: number | null = null;

    // Create slug from team name
    function createSlug(name: string): string {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    // Get league for a team by checking their matches
    function getTeamLeagueId(teamId: number): number | null {
        const match = matches.find(m => m.home_team_id === teamId || m.away_team_id === teamId);
        return match ? match.league_id : null;
    }

    // Filter and sort teams
    $: filteredTeams = (() => {
        let result = teams;

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(team => 
                team.name.toLowerCase().includes(query) ||
                team.short_name.toLowerCase().includes(query) ||
                team.city.toLowerCase().includes(query)
            );
        }

        // Filter by selected league
        if (selectedLeagueId !== null) {
            result = result.filter(team => getTeamLeagueId(team.id) === selectedLeagueId);
        }

        // Sort alphabetically by name
        return result.slice().sort((a, b) => a.name.localeCompare(b.name));
    })();
</script>

<svelte:head>
    <title>Teams | Basketball Scores</title>
</svelte:head>

<div class="teams-view">
    <h1 class="page-title">Teams</h1>
    
    <div class="filters-section">
        <div class="search-container">
            <MagnifyingGlass size={20} weight="bold" />
            <input 
                type="text" 
                class="search-input"
                placeholder="Search teams by name, code, or city..."
                bind:value={searchQuery}
            />
        </div>
        
        <div class="league-filter">
            <LeaguePills bind:selectedLeagueId />
        </div>
    </div>

    {#if filteredTeams.length === 0}
        <div class="no-results">
            <p>No teams found matching your search.</p>
        </div>
    {:else}
        <div class="teams-grid">
            {#each filteredTeams as team (team.id)}
                {@const leagueId = getTeamLeagueId(team.id)}
                {@const league = leagues.find(l => l.id === leagueId)}
                <a href="/teams/{createSlug(team.name)}" class="team-card">
                <div class="team-logo-container">
                    <img 
                        class="team-logo" 
                        src={team.logo_url} 
                        alt={team.name}
                    />
                </div>
                <div class="team-info">
                    {#if league}
                        <div class="league-badge" style="--league-color: {league.brand_color}">
                            <img class="league-logo" src={league.logo_url} alt={league.short_name} />
                            <span class="league-name">{league.short_name}</span>
                        </div>
                    {/if}
                    <h3 class="team-name">{team.name}</h3>
                    <div class="team-details">
                        <span class="team-short-name">{team.short_name}</span>
                        {#if team.city}
                            <span class="team-location">{team.city}{team.state ? `, ${team.state}` : ''}</span>
                        {/if}
                    </div>
                    {#if team.arena_name && team.arena_name !== 'N/A'}
                        <div class="team-arena">{team.arena_name}</div>
                    {/if}
                </div>
            </a>
            {/each}
        </div>
    {/if}
</div>

<style>
    .teams-view {
        padding: var(--spacing-md) 0;
    }

    .page-title {
        font-size: var(--font-size-3xl);
        font-weight: 700;
        color: var(--color-text);
        margin-bottom: var(--spacing-lg);
    }

    .filters-section {
        margin-bottom: var(--spacing-xl);
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
    }

    .search-container {
        position: relative;
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        background: white;
        border: 2px solid var(--color-border);
        border-radius: var(--radius-lg);
        padding: var(--spacing-md) var(--spacing-lg);
        transition: border-color 0.2s ease;
    }

    .search-container:focus-within {
        border-color: var(--color-primary);
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
    }

    .search-container :global(svg) {
        color: var(--color-text-light);
        flex-shrink: 0;
    }

    .search-input {
        flex: 1;
        border: none;
        outline: none;
        font-size: var(--font-size-base);
        color: var(--color-text);
        background: transparent;
        padding: 0;
    }

    .search-input::placeholder {
        color: var(--color-text-light);
    }

    .league-filter {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-sm);
    }

    .no-results {
        text-align: center;
        padding: var(--spacing-xl);
        background: white;
        border-radius: var(--radius-lg);
        border: 2px dashed var(--color-border);
    }

    .no-results p {
        color: var(--color-text-light);
        font-size: var(--font-size-lg);
        font-style: italic;
        margin: 0;
    }    .teams-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: var(--spacing-md);
    }

    .team-card {
        background: white;
        border: 2px solid var(--color-border);
        border-radius: var(--radius-lg);
        padding: var(--spacing-lg);
        display: flex;
        align-items: center;
        gap: var(--spacing-lg);
        transition: all 0.2s ease;
        cursor: pointer;
        text-align: left;
        width: 100%;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        text-decoration: none;
        color: inherit;
    }

    .team-card:hover {
        border-color: var(--color-primary);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transform: translateY(-2px);
    }

    .team-logo-container {
        flex-shrink: 0;
        width: 3.5rem;
        height: 3.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--color-bg-secondary);
        border-radius: var(--radius-md);
        padding: 0.35rem;
    }

    .team-logo {
        width: 100%;
        height: 100%;
        object-fit: contain;
        filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.08));
        transition: transform 0.15s ease;
    }

    .team-card:hover .team-logo {
        transform: scale(1.05);
    }

    @media (max-width: 640px) {
        .team-logo-container {
            width: 2.75rem;
            height: 2.75rem;
            padding: 0.25rem;
        }
    }

    .team-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xs);
        min-width: 0;
    }

    .league-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        background: var(--league-color, var(--color-primary));
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: var(--radius-sm);
        font-size: var(--font-size-xs);
        font-weight: 700;
        width: fit-content;
        margin-bottom: 0.15rem;
    }

    .league-logo {
        width: 1rem;
        height: 1rem;
        object-fit: contain;
    }

    .league-name {
        line-height: 1;
        letter-spacing: 0.05em;
    }

    .team-name {
        font-size: var(--font-size-lg);
        font-weight: 700;
        color: var(--color-text);
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .team-details {
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing-sm);
        align-items: center;
    }

    .team-short-name {
        background: var(--color-primary);
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: var(--radius-sm);
        font-size: var(--font-size-xs);
        font-weight: 700;
        letter-spacing: 0.05em;
    }

    .team-location {
        font-size: var(--font-size-sm);
        color: var(--color-text-light);
    }

    .team-arena {
        font-size: var(--font-size-xs);
        color: var(--color-text-light);
        font-style: italic;
    }

    @media (min-width: 640px) {
        .teams-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: var(--spacing-lg);
        }
    }

    @media (min-width: 900px) {
        .teams-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (min-width: 1280px) {
        .teams-grid {
            grid-template-columns: repeat(3, 1fr);
        }
    }

    @media (max-width: 640px) {
        .team-card {
            flex-direction: column;
            text-align: center;
        }

        .team-info {
            align-items: center;
        }

        .team-details {
            justify-content: center;
        }
    }
</style>