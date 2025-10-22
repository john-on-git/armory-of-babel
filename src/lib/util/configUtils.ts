import type { WeaponRarity, WeaponRarityConfig } from "$lib/generators/weaponGenerator/weaponGeneratorTypes";
import _ from "lodash";

// TODO these are wrong?

export function calcOdds(
    config: WeaponRarityConfig,
): [number, number, number, number] {
    const round = (x: number) => Math.round(x * 100) / 100;
    return [
        round(1 - config.uncommon.percentile),
        round(1 - config.rare.percentile),
        round(1 - config.epic.percentile),
        round(1 - config.legendary.percentile),
    ] as const;
}

export function applyOddsToConfig(config: WeaponRarityConfig, odds: [number, number, number, number]) {
    const POSITION: Record<Exclude<WeaponRarity, "common">, 0 | 1 | 2 | 3> = {
        uncommon: 0,
        rare: 1,
        epic: 2,
        legendary: 3,
    };

    return _.transform(
        _.omit(config, "common"),
        (acc, v, k: Exclude<WeaponRarity, "common">) => {
            acc[k] = {
                ...v,
                percentile: Number((1 - odds[POSITION[k]]).toFixed(2)),
            };
            return true;
        },
        {
            common: { ...config.common },
        } as WeaponRarityConfig, // type is wrong? seems to work fine...
    )
}