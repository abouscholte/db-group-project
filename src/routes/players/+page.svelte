<script lang="ts">
    import { players } from '$lib/data/players.js';
    import { teams } from '$lib/data/teams.js';
    import { matches } from '$lib/data/matches.js';
    import { leagues } from '$lib/data/leagues.js';
    import LeaguePills from '$lib/components/LeaguePills.svelte';
    import MagnifyingGlass from 'phosphor-svelte/lib/MagnifyingGlass';

    let searchQuery = '';
    let selectedLeagueId: number | null = null;
    let selectedTeamId: number | null = null;

    // Create slug from player name
    function createSlug(firstName: string, lastName: string): string {
        return `${firstName}-${lastName}`
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    // Get league for a team by checking their matches
    function getTeamLeagueId(teamId: number): number | null {
        const match = matches.find(m => m.home_team_id === teamId || m.away_team_id === teamId);
        return match ? match.league_id : null;
    }

    // Get teams for selected league
    $: teamsInLeague = selectedLeagueId === null 
        ? teams 
        : teams.filter(team => getTeamLeagueId(team.id) === selectedLeagueId);

    // Filter and sort players
    $: filteredPlayers = (() => {
        let result = players;

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(player => 
                player.first_name.toLowerCase().includes(query) ||
                player.last_name.toLowerCase().includes(query) ||
                `${player.first_name} ${player.last_name}`.toLowerCase().includes(query) ||
                player.position.toLowerCase().includes(query) ||
                player.nationality.toLowerCase().includes(query)
            );
        }

        // Filter by selected league (through team)
        if (selectedLeagueId !== null) {
            const teamIdsInLeague = new Set(
                teamsInLeague.map(t => t.id)
            );
            result = result.filter(player => teamIdsInLeague.has(player.team_id));
        }

        // Filter by selected team
        if (selectedTeamId !== null) {
            result = result.filter(player => player.team_id === selectedTeamId);
        }

        // Sort alphabetically by last name, then first name
        return result.slice().sort((a, b) => {
            const lastNameCompare = a.last_name.localeCompare(b.last_name);
            if (lastNameCompare !== 0) return lastNameCompare;
            return a.first_name.localeCompare(b.first_name);
        });
    })();

    function getPlayerAge(dateOfBirth: string): number {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    // Reset team filter when league changes
    $: if (selectedLeagueId !== null) {
        selectedTeamId = null;
    }
</script>

<svelte:head>
    <title>Players | Basketball Scores</title>
</svelte:head>

<div class="players-view">
    <h1 class="page-title">Players</h1>
    
    <div class="filters-section">
        <div class="search-container">
            <MagnifyingGlass size={20} weight="bold" />
            <input 
                type="text" 
                class="search-input"
                placeholder="Search players by name, position, or nationality..."
                bind:value={searchQuery}
            />
        </div>
        
        <div class="league-filter">
            <LeaguePills bind:selectedLeagueId />
        </div>

        {#if teamsInLeague.length > 0}
            <div class="team-filter">
                <button
                    class="team-pill"
                    class:active={selectedTeamId === null}
                    onclick={() => selectedTeamId = null}
                >
                    All Teams
                </button>
                {#each teamsInLeague as team (team.id)}
                    <button
                        class="team-pill"
                        class:active={selectedTeamId === team.id}
                        onclick={() => selectedTeamId = team.id}
                    >
                        <img class="team-pill-logo" src={team.logo_url} alt={team.short_name} />
                        {team.short_name}
                    </button>
                {/each}
            </div>
        {/if}
    </div>

    {#if filteredPlayers.length === 0}
        <div class="no-results">
            <p>No players found matching your search.</p>
        </div>
    {:else}
        <div class="players-grid">
            {#each filteredPlayers as player (player.id)}
                {@const team = teams.find(t => t.id === player.team_id)}
                {@const leagueId = team ? getTeamLeagueId(team.id) : null}
                {@const league = leagues.find(l => l.id === leagueId)}
                <a href="/players/{createSlug(player.first_name, player.last_name)}" class="player-card">
                    <div class="player-header">
                        <div class="player-number">#{player.jersey_number}</div>
                        {#if league}
                            <div class="league-badge" style="--league-color: {league.brand_color}">
                                <img class="league-logo" src={league.logo_url} alt={league.short_name} />
                                <span class="league-name">{league.short_name}</span>
                            </div>
                        {/if}
                    </div>
                    <div class="player-info">
                        <h3 class="player-name">{player.first_name} {player.last_name}</h3>
                        <div class="player-details">
                            <span class="player-position">{player.position}</span>
                            <span class="player-team">{team?.short_name}</span>
                        </div>
                        <div class="player-stats">
                            <div class="stat">
                                <span class="stat-label">Age</span>
                                <span class="stat-value">{getPlayerAge(player.date_of_birth)}</span>
                            </div>
                            <div class="stat">
                                <span class="stat-label">Height</span>
                                <span class="stat-value">{player.height_cm} cm</span>
                            </div>
                            <div class="stat">
                                <span class="stat-label">Weight</span>
                                <span class="stat-value">{player.weight_kg} kg</span>
                            </div>
                        </div>
                        <div class="player-nationality">{player.nationality}</div>
                    </div>
                    {#if team}
                        <div class="player-team-logo">
                            <img src={team.logo_url} alt={team.short_name} />
                        </div>
                    {/if}
                </a>
            {/each}
        </div>
    {/if}
</div>

<style>
    .players-view {
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

    .team-filter {
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing-sm);
        padding-top: var(--spacing-sm);
    }

    .team-pill {
        appearance: none;
        background: white;
        border: 2px solid var(--color-border);
        border-radius: var(--radius-md);
        padding: 0.5rem 1rem;
        font-size: var(--font-size-sm);
        font-weight: 600;
        color: var(--color-text);
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
    }

    .team-pill:hover {
        border-color: var(--color-primary);
        background: var(--color-bg-secondary);
    }

    .team-pill.active {
        background: var(--color-primary);
        color: white;
        border-color: var(--color-primary);
    }

    .team-pill-logo {
        width: 1.25rem;
        height: 1.25rem;
        object-fit: contain;
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
    }

    .players-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: var(--spacing-md);
    }

    .player-card {
        background: white;
        border: 2px solid var(--color-border);
        border-radius: var(--radius-lg);
        padding: var(--spacing-lg);
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
        transition: all 0.2s ease;
        cursor: pointer;
        text-align: left;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        text-decoration: none;
        color: inherit;
        position: relative;
        overflow: hidden;
    }

    .player-card:hover {
        border-color: var(--color-primary);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transform: translateY(-2px);
    }

    .player-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
    }

    .player-number {
        font-size: 2rem;
        font-weight: 800;
        color: var(--color-primary);
        line-height: 1;
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

    .player-info {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-sm);
    }

    .player-name {
        font-size: var(--font-size-xl);
        font-weight: 700;
        color: var(--color-text);
        margin: 0;
    }

    .player-details {
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing-sm);
        align-items: center;
    }

    .player-position {
        background: var(--color-primary);
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: var(--radius-sm);
        font-size: var(--font-size-xs);
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .player-team {
        font-size: var(--font-size-sm);
        color: var(--color-text-light);
        font-weight: 600;
    }

    .player-stats {
        display: flex;
        gap: var(--spacing-lg);
        padding: var(--spacing-sm) 0;
    }

    .stat {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xs);
    }

    .stat-label {
        font-size: var(--font-size-xs);
        color: var(--color-text-light);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-weight: 600;
    }

    .stat-value {
        font-size: var(--font-size-base);
        font-weight: 700;
        color: var(--color-text);
    }

    .player-nationality {
        font-size: var(--font-size-sm);
        color: var(--color-text-light);
        font-style: italic;
    }

    .player-team-logo {
        position: absolute;
        right: var(--spacing-lg);
        bottom: var(--spacing-lg);
        width: 3rem;
        height: 3rem;
        opacity: 0.15;
    }

    .player-team-logo img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }

    @media (min-width: 640px) {
        .players-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: var(--spacing-lg);
        }
    }

    @media (min-width: 900px) {
        .players-grid {
            grid-template-columns: repeat(3, 1fr);
        }
    }

    @media (min-width: 1280px) {
        .players-grid {
            grid-template-columns: repeat(4, 1fr);
        }
    }
</style>