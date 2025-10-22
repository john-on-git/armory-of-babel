<script lang="ts">
    import { defaultWeaponRarityConfigFactory } from "$lib/generators/weaponGenerator/weaponGeneratorConfigLoader";
    import { type WeaponRarityConfig } from "$lib/generators/weaponGenerator/weaponGeneratorTypes";
    import { type Writable } from "svelte/store";
    import RaritySlider from "./raritySlider.svelte";
    import Sidebar from "./sidebar.svelte";

    interface Props {
        configWritable: Writable<WeaponRarityConfig>;
    }

    const { configWritable }: Props = $props();

    let rarityOdds: [number, number, number, number] = $state([
        0.1, 0.333, 0.666, 0.9,
    ]);

    function resetToDefault() {
        configWritable.set(defaultWeaponRarityConfigFactory());
    }
</script>

<Sidebar localStorageKey={"weaponConfigSidebar"}>
    <div class="config-flex">
        <h2>Custom Generation Parameters</h2>
        <button onclick={resetToDefault}>🗑️</button>
        <div>
            <RaritySlider bind:odds={rarityOdds} />
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
