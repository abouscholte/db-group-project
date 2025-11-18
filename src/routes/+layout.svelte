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

  function isActive(href: string, currentPath: string) {
    if (href === '/') {
      return currentPath === '/';
    }
    return currentPath.startsWith(href);
  }

  function toggleMenu() {
    menuOpen = !menuOpen;
  }

  function closeMenu() {
    menuOpen = false;
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
    <button class="search-button" aria-label="Search">
      <MagnifyingGlass size={24} />
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
</style>

