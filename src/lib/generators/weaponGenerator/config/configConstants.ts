import { mkGen, StringGenerator } from "$lib/generators/recursiveGenerator";
import type { Descriptor, WeaponPartName, WeaponShapeGroup } from "$lib/generators/weaponGenerator/weaponGeneratorTypes";
import { capFirst } from "$lib/util/string";
import _ from "lodash";
import type { PRNG } from "seedrandom";

// shapes

export const edgedWeaponShapeFamilies = ['dagger', 'sword', 'greatsword', 'axe', 'greataxe', 'polearm', 'sword (or bow)', 'dagger (or pistol)', 'sword (or musket)', 'greataxe (or musket)'] as const satisfies WeaponShapeGroup[];
export const bluntWeaponShapeFamilies = ['club', 'mace', 'staff'] as const satisfies WeaponShapeGroup[];
export const pointedWeaponShapeFamilies = ['spear', 'lance'] as const;
export const sharpWeaponShapeFamilies = [...edgedWeaponShapeFamilies, ...pointedWeaponShapeFamilies];

export const swordlikeWeaponShapeFamilies = ['dagger', 'sword', 'greatsword', 'sword (or bow)', 'dagger (or pistol)', 'sword (or musket)'] satisfies WeaponShapeGroup[];


// reused descriptors and materials

/**
 * Descriptors that are a material, where the ephitet is exactly the material's name (but with the first letter of each word capitalised).
 */
const simpleMaterials = [
    {
        material: 'black iron',
        ephitet: 'Black Iron'
    } as const,
    {
        material: 'meteoric iron',
        ephitet: 'Meteoric Iron'
    } as const,
    {
        material: 'boreal steel',
        ephitet: 'Boreal Steel'
    } as const,
    {
        material: 'scarlet steel',
        ephitet: 'Scarlet Steel'
    } as const,
    {
        material: 'toxisteel',
        ephitet: 'Toxic'
    } as const,
    {
        material: 'ultrahard candy',
        ephitet: 'Candied'
    } as const,
    ..._.map([

        'sandstone',
        'granite',
        'alabaster',
        'marble',
        'sandstone',
        'flint',
        'obsidian',

        'copper',
        'tin',
        'bronze',
        'brass',


        'silver',
        'platinum',
        'palladium',
        'cobalt',


        'quartz',
        'diamond',
        'ruby',
        'emerald',
        'sapphire',
        'onyx',
        'amethyst',
        'crystal',
        'citrine',

        'mythrel',
        'adamantum',
        'australium',
    ] as const, (metal) => ({
        material: metal,
        ephitet: capFirst(metal)
    } satisfies Descriptor))] satisfies Descriptor[];


const voidGen = (f: (rng: PRNG) => string) => () => mkGen(f);
const golds = ['gold', 'rose gold', 'white gold', 'purple gold', 'blue gold'] as const;

const ephSharp = ['Vorpal', 'Razor', 'Jagged', 'Agonizing', 'Spiked'];
const ephCold = ["Icy", "Frigid", "Silent", "polar", "Frostbound", "Icebound"];
const ephOld = ['Ancient', 'Abyssal', 'Primeval', 'Enduring', 'Primordial', 'Antediluvian', 'Cambrian'];

const ephTransparent = ['Glass', 'Glassy', 'Translucent', 'Invisible'];
const ephGlowy = ['Brilliant', 'Radiant', 'Luminous', 'Glowing', 'Prismatic'];

const ephWhite = ['White', 'Pale', 'Fair', 'Lucent', 'Pallid', 'Ivory'];
const ephBlack = ['Dark', 'Stygian', 'Abyssal', 'Chaos', 'Chaotic', 'Shadow-Wreathed'];
const ephRed = ['Crimson', 'Bloodied', 'Bloody', 'Sanguine', 'Ruby'];
const ephRainbow = ['Prismatic', 'Rainbow', 'Variegated', 'Multicolored', 'Kaleidosopic', 'Polychromatic']


