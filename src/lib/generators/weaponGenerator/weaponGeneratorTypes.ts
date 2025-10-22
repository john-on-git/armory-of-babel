import type { TGenerator } from "$lib/generators/recursiveGenerator";
import type { PrimitiveContainer } from "$lib/util/versionController";
import seedrandom from "seedrandom";
import type { Comp, Cond, ProviderElement, Quant } from "./provider";
import type { WeaponFeatureProvider } from "./weaponGeneratorLogic";

export const allThemes = [
    "fire", "ice",
    "cloud", "earth",
    "dark", "light",
    "sweet", "sour",
    "wizard",
    "steampunk", "nature"
    // "poison",
    // "earth", "cloud",
    // "psychic", "electric"
    // "wizard", "thief"
    // "jungle",
    // "space"
] as const;
export type Theme = typeof allThemes[number];

const themesSet = new Set(allThemes);
export const isTheme = (x: unknown): x is Theme => themesSet.has(x as Theme);

export const weaponRarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'] as const;

const weaponRaritiesSet = new Set(weaponRarities);
export type WeaponRarity = (typeof weaponRarities)[number];
export const isRarity = (x: unknown): x is WeaponRarity => weaponRaritiesSet.has(x as WeaponRarity);

const weaponRaritiesLookup: Record<WeaponRarity, number> = {
    common: 0,
    uncommon: 1,
    rare: 2,
    epic: 3,
    legendary: 4
}
export const weaponRaritiesOrd = <T>([r1]: [WeaponRarity, T], [r2]: [WeaponRarity, T]) => weaponRaritiesLookup[r2] - weaponRaritiesLookup[r1];

export type WeaponRarityConfig = {
    common: {
        percentile: 1;
        paramsProvider: (rng: seedrandom.PRNG) => WeaponGenerationParams;
    };
} & {
    [k in Exclude<WeaponRarity, 'common'>]: {
        percentile: number;
        paramsProvider: (rng: seedrandom.PRNG) => WeaponGenerationParams;
    }
}
export interface WeaponGenerationParams {
    damage: DamageDice;
    nPassive: number;
    nCharges: number;
    nActive: number;
    nUnlimitedActive: number;
    sentienceChance: number;
    chanceOfMakingDemands: 2 | 4 | 6 | 8 | 10 | 12;
}


/**
 * Type of a weapon in the backend.
 */
export interface Weapon {
    /**
     * The RNG seed that produces this weapon.
     */
    id: string;


    rarity: WeaponRarity;
    name: string;
    description: string;
    shape: WeaponShape;

    damage: DamageDice & { as: string };
    toHit: number;

    active: {
        maxCharges: number,
        rechargeMethod: RechargeMethod
        powers: ActivePower[];
    }
    passivePowers: PassivePower[];
    sentient: false | {
        personality: Personality[];
        languages: string[];
        /**
         * Each scene, a sentient weapon has a 1-in-this chance of making a demand.
         */
        chanceOfMakingDemands: number;
    }

    themes: Theme[],
    params: WeaponGenerationParams
}

interface PowerView {
    additionalNotes?: string[];
}

export interface PassivePowerView extends PowerView {
    desc: string;
    bonus?: PassiveBonus;
}
export interface ActivePowerView extends PowerView {
    desc: string;
    cost: number | string;
}
/**
 * Type of a weapon in the frontend. This is the type provided returned by the generate weapon API.
 */
export interface WeaponViewModel {
    /**
     * The RNG seed that produces this weapon.
     */
    id: string;

    themes: Theme[],

    rarity: WeaponRarity;
    name: string;
    // description: string;
    shape: WeaponShape;

    damage: DamageDice & { as: string };
    toHit: number;

    active: {
        maxCharges: number,
        rechargeMethod: string
        powers: ActivePowerView[];
    }
    passivePowers: PassivePowerView[];
    sentient: false | {
        personality: string[];
        languages: string[];
        /**
         * Each scene, a sentient weapon has a 1-in-this chance of making a demand.
         */
        chanceOfMakingDemands: number;
    }
}

