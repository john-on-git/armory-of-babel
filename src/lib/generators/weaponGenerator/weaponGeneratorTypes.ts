import { type Generator } from "$lib/generators/recursiveGenerator";
import { type PrimitiveContainer } from "$lib/util/versionController";
import seedrandom from "seedrandom";
import { ProviderElement, type Comp, type Cond, type Quant, type WithUUID } from "./provider";
import type { DescriptorProvider, WeaponFeatureProvider } from "./weaponGeneratorLogic";

export const allThemes = [
    "fire", "ice",
    "cloud", "earth",
    "light", "dark",
    "sweet", "sour",
    "wizard", "steampunk",
    "nature", // "electric"
    // "poison",

] as const;
export type Theme = typeof allThemes[number];

const themesSet = new Set(allThemes);
export const isTheme = (x: unknown): x is Theme => themesSet.has(x as Theme);

export const weaponRarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'] as const;
export type WeaponRarity = (typeof weaponRarities)[number];

const weaponRaritiesSet = new Set(weaponRarities);
export const isRarity = (x: unknown): x is WeaponRarity => weaponRaritiesSet.has(x as WeaponRarity);

const weaponRaritiesLookup: Record<WeaponRarity, number> = {
    common: 0,
    uncommon: 1,
    rare: 2,
    epic: 3,
    legendary: 4
}

export const weaponRaritiesOrd = <T>([r1]: [WeaponRarity, T] | [WeaponRarity], [r2]: [WeaponRarity, T] | [WeaponRarity]) => weaponRaritiesLookup[r2] - weaponRaritiesLookup[r1];

export function gt(x: WeaponRarity, y: WeaponRarity) {
    return weaponRaritiesLookup[x] > weaponRaritiesLookup[y];
}
export function lt(x: WeaponRarity, y: WeaponRarity) {
    return weaponRaritiesLookup[x] < weaponRaritiesLookup[y];
}
export function gte(x: WeaponRarity, y: WeaponRarity) {
    return weaponRaritiesLookup[x] >= weaponRaritiesLookup[y];
}
export function lte(x: WeaponRarity, y: WeaponRarity) {
    return weaponRaritiesLookup[x] <= weaponRaritiesLookup[y];
}

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
    nAdditionalLanguages: number;
    chanceOfMakingDemands: Exclude<CommonDieSize, 20>;
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
    /**
     * True if the weapon is a negative. Negative weapons are very rare weapons that have a different rarity color. This is purely cosmetic.
     * 
     * Common weapons cannot be negative, but enforcing this with the type threw a numer of issues, so we're only doing it for the viewmodel.
     */
    isNegative: boolean;

    pronouns: Pronouns;
    name: string;
    description: StructuredDescription | null;
    shape: WeaponShape;

    damage: DamageDice & { as: string };
    toHit: number;

    active: {
        maxCharges: number,
        rechargeMethod: WithUUID<RechargeMethod>
        powers: WithUUID<ActivePower>[];
    }
    passivePowers: WithUUID<PassivePower>[];
    sentient: false | {
        personality: WithUUID<Personality>[];
        languages: WithUUID<Language>[];
        /**
         * Each scene, a sentient weapon has a 1-in-this chance of making a demand.
         */
        chanceOfMakingDemands: CommonDieSize;
    }

    themes: Theme[],
    params: WeaponGenerationParams
}
export type WeaponGivenThemes<TThemes extends Theme[]> = Omit<Weapon, 'themes'> & { themes: TThemes };

interface PowerView {
    additionalNotes?: string[];
    bonus?: PassiveBonus;
}

export interface PassivePowerView extends PowerView {
    desc: string;
}
export interface ActivePowerView extends PowerView {
    desc: string;
    cost: number | string;
}
/**
 * Type of a weapon in the frontend. This is the type provided returned by the generate weapon API.
 */
