<script lang="ts">
    import { type WeaponRarityConfig } from "$lib/generators/weaponGenerator/weaponGeneratorTypes";
    import Sidebar from "./sidebar.svelte";

    interface Props {
        config?: WeaponRarityConfig;
    }

    const { config }: Props = $props();
</script>

{#snippet sidebarContent()}
    <p>I have config {config?.toString()}</p>
{/snippet}

<Sidebar {sidebarContent} />
