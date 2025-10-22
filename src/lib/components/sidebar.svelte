<script lang="ts">
    import { type Snippet } from "svelte";

    interface Props {
        sidebarContent: Snippet;
    }

    // there's a third state for when the sidebar has never been interacted with.
    // this prevents it from animating on mount
    type SideBarState = "initial" | "open" | "closed";
    const ANIM_CLASS_BY_STATE: Record<SideBarState, string> = {
        initial: "out-initial",
        open: "slide-in-left",
        closed: "slide-out-left",
    };

    const { sidebarContent }: Props = $props();

    let sidebarState: SideBarState = $state("initial");

    function toggleExpanded() {
        // open the sidebar if it's 'initial' or 'closed';
        sidebarState = sidebarState === "open" ? "closed" : "open";
    }
</script>

<div class={`sidebar pin-top-left ${ANIM_CLASS_BY_STATE[sidebarState]}`}>
    {#if sidebarState}
        <div class="sidebar-content">
            {@render sidebarContent?.()}
        </div>
    {/if}
    <button class="toggle-sidebar-button" onclick={toggleExpanded}>☰</button>
</div>

<style>
    :root {
        --sidebar-width: 20vw;
        --sidebar-color: #ffffff66;
    }
    .sidebar-content {
        background-color: var(--sidebar-color);

        width: var(--sidebar-width);
        padding: 1rem;

        height: 100%;
    }
    .sidebar {
        height: 100%;

        display: flex;
        align-items: flex-start;
    }
    .toggle-sidebar-button {
        background-color: var(--sidebar-color);

        display: flex;
        align-items: center;
        justify-content: center;

        padding: 0.5rem;
        aspect-ratio: 1 / 1;
        font-size: 2rem;

        margin-top: 0;
        border-radius: 0;
        border-bottom-right-radius: 10pt;
    }
    .pin-top-left {
        position: fixed;
        top: 0;
        left: 0;
    }

    .slide-in-left {
        animation: 0.5s ease-in 0s 1 normal forwards running slide-in-left;
    }
    .slide-out-left {
        animation: 0.5s ease-in 0s 1 normal forwards running slide-out-left;
    }

    .out-initial {
        left: calc(-1 * var(--sidebar-width));
    }

    @keyframes slide-in-left {
        from {
            left: calc(-1 * var(--sidebar-width));
        }
        to {
            left: 0;
        }
    }

    @keyframes slide-out-left {
        from {
            left: 0;
        }
        to {
            left: calc(-1 * var(--sidebar-width));
        }
    }
</style>
