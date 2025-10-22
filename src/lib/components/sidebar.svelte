<script lang="ts">
    import { type Snippet } from "svelte";
    import { writable } from "svelte/store";

    interface Props {
        children: Snippet;
        localStorageKey: string;
    }

    // there are initial states for when the sidebar has not yet been interacted with.
    // this prevents it from animating on mount
    type SideBarState = "initOpen" | "initClosed" | "open" | "closed";
    const ANIM_CLASS_BY_STATE: Record<SideBarState, string> = {
        initOpen: "in-initial",
        initClosed: "out-initial",
        open: "slide-in-left",
        closed: "slide-out-left",
    };
    const ADD_INITIAL: Record<SideBarState, SideBarState> = {
        initOpen: "initOpen",
        initClosed: "initClosed",
        open: "initOpen",
        closed: "initClosed",
    };

    const { children, localStorageKey }: Props = $props();

    // track the open / closed state of the sidebar, linking it to local storage
    let sidebarState = $state<SideBarState>("initClosed");
    const sidebarStorage = writable<SideBarState>(
        localStorage.getItem(localStorageKey) === "initOpen"
            ? "initOpen"
            : "initClosed",
    );
    const sidebarOpen = $derived(
        sidebarState === "initOpen" || sidebarState === "open",
    );
    const btnVisClass = $derived.by(() => {
        switch (sidebarState) {
            case "initOpen":
                return "display-none";
            case "open":
                return "fade-out-fast";
            case "closed":
                return "fade-in-fast";
            case "initClosed":
                return "";
        }
    });

    sidebarStorage.subscribe((newVal) => {
        // update the value in state and local storage
        localStorage.setItem(localStorageKey, ADD_INITIAL[newVal]);
        sidebarState = newVal;
    });

    // function toggleExpanded() {
    //     const INVERT: Record<SideBarState, SideBarState> = {
    //         initOpen: "closed",
    //         initClosed: "open",
    //         open: "closed",
    //         closed: "open",
    //     };
    //     // open the sidebar if it's 'initial' or 'closed';
    //     sidebarStorage.update((prevVal) => INVERT[prevVal]);
    // }
    function setSideBar(newState: "open" | "closed") {
        sidebarStorage.set(newState);
    }

    function clickOff(node: Node) {
        document.body.addEventListener("click", (event) => {
            if (
                sidebarOpen &&
                event.target instanceof Node &&
                !node.contains(event.target)
            ) {
                setSideBar("closed");
            }
        });
    }
</script>

<div
    class={`sidebar pin-top-left ${ANIM_CLASS_BY_STATE[sidebarState]}`}
    use:clickOff
>
    <button
        class={`toggle-sidebar-button pin-top-left ${btnVisClass}`}
        aria-label="config menu"
        onclick={() => setSideBar("open")}
    >
        <i class="fa-solid fa-bars"></i>
    </button>

    <div class="sidebar-content">
        {@render children?.()}
    </div>
</div>

<style>
    @media (orientation: landscape) {
        :root {
            --sidebar-width: 20vw;
        }
    }
    @media (orientation: portrait) {
        :root {
            --sidebar-width: 75vw;
        }
    }

    :root {
        --sidebar-color: #4e4e4ecc;
    }

    .sidebar-content {
        background-color: var(--sidebar-color);
        backdrop-filter: blur(2pt);
    }
    .sidebar-content {
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
        display: flex;
        align-items: center;
        justify-content: center;

        padding: 0.5rem;
        aspect-ratio: 1 / 1;
        font-size: 2.5rem;

        margin-top: 0;
        background-color: transparent;
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

    .display-none {
        display: none;
    }
</style>
