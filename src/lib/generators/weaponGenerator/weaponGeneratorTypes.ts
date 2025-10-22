import { type TGenerator } from "$lib/generators/recursiveGenerator";
import { type PrimitiveContainer } from "$lib/util/versionController";
import seedrandom from "seedrandom";
import { ProviderElement, type Comp, type Cond, type Quant, type WithUUID } from "./provider";
import type { WeaponFeatureProvider } from "./weaponGeneratorLogic";

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
        languages: string[];
        /**
         * Each scene, a sentient weapon has a 1-in-this chance of making a demand.
         */
        chanceOfMakingDemands: CommonDieSize;
    }

    themes: Theme[],
    params: WeaponGenerationParams
}

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
        chanceOfMakingDemands: CommonDieSize;
    }
}

export interface Power {
    additionalNotes?: (string | (TGenerator<string, [Weapon]>))[];

    /**
     * UUID of the description provider that is applied to weapons with this power
     */
    descriptorPartGenerator?: string;

    bonus?: PassiveBonus;
}

export type CommonDieSize = 4 | 6 | 8 | 10 | 12 | 20;
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
    desc: string | (TGenerator<string, [Weapon]>);
};
export interface RechargeMethod {
    desc: string | (TGenerator<string, [Weapon]>);
}

export interface PassivePower extends Power {
    miscPower: true;
    desc?: string;
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

const weaponStructures = {
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
        business: ['head'],
        holding: ['grip'],
        other: ['shaft', 'pommel']
    },
    axeLike: {
        business: ['blade'],
        holding: ['grip'],
        other: ['shaft', 'pommel']
    },
    clubLike: {
        business: ['head'],
        holding: ['grip'],
        other: []
    },
    staffLike: {
        business: [],
        holding: ['body'],
        other: ['orb']
    },
    lanceLike: {
        business: ['tip'],
        holding: ['grip'],
        other: ['pommel', 'base']
    },
    spearLike: {
        business: ['tip'],
        holding: ['grip'],
        other: ['shaft', 'pommel']
    },
    forkLike: {
        business: ['prongs'],
        holding: ['grip'],
        other: ['shaft', 'pommel']
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
        other: ['shaft', 'pommel', 'barrel']
    },
    multiClubLike: {
        business: ['heads'],
        holding: ['grip'],
        other: []
    },
    flailLike: {
        business: ['head'],
        holding: ['grip'],
        other: ['chain', 'pommel']
    },
    multiFlailLike: {
        business: ['heads'],
        holding: ['grip'],
        other: ['chains', 'pommel']
    },
} as const satisfies Record<string, WeaponStructure>;

const shapeToStructure = {
    "dagger": "swordLike",
    "club": 'clubLike',
    "staff": 'staffLike',
    "sword": 'swordLike',
    "axe": 'axeLike',
    "mace": 'maceLike',

    "greataxe": 'axeLike',
    "greatsword": 'swordLike',

    "spear": 'spearLike',
    "lance": 'lanceLike',
    "polearm": 'axeLike',

    "sword (or bow)": 'bowSwordLike',
    "dagger (or pistol)": 'gunSwordLike',
    "sword (or musket)": 'gunSwordLike',
    "greataxe (or musket)": "scytheRifleLike",

    "Macuahuitl": "multiSwordLike",
    "Nunchuks": "multiClubLike",
    "Meteor Hammer": "multiFlailLike",
    "Double Flail": "multiFlailLike",
    "Triple Flail": "multiFlailLike",
    "Quadruple Flail": "multiFlailLike",
    "Quintuple Flail": "multiFlailLike",

    "Bident": "forkLike",
    "Trident": "forkLike"
} as const satisfies Record<WeaponShapeGroup | string, keyof typeof weaponStructures>;

/**
 * Determines whether a weapon part is one or many.
 * @param name weaponpart to get name for
 * @returns the next word in the sentence after the weapon part
 */
export function getPlurality(name: WeaponPartName) {
    switch (name) {
        case 'blades':
        case 'limbs':
        case 'heads':
        case 'chains':
        case 'prongs':
            return 'plural';
        default:
            return 'singular';
    }
}

export function isAre(name: WeaponPartName) {
    switch (getPlurality(name)) {
        case 'singular':
            return ' is';
        case 'plural':
            return ' are';
    }
}
export function isOrPossessionFor(name: WeaponPartName, type: DescriptorType) {
    const plurality = getPlurality(name);
    switch (plurality) {
        case 'singular':
            switch (type) {
                case 'possession':
                    return ' has ';
                case 'property':
                    return "";
                case undefined:
                    return '';
                default:
                    return type satisfies never;
            }
        case 'plural':
            switch (type) {
                case 'possession':
                    return ' have ';
                case 'property':
                    return "";
                case undefined:
                    return '';
                default:
                    return type satisfies never;
            }
        default:
            return plurality satisfies never;
    }
}