export type WeaponViewModel = {
    /**
     * The RNG seed that produces this weapon.
     */
    id: string;

    themes: Theme[],


    name: string;
    pronouns: Pronouns;
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
        chanceOfMakingDemands: CommonDieSize;
    }
} & ({
    rarity: Exclude<WeaponRarity, 'common'>;
    /**
     * True if the weapon is a negative. Negative weapons are very rare weapons that have a different rarity color. This is purely cosmetic.
     * 
     * Common weapons cannot be negative.
     */
    isNegative: boolean;
} | {
    rarity: "common";
    /**
     * True if the weapon is a negative. Negative weapons are very rare weapons that have a different rarity color. This is purely cosmetic.
     * 
     * Common weapons cannot be negative.
     */
    isNegative: false;
});

export interface Power {
    additionalNotes?: (string | (Generator<string, [Weapon]>))[];

    /**
     * UUID or UUIDs of the description provider that is applied to weapons with this power
     */
    descriptorPartGenerator?: string | string[];

    bonus?: PassiveBonus;
}

export const commonDieSizes = [4, 6, 8, 10, 12, 20] as const satisfies number[];
export type CommonDieSize = (typeof commonDieSizes)[number];
export type DamageDice = {
    const?: number;
} & {
    [k in CommonDieSize as `d${k}`]?: number;
}


export interface PassiveBonus {
    addDamageDie?: DamageDice;
    /**
     * Plus this many to attack and damage
     */
    plus?: number;

    /**
     * Add this many additional charged powers.
     * If this is added to a non-unique power, the behaviour of the generators using it is undefined (because it can cause infinite loops).
     */
    addChargedPowers?: number;

} // TODO

export interface ChargedPower extends Power {
    desc: string;
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
    desc: string | (Generator<string, [Weapon]>);
};
export interface RechargeMethod {
    desc: string | (Generator<string, [Weapon]>);
}

export interface PassivePower extends Power {
    desc?: string;
}
export interface Language extends Power {
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
    | "greatclub"
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
    languages?: Quant<Language>;
    activePowers?: Quant<ActivePower>;
    passivePowers?: Quant<PassivePower>;
    shapeFamily?: Quant<WeaponShape['group']>;
    shapeParticular?: Quant<WeaponShape['particular']>;
    rarity?: Comp<WeaponRarity>;
    isSentient?: boolean;
}


interface SharedAtom {
    /**
     * Text of the element in the description.
     * @example
     * const descriptorExample = 'encrusted with jewels';
     * const materialExample = 'steel';
     */
    desc: string;

    /**
     * Ephitet used for this description. An ephitet is either pre or post, which indicates its position relative to the weapon type.
     * @example
     * const myEphitet = {
     *      pre: 'Fiery'
     * } 
     * const myOtherEphitet = {
     *      post: ' of the Volcano'
     * } 
     */
    ephitet?: {
        pre: string;
    } | {
        post: string;
    };
}

export type MaterialAtom = SharedAtom;
export type DescriptorAtom = SharedAtom & {
    descType: DescriptorType;
}

export interface WeaponPart {
    /**
     * Main material of the part, if it's notable.
     */
    material?: WithUUID<MaterialAtom>;
    /**
     * A list of facts about the physical properties of this part, which could be combined into a sentence.
     */
    descriptors: WithUUID<DescriptorAtom>[];
}


/**
 * Strings naming the parts of a weapon, in lowercase. If the first character is 'P', then the part is plural and the P should be removed before it is displayed.
 * Yes I know that's dumb, but the interface demands it be a string. Best I can do without a bunch of refactoring.  
 */
interface WeaponStructure {
    /**
     * The part(s) of the weapon that hurt people.
     */
    business: string[];

    /**
     * The part(s) of the weapon that you hold.
     */
    holding: [string, ...string[]];

    /**
     * All other parts.
     */
    other: string[]
}

