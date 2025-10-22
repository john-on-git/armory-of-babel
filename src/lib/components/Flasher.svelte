<script lang="ts" module>
    export interface FlasherInterface {
        flash: () => void;
    }
</script>

<script lang="ts">
    const { text } = $props();

    let state = $state<1 | 2 | null>(null);

    export function flash() {
        state = state === 1 ? 2 : 1;
    }
</script>

<div class={`flasher ${state == null ? "initial" : `flash-${state}`}`}>
    <p>{text}</p>
</div>

<style>
    :root {
        --toaster-color: #4e4e4ecc;
    }

    .flasher {
        z-index: 200;
        opacity: 0;

        position: absolute;
        left: 4rem;
        height: 3rem;
        width: 12rem;

        flex-basis: 0;

        padding: 0.5rem;

        border-radius: 8px;

        background-color: var(--toaster-color);

        display: flex;
        align-items: center;
        justify-content: center;
    }

    :global(.flash-1) {
        animation: 0.666s ease-in-out 0s 1 flash-1;
    }
    :global(.flash-2) {
        animation: 0.666s ease-in-out 0s 1 flash-2;
    }
    @keyframes flash-1 {
        0% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }

    @keyframes flash-2 {
        0% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }
</style>