export function linkingIsOrPossessionFor(name: WeaponPartName, type: DescriptorType) {
    const plurality = getPlurality(name);
    switch (plurality) {
        case 'singular':
            switch (type) {
                case 'possession':
                    return 'it has ';
                case 'property':
                    return "it";
                case undefined:
                    return '';
                default:
                    return type satisfies never;
            }
        case 'plural':
            switch (type) {
                case 'possession':
                    return 'they each have ';
                case 'property':
                    return "they";
                case undefined:
                    return '';
                default:
                    return type satisfies never;
            }
        default:
            return plurality satisfies never;
    }
}

export function structureDescFor(shape: WeaponShape) {
    function getStructure(shape: WeaponShape) {

        switch (shape.particular) {
            case 'Macuahuitl':
            case 'Nunchuks':
            case 'Meteor Hammer':
            case 'Double Flail':
            case 'Triple Flail':
            case 'Quadruple Flail':
            case 'Quintuple Flail':
            case "Bident":
            case "Trident":
                return weaponStructures[shapeToStructure[shape.particular]];
            default:
                return weaponStructures[shapeToStructure[shape.group]];
        }
    }
    const structure = getStructure(shape);

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
    return structuredDesc as StructuredDescription;
}

export type WeaponPartName = (typeof weaponStructures)[keyof (typeof weaponStructures)][keyof (typeof weaponStructures)[keyof (typeof weaponStructures)]][number];
export type StructuredDescription = {
    business: Record<WeaponPartName, WeaponPart>;
    holding: Record<WeaponPartName, WeaponPart>;
    other: Record<WeaponPartName, WeaponPart>;
};

export type Ephitet = {
    pre: string;
} | {
    post: string;
};

export type DescriptorType = 'possession' | 'property';

/**
 * Union type representing different kinds of description. Used to prefix the description with varying plurality.
 * property: claims some kind of property. It is red. It is covered in paint.
 * possession: usually a sub-part. It has jewels in it.
 */
export type DescriptorText = ({
    descType: DescriptorType;
    singular: string | TGenerator<string, [Weapon, WeaponPartName]>;
    plural: string | TGenerator<string, [Weapon, WeaponPartName]>;
});

export type Descriptor = ({ material: string | TGenerator<string, [Weapon]> } | { descriptor: DescriptorText }) & {
    ephitet?: Ephitet | TGenerator<Ephitet, [Weapon]>;
};
export type DescriptorGenerator<TArgs extends Array<unknown> = [Weapon]> = TGenerator<Descriptor, TArgs> & {
    applicableTo?: Quant<WeaponPartName>;
};

// woke up mxsterr Freethem. woke u and smell the pronouns
export type Pronouns = 'object' | 'enby' | 'masc' | 'femm';
type PronounsLoc = {
    singular: {
        subject: string,
        possessive: string
    },
};
export const pronounLoc = {
    object: {
        singular: {
            subject: "it",
            possessive: "its"
        }
    },
    enby: {
        singular: {
            subject: "they",
            possessive: "their"
        }
    },
    masc: {
        singular: {
            subject: "he",
            possessive: "his"
        }
    },
    femm: {
        singular: {
            subject: "she",
            possessive: "her"
        }
    }
} as const satisfies Record<Pronouns, PronounsLoc>;

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
    activePowerProvider: WeaponFeatureProvider<ActivePower | TGenerator<ActivePower, [Weapon]>>;

    passivePowerProvider: WeaponFeatureProvider<PassivePower | TGenerator<PassivePower, [Weapon]>>;
    languageProvider: WeaponFeatureProvider<Language>;
}


export interface WeaponFeaturesTypes {
    themes: PrimitiveContainer<Theme>;
    descriptors: ProviderElement<DescriptorGenerator>;
    personalities: ProviderElement<Personality>

    rechargeMethods: ProviderElement<RechargeMethod>;
    actives: ProviderElement<ActivePower | TGenerator<ActivePower, [Weapon]>>;

    passives: ProviderElement<PassivePower | TGenerator<PassivePower, [Weapon]>>;
    languages: ProviderElement<Language>;
    shapes: ProviderElement<WeaponShape>;
}