export const weaponStructures = {
    swordLike: {
        business: ['blade'],
        holding: ['grip'],
        other: ['crossguard', 'pommel']
    },
    multiSwordLike: {
        business: ['blades'],
        holding: ['grip'],
        other: ['crossguard', 'pommel']
    },
    maceLike: {
        business: ['maceHead'],
        holding: ['grip'],
        other: ['shaft', 'pommel']
    },
    axeLike: {
        business: ['axeHead'],
        holding: ['grip'],
        other: ['shaft', 'pommel']
    },
    clubLike: {
        business: ['maceHead'],
        holding: ['grip'],
        other: []
    },
    staffLike: {
        business: [],
        holding: ['body'],
        other: []
    },
    lanceLike: {
        business: ['tip'],
        holding: ['grip'],
        other: ['pommel', 'base']
    },
    spearLike: {
        business: ['tip'],
        holding: ['spearShaft'],
        other: []
    },
    polearmLike: {
        business: ['axeHead'],
        holding: ['spearShaft'],
        other: []
    },
    forkLike: {
        business: ['prongs'],
        holding: ['spearShaft'],
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
    },
    scytheRifleLike: {
        business: ['blade'],
        holding: ['grip'],
        other: ['shaft', 'pommel', 'barrel', 'rifleSight']
    },
    multiClubLike: {
        business: ['maceHeads'],
        holding: ['chain'],
        other: []
    },
    flailLike: {
        business: ['maceHead'],
        holding: ['grip'],
        other: ['chain', 'pommel']
    },
    meteorHammerLike: {
        business: ['maceHeads'],
        holding: ['grip'],
        other: ['chain']
    },
    multiFlailLike: {
        business: ['maceHeads'],
        holding: ['grip'],
        other: ['chains', 'pommel']
    },
} as const satisfies Record<string, WeaponStructure>;

export const shapeToStructure = {
    "dagger": "swordLike",
    "club": 'clubLike',
    "staff": 'staffLike',
    "sword": 'swordLike',
    "axe": 'axeLike',
    "mace": 'maceLike',

    "greatclub": 'clubLike',
    "greataxe": 'axeLike',
    "greatsword": 'swordLike',

    "spear": 'spearLike',
    "lance": 'lanceLike',
    "polearm": 'polearmLike',

    "sword (or bow)": 'bowSwordLike',
    "dagger (or pistol)": 'gunSwordLike',
    "sword (or musket)": 'gunSwordLike',
    "greataxe (or musket)": "scytheRifleLike",

    "Macuahuitl": "multiSwordLike",
    "Nunchuks": "multiClubLike",
    "Flail": "flailLike",
    "Meteor Hammer": "meteorHammerLike",
    "Double Flail": "multiFlailLike",
    "Triple Flail": "multiFlailLike",
    "Quadruple Flail": "multiFlailLike",
    "Quintuple Flail": "multiFlailLike",

    "Bident": "forkLike",
    "Trident": "forkLike"
} as const satisfies Record<WeaponShapeGroup | string, keyof typeof weaponStructures>;

export type WeaponPartName = (typeof weaponStructures)[keyof (typeof weaponStructures)][keyof (typeof weaponStructures)[keyof (typeof weaponStructures)]][number];
export type StructuredDescription = {
    business: Record<WeaponPartName, WeaponPart>;
    holding: Record<WeaponPartName, WeaponPart>;
    other: Record<WeaponPartName, WeaponPart>;
};

export type CapitalLetter = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z';

export type Ephitet = {
    pre: string;
    /**
     * If the ephitet's first letter is pronounced in an atypical way, this property allows overriding the alliteration behaviour.
     * i.e.
     * @example "Candied" alliteratesWith 'K'
     * 
     * @example "Pterodactly's" alliteratesWith 'T'
     */
    alliteratesWith?: CapitalLetter;
} | {
    post: string;
    /**
     * If the ephitet starts with a linking phrase i.e. "of", "of the", it should provide the first letter of the real content here. 
     * If this property is not provided, the ephitet will not be prioritised when it alliterates.
     * i.e.
     * @example "of the Fire" alliteratesWith 'F'
     * 
     * @example "the Lord's Blade" alliteratesWith 'L'
     */
    alliteratesWith?: CapitalLetter;
};

