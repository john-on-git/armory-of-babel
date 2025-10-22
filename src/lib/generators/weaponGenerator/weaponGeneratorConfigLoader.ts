import seedrandom from "seedrandom";
import '../../util/string';
import { mkGen, type TGenerator } from "../recursiveGenerator";
import type { WeaponRarity, WeaponRarityConfig } from "./weaponGeneratorTypes";


export const defaultWeaponRarityConfigFactory = (): WeaponRarityConfig => ({
    common: {
        percentile: 1,
        paramsProvider: (rng) => ({
            damage: {},
            nPassive: 1,
            nCharges: 0,
            nActive: rng() > .9 ? 1 : 0,
            nUnlimitedActive: 0,
            sentienceChance: 0,
            chanceOfMakingDemands: ([10 as const, 12 as const]).choice(rng),
        })
    },
    uncommon: {
        percentile: 0.45,
        paramsProvider: (rng) => ({
            damage: {},
            nPassive: 1,
            nCharges: Math.ceil(rng() * 4),
            nActive: [0, 1].choice(rng),
            nUnlimitedActive: 0,
            sentienceChance: 0.1,
            chanceOfMakingDemands: ([8 as const, 10 as const]).choice(rng),
        })
    },
    rare: {
        percentile: 0.15,
        paramsProvider: (rng) => ({
            damage: {},
            nPassive: [1, 2].choice(rng),
            nCharges: Math.ceil(rng() * 4),
            nActive: [1, 2].choice(rng),
            nUnlimitedActive: 0,
            sentienceChance: 1 / 3,
            chanceOfMakingDemands: ([8 as const, 10 as const]).choice(rng),
        })
    },
    epic: {
        percentile: 0.05,
        paramsProvider: (rng) => ({
            damage: {},
            nPassive: [1, 2, 3].choice(rng),
            nCharges: Math.ceil(rng() * 8),
            nActive: [1, 2, 3].choice(rng),
            nUnlimitedActive: 0,
            sentienceChance: 1 / 2,
            chanceOfMakingDemands: ([6 as const, 8 as const, 10 as const]).choice(rng),
        })
    },
    legendary: {
        percentile: 0.01,
        paramsProvider: (rng) => ({
            damage: {},
            nPassive: 3,
            nCharges: Math.ceil(rng() * 10),
            nActive: [2, 3, 4].choice(rng),
            nUnlimitedActive: 1,
            sentienceChance: 1,
            chanceOfMakingDemands: ([4 as const, 6 as const, 8 as const]).choice(rng),
        })
    }
});

export const WEAPON_TO_HIT: Record<WeaponRarity, TGenerator<number>> = {
    common: mkGen((rng: seedrandom.PRNG) => {
        return (
            rng() > .75 ?
                1
                :
                0
        );
    }),
    uncommon: mkGen((rng: seedrandom.PRNG) => {
        const n = rng();
        return (
            n > .75 ?
                2
                : n > .25 ?
                    1
                    :
                    0
        );
    }),
    rare: mkGen((rng: seedrandom.PRNG) => {
        const n = rng();
        return (
            n > .75 ?
                4
                : n > .25 ?
                    3
                    :
                    2
        );
    }),
    epic: mkGen((rng: seedrandom.PRNG) => {
        const n = rng();
        return (
            n > .5 ?
                4
                : n > .5 ?
                    3
                    :
                    2
        );
    }),
    legendary: mkGen((rng: seedrandom.PRNG) => {
        const n = rng();
        return (
            n > .75 ?
                5
                : n > .25 ?
                    4
                    :
                    3
        );
    })
};