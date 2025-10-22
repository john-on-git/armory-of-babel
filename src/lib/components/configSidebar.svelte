<script lang="ts">
    import { type WeaponRarityConfig } from "$lib/generators/weaponGenerator/weaponGeneratorTypes";
    import { type Writable } from "svelte/store";
    import Sidebar from "./sidebar.svelte";

    interface Props {
        configWritable: Writable<WeaponRarityConfig>;
    }

    const { configWritable: _configWritable }: Props = $props();
</script>

<Sidebar localStorageKey={"weaponConfigSidebar"}>
    <h2>Generation Parameters</h2>

    <label>
        Rarity Odds
        <!--Range Slider here-->
    </label>
</Sidebar>

<style>
</style>
