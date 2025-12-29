import { mkGen, type Generator } from "$lib/generators/recursiveGenerator";
import '$lib/util/string';
import seedrandom from "seedrandom";
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
            nAdditionalLanguages: 0,
            chanceOfMakingDemands: ([10 as const, 12 as const]).choice(rng),
        })
    },
    uncommon: {
        percentile: 0.45,
        paramsProvider: (rng) => ({
            damage: {},
            nPassive: 1,
            nCharges: Math.ceil((rng() * 4) + 2),
            nActive: [0, 1].choice(rng),
            nUnlimitedActive: 0,
            sentienceChance: 0.1,
            nAdditionalLanguages: ([1, 2]).choice(rng),
            chanceOfMakingDemands: ([8 as const, 10 as const]).choice(rng),
        })
    },
    rare: {
        percentile: 0.15,
        paramsProvider: (rng) => ({
            damage: {},
            nPassive: [1, 2].choice(rng),
            nCharges: Math.ceil((rng() * 8) + 2),
            nActive: [1, 2].choice(rng),
            nUnlimitedActive: 0,
            sentienceChance: 1 / 3,
            nAdditionalLanguages: ([1, 2, 2]).choice(rng),
            chanceOfMakingDemands: ([8 as const, 10 as const]).choice(rng),
        })
    },
    epic: {
        percentile: 0.05,
        paramsProvider: (rng) => ({
            damage: {},
            nPassive: [1, 2, 3].choice(rng),
            nCharges: Math.ceil((rng() * 8) + 4),
            nActive: [1, 2, 3].choice(rng),
            nUnlimitedActive: 0,
            sentienceChance: 1 / 2,
            nAdditionalLanguages: 1,
            chanceOfMakingDemands: ([6 as const, 8 as const, 10 as const]).choice(rng),
        })
    },
    legendary: {
        percentile: 0.01,
        paramsProvider: (rng) => ({
            damage: {},
            nPassive: 3,
            nCharges: Math.ceil((rng() * 16) + 4),
            nActive: [2, 3, 4].choice(rng),
            nUnlimitedActive: 1,
            sentienceChance: 1,
            nAdditionalLanguages: ([1, 2, 2, 3, 3]).choice(rng),
            chanceOfMakingDemands: ([4 as const, 6 as const, 8 as const]).choice(rng),
        })
    }
});

export const WEAPON_TO_HIT: Record<WeaponRarity, Generator<number>> = {
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