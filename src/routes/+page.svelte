<script lang="ts">
    import LeaguePills from '$lib/components/LeaguePills.svelte';
    import MatchCard from '$lib/components/MatchCard.svelte';
    import MatchDetailModal from '$lib/components/MatchDetailModal.svelte';
    import { matches } from '$lib/data/matches.js';
    import { leagues } from '$lib/data/leagues.js';
    import type { Match } from '$lib/data/matches.js';
    import CaretDown from 'phosphor-svelte/lib/CaretDown';
    import CaretUp from 'phosphor-svelte/lib/CaretUp';

    // Selected league filter; null means "All"
    let selectedLeagueId: number | null = $state(null);
    let isScrolled = $state(false);
    let showAllMatches = $state(false);
    let selectedMatch: Match | null = $state(null);

    $effect(() => {
        const handleScroll = () => {
            isScrolled = window.scrollY > 0;
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('scroll', handleScroll);
            return () => window.removeEventListener('scroll', handleScroll);
        }
    });

    const TODAY_ISO_DATE = '2025-02-10';
    const TOMORROW_ISO_DATE = (() => {
        const reference = new Date(`${TODAY_ISO_DATE}T00:00:00`);
        reference.setDate(reference.getDate() + 1);
        const year = reference.getFullYear();
        const month = `${reference.getMonth() + 1}`.padStart(2, '0');
		const day = `${reference.getDate()}`.padStart(2, '0');
        return `${year}-${month}-${day}`;
    })();
    
    const TWO_DAYS_LATER = (() => {
        const reference = new Date(`${TODAY_ISO_DATE}T00:00:00`);
        reference.setDate(reference.getDate() + 2);
        const year = reference.getFullYear();
        const month = `${reference.getMonth() + 1}`.padStart(2, '0');
		const day = `${reference.getDate()}`.padStart(2, '0');
        return `${year}-${month}-${day}`;
    })();

    // Filter matches based on selected league
    const filteredMatches = $derived(
        selectedLeagueId === null
            ? matches
            : matches.filter(m => m.league_id === selectedLeagueId)
    );

    const formatDate = (isoDate: string) =>
        new Date(`${isoDate}T00:00:00`).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

    const sortByDatetime = (list: typeof matches) =>
        list.slice().sort((a, b) => a.datetime.localeCompare(b.datetime));

    // Split matches into today vs. upcoming days while keeping chronological order
    const sections = $derived(() => {
        const today: typeof matches = [];
        const tomorrow: typeof matches = [];
        const futureGrouped: Record<string, typeof matches> = {};

        filteredMatches.forEach(match => {
            const isoDate = match.datetime.slice(0, 10);

            // Skip past matches
            if (isoDate < TODAY_ISO_DATE) {
                return;
            }

            if (isoDate === TODAY_ISO_DATE) {
                today.push(match);
                return;
            }

            if (isoDate === TOMORROW_ISO_DATE) {
                tomorrow.push(match);
                return;
            }

            if (!futureGrouped[isoDate]) {
                futureGrouped[isoDate] = [];
            }

            futureGrouped[isoDate].push(match);
        });

        const upcomingDays = Object.entries(futureGrouped)
            .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
            .map(([isoDate, dayMatches]) => ({
                isoDate,
                label: formatDate(isoDate),
                matches: sortByDatetime(dayMatches)
            }));

        // Split upcoming into near and far
        const nearUpcoming = upcomingDays.filter(day => day.isoDate <= TWO_DAYS_LATER);
        const farUpcoming = upcomingDays.filter(day => day.isoDate > TWO_DAYS_LATER);

        return {
            todayMatches: sortByDatetime(today),
            tomorrowMatches: sortByDatetime(tomorrow),
            nearUpcoming,
            farUpcoming
        };
    });
</script>

<div class="sticky-filters" class:scrolled={isScrolled}>
    <LeaguePills bind:selectedLeagueId />
</div>