export const MATERIALS = {
    'lemonWood': {
        material: 'lemon tree wood',
        ephitet: 'Lemony'
    } as const,
    'oak': {
        material: 'oak wood',
        ephitet: 'Oaken'
    } as const,
    'pine': {
        material: 'pine wood',
        ephitet: 'Pine'
    } as const,
    'cherry': {
        material: 'redwood',
        ephitet: 'Cherry'
    } as const,
    'maple': {
        material: 'maple wood',
        ephitet: voidGen((rng) => ephWhite.choice(rng))
    } as const,
    'birch': {
        material: 'birch wood',
        ephitet: voidGen((rng) => ephWhite.choice(rng))
    } as const,
    'ebonyWood': {
        material: 'ebony wood',
        ephitet: voidGen((rng) => ephBlack.choice(rng))
    } as const,
    'bloodWood': {
        material: 'bloodwood',
        ephitet: voidGen((rng) => ephRed.choice(rng))
    } as const,
    'ironWood': {
        material: 'ironwood',
        ephitet: 'Iron'
    } as const,
    'wiseWood': {
        material: 'wood that was once part of a wise mystical tree',
        ephitet: 'Wise Mystical'
    } as const,
    'plyWood': {
        material: 'plywood',
        ephitet: 'Compliant'
    } as const,

    'ivory': {
        material: 'ivory',
        ephitet: voidGen((rng) => ephWhite.choice(rng))
    } as const,

    'silver-plated': {
        material: 'silver-plated steel',
        ephitet: 'Silvery'
    } as const,
    'gold-plated': {
        material: 'gold-plated steel',
        ephitet: 'Golden'
    } as const,
    'glass': {
        material: 'glass',
        ephitet: voidGen((rng) => ephTransparent.choice(rng))
    } as const,
    'glass-like-steel': {
        material: 'glass-like-steel',
        ephitet: voidGen((rng) => ephTransparent.choice(rng))
    } as const,
    'force': {
        material: 'magical force',
        ephitet: voidGen((rng) => ephTransparent.choice(rng))
    } as const,
    'light': {
        material: 'light',
        ephitet: voidGen((rng) => ephGlowy.choice(rng))
    } as const,
    'darkness': {
        material: 'darkness',
        ephitet: voidGen((rng) => ephBlack.choice(rng))
    } as const,

    'razors': {
        material: 'razor blades',
        ephitet: voidGen((rng) => ephSharp.choice(rng))
    } as const,

    'ice': {
        material: 'ice',
        ephitet: voidGen((rng) => ephCold.choice(rng))
    } as const,
    'iceBlood': {
        material: 'frozen blood',
        ephitet: voidGen((rng) => [...ephRed, ...ephCold].choice(rng))
    } as const,
    'iceSlime': {
        material: 'frozen slime',
        ephitet: voidGen((rng) => [...ephCold].choice(rng))
    } as const,

    'fossils': {
        material: 'various compacted fossils',
        ephitet: voidGen((rng) => ephOld.choice(rng))
    } as const,
    'recursiveSwords': {
        material: (weapon) => mkGen(() => `various smaller ${weapon.shape.particular}s, melded together into a single hunk`),
        ephitet: voidGen((rng) => ephOld.choice(rng))
    } as const,
    'beetleShell': {
        material: 'beetle shell',
        ephitet: voidGen((rng) => ['Verminous', 'Bug'].choice(rng))
    } as const,

    "clockwork": {
        material: "a complex system of clockwork",
        ephitet: "Clockwork"
    },

    ..._.reduce<(typeof golds)[number], Record<(typeof golds)[number], Descriptor>>(golds, (acc, metal) => {
        acc[metal] = ({
            material: metal,
            ephitet: 'Golden'
        } satisfies Descriptor)
        return acc;
    }, {} as Record<(typeof golds)[number], Descriptor>),

    ..._.mapKeys(simpleMaterials, x => x.material) as Record<(typeof simpleMaterials)[number]['material'], (typeof simpleMaterials)[number]>,
} as const satisfies Record<string, Descriptor>;

