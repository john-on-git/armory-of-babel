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
<ConfigSidebar bind:odds {oddsWritable} {resetToDefault} />
