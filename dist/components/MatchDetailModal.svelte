<script lang="ts">
    import { leagues } from '../data/leagues.js';
    import { teams } from '../data/teams.js';
    import { players } from '../data/players.js';
    import { match_events } from '../data/match_events.js';
    import type { Match } from '../data/matches.js';
    import X from 'phosphor-svelte/lib/X';

    const { match, onClose } = $props<{ match: Match; onClose: () => void }>();

    const league = $derived(leagues.find(l => l.id === match.league_id));
    const homeTeam = $derived(teams.find(t => t.id === match.home_team_id));
    const awayTeam = $derived(teams.find(t => t.id === match.away_team_id));
    
    const isUpcoming = $derived(match.status === 'Upcoming');
    
    const homePlayers = $derived(players.filter(p => p.team_id === match.home_team_id));
    const awayPlayers = $derived(players.filter(p => p.team_id === match.away_team_id));
    
    const matchEvents = $derived(
        match_events
            .filter(e => e.match_id === match.id)
            .sort((a, b) => {
                if (a.quarter !== b.quarter) return b.quarter - a.quarter;
                const [minA, secA] = a.game_time.split(':').map(Number);
                const [minB, secB] = b.game_time.split(':').map(Number);
                const timeA = minA * 60 + secA;
                const timeB = minB * 60 + secB;
                return timeB - timeA;
            })
    );

    function handleBackdropClick(e: MouseEvent) {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }

    function handleBackdropKeydown(e: KeyboardEvent) {
        // Only trigger when the backdrop itself has focus
        if (e.target === e.currentTarget) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClose();
            } else if (e.key === 'Escape') {
                onClose();
            }
        }
    }

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

</script>

