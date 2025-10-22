import { type TGenerator } from "$lib/generators/recursiveGenerator";
import { type PrimitiveContainer } from "$lib/util/versionController";
import seedrandom from "seedrandom";
import { ProviderElement, type Comp, type Cond, type Quant } from "./provider";
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
    description: StructuredDescription | null;
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
    description: string;

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

    /**
     * UUID of the description provider that is applied to weapons with this power
     */
    descriptorPartGenerator?: string;
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

export type WeaponShapeGroup =
    | "dagger"
    | "club"
    | "staff"
    | "sword"
    | "axe"
    | "mace"
    | "greataxe"
    | "greatsword"
    | "spear"
    | "lance"
    | "polearm"
    | "sword (or bow)"
    | "dagger (or pistol)"
    | "sword (or musket)"
    | "greataxe (or musket)";


export type WeaponShape = {
    particular: string;
    group: WeaponShapeGroup;
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


export interface WeaponPart {
    /**
     * Main material of the part, if it's notable.
     */
    material?: {
        /**
         * Text of the material in the description.
         * @example
         * const example = 'steel';
         */
        desc: string;
        /**
         * Ephitet used for this description.
         * @example
         * const example = 'steely';
         */
        ephitet: string;
        UUID: string;
    };
    /**
     * A list of facts about the physical properties of this part, which could be combined into a sentence.
     */
    descriptors: {
        /**
         * Text of the material in the description.
         * @example
         * const example = 'encrusted with jewels';
         */
        desc: string;
        /**
         * Ephitet used for this description.
         * @example
         * const example = 'jewel-encrusted';
         */
        ephitet: string;
        UUID: string;
    }[];
}


interface WeaponStructure {
    /**
     * The part(s) of the weapon that hurt people.
     */
    business: [string, ...string[]];

    /**
     * The part(s) of the weapon that you hold.
     */
    holding: [string, ...string[]];

    /**
     * All other parts.
     */
    other: string[]
}

const weaponStructures = {
    swordLike: {
        business: ['blade'],
        holding: ['grip'],
        other: ['crossguard', 'pommel']
    },
    maceOrAxeLike: {
        business: ['head'],
        holding: ['grip'],
        other: ['shaft', 'pommel']
    },
    lanceLike: {
        business: ['tip'],
        holding: ['grip'],
        other: ['pommel']
    },
    spearLike: {
        business: ['tip'],
        holding: ['grip'],
        other: ['shaft', 'pommel']
    },
    clubOrStaffLike: {
        business: ['body'],
        holding: ['body'],
        other: []
    },
    bowSwordLike: {
        business: ['blades'],
        holding: ['grip'],
        other: ['string', 'quiver', 'limbs']
    },
    gunSwordLike: {
        business: ['blade'],
        holding: ['grip'],
        other: ['crossguard', 'pommel', 'barrel']
    }
} as const satisfies Record<string, WeaponStructure>;


const shapeToStructure = {
    "dagger": "swordLike",
    "club": 'clubOrStaffLike',
    "staff": 'clubOrStaffLike',
    "sword": 'swordLike',
    "axe": 'maceOrAxeLike',
    "mace": 'maceOrAxeLike',

    "greataxe": 'swordLike',
    "greatsword": 'swordLike',

    "spear": 'spearLike',
    "lance": 'lanceLike',
    "polearm": 'maceOrAxeLike',

    "sword (or bow)": 'bowSwordLike',
    "dagger (or pistol)": 'gunSwordLike',
    "sword (or musket)": 'gunSwordLike',
    "greataxe (or musket)": "maceOrAxeLike",
} as const satisfies Record<WeaponShapeGroup, keyof typeof weaponStructures>

export type WeaponPartName = (typeof weaponStructures)[keyof (typeof weaponStructures)][keyof (typeof weaponStructures)[keyof (typeof weaponStructures)]][number];
export type StructuredDescription = {
    business: Record<WeaponPartName, WeaponPart>;
    holding: Record<WeaponPartName, WeaponPart>;
    other: Record<WeaponPartName, WeaponPart>;
};

export type Descriptor = ({ material: string | ((weapon: Weapon) => TGenerator<string>) } | { descriptor: string | ((weapon: Weapon) => TGenerator<string>) }) & { ephitet: string | ((weapon: Weapon) => TGenerator<string>); };
export type DescriptorGenerator = TGenerator<Descriptor> & {
    applicableTo?: Quant<WeaponPartName>;
};


export function structureFor<T extends WeaponShapeGroup>(shape: T) {
    const structure = weaponStructures[shapeToStructure[shape]];

    const structuredDesc = {
        business: structure.business.reduce((acc, partName) => {
            acc[partName] = {
                descriptors: []
            } satisfies WeaponPart;
            return acc;
        }, {} as Record<WeaponPartName, WeaponPart>),
        holding: structure.holding.reduce((acc, partName) => {
            acc[partName] = {
                descriptors: []
            } satisfies WeaponPart;
            return acc;
        }, {} as Record<WeaponPartName, WeaponPart>),
        other: structure.other.reduce((acc, partName) => {
            acc[partName] = {
                descriptors: []
            } satisfies WeaponPart;
            return acc;
        }, {} as Record<WeaponPartName, WeaponPart>),

    };

    return [structure, structuredDesc as StructuredDescription] as const;
}


/**
 * TODO this should really just accept weapon
 * (what did he mean by this?)
 */
export type WeaponPowerCondParams = Pick<Weapon, 'active' | 'passivePowers' | 'sentient' | 'rarity' | 'themes' | 'shape'>

// themes: PrimitiveContainer<Theme>;
// adjectives: ProviderElement<WeaponAdjective;
// personalities: ProviderElement<Personality

// rechargeMethods: ProviderElement<RechargeMethod;
// actives: ProviderElement<ActivePower;

// passives: ProviderElement<MiscPower;
// languages: ProviderElement<Language;
// shapes: ProviderElement<WeaponShape;

export interface FeatureProviderCollection {
    themeProvider: Theme[];
    descriptors: WeaponFeatureProvider<DescriptorGenerator>;
    /**
     * Descriptor generator indexed by UUID. This allows features to apply specific descriptors, ignoring the usual conditions.
     */
    descriptorIndex: Record<string, DescriptorGenerator & { UUID: string }>;
    personalityProvider: WeaponFeatureProvider<Personality>;
    shapeProvider: WeaponFeatureProvider<WeaponShape>;

    rechargeMethodProvider: WeaponFeatureProvider<RechargeMethod>;
    activePowerProvider: WeaponFeatureProvider<ActivePower>;

    passivePowerOrLanguageProvider: WeaponFeatureProvider<PassivePower | Language>;
    languageProvider: WeaponFeatureProvider<Language>;
}


export interface WeaponFeaturesTypes {
    themes: PrimitiveContainer<Theme>;
    descriptors: ProviderElement<DescriptorGenerator>;
    personalities: ProviderElement<Personality>

    rechargeMethods: ProviderElement<RechargeMethod>;
    actives: ProviderElement<ActivePower>;

    passives: ProviderElement<PassivePower>;
    languages: ProviderElement<Language>;
    shapes: ProviderElement<WeaponShape>;
}