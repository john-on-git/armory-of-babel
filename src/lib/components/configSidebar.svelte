<script lang="ts">
    import { defaultWeaponRarityConfigFactory } from "$lib/generators/weaponGenerator/weaponGeneratorConfigLoader";
    import { type WeaponRarityConfig } from "$lib/generators/weaponGenerator/weaponGeneratorTypes";
    import { applyOddsToConfig, calcOdds } from "$lib/util/configUtils";
    import { type Writable } from "svelte/store";
    import RaritySlider from "./raritySlider.svelte";
    import Sidebar from "./sidebar.svelte";

    interface Props {
        config: WeaponRarityConfig;
        configWritable: Writable<WeaponRarityConfig>;
    }

    const { config, configWritable }: Props = $props();

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
        <h2>Custom Generation Parameters</h2>
        <button onclick={resetToDefault}>🗑️</button>
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
</style>
