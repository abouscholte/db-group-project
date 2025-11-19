<script lang="ts">
    import { leagues } from '../data/leagues.js';
    import { teams } from '../data/teams.js';
    import type { Match } from '../data/matches.js';

    const { match, onClick } = $props<{ match: Match; onClick?: () => void }>();

    const league = $derived(leagues.find(l => l.id === match.league_id));
    const homeTeam = $derived(teams.find(t => t.id === match.home_team_id));
    const awayTeam = $derived(teams.find(t => t.id === match.away_team_id));
    const isUpcoming = $derived(match.status === 'Upcoming');
    const isLive = $derived(match.status === 'Live');

    // Generate a pseudo-random but consistent game clock for live matches
    const gameTime = $derived(() => {
        if (!isLive) return '';
        const matchId = match.id;
        const quarter = ((matchId % 4) + 1);
        const minutesBase = matchId % 12;
        const seconds = (matchId * 7) % 60;
        return `Q${quarter} ${minutesBase}:${seconds.toString().padStart(2, '0')}`;
    });

    function formatDate(dateStr: string): string {
        const d = new Date(dateStr);
        return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }

    function formatTime(dateStr: string): string {
        const d = new Date(dateStr);
        return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    }

    function createSlug(name: string): string {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    // Legacy click/key handlers removed; anchors now handle navigation semantically.
</script>

<div class="match-card" class:upcoming={isUpcoming} class:live={isLive} style="--league-color: {league?.brand_color}" onclick={onClick} role="button" tabindex="0" onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick?.(); } }}>
    <div class="match-header">
        <div class="league-info">
            <img 
                class="league-logo" 
                src={league?.logo_url} 
                alt={league?.short_name}
                title={league?.name}
            >
            <span class="league-name">
                {league?.short_name}
            </span>
            <span class="match-date">{formatDate(match.datetime)}</span>
        </div>
        {#if isLive}
            <div class="live-indicator">
                <span class="live-dot"></span>
                <span class="live-text">LIVE</span>
            </div>
        {/if}
    </div>

    <div class="match-teams">
        <div class="team home">
            <img 
                class="team-logo" 
                src={homeTeam?.logo_url} 
                alt={homeTeam?.name}
                title={homeTeam?.name}
            >
                <a 
                    class="team-name" 
                    href={`/teams/${createSlug(homeTeam?.name ?? '')}`} 
                    aria-label={`View team ${homeTeam?.name}`}
                >
                    {homeTeam?.short_name}
                </a>
        </div>
        <div class="score">
            {#if isUpcoming}
                <div class="upcoming-score">
                    <span class="upcoming-label">Tip-off</span>
                    <span class="upcoming-time">{formatTime(match.datetime)}</span>
                    <span class="upcoming-vs">vs</span>
                </div>
            {:else if isLive}
                <div class="live-score">
                    <div class="game-clock">{gameTime()}</div>
                    <div class="score-display">{match.home_score} - {match.away_score}</div>
                </div>
            {:else}
                <div class="score-display">{match.home_score} - {match.away_score}</div>
            {/if}
        </div>
        <div class="team away">
            <a 
                class="team-name" 
                href={`/teams/${createSlug(awayTeam?.name ?? '')}`} 
                aria-label={`View team ${awayTeam?.name}`}
            >
                {awayTeam?.short_name}
            </a>
            <img 
                class="team-logo" 
                src={awayTeam?.logo_url} 
                alt={awayTeam?.name}
                title={awayTeam?.name}
            >
        </div>
    </div>

    <div class="match-footer">
        <span class="status">{match.status}</span>
        <span class="venue">{match.venue}</span>
    </div>
</div>

<style>
    :root {
        --league-color: #007bff;
    }

    .match-card {
        background: #fff;
        border-radius: var(--radius-lg);
        border: 2px solid var(--league-color);
        padding: var(--spacing-md);
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        transition: all 0.2s ease;
        position: relative;
        overflow: hidden;
        cursor: pointer;
        width: 100%;
        text-align: left;
    }

    .match-card.upcoming {
        border-style: dashed;
        background: linear-gradient(145deg, rgba(0, 0, 0, 0.04), rgba(255, 255, 255, 0.9));
    }

    .match-card.upcoming::before {
        background: linear-gradient(90deg, rgba(0, 0, 0, 0.12), transparent);
    }

    .match-card.live {
        border-color: #ff4444;
        box-shadow: 0 0 8px 5px #ff44442c;
    }

    .match-card.live::before {
        background: linear-gradient(90deg, #ff4444 20%, transparent 40%, transparent 60%, #ff4444 80%);
        background-size: 200% 100%;
        animation: liveLineMove 4s linear infinite;
    }

    @keyframes liveLineMove {
        0% {
            background-position: 200% 0;
        }
        100% {
            background-position: -200% 0;
        }
    }

    .match-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, var(--league-color), transparent);
    }

    .match-card:hover {
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
        transform: translateY(-2px);
    }

    .match-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--spacing-sm);
    }

    .league-info {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
    }

    .league-logo {
        width: 1.5rem;
        height: 1.5rem;
        object-fit: contain;
        flex-shrink: 0;
    }

    .league-name {
        background: var(--league-color);
        color: #fff;
        padding: 0.375rem 0.75rem;
        border-radius: var(--radius-md);
        font-weight: 700;
        font-size: var(--font-size-sm);
        letter-spacing: 0.05em;
        white-space: nowrap;
    }

    .match-date {
        color: var(--color-text-light);
        font-size: var(--font-size-sm);
        font-weight: 500;
    }

    .live-indicator {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: #ff4444;
        color: white;
        padding: 0.375rem 0.75rem;
        border-radius: var(--radius-md);
        font-weight: 700;
        font-size: var(--font-size-xs);
        letter-spacing: 0.05em;
    }

    .live-dot {
        width: 8px;
        height: 8px;
        background: white;
        border-radius: 50%;
        animation: liveDotPulse 1.5s ease-in-out infinite;
    }

    @keyframes liveDotPulse {
        0%, 100% {
            opacity: 1;
            transform: scale(1);
        }
        50% {
            opacity: 0.6;
            transform: scale(1.3);
        }
    }

    .live-text {
        font-weight: 800;
    }

    .match-teams {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--spacing-md);
        padding: var(--spacing-md) 0;
        border-top: 1px solid var(--color-border);
        border-bottom: 1px solid var(--color-border);
    }

    .team {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 0;
        gap: var(--spacing-md);
    }

    .team-logo {
        width: 2.5rem;
        height: 2.5rem;
        object-fit: contain;
        filter: drop-shadow(0 1px 2px rgba(0,0,0,0.12));
        transition: transform 0.15s ease;
    }

    .team:hover .team-logo {
        transform: scale(1.05);
    }

    @media (max-width: 640px) {
        .team-logo {
            width: 2rem;
            height: 2rem;
        }
    }

    .team.away {
        justify-content: flex-end;
    }

    .team-name {
        font-weight: 700;
        font-size: var(--font-size-base);
        color: var(--color-text);
        text-align: center;
        word-break: break-word;
    }

    .team-name {
        position: relative;
        text-decoration: none;
        padding: 0.25rem 0.5rem;
        border-radius: var(--radius-sm);
        transition: color 0.15s ease, background 0.15s ease;
    }

    .team-name:hover,
    .team-name:focus-visible {
        background: var(--color-bg-secondary);
        color: var(--color-primary);
        outline: none;
    }

    .score {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 110px;
    }

    .score-display {
        font-size: 1.75rem;
        font-weight: 800;
        color: var(--league-color);
        min-width: 110px;
        text-align: center;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }

    .match-card.live .score-display {
        color: #ff4444;
        animation: scoreFlash 3s ease-in-out infinite;
    }

    @keyframes scoreFlash {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: 0.85;
        }
    }

    .upcoming-score {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.25rem;
        min-width: 110px;
        padding: 0.5rem 0.75rem;
        border-radius: var(--radius-md);
        background: rgba(0, 0, 0, 0.05);
        border: 1px dashed rgba(0, 0, 0, 0.1);
    }

    .upcoming-label {
        font-size: var(--font-size-xs);
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--color-text-light);
        font-weight: 600;
    }

    .upcoming-time {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--color-text);
    }

    .upcoming-vs {
        font-size: var(--font-size-xs);
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--color-text-light);
    }

    .live-score {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        min-width: 110px;
    }

    .game-clock {
        font-size: var(--font-size-sm);
        font-weight: 700;
        color: #ff4444;
        background: rgba(255, 68, 68, 0.1);
        padding: 0.25rem 0.75rem;
        border-radius: var(--radius-sm);
        letter-spacing: 0.05em;
        animation: clockPulse 2s ease-in-out infinite;
    }

    @keyframes clockPulse {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: 0.7;
        }
    }

    .match-footer {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xs);
        font-size: var(--font-size-sm);
    }

    .status {
        color: var(--league-color);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-weight: 600;
        font-size: var(--font-size-xs);
    }

    .match-card.upcoming .status {
        color: var(--color-text-light);
    }

    .match-card.live .status {
        color: #ff4444;
        font-weight: 800;
    }

    .venue {
        color: var(--color-text-light);
        font-size: var(--font-size-xs);
    }
</style>
