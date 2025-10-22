<script lang="ts">
    import { type Snippet } from "svelte";

    interface Props {
        sidebarContent: Snippet;
    }

    const { sidebarContent }: Props = $props();

    let expanded = $state(false);

    function toggleExpanded() {
        expanded = !expanded;
    }
</script>

{#if expanded}
    <div class="sidebar">
        {@render sidebarContent?.()}
    </div>
{:else}
    <button onclick={toggleExpanded}>open sidebar</button>
{/if}

<style>
    .sidebar {
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
    }
</style>
