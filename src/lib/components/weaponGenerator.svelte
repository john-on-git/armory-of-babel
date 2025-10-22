<script lang="ts">
    import { pushState } from "$app/navigation";
    import { weaponFeatureVersionController } from "$lib/generators/weaponGenerator/weaponFeatureVersionController";
    import { mkWeapon } from "$lib/generators/weaponGenerator/weaponGeneratorLogic";
    import {
        type Weapon,
        type WeaponRarityConfig,
    } from "$lib/generators/weaponGenerator/weaponGeneratorTypes.ts";
    import { pushURLSearchParamsToLocation } from "$lib/util/queryString";
    import { onMount, tick } from "svelte";
    import { writable } from "svelte/store";
    import WeaponDisplay from "./weaponDisplay.svelte";

    interface Props {
        config?: WeaponRarityConfig;
    }

    const { config }: Props = $props();

    const version = writable<number>(getVersionFromURL());
    let featureProviders = $state(
        weaponFeatureVersionController.getVersion(
            weaponFeatureVersionController.getLatestVersionNum(),
        ),
    );
    version.subscribe((newVersion) => {
        // update the view with the new weapon. derived doesn't update when the URL is changed
        featureProviders =
            weaponFeatureVersionController.getVersion(newVersion);
    });

    let weapon: Weapon = $state(
        // svelte-ignore state_referenced_locally
        mkWeapon(featureProviders, getIDFromURL(), config),
    );
    const weaponID = writable<string>(getIDFromURL());
    weaponID.subscribe((newId) => {
        // update the view with the new weapon. derived doesn't update when the URL is changed
        weapon = mkWeapon(featureProviders, newId, config);
    });

    // set up event listeners
    onMount(async () => {
        // listen for any future changes in the URL, ensuring that the weapon always conforms to it
        window.addEventListener("popstate", () => {
            weaponID.set(getIDFromURL());
        });

        tick().then(() => {
            // and initialize the ID in the URL if it has not been set yet
            if (
                new URLSearchParams(window.location.search).get("id") === null
            ) {
                pushIdToURL(weapon.id);
            }
        });
    });

    /** Generate a new weapon ID / seed.
     */
    function getNewId() {
        return Math.floor(Math.random() * 10e19).toString();
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
            const latest = weaponFeatureVersionController.getLatestVersionNum();

            // push it to the URL
            const searchParams = new URLSearchParams(window.location.search);
            searchParams.set("v", latest.toString());
            pushURLSearchParamsToLocation(searchParams);

            // return it
            return latest;
        }
    }

    function pushIdToURL(id: string) {
        // only add the id param if it wasn't added already
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set("id", id);

        // and update the URL params to point to its ID
        const queryNoQuestion = searchParams.toString();
        const newQuery =
            queryNoQuestion.length > 0 ? `?${queryNoQuestion}` : "";
        // note this doesn't trigger popstate for whatever reason, so we also have to do that manually below
        if (window.location.search !== newQuery) {
            pushState(newQuery, {});
        }
        dispatchEvent(new PopStateEvent("popstate", { state: null }));
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
