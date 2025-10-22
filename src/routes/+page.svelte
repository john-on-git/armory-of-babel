<script lang="ts">
    import ConfigSidebar from "$lib/components/configSidebar.svelte";
    import WeaponGenerator from "$lib/components/weaponGenerator.svelte";
    import { getOddsFromURL } from "$lib/util/getFromURL";
    import { writable } from "svelte/store";

    import { dev } from "$app/environment";
    import { syncLocationWithURLSearchParams } from "$lib/util/queryString";
    import { injectAnalytics } from "@vercel/analytics/sveltekit";
    import _ from "lodash";
    import { DEFAULT_RARITY_ODDS } from "./state.svelte";
    injectAnalytics({ mode: dev ? "development" : "production" });

    function resetToDefault() {
        odds = DEFAULT_RARITY_ODDS;
    }

    let odds = $state(getOddsFromURL() ?? DEFAULT_RARITY_ODDS);

    const oddsWritable = writable((() => odds)());
    oddsWritable.subscribe((newVal) => {
        odds = newVal;

        // if a section of the config is not default, also update the URL

        // only add the id param if it wasn't added already
        const searchParams = new URLSearchParams(window.location.search);

        if (_.isEqual(odds, DEFAULT_RARITY_ODDS)) {
            searchParams.delete("o");
        } else {
            searchParams.set("o", odds[0].toFixed(2));
            for (let i = 1; i < odds.length; i++) {
                searchParams.append("o", odds[i].toFixed(2));
            }
        }
        syncLocationWithURLSearchParams(searchParams, "replace");
    });
</script>

<WeaponGenerator {odds} />
<ConfigSidebar {odds} {oddsWritable} {resetToDefault} />

<style>
    :global(body, html) {
        overflow-x: hidden;
    }
    @media (orientation: portrait) {
        :global(h2) {
            padding-top: 3rem;
        }
    }

    :global(:root) {
        --bg-dark: #242424;

        --color-common: white;
        --color-uncommon: hsl(108, 74%, 50%);
        --color-rare: hsl(212, 74%, 55%);
        --color-epic: hsl(273, 74%, 60%);
        --color-legendary: hsl(51, 84%, 50%);
    }

    :global(:root) {
        font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
        line-height: 1.5;
        font-weight: 400;

        color-scheme: light dark;
        color: rgba(255, 255, 255, 0.87);
        background-color: var(--bg-dark);

        font-synthesis: none;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;

        height: 100%;
    }

    :global(*) {
        padding: 0;
        box-sizing: border-box;
    }

    :global(#sveltekit-body) {
        flex-grow: 1;

        display: flex;
        flex-direction: column;
        align-items: center;

        position: relative;
    }

    :global(h1, h2) {
        text-align: center;
    }

    :global(p) {
        margin: 0;
    }

    :global(a) {
        font-weight: 500;
        color: #646cff;
        text-decoration: inherit;
    }
    :global(a:hover) {
        color: #535bf2;
    }

    :global(body) {
        margin: 0;

        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    :global(#body) {
        width: 100%;
    }

    :global(h2) {
        text-align: center;
        padding-top: 1rem;
        padding-bottom: 1rem;
    }

    :global(#app) {
        max-width: 1280px;
        margin: 0 auto;
        padding: 2rem;
        text-align: center;
    }

    :global(.logo) {
        height: 6em;
        padding: 1.5em;
        will-change: filter;
        transition: filter 300ms;
    }
    :global(.logo:hover) {
        filter: drop-shadow(0 0 2em #646cffaa);
    }
    :global(.logo.vanilla:hover) {
        filter: drop-shadow(0 0 2em #3178c6aa);
    }

    :global(.card) {
        padding: 2em;
    }

    :global(.bold) {
        font-weight: bold;
    }
    :global(.italic) {
        font-style: italic;
    }
    :global(.underline) {
        text-decoration: underline;
    }

    :global(button) {
        border-radius: 8px;
        border: 2pt solid transparent;
        padding: 0.6em 1.2em;
        font-size: 1em;
        font-weight: 500;
        font-family: inherit;
        background-color: #1a1a1a;
        cursor: pointer;
    }
    :global(.default-button) {
        transition: border-color 0.25s;
    }
    :global(.default-button:hover) {
        border-color: #ffffffa9;
    }
    :global(.default-button:focus, .default-button:focus-visible) {
        outline: 4px auto -webkit-focus-ring-color;
    }

    @media (prefers-color-scheme: light) {
        :global(i) {
            color: black;
        }
        :global(:root) {
            color: #213547;
            background-color: #ffffff;
        }
        :global(a:hover) {
            color: #747bff;
        }
        :global(button) {
            background-color: #f9f9f9;
        }
        :global(button:hover) {
            border-color: #00000047 !important;
        }
    }

    :global(.fade-in-1) {
        animation: 1s ease-in 0s 1 fade-in-1 forwards;
    }
    :global(.fade-in-2) {
        animation: 1s ease-in 0s 1 fade-in-2 forwards;
    }
    :global(.fade-out-1) {
        animation: 0.666s ease-out 0s 1 fade-in-1 reverse;
    }
    :global(.fade-out-2) {
        animation: 0.666s ease-out 0s 1 fade-in-2 reverse;
    }
    :global(.fade-in-fast) {
        animation: 0.2s ease-in 0s 1 fade-in-1 forwards;
    }
    :global(.fade-out-fast) {
        animation: 0.2s ease-in 0s 1 fade-in-2 forwards;
        animation-direction: reverse;
    }

    :global(.inline-button, .action-button) {
        aspect-ratio: 1;

        background-color: transparent;
        border: 0 solid transparent;

        padding: 0;

        opacity: 33%;
        color: white;

        cursor: pointer;
    }

    :global(.action-button:disabled, .inline-button:disabled) {
        opacity: 5%;
        cursor: auto;
    }

    :global(
            .action-button:not(:disabled):hover,
            .inline-button:not(:disabled):hover
        ) {
        opacity: 1;
    }

    :global(
            .action-button:not(:disabled):active,
            .inline-button:not(:disabled):active
        ) {
        -webkit-text-fill-color: transparent;
        -webkit-text-stroke: 1pt;
        paint-order: stroke;
    }

    :global(.action-button) {
        position: fixed;
    }

    @keyframes fade-in-1 {
        0% {
            opacity: 0;
        }
        10% {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    @keyframes fade-in-2 {
        0% {
            opacity: 0;
        }
        10% {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    :global(.weapon-rarity-common) {
        color: white;
    }
    :global(.weapon-rarity-uncommon) {
        color: var(--color-uncommon);
    }
    :global(.weapon-rarity-rare) {
        color: var(--color-rare);
    }
    :global(.weapon-rarity-epic) {
        color: var(--color-epic);
    }
    :global(.weapon-rarity-legendary) {
        color: var(--color-legendary);
    }
</style>
