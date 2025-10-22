<script lang="ts">
    import WeaponDisplay from "$lib/components/weaponDisplay.svelte";
    import { weaponFeatureVersionController as weaponVersionController } from "$lib/generators/weaponGenerator/weaponFeatureVersionController";
    import { defaultWeaponRarityConfigFactory } from "$lib/generators/weaponGenerator/weaponGeneratorConfigLoader";
    import { type WeaponViewModel } from "$lib/generators/weaponGenerator/weaponGeneratorTypes";
    import { calcOdds } from "$lib/util/configUtils";
    import { getOddsFromURL } from "$lib/util/getFromURL";
    import { syncLocationWithURLSearchParams } from "$lib/util/queryString";
    import "@fortawesome/fontawesome-free/css/all.min.css";
    import { StatusCodes } from "http-status-codes";
    import _ from "lodash";
    import { onMount, tick } from "svelte";
    import { MediaQuery } from "svelte/reactivity";
    import type {
        GenerateWeaponRequest,
        GenerateWeaponResponse,
    } from "../../routes/api/generate-weapon/+server";

    let version = $state(getVersionFromURL());
    let weaponID = $state(getIDFromURL());
    let odds = $state(getOddsFromURL());

    let weaponState = $state<{
        req: GenerateWeaponRequest;
        res?: GenerateWeaponResponse;
    } | null>(null);

    /**
     * The display swaps between two animations each
     * time a new demand is generated, so that the animation
     * always triggers. fadeLock represents which one it's using
     */
    let fadeLock = $state(false);

    let isLandscape = new MediaQuery("orientation: landscape");

    const weapon = $derived.by<WeaponViewModel | null>(() => {
        if (odds === null || !weaponState?.res) {
            // no response, no weapon
            return null;
        } else {
            // otherwise get the active weapon for this response

            // legendary
            if (odds[3] < weaponState.res.n) {
                return weaponState.res.weapons.legendary;
            } else if (odds[2] < weaponState.res.n) {
                return weaponState.res.weapons.epic;
            } else if (odds[1] < weaponState.res.n) {
                return weaponState.res.weapons.rare;
            } else if (odds[0] < weaponState.res.n) {
                return weaponState.res.weapons.uncommon;
            } else {
                return weaponState.res.weapons.common;
            }
        }
    });

    // this is linked to a value stored in history state, see popState listener below. We can't use this value directly / inline, or the UI won't be reactive.
    let canGoBack = $state(false);
    let canGoForward = $state(false);

    // set up event listeners
    onMount(async () => {
        // listen for any future changes in the URL, ensuring that the weapon always conforms to it
        window.addEventListener("popstate", async () => {
            canGoBack =
                history.state["sveltekit:states"].isFirstInHistory === false;
            canGoForward =
                history.state["sveltekit:states"].isLastInHistory === false;

            weaponID = getIDFromURL();
            version = getVersionFromURL();
            odds =
                getOddsFromURL() ??
                calcOdds(defaultWeaponRarityConfigFactory());

            const searchParams = new URLSearchParams(window.location.search);
            if (!searchParams.has("o")) {
                searchParams.set("o", odds[0].toFixed(2));
                for (let i = 1; i < odds.length; i++) {
                    searchParams.append("o", odds[i].toFixed(2));
                }
            }
            // take a copy of the parts of the UI state that determine the weapon at the time the request was made
            const v = searchParams.get("v");
            const newReq = {
                id: searchParams.get("id"),
                v: v === null ? NaN : Number.parseInt(v),
            };

            // if these params correspond to a valid set of weapons, and it isn't the currently held set of weapons, make the call
            if (
                newReq.id !== null &&
                newReq.v !== null &&
                !_.isEqual(newReq, weaponState?.req)
            ) {
                try {
                    // take just the ID & version from the current searchParams, to post to the API
                    const filteredParams = new URLSearchParams(
                        _.pick(Object.fromEntries(searchParams.entries()), [
                            "id",
                            "v",
                        ]),
                    );
                    const res = await fetch(
                        `/api/generate-weapon?${filteredParams}`,
                    );
                    if (res.status === StatusCodes.OK) {
                        // if this still matches the UI state
                        if (newReq.v === version && newReq.id === weaponID) {
                            const resBody = await res.json();
                            weaponState = {
                                req: { id: newReq.id, v: newReq.v },
                                res: resBody as unknown as GenerateWeaponResponse,
                            };
                        }
                    }
                } catch (e) {
                    console.error(e);
                    weaponState = {
                        req: { id: newReq.id, v: newReq.v },
                        res: undefined,
                    };
                }
            }
        });

        tick().then(() => {
            const searchParams = new URLSearchParams(window.location.search);
            // and initialize any values in the URL that have not been set yet
            if (!searchParams.has("id")) {
                syncIdToURL(weaponID, "replace");
            }
            if (!searchParams.has("v")) {
                replaceVersionInURL(version);
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
    function replaceVersionInURL(id: number) {
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
    function syncIdToURL(id: string, mode: "push" | "replace" = "push") {
        // only add the id param if it wasn't added already
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set("id", id);

        // and update the URL params to point to its ID
        syncLocationWithURLSearchParams(searchParams, mode);
    }

    /**
     * Remove all the UI state related to the current weapon, in preparation for the UI binding to a new weapon.
     */
    function invalidateCurrentWeapon() {
        weaponState = null;
        // switch animations
        fadeLock = !fadeLock;
    }

    /**
     * Generate a new weapon, called when the page is loaded without an ID in the URL, and when the 'generate' button is clicked.
     */
    function generateWeapon() {
        invalidateCurrentWeapon();

        syncIdToURL(getNewId());
    }

    /**
     * go back in history and perform any necessary Svelte state changes
     */
    function goBack() {
        invalidateCurrentWeapon();

        history.back();
    }

    /**
     * go forward in history and perform any necessary Svelte state changes
     */
    function goForward() {
        invalidateCurrentWeapon();

        history.forward();
    }
</script>

<div class="weapon-generator">
    <div class="header">
        <h1>Armory of Babel</h1>
    </div>
    <div class="body">
        <div class="weapon-display-container">
            {#if weapon !== null}
                <WeaponDisplay {weapon} {fadeLock} />
            {/if}
        </div>
    </div>

    <button
        class="action-button generate-button"
        data-testid="weapon-generator-generate-button"
        onclick={generateWeapon}
        aria-label="generate new weapon button"
        disabled={weapon === null}
    >
        {#if weapon === null}
            <i class="loading fa-solid fa-gear"></i>
        {:else}
            <i class="fa-solid fa-wand-magic-sparkles"></i>
        {/if}
    </button>

    {#if isLandscape.current}
        <button
            class="action-button back-button"
            data-testid="go-back-button"
            onclick={goBack}
            aria-label="go back button"
            disabled={!canGoBack}
        >
            <i class="fa-solid fa-chevron-left"></i>
        </button>

        <button
            class="action-button forward-button"
            data-testid="forward-button"
            onclick={goForward}
            aria-label="go forward button"
            disabled={!canGoForward}
        >
            <i class="fa-solid fa-chevron-right"></i>
        </button>
    {/if}
</div>

<style>
    .weapon-generator {
        display: flex;
        flex-direction: column;

        flex-grow: 1;
        width: 100vw;
    }
    .header {
        width: 100%;
        height: 7.5vh;

        display: flex;
        flex-direction: row;
        gap: 10%;

        align-items: center;
        justify-content: center;

        padding-left: 10%;
        padding-right: 10%;
    }
    @media (orientation: landscape) {
        .header {
            margin-top: 2.5vh;
            margin-bottom: 2.5vh;
        }
    }
    .header > * {
        height: 100%;
    }
    .header > h1 {
        margin: 0;

        font-size: 3.2em;
        line-height: 1.1;

        text-wrap: none;
    }

    @media (orientation: landscape) {
        .body {
            margin-left: 15vw;
            margin-right: 15vw;
        }
    }
    @media (orientation: portrait) {
        .body {
            margin-left: 5vw;
            margin-right: 5vw;
        }

        .header {
            margin-top: 20pt;
            margin-bottom: 20pt;
        }
    }

    .body {
        display: flex;
        flex-direction: column;
        align-items: center;

        position: relative;

        flex-grow: 1;

        margin-bottom: 1rem;
    }

    .weapon-display-container {
        display: flex;
        flex-grow: 1;
        width: 100%;
    }

    .action-button {
        position: absolute;

        aspect-ratio: 1;

        background-color: transparent;
        border: 0 solid transparent;

        padding: 0;

        color: white;
        opacity: 33%;
    }

    .action-button:disabled {
        opacity: 5%;
        cursor: auto;
    }

    .action-button:not(:disabled):hover {
        opacity: 1;
    }

    .back-button,
    .forward-button {
        top: 70vh;
        font-size: 7.5vw;
    }

    .back-button {
        left: 1vw;
    }
    .forward-button {
        right: 1vw;
    }

    @media (orientation: landscape) {
        .generate-button {
            right: 2.5vw;
            top: 2.5vh;

            font-size: 5vw;
        }
    }
    @media (orientation: portrait) {
        .generate-button {
            bottom: 1rem;
            right: 1rem;

            font-size: 5rem;
        }

        .body {
            padding-bottom: 7.5rem;
        }
    }

    .loading {
        animation: spin 3s infinite linear;
    }

    @keyframes spin {
        0% {
            rotate: 0deg;
        }

        100% {
            rotate: 360deg;
        }
    }
</style>
