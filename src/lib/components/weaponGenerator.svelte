<script lang="ts">
    import { weaponFeatureVersionController as weaponVersionController } from "$lib/generators/weaponGenerator/weaponFeatureVersionController";
    import { defaultWeaponRarityConfigFactory } from "$lib/generators/weaponGenerator/weaponGeneratorConfigLoader";
    import { type WeaponViewModel } from "$lib/generators/weaponGenerator/weaponGeneratorTypes";
    import { calcOdds } from "$lib/util/configUtils";
    import { getOddsFromURL } from "$lib/util/getFromURL";
    import { syncLocationWithURLSearchParams } from "$lib/util/queryString";
    import { StatusCodes } from "http-status-codes";
    import _ from "lodash";
    import { onMount, tick } from "svelte";
    import type {
        GenerateWeaponRequest,
        GenerateWeaponResponse,
    } from "../../routes/api/generate-weapon/+server";
    import WeaponDisplay from "./weaponDisplay.svelte";

    let version = $state(getVersionFromURL());
    let weaponID = $state(getIDFromURL());
    let odds = $state(getOddsFromURL());

    let weaponState = $state<{
        req: GenerateWeaponRequest;
        res?: GenerateWeaponResponse;
    } | null>(null);

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
     * Generate a new weapon, called when the page is loaded without an ID in the URL, and when the 'generate' button is clicked.
     */
    function generateWeapon() {
        syncIdToURL(getNewId());
    }
</script>

<div class="weapon-generator">
    {#if weapon !== null}
        <WeaponDisplay {weapon} />
    {/if}
    <button
        class="generate-button"
        data-testid="weapon-generator-generate-button"
        onclick={generateWeapon}>Generate</button
    >
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
