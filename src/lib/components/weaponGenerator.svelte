<script lang="ts">
    import { weaponFeatureVersionController as weaponVersionController } from "$lib/generators/weaponGenerator/weaponFeatureVersionController";
    import { syncLocationWithURLSearchParams } from "$lib/util/queryString";
    import { StatusCodes } from "http-status-codes";
    import _ from "lodash";
    import { onMount, tick } from "svelte";
    import { defaultWeaponRarityConfigFactory } from "../generators/weaponGenerator/weaponGeneratorConfigLoader";
    import type { WeaponViewModel } from "../generators/weaponGenerator/weaponGeneratorTypes";
    import { calcOdds } from "../util/configUtils";
    import { getOddsFromURL } from "../util/getFromURL";
    import WeaponDisplay from "./weaponDisplay.svelte";

    let version = $state(getVersionFromURL());
    let weaponID = $state(getIDFromURL());
    let odds = $state(getOddsFromURL());

    let weapon = $state<WeaponViewModel | null>(null);

    // set up event listeners
    onMount(async () => {
        // listen for any future changes in the URL, ensuring that the weapon always conforms to it
        window.addEventListener("popstate", async () => {
            weaponID = getIDFromURL();
            version = getVersionFromURL();
            odds =
                getOddsFromURL() ??
                calcOdds(defaultWeaponRarityConfigFactory());

            const searchParams = new URLSearchParams(window.location.search);
            if (searchParams.get("rarityOdds") === null) {
                searchParams.set("rarityOdds", odds[0].toFixed(2));
                searchParams.append("rarityOdds", odds[1].toFixed(2));
                searchParams.append("rarityOdds", odds[2].toFixed(2));
                searchParams.append("rarityOdds", odds[3].toFixed(2));
            }
            const { res, forParams } = await (async () => {
                // take a copy of the parts of the UI state that determine the weapon at the time the request was made
                const forParams = {
                    weaponID: weaponID,
                    version: version,
                    odds: [...odds],
                };

                //make the request
                const res = await fetch(
                    `/api/generate-weapon?${searchParams.toString()}`,
                );

                return { res: res, forParams: forParams };
            })();
            if (res.status === StatusCodes.OK) {
                // if this still matches the UI state
                if (
                    _.isEqual(forParams.odds, odds) &&
                    forParams.version === version &&
                    forParams.weaponID === weaponID
                ) {
                    const resBody = await res.json();
                    weapon = resBody as unknown as WeaponViewModel;
                }
            } else {
                weapon = null;
            }
        });

        tick().then(() => {
            // and initialize any values in the URL that have not been set yet
            if (
                new URLSearchParams(window.location.search).get("id") === null
            ) {
                pushIdToURL(weaponID);
            }
            if (new URLSearchParams(window.location.search).get("v") === null) {
                pushVersionToURL(version);
            }
        });
    });

    /** Generate a new weapon ID / seed.
     */
    function getNewId() {
        return Math.floor(Math.random() * 10e19).toString();
    }
    /**
     * Get the version ID associated with the current URL.
     * If the URL has no 'v' param, its associated with the latest version.
     */
    function getVersionFromURL(): number {
        // this is user input and could be literally anything, i.e. an XSS attack
        const maybeNumber = Number.parseInt(
            new URLSearchParams(window.location.search).get("v") ?? "NaN",
        );

        if (Number.isInteger(maybeNumber)) {
            // return the existing version num
            return maybeNumber;
        } else {
            // get the latest version
            const latest = weaponVersionController.getLatestVersionNum();

            // push it to the URL
            const searchParams = new URLSearchParams(window.location.search);
            searchParams.set("v", latest.toString());
            syncLocationWithURLSearchParams(searchParams, "replace");

            // return it
            return latest;
        }
    }
    function pushVersionToURL(id: number) {
        // only add the id param if it wasn't added already
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set("v", id.toString());

        // and update the URL params to point to its ID
        syncLocationWithURLSearchParams(searchParams, "replace");
    }

    /**
     * Get the weapon ID associated with the current URL.
     * If the URL has no 'id' param, its associated with a random ID.
     */
    function getIDFromURL(): string {
        // this is user input and could be literally anything, i.e. an XSS attack
        const maybeNumber = Number.parseInt(
            new URLSearchParams(window.location.search).get("id") ?? "NaN",
        );

        return Number.isInteger(maybeNumber)
            ? maybeNumber.toString()
            : getNewId();
    }
    function pushIdToURL(id: string) {
        // only add the id param if it wasn't added already
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set("id", id);

        // and update the URL params to point to its ID
        syncLocationWithURLSearchParams(searchParams, "push");
    }

    /**
     * Generate a new weapon, called when the page is loaded without an ID in the URL, and when the 'generate' button is clicked.
     */
    function generateWeapon() {
        pushIdToURL(getNewId());
    }
</script>

<div class="weapon-generator">
    {#if weapon !== null}
        <WeaponDisplay {weapon} />
    {/if}
    <button class="generate-button" onclick={generateWeapon}>Generate</button>
</div>

<style>
    @media (orientation: landscape) {
        .weapon-generator {
            margin-left: 10vw;
            margin-right: 10vw;
        }
    }
    @media (orientation: portrait) {
        .weapon-generator {
            margin-left: 5vw;
            margin-right: 5vw;
        }
    }

    .weapon-generator {
        display: flex;
        flex-direction: column;
        align-items: center;

        position: relative;

        flex-grow: 1;
    }

    .generate-button {
        height: 3rem;
        display: flex;
        align-items: center;
        justify-content: center;

        margin-top: auto;

        width: fit-content;
    }
</style>
