<script lang="ts">
    import { type WeaponRarityConfig } from "$lib/generators/weaponGenerator/weaponGeneratorTypes";
    import { Slider } from "melt/components";
    import { type Writable } from "svelte/store";
    import Sidebar from "./sidebar.svelte";

    interface Props {
        configWritable: Writable<WeaponRarityConfig>;
    }

    const { configWritable: _configWritable }: Props = $props();
</script>

<Sidebar localStorageKey={"weaponConfigSidebar"}>
    <h2>Generation Parameters</h2>

    <Slider min={0} max={1}>
        {#snippet children(slider)}
            <div class="slider" {...slider.root}>
                <div {...slider.thumb}></div>
            </div>
        {/snippet}
    </Slider>
</Sidebar>
