<script lang="ts">
    import { defaultWeaponRarityConfigFactory } from "$lib/generators/weaponGenerator/weaponGeneratorConfigLoader";
    import {
        type WeaponRarity,
        type WeaponRarityConfig,
    } from "$lib/generators/weaponGenerator/weaponGeneratorTypes";
    import * as _ from "lodash";
    import { type Writable } from "svelte/store";
    import RaritySlider from "./raritySlider.svelte";
    import Sidebar from "./sidebar.svelte";

    interface Props {
        config: WeaponRarityConfig;
        configWritable: Writable<WeaponRarityConfig>;
    }

    const { config, configWritable }: Props = $props();

    function toPercentile(rarity: Exclude<WeaponRarity, "common">) {
        switch (rarity) {
            case "uncommon":
                return 1 - odds[0];
            case "rare":
                return 1 - odds[1];
            case "epic":
                return 1 - odds[2];
            case "legendary":
                return 1 - odds[3];
            default:
                return rarity satisfies never;
        }
    }

    let odds = $state(calcOdds((() => config)()));

    $effect(() =>
        configWritable.update((prevValue) =>
            _.transform(
                _.omit(prevValue, "common"),
                (acc, v, k: Exclude<WeaponRarity, "common">) => {
                    acc[k] = {
                        ...v,
                        percentile: Number(toPercentile(k).toFixed(2)),
                    };
                    return true;
                },
                {
                    common: { ...prevValue.common },
                } as WeaponRarityConfig, // type is wrong? seems to work fine...
            ),
        ),
    );

    function calcOdds(
        config: WeaponRarityConfig,
    ): [number, number, number, number] {
        return [
            0,
            1 - config.uncommon.percentile,
            1 - config.rare.percentile,
            1 - config.epic.percentile,
        ];
    }

    function resetToDefault() {
        configWritable.set(defaultWeaponRarityConfigFactory());
        odds = calcOdds(config);
    }
</script>

<Sidebar localStorageKey={"weaponConfigSidebar"}>
    <div class="config-flex">
        <h2>Custom Generation Parameters</h2>
        <button onclick={resetToDefault}>🗑️</button>
        <div>
            <RaritySlider bind:odds />
        </div>
    </div>
</Sidebar>

<style>
    .config-flex {
        height: 100%;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: start;
        gap: 1rem;
    }
</style>
