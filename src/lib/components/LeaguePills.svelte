<script lang="ts">
    import { leagues, type League } from '$lib/data/leagues.js';

    let { selectedLeagueId = $bindable(null) } = $props<{
        selectedLeagueId?: number | null;
    }>();
</script>

<div class="league-filter">
    <div class="pills" role="radiogroup" aria-label="Filter by league">
        <button
            class="pill"
            class:active={selectedLeagueId === null}
            onclick={() => selectedLeagueId = null}
            role="radio"
            aria-checked={selectedLeagueId === null}
            aria-label="All leagues"
        >
            All
        </button>

        {#each leagues as league}
            <button
                class="pill"
                class:active={selectedLeagueId === league.id}
                style="--pill-color: {league.brand_color}"
                onclick={() => selectedLeagueId = league.id}
                role="radio"
                aria-checked={selectedLeagueId === league.id}
                aria-label={`${league.name} — ${league.country}`}
                title={`${league.name} — ${league.country}`}
            >
                <span class="dot" aria-hidden="true"></span>
                <span class="country" aria-hidden="true">
                    {league.country_emoji}
                    <span class="country-text">{league.country_short}</span>
                </span>
                <span class="label">
                    <span class="short">{league.short_name}</span>
                    <span class="long">{league.name}</span>
                </span>
            </button>
        {/each}
    </div>
</div>

<style>
    .league-filter {
        margin-bottom: var(--spacing-md);
    }

    .pills {
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing-sm);
        row-gap: var(--spacing-sm);
        padding-bottom: var(--spacing-sm);
    }

    .pill {
        appearance: none;
        border: 1px solid var(--color-border);
        background: #fff;
        color: var(--color-text);
        border-radius: var(--radius-full);
        padding: 0.5rem 1rem;
        min-height: 2.75rem; /* desktop base slightly larger too */
        font-weight: 500;
        white-space: nowrap;
        display: inline-flex;
        align-items: center;
        gap: var(--spacing-xs);
        cursor: pointer;
        line-height: 1;
        transition: background-color 0.15s ease, border-color 0.15s ease, 
                  color 0.15s ease, box-shadow 0.15s ease;
        touch-action: manipulation;
    }

    .pill:hover {
        border-color: var(--color-border-light);
        background-color: var(--color-bg-secondary);
    }

    .pill.active {
        background-color: var(--pill-color, var(--color-primary));
        color: #fff;
        border-color: var(--pill-color, var(--color-primary));
    }

    .pill:focus-visible {
        outline: 2px solid var(--pill-color, var(--color-primary));
        outline-offset: 2px;
    }

    .dot {
        width: 0.6em;
        height: 0.6em;
        border-radius: var(--radius-full);
        background-color: var(--pill-color, var(--color-secondary));
        align-self: center;
    }

    .pill.active .dot {
        background-color: rgba(255, 255, 255, 0.9);
    }

    .label {
        display: inline-flex;
        align-items: center;
        line-height: 1;
    }

    .country {
        margin-left: var(--spacing-xs);
        color: var(--color-text-light);
        font-size: var(--font-size-sm);
        display: inline-flex;
        align-items: center;
        line-height: 1;
        transform: translateY(0.08em);
    }

    .country-text { display: none; }

    .label .long { display: none; }
    .label .short { display: inline; }

    @media (min-width: 768px) {
        .label .long { display: inline; }
        .label .short { display: none; }
    }

    .pill.active .country {
        color: rgba(255, 255, 255, 0.9);
    }

    /* Mobile optimizations: larger tap targets */
    @media (max-width: 640px) {
        .pills {
            gap: var(--spacing-sm);
        }
        .pill {
            padding: 0.7rem 0.95rem; /* slightly tighter now country removed */
            min-height: 2.9rem; /* ~46px tap target */
            font-size: 0.95rem;
        }
        /* Show only the emoji (hide textual country code) */
        .country { 
            display: inline-flex; 
            align-items: center; 
            font-size: 1rem; 
            margin-left: var(--spacing-xs);
        }
        .country-text { display: none; }
        /* Slightly smaller dot for compact mobile layout */
        .dot { width: 0.55em; height: 0.55em; }
    }
</style>