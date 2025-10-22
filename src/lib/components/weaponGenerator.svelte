<script lang="ts">
    import { pushState } from "$app/navigation";
    import { mkWeapon } from "$lib/generators/weaponGenerator/weaponGeneratorLogic";
    import {
        type Weapon,
        type WeaponRarityConfig,
    } from "$lib/generators/weaponGenerator/weaponGeneratorTypes.ts";
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    import WeaponDisplay from "./weaponDisplay.svelte";

    interface Props {
        config?: WeaponRarityConfig;
        logging?: boolean;
    }

    const { config, logging = false }: Props = $props();

    let weapon: Weapon = $derived(mkWeapon(getIDFromURL(), config));
    const weaponID = writable<string>(getIDFromURL());
    weaponID.subscribe((newId) => {
        // update the view with the new weapon. derived doesn't update when the URL is changed
        weapon = mkWeapon(newId, config);
    });

    // set up event listeners
    onMount(async () => {
        // listen for any future changes in the URL, ensuring that the weapon always conforms to it
        await new Promise(() =>
            window.addEventListener("popstate", () => {
                weaponID.set(getIDFromURL());
            }),
        ).then(generateWeapon);
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
     * Generate a new weapon, called when the 'generate' button is clicked.
     */
    function generateWeapon() {
        // only add the id param if it wasn't added already
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set("id", getNewId());

        // and update the URL params to point to its ID
        const newQuery = `?${searchParams.toString()}`;
        // note this doesn't trigger popstate for whatever reason, so we also have to do that manually below
        if (window.location.search !== newQuery) {
            pushState(newQuery, {});
        }

        if (logging) {
            console.log("generated weapon", weapon);
        }

        dispatchEvent(new PopStateEvent("popstate", { state: null }));
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