<div class="modal-backdrop" role="button" tabindex="0" aria-label="Close modal" onclick={handleBackdropClick} onkeydown={handleBackdropKeydown}>
    <div class="modal-content">
        <div class="modal-header">
            <div class="header-info">
                <img class="league-logo" src={league?.logo_url} alt={league?.short_name} />
                <div>
                    <h2 class="match-title">{homeTeam?.name} vs {awayTeam?.name}</h2>
                    <p class="league-name">{league?.name}</p>
                </div>
            </div>
            <button class="close-button" onclick={onClose} aria-label="Close">
                <X size={24} weight="bold" />
            </button>
        </div>

        <div class="score-section">
            <div class="team-score">
                <a 
                    class="team-logo-link"
                    href={homeTeam ? `/teams/${createSlug(homeTeam.name)}` : undefined}
                    aria-label="View {homeTeam?.name}"
                    title="View {homeTeam?.name}"
                >
                    <img class="team-logo" src={homeTeam?.logo_url} alt={homeTeam?.short_name} />
                </a>
                <h3>{homeTeam?.short_name}</h3>
                <div class="score">{match.home_score ?? '-'}</div>
            </div>
            <div class="vs">VS</div>
            <div class="team-score">
                <a 
                    class="team-logo-link"
                    href={awayTeam ? `/teams/${createSlug(awayTeam.name)}` : undefined}
                    aria-label="View {awayTeam?.name}"
                    title="View {awayTeam?.name}"
                >
                    <img class="team-logo" src={awayTeam?.logo_url} alt={awayTeam?.short_name} />
                </a>
                <h3>{awayTeam?.short_name}</h3>
                <div class="score">{match.away_score ?? '-'}</div>
            </div>
        </div>

        <div class="modal-body">
            <div class="section">
                <h3 class="section-title">Match Events</h3>
                {#if isUpcoming}
                    <p class="no-data">Match events will be available once the game starts</p>
                {:else if matchEvents.length > 0}
                    <div class="events-list">
                        {#each matchEvents as event}
                            <div class="event-item">
                                <div class="event-time">Q{event.quarter} {event.game_time}</div>
                                <div class="event-details">
                                    <span class="event-type">{event.event_type}</span>
                                    <span class="event-description">{event.description}</span>
                                    {#if event.points > 0}
                                        <span class="event-points">+{event.points}</span>
                                    {/if}
                                </div>
                            </div>
                        {/each}
                    </div>
                {:else}
                    <p class="no-data">No match events recorded yet</p>
                {/if}
            </div>

            <div class="section">
                <h3 class="section-title">{homeTeam?.name} Roster</h3>
                {#if isUpcoming}
                    <p class="no-data">Team rosters will be available closer to game time</p>
                {:else if homePlayers.length > 0}
                    <div class="players-grid">
                        {#each homePlayers as player}
                            <a 
                                class="player-card"
                                href={`/players/${createPlayerSlug(player.first_name, player.last_name)}`}
                                title="View {player.first_name} {player.last_name}"
                            >
                                <div class="player-number">#{player.jersey_number}</div>
                                <div class="player-info">
                                    <div class="player-name">{player.first_name} {player.last_name}</div>
                                    <div class="player-details">{player.position} • {player.height_cm}cm</div>
                                </div>
                            </a>
                        {/each}
                    </div>
                {:else}
                    <p class="no-data">No player information available</p>
                {/if}
            </div>

            <div class="section">
                <h3 class="section-title">{awayTeam?.name} Roster</h3>
                {#if isUpcoming}
                    <p class="no-data">Team rosters will be available closer to game time</p>
                {:else if awayPlayers.length > 0}
                    <div class="players-grid">
                        {#each awayPlayers as player}
                            <a 
                                class="player-card"
                                href={`/players/${createPlayerSlug(player.first_name, player.last_name)}`}
                                title="View {player.first_name} {player.last_name}"
                            >
                                <div class="player-number">#{player.jersey_number}</div>
                                <div class="player-info">
                                    <div class="player-name">{player.first_name} {player.last_name}</div>
                                    <div class="player-details">{player.position} • {player.height_cm}cm</div>
                                </div>
                            </a>
                        {/each}
                    </div>
                {:else}
                    <p class="no-data">No player information available</p>
                {/if}
            </div>
        </div>
    </div>
</div>

<style>
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        padding: var(--spacing-md);
        overflow-y: auto;
    }

    .modal-content {
        background: white;
        border-radius: var(--radius-xl);
        width: 100%;
        max-width: 800px;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        animation: modalSlideIn 0.3s ease-out;
    }

    @keyframes modalSlideIn {
        from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--spacing-lg);
        border-bottom: 1px solid var(--color-border);
        position: sticky;
        top: 0;
        background: white;
        z-index: 10;
    }

    .header-info {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
    }

    .league-logo {
        width: 1.75rem;
        height: 1.75rem;
        object-fit: contain;
    }

    .match-title {
        font-size: var(--font-size-xl);
        font-weight: 700;
        color: var(--color-text);
        margin: 0;
    }

    .league-name {
        font-size: var(--font-size-sm);
        color: var(--color-text-light);
        margin: var(--spacing-xs) 0 0 0;
    }

    .close-button {
        background: transparent;
        border: none;
        cursor: pointer;
        color: var(--color-text-light);
        transition: color 0.2s ease;
        padding: var(--spacing-xs);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--radius-md);
    }

    .close-button:hover {
        color: var(--color-text);
        background: var(--color-bg-secondary);
    }

    .score-section {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--spacing-xl);
        padding: var(--spacing-xl);
        background: var(--color-bg-secondary);
    }

    .team-score {
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--spacing-sm);
    }

    .team-logo-link {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        border-radius: var(--radius-md);
        transition: transform 0.2s ease, filter 0.2s ease;
    }

    .team-logo-link:hover {
        transform: scale(1.1);
    }

    .team-logo-link:hover .team-logo {
        filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.25));
    }

    .team-score .team-logo {
        width: 3rem;
        height: 3rem;
        object-fit: contain;
        filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.12));
        transition: filter 0.2s ease, transform 0.2s ease;
    }

    .team-score h3 {
        font-size: var(--font-size-lg);
        font-weight: 600;
        color: var(--color-text);
        margin: 0 0 var(--spacing-sm) 0;
    }

    .score {
        font-size: 3rem;
        font-weight: 800;
        color: var(--color-text);
    }

    .vs {
        font-size: var(--font-size-sm);
        font-weight: 600;
        color: var(--color-text-light);
        text-transform: uppercase;
        letter-spacing: 0.1em;
    }

    .modal-body {
        padding: var(--spacing-lg);
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xl);
    }

    .section {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
    }

    .section-title {
        font-size: var(--font-size-lg);
        font-weight: 700;
        color: var(--color-text);
        margin: 0;
        padding-bottom: var(--spacing-sm);
        border-bottom: 2px solid var(--color-border);
    }

    .events-list {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-sm);
    }

    .event-item {
        display: flex;
        gap: var(--spacing-md);
        padding: var(--spacing-sm) var(--spacing-md);
        background: var(--color-bg-secondary);
        border-radius: var(--radius-md);
        border-left: 3px solid var(--color-primary);
    }

    .event-time {
        font-size: var(--font-size-sm);
        font-weight: 600;
        color: var(--color-text);
        min-width: 60px;
        flex-shrink: 0;
    }

    .event-details {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xs);
        flex: 1;
    }

    .event-type {
        font-size: var(--font-size-sm);
        font-weight: 600;
        color: var(--color-primary);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .event-description {
        font-size: var(--font-size-sm);
        color: var(--color-text);
    }

    .event-points {
        font-size: var(--font-size-xs);
        font-weight: 700;
        color: var(--color-primary);
    }

    .players-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: var(--spacing-sm);
    }

    .player-card {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
        padding: var(--spacing-md);
        background: var(--color-bg-secondary);
        border-radius: var(--radius-md);
        border: 1px solid var(--color-border);
        transition: all 0.2s ease;
        cursor: pointer;
        width: 100%;
        text-align: left;
    }

    .player-card:hover {
        border-color: var(--color-primary);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        transform: translateY(-1px);
    }

    .player-number {
        font-size: var(--font-size-xl);
        font-weight: 800;
        color: var(--color-primary);
        min-width: 50px;
        text-align: center;
    }

    .player-info {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xs);
    }

    .player-name {
        font-size: var(--font-size-base);
        font-weight: 600;
        color: var(--color-text);
    }

    .player-details {
        font-size: var(--font-size-sm);
        color: var(--color-text-light);
    }

    .no-data {
        color: var(--color-text-light);
        font-style: italic;
        text-align: center;
        padding: var(--spacing-lg);
    }

    @media (max-width: 768px) {
        .modal-content {
            max-height: 100vh;
            border-radius: 0;
        }

        .score {
            font-size: 1.75rem;
        }

        .team-score .team-logo {
            width: 2.4rem;
            height: 2.4rem;
        }

        .players-grid {
            grid-template-columns: 1fr;
        }
    }
</style>
