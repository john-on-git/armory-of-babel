<script lang="ts">
    import { defaultWeaponRarityConfigFactory } from "$lib/generators/weaponGenerator/weaponGeneratorConfigLoader";
    import { type WeaponRarityConfig } from "$lib/generators/weaponGenerator/weaponGeneratorTypes";
    import { applyOddsToConfig, calcOdds } from "$lib/util/configUtils";
    import _ from "lodash";
    import { type Writable } from "svelte/store";
    import RaritySlider from "./raritySlider.svelte";
    import Sidebar from "./sidebar.svelte";

    interface Props {
        config: WeaponRarityConfig;
        configWritable: Writable<WeaponRarityConfig>;
    }

    const { config, configWritable }: Props = $props();

    const defaultConfig = defaultWeaponRarityConfigFactory();
    const currentConfigIsDefault = $derived(
        _.isEqual(calcOdds(config), calcOdds(defaultConfig)),
    );
    let odds = $state(calcOdds((() => config)()));

    function onOddsChanged(odds: [number, number, number, number]) {
        configWritable.update((prevValue) =>
            applyOddsToConfig(prevValue, odds),
        );
    }

    function resetToDefault() {
        configWritable.set(defaultWeaponRarityConfigFactory());
        odds = calcOdds(config);
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
                disabled={currentConfigIsDefault}
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
