<script lang="ts">
    import { page } from '$app/stores';
    import { players } from '$lib/data/players.js';
    import { teams } from '$lib/data/teams.js';
    import { matches } from '$lib/data/matches.js';
    import { leagues } from '$lib/data/leagues.js';
    import { match_events } from '$lib/data/match_events.js';
    import MatchCard from '$lib/components/MatchCard.svelte';
    import MatchDetailModal from '$lib/components/MatchDetailModal.svelte';
    import type { Match } from '$lib/data/matches.js';
    import ArrowLeft from 'phosphor-svelte/lib/ArrowLeft';

    const slug = $derived($page.params.slug);

    // Find player by slug
    const player = $derived(players.find(p => {
        const playerSlug = `${p.first_name}-${p.last_name}`
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        return playerSlug === slug;
    }));

    const team = $derived(player ? teams.find(t => t.id === player.team_id) : null);
    const league = $derived(team ? leagues.find(l => l.id === matches.find(m => m.home_team_id === team.id || m.away_team_id === team.id)?.league_id) : null);

    // Get player's team matches
    const teamMatches = $derived(player && team
        ? matches.filter(m => m.home_team_id === team.id || m.away_team_id === team.id)
            .sort((a, b) => b.datetime.localeCompare(a.datetime))
        : []);

    // Get player stats from match events
    const playerEvents = $derived(player
        ? match_events.filter(e => e.player_id === player.id)
        : []);

    const totalPoints = $derived(playerEvents.reduce((sum, e) => sum + e.points, 0));
    const totalAssists = $derived(playerEvents.filter(e => e.event_type === 'Assist').length);
    const totalRebounds = $derived(playerEvents.filter(e => e.event_type === 'Rebound').length);

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

    function formatDate(dateStr: string): string {
        return new Date(dateStr).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    function createTeamSlug(name: string): string {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    let selectedMatch: Match | null = $state(null);

    const TODAY_ISO_DATE = '2025-02-10';
    const upcomingMatches = $derived(teamMatches.filter(m => m.datetime.slice(0, 10) >= TODAY_ISO_DATE));
    const pastMatches = $derived(teamMatches.filter(m => m.datetime.slice(0, 10) < TODAY_ISO_DATE));

    function goBack() {
        window.history.back();
    }
</script>

<svelte:head>
    <title>{player ? `${player.first_name} ${player.last_name} | Players` : 'Player Not Found'} | Basketball Scores</title>
</svelte:head>

{#if !player}
    <div class="not-found">
        <h1>Player Not Found</h1>
        <p>The player you're looking for doesn't exist.</p>
        <a class="back-button" href="/players">
            <ArrowLeft size={24} weight="bold" />
            <span>Back to Players</span>
        </a>
    </div>
{:else}
    <div class="player-view">
        <div class="detail-header">
            <a class="back-button" href="/players">
                <ArrowLeft size={24} weight="bold" />
                <span>Back to Players</span>
            </a>
        </div>
        <div class="player-header">
            <div class="player-main-info">
                <div class="player-number-large">#{player.jersey_number}</div>
                <div class="player-name-section">
                    <h1 class="player-name">{player.first_name} {player.last_name}</h1>
                    <div class="player-meta">
                        <span class="player-position">{player.position}</span>
                        {#if team}
                            <a href="/teams/{createTeamSlug(team.name)}" class="team-link">
                                <img class="team-logo-small" src={team.logo_url} alt={team.short_name} />
                                {team.name}
                            </a>
                        {/if}
                        {#if league}
                            <div class="league-badge" style="--league-color: {league.brand_color}">
                                <img class="league-logo" src={league.logo_url} alt={league.short_name} />
                                <span>{league.short_name}</span>
                            </div>
                        {/if}
                    </div>
                </div>
            </div>
            {#if team}
                <div class="team-logo-large">
                    <img src={team.logo_url} alt={team.short_name} />
                </div>
            {/if}
        </div>

        <div class="stats-section">
            <div class="stat-card">
                <div class="stat-label">Age</div>
                <div class="stat-value">{getPlayerAge(player.date_of_birth)}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Height</div>
                <div class="stat-value">{player.height_cm} cm</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Weight</div>
                <div class="stat-value">{player.weight_kg} kg</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Nationality</div>
                <div class="stat-value nationality">{player.nationality}</div>
            </div>
        </div>

        <div class="stats-section performance">
            <div class="stat-card">
                <div class="stat-label">Total Points</div>
                <div class="stat-value highlight">{totalPoints}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Total Assists</div>
                <div class="stat-value highlight">{totalAssists}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Total Rebounds</div>
                <div class="stat-value highlight">{totalRebounds}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Date of Birth</div>
                <div class="stat-value small">{formatDate(player.date_of_birth)}</div>
            </div>
        </div>

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
                <h2 class="section-title">Past Matches</h2>
                <div class="matches-grid">
                    {#each pastMatches as match (match.id)}
                        <MatchCard {match} onClick={() => selectedMatch = match} />
                    {/each}
                </div>
            </section>
        {/if}
    </div>
{/if}

{#if selectedMatch}
    <MatchDetailModal match={selectedMatch} onClose={() => selectedMatch = null} />
{/if}

<style>
    .not-found {
        text-align: center;
        padding: var(--spacing-3xl);
    }

    .not-found h1 {
        font-size: var(--font-size-3xl);
        font-weight: 700;
        color: var(--color-text);
        margin-bottom: var(--spacing-md);
    }

    .not-found p {
        font-size: var(--font-size-lg);
        color: var(--color-text-light);
        margin-bottom: var(--spacing-xl);
    }

    .detail-header {
        /* Reduced spacing to tighten gap between back button and player info */
        margin-bottom: var(--spacing-sm);
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
        /* Remove extra bottom margin so header sits closer */
        margin-bottom: 0;
        text-decoration: none;
    }

    .back-button:hover {
        background: var(--color-bg-secondary);
        transform: translateX(-4px);
    }

    .player-view {
        padding: var(--spacing-md) 0;
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xl);
    }

    .player-header {
        background: white;
        border: 2px solid var(--color-border);
        border-radius: var(--radius-lg);
        padding: var(--spacing-xl);
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--spacing-xl);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .player-main-info {
        display: flex;
        align-items: center;
        gap: var(--spacing-lg);
        flex: 1;
    }

    .player-number-large {
        font-size: 4rem;
        font-weight: 800;
        color: var(--color-primary);
        line-height: 1;
    }

    .player-name-section {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-sm);
    }

    .player-name {
        font-size: var(--font-size-3xl);
        font-weight: 700;
        color: var(--color-text);
        margin: 0;
    }

    .player-meta {
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing-sm);
        align-items: center;
    }

    .player-position {
        background: var(--color-primary);
        color: white;
        padding: 0.375rem 0.75rem;
        border-radius: var(--radius-sm);
        font-size: var(--font-size-sm);
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .team-link {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
        padding: 0.375rem 0.75rem;
        background: var(--color-bg-secondary);
        border-radius: var(--radius-sm);
        color: var(--color-text);
        text-decoration: none;
        font-weight: 600;
        font-size: var(--font-size-sm);
        transition: all 0.2s ease;
    }

    .team-link:hover {
        background: var(--color-primary);
        color: white;
        transform: scale(1.05);
    }

    .team-logo-small {
        width: 1.25rem;
        height: 1.25rem;
        object-fit: contain;
    }

    .league-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        background: var(--league-color, var(--color-primary));
        color: white;
        padding: 0.375rem 0.75rem;
        border-radius: var(--radius-sm);
        font-size: var(--font-size-sm);
        font-weight: 700;
    }

    .league-logo {
        width: 0.9rem;
        height: 0.9rem;
        object-fit: contain;
    }

    .team-logo-large {
        width: 5.5rem;
        height: 5.5rem;
        opacity: 0.18;
        flex-shrink: 0;
    }

    .team-logo-large img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }

    .stats-section {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: var(--spacing-md);
    }

    .stats-section.performance {
        margin-top: calc(var(--spacing-xl) * -0.5);
    }

    .stat-card {
        background: white;
        border: 2px solid var(--color-border);
        border-radius: var(--radius-lg);
        padding: var(--spacing-lg);
        display: flex;
        flex-direction: column;
        gap: var(--spacing-sm);
        text-align: center;
        transition: all 0.2s ease;
    }

    .stat-card:hover {
        border-color: var(--color-primary);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .stat-label {
        font-size: var(--font-size-sm);
        color: var(--color-text-light);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-weight: 600;
    }

    .stat-value {
        font-size: var(--font-size-2xl);
        font-weight: 800;
        color: var(--color-text);
    }

    .stat-value.highlight {
        color: var(--color-primary);
    }

    .stat-value.nationality {
        font-size: var(--font-size-lg);
        font-style: italic;
    }

    .stat-value.small {
        font-size: var(--font-size-base);
        font-weight: 600;
    }

    .matches-section {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
    }

    .section-title {
        font-size: var(--font-size-2xl);
        font-weight: 700;
        color: var(--color-text);
        margin: 0;
    }

    .matches-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: var(--spacing-md);
    }

    @media (max-width: 768px) {
        .player-header {
            flex-direction: column;
        }

        .player-main-info {
            flex-direction: column;
            text-align: center;
        }

        .player-meta {
            justify-content: center;
        }

        .team-logo-large {
            width: 4.5rem;
            height: 4.5rem;
        }

        .player-number-large {
            font-size: 3rem;
        }

        .player-name {
            font-size: var(--font-size-2xl);
        }
    }

    @media (min-width: 900px) {
        .matches-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: var(--spacing-lg);
        }
    }

    @media (min-width: 1280px) {
        .matches-grid {
            grid-template-columns: repeat(3, 1fr);
        }
    }
</style>