{#if filteredMatches.length === 0}
    <div class="no-matches">No matches found</div>
{:else}
    {@const groupedSections = sections()}

    {#if groupedSections.todayMatches.length}
        <section class="today-section">
            <h2 class="section-header">Today</h2>
            <div class="matches-grid">
                {#each groupedSections.todayMatches as match (match.id)}
                    <MatchCard {match} onClick={() => selectedMatch = match} />
                {/each}
            </div>
        </section>
    {/if}

    {#if groupedSections.tomorrowMatches.length}
        <section class="tomorrow-section">
            <h2 class="section-header">Tomorrow</h2>
            <div class="matches-grid">
                {#each groupedSections.tomorrowMatches as match (match.id)}
                    <MatchCard {match} onClick={() => selectedMatch = match} />
                {/each}
            </div>
        </section>
    {/if}

    {#if groupedSections.nearUpcoming.length}
        <section class="other-days">
            <h2 class="section-header">Upcoming</h2>

            {#each groupedSections.nearUpcoming as day}
                <div class="day-section">
                    <h3 class="day-header">{day.label}</h3>
                    <div class="matches-grid">
                        {#each day.matches as match (match.id)}
                            <MatchCard {match} onClick={() => selectedMatch = match} />
                        {/each}
                    </div>
                </div>
            {/each}
        </section>
    {/if}

    {#if groupedSections.farUpcoming.length}
        {#if showAllMatches}
            <section class="other-days far-upcoming">
                {#each groupedSections.farUpcoming as day}
                    <div class="day-section">
                        <h3 class="day-header">{day.label}</h3>
                        <div class="matches-grid">
                            {#each day.matches as match (match.id)}
                                <MatchCard {match} onClick={() => selectedMatch = match} />
                            {/each}
                        </div>
                    </div>
                {/each}
            </section>
        {/if}

        <div class="see-more-container">
            <button class="see-more-button" onclick={() => showAllMatches = !showAllMatches}>
                <span class="button-text">{showAllMatches ? 'Show Less' : 'Show More'}</span>
                {#if showAllMatches}
                    <CaretUp size={24} weight="bold" />
                {:else}
                    <CaretDown size={24} weight="bold" />
                {/if}
            </button>
        </div>
    {/if}
{/if}

{#if selectedMatch}
    <MatchDetailModal match={selectedMatch} onClose={() => selectedMatch = null} />
{/if}

<style>
    .sticky-filters {
        position: sticky;
        top: 57px; /* Height of the header */
        z-index: 50;
        padding-top: var(--spacing-lg);
        padding-bottom: var(--spacing-sm);
        margin-bottom: calc(var(--spacing-md) * -1);
        margin-top: calc(var(--spacing-md) * -1);
    }

    .sticky-filters :global(.pill) {
        transition: background-color 0.15s ease, border-color 0.15s ease, 
                  color 0.15s ease, box-shadow 0.3s ease;
    }

    .sticky-filters.scrolled :global(.pill) {
        box-shadow: 0 18px 50px 20px rgba(0, 0, 0, 0.15);
    }

    .section-header {
        font-size: var(--font-size-3xl);
        font-weight: 700;
        color: var(--color-text);
        margin-bottom: var(--spacing-md);
    }

    .day-section {
        margin-bottom: var(--spacing-xl);
    }

    .day-header {
        font-size: var(--font-size-lg);
        font-weight: 600;
        color: var(--color-text);
        margin-bottom: var(--spacing-sm);
        padding-bottom: var(--spacing-sm);
    }

    .matches-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: var(--spacing-md);
    }

    .see-more-container {
        display: flex;
        justify-content: center;
        margin: var(--spacing-xl) 0;
    }

    .see-more-button {
        background: white;
        color: var(--color-text-light);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        padding: var(--spacing-lg) var(--spacing-xl);
        cursor: pointer;
        transition: all 0.2s ease;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        display: inline-flex;
        flex-direction: column;
        align-items: center;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		gap: var(--spacing-xs);
    }

    .see-more-button:hover {
        background: var(--color-bg-secondary);
        border-color: var(--color-border-light);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    }

    .see-more-button:active {
        transform: translateY(0);
    }

    .button-text {
        font-size: var(--font-size-base-xs);
		font-family: var(--font-family);
        font-weight: 600;
        line-height: 1.2;
    }

    .see-more-button :global(svg) {
        color: var(--color-text-light);
    }

    .no-matches {
        text-align: center;
        padding: var(--spacing-xl);
        color: var(--color-text-light);
    }

    @media (min-width: 800px) {
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