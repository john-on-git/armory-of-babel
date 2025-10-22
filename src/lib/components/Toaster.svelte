<script lang="ts" module>
    export interface ToasterInteface {
        toast: (toast: string) => void;
    }
</script>

<script lang="ts">
    import { flip } from "svelte/animate";

    import { linear } from "svelte/easing";
    import { crossfade } from "svelte/transition";

    let toasts = $state<string[]>([]);
    const maxToasts = 1;

    export function toast(toast: string) {
        if (toasts.length !== maxToasts) {
            toasts.push(toast);
            setTimeout(() => toasts.shift(), 1000);
        }
    }

    const [send] = crossfade({
        fallback(_node, _params) {
            return {
                duration: 1000,
                easing: linear,
                iterations: 1,
                css: (_t: number, u: number) => `
                    opacity: ${u}
                `,
            };
        },
    });
</script>

<div class="toaster">
    {#each toasts as toast, index (index)}
        <div animate:flip class="toast" in:send={{ key: index }}>
            <p>{toast}</p>
        </div>
    {/each}
</div>

<style>
    :root {
        --toaster-color: #4e4e4ecc;
    }

    .toaster {
        z-index: 200;

        position: absolute;
        left: 4rem;
        height: 3rem;
        width: 12rem;

        display: flex;
        flex-direction: column;
        gap: 1rem;

        flex-basis: 0;
    }

    .toast {
        height: 3rem;
        width: 12rem;
        padding: 0.5rem;

        border-radius: 8px;

        opacity: 0;

        background-color: var(--toaster-color);

        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
