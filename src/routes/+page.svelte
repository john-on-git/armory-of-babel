<script lang="ts">
    import ConfigSidebar from "$lib/components/configSidebar.svelte";
    import WeaponGenerator from "$lib/components/weaponGenerator.svelte";
    import { getOddsFromURL } from "$lib/util/getFromURL";
    import { writable } from "svelte/store";

    import { dev } from "$app/environment";
    import { syncLocationWithURLSearchParams } from "$lib/util/queryString";
    import { injectAnalytics } from "@vercel/analytics/sveltekit";
    import _ from "lodash";
    import { tick } from "svelte";
    import { DEFAULT_RARITY_ODDS } from "./state.svelte";
    injectAnalytics({ mode: dev ? "development" : "production" });

    function resetToDefault() {
        oddsWritable.set([...DEFAULT_RARITY_ODDS] as [
            number,
            number,
            number,
            number,
        ]);
    }

    let odds = $state(
        getOddsFromURL() ??
            ([...DEFAULT_RARITY_ODDS] as [number, number, number, number]),
    );

    const oddsWritable = writable((() => odds)());
    tick().then(() =>
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
        }),
    );
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

    @media (prefers-color-scheme: dark) {
        :global(:root) {
            --color-background: #27272a;
            --color-foreground: white;
        }
    }
    @media (prefers-color-scheme: light) {
        :global(:root) {
            --color-background: white;
            --color-foreground: #121212;
        }
    }
    :global(:root) {
        --color-uncommon: hsl(108, 74%, 50%);
        --color-rare: hsl(212, 74%, 55%);
        --color-epic: hsl(273, 74%, 60%);
        --color-legendary: hsl(51, 84%, 50%);

        --negative-shimmer-angle: 70deg;
        --negative-shimmer-width: 10rem;

        --color-uncommon-negative-hi: hsl(7, 74%, 55%);
        --color-uncommon-negative-lo: hsl(7, 67%, 35%);

        --color-rare-negative-hi: hsl(301, 87%, 64%);
        --color-rare-negative-lo: hsl(301, 61%, 43%);

        --color-epic-negative-hi: hsl(146, 74%, 60%);
        --color-epic-negative-lo: hsl(155, 80%, 34%);

        --color-legendary-negative-hi: hsl(176, 79%, 68%);
        --color-legendary-negative-lo: hsl(176, 72%, 39%);
    }

    @keyframes gradient-scroll-x {
        0% {
            background-position-x: 0;
        }
        100% {
            background-position-x: var(--negative-shimmer-width);
        }
    }

    :global(:root) {
        font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
        line-height: 1.5;
        font-weight: 400;

        color-scheme: light dark;
        color: var(--color-foreground);
        background-color: var(--color-background);

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
            color: var(--color-foreground);
            background-color: var(--color-background);
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

    @media (prefers-color-scheme: dark) {
        :global(.weapon-rarity-common) {
            color: white !important;
        }
    }
    @media (prefers-color-scheme: light) {
        :global(.weapon-rarity-common) {
            color: #121212 !important;
        }
    }
    :global(.weapon-rarity-uncommon) {
        color: var(--color-uncommon) !important;
    }
    :global(.weapon-rarity-rare) {
        color: var(--color-rare) !important;
    }
    :global(.weapon-rarity-epic) {
        color: var(--color-epic) !important;
    }
    :global(.weapon-rarity-legendary) {
        color: var(--color-legendary) !important;
    }

    :global(.weapon-rarity-uncommon-negative) {
        background-image: linear-gradient(
            var(--negative-shimmer-angle),
            var(--color-uncommon-negative-hi),
            var(--color-uncommon-negative-lo),
            var(--color-uncommon-negative-hi)
        ) !important;
        color: transparent;
        background-clip: text;
    }
    :global(.weapon-rarity-rare-negative) {
        background-image: linear-gradient(
            var(--negative-shimmer-angle),
            var(--color-rare-negative-hi),
            var(--color-rare-negative-lo),
            var(--color-rare-negative-hi)
        ) !important;
        color: transparent;
        background-clip: text;
        animation: linear 1s gradient-scroll-x;
    }
    :global(.weapon-rarity-epic-negative) {
        background-image: linear-gradient(
            var(--negative-shimmer-angle),
            var(--color-epic-negative-hi),
            var(--color-epic-negative-lo),
            var(--color-epic-negative-hi)
        ) !important;
        color: transparent;
        background-clip: text;
    }
    :global(.weapon-rarity-legendary-negative) {
        background-image: linear-gradient(
            var(--negative-shimmer-angle),
            var(--color-legendary-negative-lo),
            var(--color-legendary-negative-hi),
            var(--color-legendary-negative-lo)
        ) !important;
        color: transparent;
        background-clip: text;
    }
    :global(.weapon-negative) {
        background-size: var(--negative-shimmer-width);
        animation: 1.5s linear 0s gradient-scroll-x infinite;
    }
</style>
