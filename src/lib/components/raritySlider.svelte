<script lang="ts">
    import {
        weaponRarities,
        type WeaponRarity,
    } from "$lib/generators/weaponGenerator/weaponGeneratorTypes";
    import RangeSlider from "svelte-range-slider-pips";

    interface Props {
        odds: [number, number, number, number];
    }

    let { odds = $bindable() }: Props = $props();

    const raritySliderStyles = $derived.by(() => {
        return `background-image: linear-gradient(
            to right,
            var(--color-common) 0%,
            var(--color-common) ${odds[0] * 100}%,
            
            var(--color-uncommon) ${odds[0] * 100}%,
            var(--color-uncommon) ${odds[1] * 100}%,

            var(--color-rare) ${odds[1] * 100}%,
            var(--color-rare) ${odds[2] * 100}%,

            var(--color-epic) ${odds[2] * 100}%,
            var(--color-epic) ${odds[3] * 100}%,

            var(--color-legendary) ${odds[3] * 100}%
        );`;
    });

    interface SliderChangeDetails {
        activeHandle: number;
        startValue: number;
        previousValue: number;
        value: number;
        values: number[];
    }

    function handleRarityChange(e: CustomEvent<SliderChangeDetails>) {
        //handles cannot be any closer than this
        const minDiff = 0.05;

        // the handles cannot be put out of order
        // calculate the bounds
        const prevHandleVal =
            e.detail.activeHandle > 0
                ? odds[e.detail.activeHandle - 1] + minDiff
                : Number.NEGATIVE_INFINITY;
        const nextHandleVal =
            e.detail.activeHandle < odds.length - 1
                ? odds[e.detail.activeHandle + 1] - minDiff
                : Number.POSITIVE_INFINITY;

        // clamp the value
        odds[e.detail.activeHandle] = Math.max(
            prevHandleVal,
            Math.min(e.detail.value, nextHandleVal),
        );
    }

    function chance(rarity: WeaponRarity) {
        switch (rarity) {
            case "common":
                return odds[0]; // - 0
            case "uncommon":
                return odds[1] - odds[0];
            case "rare":
                return odds[2] - odds[1];
            case "epic":
                return odds[3] - odds[2];
            case "legendary":
                return 1 - odds[3];
            default:
                return rarity satisfies never;
        }
    }
    function percentageChance(rarity: WeaponRarity) {
        return Math.round(chance(rarity) * 100);
    }
</script>

<div class="rarity-slider-label">
    <span class="rarity-odds-label-title">Rarity Odds:</span>
    <div class="rarity-odds-label-percentages">
        {#each weaponRarities as rarity}
            <span class={`weapon-rarity-${rarity}`}
                >{`${percentageChance(rarity)}% `}
            </span>
        {/each}
    </div>
</div>
<RangeSlider
    style={raritySliderStyles}
    min={0}
    max={1}
    step={0.01}
    bind:values={odds}
    on:change={handleRarityChange}
/>

<style>
    :global(.rangeSlider) {
        --handle: #373737;
        --handle-focus: white;
        --handle-border: white;

        --roundel-shine: #ffffff41;
    }
    .rarity-slider-label {
        display: flex;
        gap: 1rem;
        align-items: center;
        justify-content: center;
    }
    .rarity-odds-label-title {
        font-weight: bold;
    }
    .rarity-odds-label-percentages {
        background-color: #373737;

        padding-top: 0.25rem;
        padding-bottom: 0.25rem;
        padding-left: 0.75rem;
        padding-right: 0.75rem;

        border-radius: 8px;
        border-bottom: 1pt solid var(--bg-dark);
        border-left: 1pt solid var(--bg-dark);
    }
</style>
