<script lang="ts">
  import '../app.css';
  import { page } from '$app/state';

  import MagnifyingGlass from 'phosphor-svelte/lib/MagnifyingGlass';
  import Basketball from 'phosphor-svelte/lib/Basketball';
  import List from 'phosphor-svelte/lib/List';
  import X from 'phosphor-svelte/lib/X';

  type Props = {
    children: import('svelte').Snippet;
  };

  let { children }: Props = $props();

  const navLinks = [
    { href: '/', label: 'Today & Upcoming' },
    { href: '/standings', label: 'Standings' },
    { href: '/players', label: 'Players' },
    { href: '/teams', label: 'Teams' }
  ];

  let menuOpen = $state(false);
  let searchOpen = $state(false);
  let searchQuery = $state('');

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
    if (searchOpen) menuOpen = false;
  }

  function closeSearch() {
    searchOpen = false;
    searchQuery = '';
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
          class="search-input"
        />
      </div>
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
</style>

