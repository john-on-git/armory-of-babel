<script lang="ts">
    import _ from "lodash";
    import type { Writable } from "svelte/store";
    import { DEFAULT_RARITY_ODDS } from "../../routes/state.svelte";
    import RaritySlider from "./raritySlider.svelte";
    import Sidebar from "./sidebar.svelte";

    interface Props {
        odds: [number, number, number, number];
        oddsWritable: Writable<[number, number, number, number]>;
        resetToDefault: () => void;
    }

    let { odds, oddsWritable, resetToDefault }: Props = $props();

    const oddsAreDefault = $derived(_.isEqual(odds, DEFAULT_RARITY_ODDS));

    function onOddsChanged(newOdds: [number, number, number, number]) {
        oddsWritable.set(newOdds);
    }
</script>

<Sidebar localStorageKey={"weaponConfigSidebar"}>
    <div class="config-flex">
        <div class="title-flex">
            <h2>Custom Generation Parameters</h2>
            <button
                class="inline-button reset-button"
                onclick={resetToDefault}
                aria-label="reset custom generation parameters to default"
                disabled={oddsAreDefault}
            >
                <i class="fa-solid fa-rotate"></i>
            </button>
        </div>
        <div>
            <RaritySlider bind:odds onChange={onOddsChanged} />
        </div>
    </div>
</Sidebar>

<style>
    .config-flex {
        height: 100%;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: start;
        gap: 1rem;
    }
    .title-flex {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
    }

    .reset-button {
        font-size: 2rem;
        aspect-ratio: 1;
    }
</style>