export type DescriptorType = 'possession' | 'property';

/**
 * Union type representing different kinds of description. Used to prefix the description with varying plurality.
 * property: claims some kind of property. It is red. It is covered in paint.
 * possession: usually a sub-part. It has jewels in it.
 */
export type DescriptorText = ({
    descType: DescriptorType;
    singular: string | Generator<string, [Weapon, WeaponPartName]>;
    plural: string | Generator<string, [Weapon, WeaponPartName]>;
});

export type PartMaterial<TArgs extends [Weapon, ...unknown[]] = [Weapon]> = ({ material: string | Generator<string, TArgs> }) & {
    ephitet?: Ephitet | Generator<Ephitet, [Weapon]>;
};
export type PartFeature<TArgs extends [Weapon, ...unknown[]] = [Weapon]> = ({ descriptor: DescriptorText }) & {
    ephitet?: Ephitet | Generator<Ephitet, TArgs>;
};
export type DescriptorGenerator<TArgs extends [Weapon, ...unknown[]] = [Weapon]> =
    ((Generator<PartMaterial<TArgs>, TArgs> & {
        /**
         * The type of descriptor that the generator will produce. 
         */
        yields: 'material'
    }) | (Generator<PartFeature<TArgs>, TArgs> & {
        /**
         * The type of descriptor that the generator will produce. 
         */
        yields: 'feature'
    })) & {
        applicableTo: Quant<WeaponPartName>;
    };

/**
 * Woke up mxster Freethem. Woke up and smell the pronouns.
 */
export type Pronouns = 'object' | 'enby' | 'masc' | 'femm';
export type PronounsLoc = {
    singular: {
        subject: string,
        possessive: string
    },
};

/**
 * TODO this should really just accept weapon
 * (what did he mean by this?)
 */
export type WeaponPowerCondParams = Pick<Weapon, 'active' | 'passivePowers' | 'sentient' | 'rarity' | 'themes' | 'shape'>;
export type DescriptorCondParams = Pick<Weapon, 'active' | 'passivePowers' | 'sentient' | 'rarity' | 'themes' | 'shape' | 'description'>

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
    descriptors: DescriptorProvider;
    /**
     * Descriptor generator indexed by UUID. This allows features to apply specific descriptors, ignoring the usual conditions.
     */
    descriptorIndex: Record<string, DescriptorGenerator & { UUID: string }>;
    personalityProvider: WeaponFeatureProvider<Personality>;
    shapeProvider: WeaponFeatureProvider<WeaponShape>;

    rechargeMethodProvider: WeaponFeatureProvider<RechargeMethod>;
    activePowerProvider: WeaponFeatureProvider<ActivePower | Generator<ActivePower, [Weapon]>>;

    passivePowerProvider: WeaponFeatureProvider<PassivePower | Generator<PassivePower, [Weapon]>>;
    languageProvider: WeaponFeatureProvider<Language>;
}


export interface WeaponFeaturesTypes {
    themes: PrimitiveContainer<Theme>;
    nonRollableDescriptors: ProviderElement<DescriptorGenerator, { never: true }>;
    descriptors: ProviderElement<DescriptorGenerator>;
    personalities: ProviderElement<Personality>

    rechargeMethods: ProviderElement<RechargeMethod>;
    actives: ProviderElement<ActivePower | Generator<ActivePower, [Weapon]>>;

    passives: ProviderElement<PassivePower | Generator<PassivePower, [Weapon]>>;
    languages: ProviderElement<Language>;
    shapes: ProviderElement<WeaponShape>;
}