const amberGen = new StringGenerator(['a nodule of amber preserving an ancient ', mkGen((rng) => ['mosquito', 'crustacean', 'lizard', 'dragonfly', 'hummingbird'].choice(rng))]);
const embeddedArr = [['a ruby', voidGen((rng) => ephRed.choice(rng))], ['an emerald', 'Emerald'], ['a sapphire', 'Sapphire'], ['an amethyst', 'Amethyst'], ['a pearl', 'Empearled']] as const;
export const MISC_DESC_FEATURES = {
    embedded: {
        ..._.reduce<(typeof embeddedArr)[number], Record<(typeof embeddedArr)[number][0], Descriptor>>(embeddedArr, (acc, [thing, ephitet]) => {
            acc[thing] = ({
                descriptor: `${thing} embedded in it`,
                ephitet
            } satisfies Descriptor)
            return acc;
        }, {} as Record<(typeof embeddedArr)[number][0], Descriptor>),
        amber: {
            descriptor: () => amberGen,
            ephitet: voidGen((rng) => ephOld.choice(rng))
        } as Descriptor
    },
    charm: {
        puritySeal: {
            descriptor: 'has a piece of scripture affixed to it with a wax seal',
            ephitet: 'Sanctified'
        },
        smile: {
            descriptor: 'has a miniature bust tied to it, a smiling face',
            ephitet: 'Charming'
        },
        sad: {
            descriptor: 'has a miniature bust tied to it, a sad face',
            ephitet: 'Charming'
        },
        angry: {
            descriptor: 'has a miniature bust tied to it, an angry face',
            ephitet: 'Charming'
        },
        demon: {
            descriptor: "has a miniature bust tied to it, a demonic imp's head",
            ephitet: 'Charming'
        },
        cat: {
            descriptor: "has a miniature bust tied to it, a cat",
            ephitet: 'Charming'
        },
        shrunken: {
            descriptor: 'has a shrunken head tied to it',
            ephitet: 'Headhunter'
        },
    },
    coating: {
        glitter: {
            descriptor: 'has small flecks of glitter embedded just below the surface',
            ephitet: 'Glittering'
        },
        caseHardened: {
            descriptor: "is split into multicolored regions with psychedelic shapes",
            ephitet: 'Case Hardened'
        },
        oil: {
            descriptor: 'shines like a rainbow when viewed from the right angle',
            ephitet: voidGen((rng) => ephRainbow.choice(rng))
        },
        pearlescent: {
            descriptor: 'changes between pink and blue depending on the viewing angle',
            ephitet: voidGen((rng) => ephRainbow.choice(rng))
        }
    },
    wrap: {
        bannerWrap: {
            descriptor: 'has the flag of an ancient realm wrapped around it',
            ephitet: 'Bannered'
        },
        pirateWrap: {
            descriptor: 'has a scrap of a jolly roger wrapped around it',
            ephitet: "Pirate"
        },
        beadsWrap: {
            descriptor: 'has a string of glass beads wrapped around it',
            ephitet: 'Glassy'
        },
        silverChainWrap: {
            descriptor: 'has a small silver chain wrapped around it',
            ephitet: 'Silvery'
        },
        goldChainWrap: {
            descriptor: 'has a small gold chain wrapped around it',
            ephitet: 'Golden'
        },
        silkWrap: {
            descriptor: 'has a silk sash wrapped around it',
            ephitet: 'Silky'
        },
    },

} as const;

// weapon parts

/**
 * The main / signature part the weapon
 */
export const importantPart = ['blade', 'blades', 'tip', 'head', 'body'] as const satisfies WeaponPartName[];


/** Parts of a weapon specialised for striking and clashing, usually made of metal.
*/
export const hardNonHoldingParts = ['barrel', 'blade', 'blades', 'tip', 'head', 'crossguard', 'pommel'] as const satisfies WeaponPartName[];

/**
 * Parts of a weapon that are used to hold it. Usually made of wood.
 */
export const holdingParts = ['body', 'shaft', 'grip', 'limbs'] as const satisfies WeaponPartName[];

/**
 * Parts of a weapon that could have something wrapped around them (like a string or piece of cloth).
 */
export const wrappableParts = ['grip', 'crossguard', 'barrel', 'shaft', 'quiver', 'body'] as const satisfies WeaponPartName[];

