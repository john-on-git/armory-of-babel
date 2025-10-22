<script lang="ts">
    import ConfigSidebar from "$lib/components/configSidebar.svelte";
    import WeaponGenerator from "$lib/components/weaponGenerator.svelte";
    import { defaultWeaponRarityConfigFactory } from "$lib/generators/weaponGenerator/weaponGeneratorConfigLoader";
    import type { WeaponRarityConfig } from "$lib/generators/weaponGenerator/weaponGeneratorTypes";
    import { applyOddsToConfig, calcOdds } from "$lib/util/configUtils";
    import { syncLocationWithURLSearchParams } from "$lib/util/queryString";
    import _ from "lodash";
    import { writable } from "svelte/store";
    import { getOddsFromURL } from "../lib/util/getFromURL";

    import { dev } from "$app/environment";
    import { injectAnalytics } from "@vercel/analytics/sveltekit";
    injectAnalytics({ mode: dev ? "development" : "production" });

    function getConfigFromURL(): WeaponRarityConfig {
        let config = defaultWeaponRarityConfigFactory();

        // these are user input and could be literally anything, i.e. an XSS attack

        const urlParams = new URLSearchParams(window.location.search);

        const odds = getOddsFromURL(urlParams);
        if (odds !== null) {
            config = applyOddsToConfig(config, odds);
        }

        // get the rarity odds

        return config;
    }

    const defaultConfig = $state(defaultWeaponRarityConfigFactory());
    const defaultOdds = $derived(calcOdds(defaultConfig));

    let config = $state(getConfigFromURL());
    const configWritable = writable((() => config)());

    configWritable.subscribe((newVal) => {
        config = newVal;

        // if a section of the config is not default, also update the URL

        // only add the id param if it wasn't added already
        const searchParams = new URLSearchParams(window.location.search);

        const newOdds = calcOdds(config);

        if (_.isEqual(newOdds, defaultOdds)) {
            searchParams.delete("rarityOdds");
        } else {
            searchParams.set("rarityOdds", newOdds[0].toFixed(2));
            searchParams.append("rarityOdds", newOdds[1].toFixed(2));
            searchParams.append("rarityOdds", newOdds[2].toFixed(2));
            searchParams.append("rarityOdds", newOdds[3].toFixed(2));
        }
        syncLocationWithURLSearchParams(searchParams, "replace");
    });
</script>

<h1>Generator Test</h1>
<WeaponGenerator />
<ConfigSidebar {config} {configWritable} />

<style>
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

        margin-bottom: 10pt;

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

    :global(h1) {
        font-size: 3.2em;
        line-height: 1.1;
    }
    :global(h2) {
        text-align: center;
        margin-top: 1rem;
        margin-bottom: 1rem;
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
        transition: border-color 0.25s;
    }
    :global(button:hover) {
        border-color: #ffffff47;
    }
    :global(button:focus, button:focus-visible) {
        outline: 4px auto -webkit-focus-ring-color;
    }

    @media (prefers-color-scheme: light) {
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
    :global(h1) {
        height: 7.5vh;
        margin: 0;
        margin-top: 1.5vh;
    }

    :global(.fade-in-1) {
        animation: 0.666s ease-in 0s 1 fade-in-1;
    }
    :global(.fade-in-2) {
        animation: 0.666s ease-in 0s 1 fade-in-2;
    }

    @keyframes fade-in-1 {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    @keyframes fade-in-2 {
        from {
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