export interface Power {
    additionalNotes?: (string | ((weapon: Weapon) => TGenerator<string>))[];
}

export interface DamageDice {
    const?: number;
    d4?: number;
    d6?: number;
    d8?: number;
    d10?: number;
    d12?: number;
    d20?: number;
}
export interface PassiveBonus {
    addDamageDie?: DamageDice;
    /**
     * Plus this many to attack and damage
     */
    plus?: number;
} // TODO

export interface ChargedPower extends Power {
    desc: string | ((weapon: Weapon) => TGenerator<string>);
    cost: number | string;
}
export interface UnlimitedChargedPower extends Power {
    desc: string;
    cost: "at will";
}
export type ActivePower = ChargedPower | UnlimitedChargedPower;


/** An adjective that could describe a physical object.
 *  The adjective should be simple and describe its physical state, no vibes/moral/metaphysical descriptors i.e. Just, Terrifying, Gothic.
*/
export interface WeaponAdjective {
    desc: string;
}
export interface Personality {
    desc: string | ((weapon: Weapon) => TGenerator<string>);
};
export interface RechargeMethod {
    desc: string | ((weapon: Weapon) => TGenerator<string>);
}

export interface PassivePower extends Power {
    miscPower: true;
    desc: string | ((weapon: Weapon) => TGenerator<string>);
    bonus?: PassiveBonus;
}
export interface Language extends Power {
    language: true;
    desc: string;
}

export type AnyPower = ActivePower | PassivePower;

export type WeaponShape = {
    particular: string;
    group: string;
}

export interface WeaponPowerCond extends Cond {
    themes?: Quant<Theme>;
    personality?: Quant<Personality>;
    languages?: Quant<string>;
    activePowers?: Quant<ActivePower>;
    passivePowers?: Quant<PassivePower>;
    shapeFamily?: Quant<WeaponShape['group']>;
    rarity?: Comp<WeaponRarity>;
    isSentient?: boolean;
}

/**
 * TODO this should really just accept weapon
 */
export type WeaponPowerCondParams = Pick<Weapon, 'active' | 'passivePowers' | 'sentient' | 'rarity' | 'themes' | 'shape'>

// themes: PrimitiveContainer<Theme>;
// adjectives: ProviderElement<WeaponAdjective, WeaponPowerCond>;
// personalities: ProviderElement<Personality, WeaponPowerCond>

// rechargeMethods: ProviderElement<RechargeMethod, WeaponPowerCond>;
// actives: ProviderElement<ActivePower, WeaponPowerCond>;

// passives: ProviderElement<MiscPower, WeaponPowerCond>;
// languages: ProviderElement<Language, WeaponPowerCond>;
// shapes: ProviderElement<WeaponShape, WeaponPowerCond>;

export interface FeatureProviderCollection {
    themeProvider: Theme[];
    adjectiveProvider: WeaponFeatureProvider<WeaponAdjective>;
    personalityProvider: WeaponFeatureProvider<Personality>;
    shapeProvider: WeaponFeatureProvider<WeaponShape>;

    rechargeMethodProvider: WeaponFeatureProvider<RechargeMethod>;
    activePowerProvider: WeaponFeatureProvider<ActivePower>;

    passivePowerOrLanguageProvider: WeaponFeatureProvider<PassivePower | Language>;
    languageProvider: WeaponFeatureProvider<Language>;
}


export interface WeaponFeaturesTypes {
    themes: PrimitiveContainer<Theme>;
    adjectives: ProviderElement<WeaponAdjective, WeaponPowerCond>;
    personalities: ProviderElement<Personality, WeaponPowerCond>

    rechargeMethods: ProviderElement<RechargeMethod, WeaponPowerCond>;
    actives: ProviderElement<ActivePower, WeaponPowerCond>;

    passives: ProviderElement<PassivePower, WeaponPowerCond>;
    languages: ProviderElement<Language, WeaponPowerCond>;
    shapes: ProviderElement<WeaponShape, WeaponPowerCond>;
}