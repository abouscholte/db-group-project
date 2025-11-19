<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { teams } from '$lib/data/teams.js';
    import { matches } from '$lib/data/matches.js';
    import { players } from '$lib/data/players.js';
    import MatchCard from '$lib/components/MatchCard.svelte';
    import MatchDetailModal from '$lib/components/MatchDetailModal.svelte';
    import type { Match } from '$lib/data/matches.js';
    import ArrowLeft from 'phosphor-svelte/lib/ArrowLeft';

    let selectedMatch: Match | null = null;
    let teamSlug: string = '';
    let team: any = null;
    let teamMatches: Match[] = [];
    let upcomingMatches: Match[] = [];
    let pastMatches: Match[] = [];

    // Create slug from team name
    function createSlug(name: string): string {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    // Get team slug from URL
    $: teamSlug = $page.params.slug ?? '';

    // Find team by matching slug
    $: team = teams.find(t => createSlug(t.name) === teamSlug) ?? null;

    $: teamMatches = (() => {
        if (!team) return [];
        return matches
            .filter(m => m.home_team_id === team.id || m.away_team_id === team.id)
            .sort((a, b) => b.datetime.localeCompare(a.datetime));
    })();

    $: upcomingMatches = teamMatches.filter(m => m.status === 'Upcoming');

    $: pastMatches = teamMatches.filter(m => m.status === 'Finished' || m.status === 'Live');

    $: teamPlayers = (() => {
        if (!team) return [];
        return players
            .filter(p => p.team_id === team.id)
            .sort((a, b) => a.jersey_number - b.jersey_number);
    })();

    function createPlayerSlug(firstName: string, lastName: string): string {
        return `${firstName}-${lastName}`
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
</script>

<svelte:head>
    <title>{team ? `${team.name} | Teams` : 'Team Not Found'} | Basketball Scores</title>
</svelte:head>

{#if !team}
    <div class="not-found">
        <h1>Team Not Found</h1>
        <p>The team you're looking for doesn't exist.</p>
        <a class="back-button" href="/teams">
            <ArrowLeft size={24} weight="bold" />
            <span>Back to Teams</span>
        </a>
    </div>
{:else}
    <div class="team-detail-view">
        <div class="detail-header">
            <a class="back-button" href="/teams">
                <ArrowLeft size={24} weight="bold" />
                <span>Back to Teams</span>
            </a>
            
            <div class="team-header">
                <img 
                    class="team-logo-large" 
                    src={team.logo_url} 
                    alt={team.name}
                />
                <div class="team-header-info">
                    <h1 class="team-title">{team.name}</h1>
                    <div class="team-meta">
                        <span class="team-badge">{team.short_name}</span>
                        {#if team.city}
                            <span class="meta-text">{team.city}{team.state ? `, ${team.state}` : ''}</span>
                        {/if}
                        {#if team.arena_name && team.arena_name !== 'N/A'}
                            <span class="meta-text">🏟️ {team.arena_name}</span>
                        {/if}
                    </div>
                </div>
            </div>
        </div>

        {#if teamPlayers.length > 0}
            <section class="players-section">
                <h2 class="section-title">Team Roster</h2>
                <div class="players-grid">
                    {#each teamPlayers as player (player.id)}
                        <a 
                            class="player-card"
                            href={`/players/${createPlayerSlug(player.first_name, player.last_name)}`}
                            title="View {player.first_name} {player.last_name}"
                        >
                            <div class="player-number">#{player.jersey_number}</div>
                            <div class="player-info">
                                <div class="player-name">{player.first_name} {player.last_name}</div>
                                <div class="player-details">
                                    <span class="player-position">{player.position}</span>
                                    <span class="player-stat">{player.height_cm}cm</span>
                                    <span class="player-stat">{player.weight_kg}kg</span>
                                </div>
                                <div class="player-nationality">{player.nationality}</div>
                            </div>
                        </a>
                    {/each}
                </div>
            </section>
        {/if}

        {#if teamMatches.length === 0}
            <div class="no-matches">
                <p>No matches found for this team</p>
            </div>
        {:else}
            {#if upcomingMatches.length > 0}
                <section class="matches-section">
                    <h2 class="section-title">Upcoming Matches</h2>
                    <div class="matches-grid">
                        {#each upcomingMatches as match (match.id)}
                            <MatchCard {match} onClick={() => selectedMatch = match} />
                        {/each}
                    </div>
                </section>
            {/if}

            {#if pastMatches.length > 0}
                <section class="matches-section">
                    <h2 class="section-title">Past & Live Matches</h2>
                    <div class="matches-grid">
                        {#each pastMatches as match (match.id)}
                            <MatchCard {match} onClick={() => selectedMatch = match} />
                        {/each}
                    </div>
                </section>
            {/if}
        {/if}
    </div>
{/if}

{#if selectedMatch}
    <MatchDetailModal match={selectedMatch} onClose={() => selectedMatch = null} />
{/if}

<style>
    .team-detail-view {
        padding: var(--spacing-md) 0;
    }

    .detail-header {
        margin-bottom: var(--spacing-xl);
    }

    .back-button {
        background: transparent;
        border: none;
        color: var(--color-primary);
        display: inline-flex;
        align-items: center;
        gap: var(--spacing-sm);
        font-size: var(--font-size-base);
        font-weight: 600;
        cursor: pointer;
        padding: var(--spacing-sm);
        border-radius: var(--radius-md);
        transition: all 0.2s ease;
        margin-bottom: var(--spacing-lg);
        text-decoration: none;
    }

    .back-button:hover {
        background: var(--color-bg-secondary);
        transform: translateX(-4px);
    }

    .team-header {
        display: flex;
        align-items: center;
        gap: var(--spacing-xl);
        padding: var(--spacing-xl);
        background: white;
        border-radius: var(--radius-lg);
        border: 2px solid var(--color-border);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .team-logo-large {
        width: 8rem;
        height: 8rem;
        object-fit: contain;
        filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));
        flex-shrink: 0;
    }

    .team-header-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: var(--spacing-sm);
        min-width: 0;
    }

    .team-title {
        font-size: var(--font-size-3xl);
        font-weight: 700;
        color: var(--color-text);
        margin: 0;
    }

    .team-meta {
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing-md);
        align-items: center;
    }

    .team-badge {
        background: var(--color-primary);
        color: white;
        padding: 0.375rem 0.75rem;
        border-radius: var(--radius-md);
        font-size: var(--font-size-sm);
        font-weight: 700;
        letter-spacing: 0.05em;
    }

    .meta-text {
        font-size: var(--font-size-base);
        color: var(--color-text-light);
    }

    .matches-section {
        margin-bottom: var(--spacing-xl);
    }

    .players-section {
        margin-bottom: var(--spacing-xl);
    }

    .players-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: var(--spacing-sm);
    }

    .player-card {
        background: white;
        border: 2px solid var(--color-border);
        border-radius: var(--radius-lg);
        padding: var(--spacing-md);
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
        transition: all 0.2s ease;
        cursor: pointer;
        width: 100%;
        text-align: left;
    }

    .player-card:hover {
        border-color: var(--color-primary);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
        transform: translateY(-2px);
    }

    .player-number {
        font-size: var(--font-size-xl);
        font-weight: 800;
        color: var(--color-primary);
        min-width: 50px;
        text-align: center;
    }

    .player-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xs);
    }

    .player-name {
        font-size: var(--font-size-base);
        font-weight: 700;
        color: var(--color-text);
    }

    .player-details {
        display: flex;
        gap: var(--spacing-sm);
        flex-wrap: wrap;
        align-items: center;
    }

    .player-position {
        background: var(--color-primary);
        color: white;
        padding: 0.125rem 0.5rem;
        border-radius: var(--radius-sm);
        font-size: var(--font-size-xs);
        font-weight: 600;
    }

    .player-stat {
        font-size: var(--font-size-sm);
        color: var(--color-text-light);
    }

    .player-nationality {
        font-size: var(--font-size-xs);
        color: var(--color-text-light);
    }

    .section-title {
        font-size: var(--font-size-2xl);
        font-weight: 700;
        color: var(--color-text);
        margin-bottom: var(--spacing-md);
        padding-bottom: var(--spacing-sm);
        border-bottom: 2px solid var(--color-border);
    }

    .matches-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: var(--spacing-md);
    }

    .no-matches {
        text-align: center;
        padding: var(--spacing-xl);
        background: white;
        border-radius: var(--radius-lg);
        border: 2px dashed var(--color-border);
    }

    .no-matches p {
        color: var(--color-text-light);
        font-size: var(--font-size-lg);
        font-style: italic;
        margin: 0;
    }

    .not-found {
        text-align: center;
        padding: var(--spacing-xl);
    }

    .not-found h1 {
        font-size: var(--font-size-3xl);
        font-weight: 700;
        color: var(--color-text);
        margin-bottom: var(--spacing-md);
    }

    .not-found p {
        color: var(--color-text-light);
        font-size: var(--font-size-lg);
        margin-bottom: var(--spacing-xl);
    }

    @media (min-width: 900px) {
        .matches-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: var(--spacing-lg);
        }

        .players-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: var(--spacing-md);
        }
    }

    @media (min-width: 1280px) {
        .matches-grid {
            grid-template-columns: repeat(3, 1fr);
        }

        .players-grid {
            grid-template-columns: repeat(3, 1fr);
        }
    }

    @media (max-width: 640px) {
        .team-header {
            flex-direction: column;
            text-align: center;
        }

        .team-logo-large {
            width: 6rem;
            height: 6rem;
        }

        .team-title {
            font-size: var(--font-size-2xl);
        }

        .team-meta {
            justify-content: center;
        }
    }
</style>
