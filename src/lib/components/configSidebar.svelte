<script lang="ts">
    import { type WeaponRarityConfig } from "$lib/generators/weaponGenerator/weaponGeneratorTypes";
    import { type Writable } from "svelte/store";
    import RaritySlider from "./raritySlider.svelte";
    import Sidebar from "./sidebar.svelte";

    interface Props {
        configWritable: Writable<WeaponRarityConfig>;
    }

    const { configWritable: _configWritable }: Props = $props();

    let rarityOdds: [number, number, number, number] = $state([
        0.1, 0.333, 0.666, 0.9,
    ]);
</script>

<Sidebar localStorageKey={"weaponConfigSidebar"}>
    <h2>Generation Parameters</h2>

    <RaritySlider bind:odds={rarityOdds} />
</Sidebar>

<style>
</style>
