import { coldBiomeHorn as coldAnimalHorn, darkAnimalSkin, coldBiomeHorn as hotAnimalHorn, magicAnimalHorn } from "$lib/generators/foes";
import { mkGen, StringGenerator, type Generator } from "$lib/generators/recursiveGenerator";
import { gatherUUIDs } from "$lib/generators/weaponGenerator/provider";
import { pickForTheme } from "$lib/generators/weaponGenerator/weaponGeneratorLogic";
import { gte, type DescriptorText, type Ephitet, type PartFeature, type PartMaterial, type Theme, type Weapon, type WeaponGivenThemes, type WeaponPartName, type WeaponRarity, type WeaponShapeGroup } from "$lib/generators/weaponGenerator/weaponGeneratorTypes";
import { choice } from "$lib/util/choice";
import { titleCase } from "$lib/util/string";
import _ from "lodash";
import type { PRNG } from "seedrandom";

export const UUIDsOfAllAbilitiesThatProvideResourcelessRangedAttacks = ["fire-magic-projectile"] as const satisfies string[];

// providers
export const allEyeProviders = ['generic-eyes'] as const;

// shapes

export const edgedWeaponShapeFamilies = ['dagger', 'sword', 'greatsword', 'axe', 'greataxe', 'polearm', 'sword (or bow)', 'dagger (or pistol)', 'sword (or musket)', 'greataxe (or musket)'] as const satisfies WeaponShapeGroup[];
export const bluntWeaponShapeFamilies = ['club', 'mace', 'staff', 'greatclub'] as const satisfies WeaponShapeGroup[];
export const pointedWeaponShapeFamilies = ['spear', 'lance'] as const satisfies WeaponShapeGroup[];

export const swordlikeWeaponShapeFamilies = ['dagger', 'sword', 'greatsword', 'sword (or bow)', 'dagger (or pistol)', 'sword (or musket)'] as const satisfies WeaponShapeGroup[];
export const grippedWeaponShapeFamilies = ['dagger', 'sword', 'greatsword', 'axe', 'greataxe', 'polearm', 'sword (or bow)', 'dagger (or pistol)', 'sword (or musket)', 'greataxe (or musket)', 'club', 'mace', 'greatclub'] as const satisfies WeaponShapeGroup[];
export const twoHandedWeaponShapeFamilies = ['staff', 'spear', 'polearm', 'greataxe', 'greatsword', 'sword (or musket)', 'greataxe (or musket)'] as const satisfies WeaponShapeGroup[]
export const rangedWeaponShapeFamilies = ["dagger (or pistol)", "sword (or bow)", "sword (or musket)", "greataxe (or musket)"] as const satisfies WeaponShapeGroup[];

/**
 * Weapon shape families that usually have a small damage die, like d4 or d6.
 */
export const smallDieWeaponShapeFamilies = ['dagger', 'club'] as const satisfies WeaponShapeGroup[];

export const shapeFamiliesWithoutPommels = ['club', 'staff'] as const satisfies WeaponShapeGroup[];

export const animeWeaponShapes = ['Tanto', 'Katana', "Naginata", "Nodachi", "Kanabo", "Keyblade", "Transforming Sniper Scythle"] as const;
export const pointedWeaponShapes = ['Stiletto', 'Dirk', 'Rapier', 'Foil', 'Epee', 'Spear', 'Trident', 'Bident', 'Pike', 'Lance'] as const;

// reused descriptors and materials
const mkCharms = (rng: PRNG, quantity: 'singular' | 'plural') => {
    const options = ['a smiling face', 'a sad face', 'an angry face', "a dizzy face", "a melting face", "an imp's head", "a cat's head", "a sun with a face", "a moon with a face"];
    const nCharms = ([1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3] satisfies (1 | 2 | 3)[]).choice(rng);
    const chosenOptions = new Array(nCharms).fill(null).map(() => {
        // choose an element, and remove it from the array to prevent duplicates
        const iChoice = Math.floor(options.length * rng());
        return options.splice(iChoice, 1);
    });
    switch (nCharms) {
        case 1:
            return ({
                singular: `a miniature bust affixed to it (${chosenOptions[0]})`,
                plural: `a pair of miniature busts affixed to them (${chosenOptions[0]} and ${chosenOptions[1]})`,
            } satisfies Omit<DescriptorText, 'descType'>)[quantity];
        case 2:
            return ({
                singular: `a pair of miniature busts affixed to it (${chosenOptions[0]} and ${chosenOptions[1]})`,
                plural: `a pair of miniature busts affixed to them (${chosenOptions[0]} and ${chosenOptions[1]})`,
            } satisfies Omit<DescriptorText, 'descType'>)[quantity];
        case 3:
            return ({
                singular: `a cluster of miniature busts affixed to it (${chosenOptions[0]}, ${chosenOptions[1]}, and ${chosenOptions[2]})`,
                plural: `a cluster of miniature busts affixed to them (${chosenOptions[0]}, ${chosenOptions[1]}, and ${chosenOptions[2]})`,
            } satisfies Omit<DescriptorText, 'descType'>)[quantity];
    }
}

/**
 * Descriptors that are a material, where the ephitet is exactly the material's name (but with the first letter of each word capitalised).
 */
const simpleMaterials = [
    {
        material: 'black iron',
        ephitet: { pre: 'Black-Iron' }
    } as const,
    {
        material: 'meteoric iron',
        ephitet: { pre: 'Meteoric Iron' }
    } as const,
    {
        material: 'boreal steel',
        ephitet: { pre: 'Boreal Steel' }
    } as const,
    {
        material: 'scarlet steel',
        ephitet: { pre: 'Scarlet Steel' }
    } as const,
    {
        material: 'lumensteel',
        ephitet: { pre: 'Lumensteel' }
    } as const,

    // cool materials (can be the source of an ephitet)
    ..._.map([

        'sandstone',
        'granite',
        'alabaster',
        'marble',
        'sandstone',
        'flint',
        'obsidian',
        'basalt',

        'terracotta',
        'porcelain',

        'brass',
        'silver',
        'platinum',
        'palladium',
        'cobalt',

        'gingerbread',

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
    ] as const, (metal) => ({
        material: metal,
        ephitet: { pre: titleCase(metal) }
    } satisfies PartMaterial)),

    // boring materials (cannot be the source of an ephitet)
    ..._.map([
        'copper',
        'tin',
        'bronze',
        'iron',
        'steel',
    ] as const, (metal) => ({
        material: metal,
    } satisfies PartMaterial))
] satisfies PartMaterial[];


const golds = ['gold', 'rose gold', 'white gold', 'purple gold', 'blue gold'] as const;

// export const eph_TEMPLATE = [] satisfies Ephitet[];

export const ephSharp = ['Vorpal', 'Razor', 'Jagged', 'Agonizing', 'Spiked'];
export const ephCold = [{ pre: "Icebound" }, { pre: "Frostbound" }, { pre: "Frigid" }, { pre: "Silent" }, { post: " of the North Star", alliteratesWith: 'N' }, { pre: "Frostbound" }, { pre: "Icebound" }] satisfies Ephitet[];
export const ephHot = [{ pre: 'Fiery' }, { pre: 'Blazing' }, { post: ' of the Bonfire Keeper', alliteratesWith: 'B' }, { post: ' of the Scorchlands', alliteratesWith: 'S' }, { pre: 'Burning' }] satisfies Ephitet[];
export const ephOld = ['Ancient', 'Abyssal', 'Primeval', 'Enduring', 'Primordial', 'Antediluvian'];
export const ephSky = [{ pre: 'Cloudborn' }, { pre: 'Zephyr' }, { post: ' of the Zephyr', alliteratesWith: 'Z' }, { post: ' of the Skylands', alliteratesWith: 'S' }, { post: ' of the Cloud Giants', alliteratesWith: 'C' }, { post: ' of the Butterfly Lords', alliteratesWith: 'B' }, { post: ' of the Valkyrie Queen', alliteratesWith: 'V' }] satisfies Ephitet[];
export const ephWizard = [{ post: ' of the Wizard', alliteratesWith: 'W' }, { post: ' of the Stars', alliteratesWith: 'S' }, { post: ' of the Cosmos', alliteratesWith: 'C' }] satisfies Ephitet[];
export const ephExplorer = [{ pre: "Explorer's" }, { pre: "Navigator's" }, { pre: "Pathfinder's" }, { post: ' of the Explorer', alliteratesWith: 'E' }, { post: ' of the Navigator', alliteratesWith: 'N' }] satisfies Ephitet[];
export const ephSteampunk = [...ephExplorer, { post: ' of the Empire', alliteratesWith: 'E' }, { pre: 'Clockwork' }, { pre: 'Machine' }, { pre: 'Steam-Powered' }, { pre: 'Automatic' }] satisfies Ephitet[];

export const ephAcid = [{ pre: 'Toxic' }, { pre: 'Corrosive' }] satisfies Ephitet[];
export const ephBug = [{ pre: 'Verminous' }, { post: " of the Isopod", alliteratesWith: 'I' }, { post: " of the Beetle", alliteratesWith: 'B' }, { post: " of the Queen Bee", alliteratesWith: 'Q' }, { post: " of the Swarm", alliteratesWith: 'S' }, { post: " of the Hive", alliteratesWith: 'H' }] satisfies Ephitet[];

export const ephTransparent = [{ pre: 'Glass' }, { post: ' of Glass', alliteratesWith: 'G' }, { pre: 'Translucent' }] satisfies Ephitet[];
export const adjLight = [{ pre: 'Brilliant' }, { pre: 'Radiant' }, { pre: 'Luminous' }, { pre: 'Glowing' }, { pre: 'Prismatic' }, { pre: 'Moonlit' }, { pre: 'Moonlight' }, { pre: 'Sunlit' }, { post: 'of Dawn', alliteratesWith: 'D' }] satisfies Ephitet[];

export const ephWhite = [{ pre: 'White' }, { pre: 'Pale' }, { pre: 'Fair' }, { pre: 'Lucent' }, { pre: 'Pallid' }, { pre: 'Ivory' }, { pre: 'Moonlit' }, { pre: 'Moonlight' }, { post: ' of Selene', alliteratesWith: 'S' }] satisfies Ephitet[];
export const ephBlack = [{ pre: 'Dark' }, { pre: 'Stygian' }, { pre: 'Abyssal' }, { post: ' of Chaos', alliteratesWith: 'C' }, { pre: 'Chaotic' }, { pre: 'Shadow-Wreathed' }, { post: ' of Shadows', alliteratesWith: 'S' }, { post: ' of Dusk', alliteratesWith: 'D' }] satisfies Ephitet[];
export const ephRainbow = [{ pre: 'Prismatic' }, { post: ' of Rainbows', alliteratesWith: 'R' }, { pre: 'Variegated' }, { pre: 'Multicolored' }, { pre: 'Kaleidosopic' }, { pre: 'Polychromatic' }] satisfies Ephitet[];

export const ephRed = [{ pre: 'Crimson' }, { pre: 'Blood-Stained' }, { pre: 'Bloody' }, { pre: 'Sanguine' }, { pre: 'Ruby' }, { post: ' of the King in Red', alliteratesWith: 'R' }] satisfies Ephitet[];

// TODO these need more stuff
export const ephPurple = [{ pre: 'Purple' }, { pre: 'Ultraviolet' }] satisfies Ephitet[];
export const ephBlue = [{ pre: 'Blue' }, { pre: 'Cerulean' }, { pre: 'Azure' }, { pre: 'Sapphire' }] satisfies Ephitet[];
export const ephGreen = [{ pre: 'Green' }, { pre: 'Emerald' }, { post: ' of Val Verde', alliteratesWith: 'V' }] satisfies Ephitet[];
export const ephGold = [{ pre: 'Golden' }, { pre: 'Auric' }, { post: ' of the Sun', alliteratesWith: 'S' }, { post: ' of Ra', alliteratesWith: 'R' }] satisfies Ephitet[];
export const ephSweet = [{ pre: 'Candied' }] satisfies Ephitet[];



export const MATERIALS = {
    lemonWood: {
        material: 'lemon tree wood',
        ephitet: mkGen((rng) => choice([{ pre: 'Lemony' }, { post: ' of the Lemon Lord', alliteratesWith: 'L' }] as const, rng))
    } as const,
    oak: {
        material: 'oak wood',
        ephitet: { pre: 'Oaken' }
    } as const,
    pine: {
        material: 'pine wood',
        ephitet: { post: ' of the Tundra', alliteratesWith: 'T' }
    } as const,
    cherryNormal: {
        material: 'cherry wood',
        ephitet: { pre: 'Cherry' }
    } as const,
    cherryAnime: {
        material: 'cherry wood',
        ephitet: { post: ' of the Sakura Forest', alliteratesWith: 'S' }
    } as const,
    maple: {
        material: 'maple wood',
        ephitet: mkGen((rng) => ephWhite.choice(rng))
    } as const,
    birch: {
        material: 'birch wood',
        ephitet: mkGen((rng) => ephWhite.choice(rng))
    } as const,
    ebonyWood: {
        material: 'ebony wood',
        ephitet: mkGen((rng) => ephBlack.choice(rng))
    } as const,
    bloodWood: {
        material: 'bloodwood',
        ephitet: mkGen((rng) => ephRed.choice(rng))
    } as const,
    ironWood: {
        material: 'ironwood',
        ephitet: { pre: 'Ironwood' }
    } as const,
    aetherWood: {
        material: 'wood from a sky-land tree',
        ephitet: mkGen((rng) => ephSky.choice(rng))
    } as const,
    peachWood: {
        material: 'peach wood',
        ephitet: mkGen((rng) => [{ pre: "Peach" }].choice(rng))
    } as const,
    heavenlyPeachWood: {
        material: 'wood from a heavenly peach tree',
        ephitet: mkGen((rng) => [{ pre: "Jade Emperor's" }].choice(rng))
    } as const,
    scorchedWood: {
        material: 'scorched wood',
        ephitet: { pre: 'Scorched' }
    } as const,
    wiseWood: {
        material: 'wood that was once part of a wise mystical tree',
        ephitet: { pre: 'Wise Mystical' }
    } as const,
    plyWood: {
        material: 'plywood',
        ephitet: { pre: 'Compliant' }
    } as const,
    cedarWood: {
        material: 'cedar wood',
        ephitet: { post: ' of the Cedar Copse', alliteratesWith: 'C' }
    } as const,
    ygdrassilWood: {
        material: 'the wood of Ygdrassil, the world tree',
        ephitet: mkGen((rng) => ephWizard.choice(rng))
    } as const,
    magicWood: {
        material: 'purple mageleaf wood',
        ephitet: mkGen((rng) => ephWizard.choice(rng))
    } as const,

    ivory: {
        material: 'ivory',
        ephitet: mkGen((rng) => ephWhite.choice(rng))
    } as const,

    hotHorn: mkGen((rng) => {
        const [creature, protrusionName] = hotAnimalHorn.generate(rng);

        return {
            material: `${creature} ${protrusionName}`,
            ephitet: { post: ` of the ${creature}`, alliteratesWith: creature[0].toUpperCase() }
        } as PartMaterial;
    }),
    coldHorn: mkGen((rng) => {
        const [creature, protrusionName] = coldAnimalHorn.generate(rng);

        return {
            material: `${creature} ${protrusionName}`,
            ephitet: { post: ` of the ${creature}`, alliteratesWith: creature[0].toUpperCase() }
        } as PartMaterial;
    }),
    magicHorn: mkGen((rng, weapon) => {
        const [creature, protrusionName] = magicAnimalHorn.generate(rng, weapon);

        return {
            material: `${creature} ${protrusionName}`,
            ephitet: { post: ` of the ${creature}`, alliteratesWith: creature[0].toUpperCase() }
        } as PartMaterial;
    }),
    darkLeather: mkGen((rng) => {
        const [creature, skinName] = darkAnimalSkin.generate(rng);

        function ephFor(val: typeof creature) {
            switch (val) {
                case 'elf':
                    return [{ post: " of the Dwarves" }, { post: " of the Dwarven Lords" }].choice(rng);
                case 'dwarf':
                    return [{ pre: "Dwarfslayer's" }].choice(rng);
                case 'human':
                    return [{ pre: "Manslayer's" }, { post: ' of the Cannibal' }].choice(rng);
                case 'orc':
                    return [{ pre: "Orcslayer's" }, { post: ' of Orc City' }].choice(rng);
                default:
                    return [{ pre: `${val}-Slayer's` }].choice(rng);
            }
        }

        return {
            material: `${creature} ${skinName}`,
            ephitet: ephFor(creature)
        } as PartMaterial;
    }),

    vitStone: {
        material: 'vitrified stone',
        ephitet: mkGen(rng => ephHot.choice(rng)),
    },

    silverPlated: {
        material: 'silver-plated steel',
        ephitet: { pre: 'Silvery' }
    } as const,
    goldPlated: {
        material: 'gold-plated steel',
        ephitet: { pre: 'Golden' }
    } as const,
    glass: {
        material: 'glass',
        ephitet: mkGen((rng) => ephTransparent.choice(rng))
    } as const,
    glassLikeSteel: {
        material: 'glass-like-steel',
        ephitet: mkGen((rng) => ephTransparent.choice(rng))
    } as const,
    force: {
        material: 'magical force',
        ephitet: mkGen((rng) => ephTransparent.choice(rng))
    } as const,
    light: {
        material: 'pure light',
        ephitet: mkGen((rng) => adjLight.choice(rng))
    } as const,
    darkness: {
        material: 'pure darkness',
        ephitet: mkGen((rng) => ephBlack.choice(rng))
    } as const,
    darkSteel: {
        material: 'shadow steel',
        ephitet: { post: ' of Shadows', alliteratesWith: 'S' }
    } as const,

    razors: {
        material: 'razor blades',
        ephitet: mkGen((rng) => ({ pre: ephSharp.choice(rng) }))
    } as const,

    iceLikeSteel: {
        material: 'magical ice as strong as steel',
        ephitet: mkGen((rng) => ephCold.choice(rng))
    } as const,
    iceBlood: {
        material: 'frozen blood',
        ephitet: mkGen((rng) => [...ephRed, ...ephCold].choice(rng))
    } as const,
    iceSlime: {
        material: 'frozen slime',
        ephitet: mkGen((rng) => [...ephCold].choice(rng))
    } as const,

    fossils: {
        material: 'various compacted fossils',
        ephitet: mkGen((rng) => ({ pre: ephOld.choice(rng) }))
    } as const,
    recursiveSwords: {
        material: mkGen((_rng, weapon) => `various smaller ${weapon.shape.particular}s, melded together into a single hunk`),
        ephitet: mkGen((rng) => ({ pre: ephOld.choice(rng) }))
    } as const,
    beetleShell: {
        material: 'beetle shell',
        ephitet: mkGen((rng) => ephBug.choice(rng))
    } as const,

    clockwork: {
        material: "a complex system of clockwork",
        ephitet: { pre: "Clockwork" }
    },
    acidium: {
        material: 'acidium',
        ephitet: { pre: 'Corrosive' }
    } as const,
    hardCandy: {
        material: 'ultra-hard candy',
        ephitet: mkGen(rng => choice(ephSweet, rng))
    } as const,
    rockCandy: {

        material: 'rock candy',
        ephitet: mkGen(rng => choice(ephSweet, rng))
    } as const,
    liquoriceRoot: {

        material: 'liquorice root',
        ephitet: { pre: 'Liquorice' }
    } as const,
    dateWood: {
        material: 'date tree wood',
        ephitet: mkGen(rng => choice(ephSweet, rng))
    } as const,

    ..._.reduce<(typeof golds)[number], Record<(typeof golds)[number], PartMaterial>>(golds, (acc, metal) => {
        acc[metal] = ({
            material: metal,
            ephitet: { pre: 'Golden' }
        } satisfies PartMaterial)
        return acc;
    }, {} as Record<(typeof golds)[number], PartMaterial>),

    ..._.mapKeys(simpleMaterials, x => x.material) as Record<(typeof simpleMaterials)[number]['material'], (typeof simpleMaterials)[number]>,
} as const satisfies Record<string, PartFeature | Generator<PartFeature, [Weapon]> | PartMaterial | Generator<PartMaterial, [Weapon]>>;

const amberGen = new StringGenerator(['a nodule of amber preserving an ancient ', mkGen((rng) => ['mosquito', 'fish', 'crustacean', 'lizard', 'dragonfly', 'hummingbird', 'shrew'].choice(rng))]);
const embeddedArr = [
    ['a ruby', ephRed],
    ['a garnet', ephRed],
    ["a tiger's eye stone", ephRed],
    ['an opal', ephHot],
    ['a piece of carnelian', ephRed],

    ["a citrine", ephGold],
    ["a topaz", ephGold],

    ['an emerald', ephGreen],
    ['a piece of green jade', ephGreen],

    ['a sapphire', ephBlue],
    ['a piece of lapis lazuli', ephBlue],
    ['a piece of blue jade', ephBlue],

    ['an amethyst', ephPurple],
    ['a piece of porphyry', ephPurple],

    ['a diamond', ephWhite],
    ['a piece of selenite', ephWhite],
    ['a tourmaline', ephRainbow],
    ['a pearl', [{ pre: 'Empearled' }]],

    ['a piece of eternal ice', ephCold],
    ['an onyx', ephBlack],
    ['a black pearl', [{ post: ' of the Oyster King', alliteratesWith: 'O' }] satisfies Ephitet[]],
    ['a dark sapphire', ephBlack],

    ['an acid diamond', ephAcid],
    ['a toxic pearl', ephAcid],
] as const satisfies [string, Ephitet[]][];

const eyeStructureGen = mkGen((rng, weapon: Weapon, plurality: 'singular' | 'plural') => choice([
    ["a single ", "eye", ""],
    ["a pair of ", "eyes", ""],
    ["three ", "eyes", " mounted in a triangle"],
    ["four ", "eyes", " mounted in two sets"],
    ...(weapon?.themes?.includes?.('dark') ? [
        ["a cluster of ", "eyes", ` mounted on ${plurality === 'singular' ? "it" : "them"}`],
        ["", "eyes", ` dotted randomly across ${plurality === 'singular' ? "it" : "them"}`]
    ] as const : []),
] as const, rng) satisfies readonly ["" | `${string} `, "eye" | "eyes", "" | `${string}`]);


const eyeColorGen = mkGen((rng, weapon: Weapon) => {
    const effects = {
        fire: ['orange', 'red', 'yellow'],
        ice: ['blue', 'cyan', 'white'],
        cloud: ['blue', 'cyan', 'white'],
        earth: ['orange', 'brown'],
        dark: ['jet black', 'red', 'black & red'],
        light: ['white', 'blue', 'yellow', 'grey'],
        sweet: ['white', 'red', 'pink'],
        sour: ['yellow', 'green', 'lime'],
        wizard: ['purple', 'blue', 'gold'],
        steampunk: ['white', 'grey', 'gold'],
        nature: ['green', 'brown', 'hazel', 'blue']
    } as const satisfies Record<Theme, string[]>;

    return effects[weapon.themes.choice(rng)].choice(rng);
});



const themedAnimals = {
    fire: ["a tiger's", "a lion's"],
    ice: ["a seal's"],
    cloud: [
        "a cuttlefish's",
        "an octopus'",
        "a hawk's",
        "an owl's",
        "an eagle's",
    ],
    earth: ["a mountain goat's"],
    dark: ["a snake's"],
    sweet: ["a cat's"],
    light: [
        "a hawk's",
        "an eagle's"
    ],
    sour: ["a frog's"],
    wizard: ["an owl's"],
    steampunk: ["an owl's"],
    nature: [
        "a mountain goat's",
        "a cuttlefish's",
        "an octopus'",
        "a hawk's",
        "an owl's",
        "an eagle's",
    ]
} as const satisfies Record<Theme, string[]>;
const themedAnimal = mkGen((rng, weapon: Weapon) => {

    const sharedAnimals = [
        "a wolf's",
        "a fox's",
        "a bear's",
    ] as const;

    return [...pickForTheme(weapon, themedAnimals, rng).chosen ?? [], ...sharedAnimals].choice(rng);
})

export const MISC_DESC_FEATURES = {
    embedded: {
        ..._.reduce<(typeof embeddedArr)[number], Record<(typeof embeddedArr)[number][0], PartFeature>>(embeddedArr, (acc, [thing, ephArr]) => {
            acc[thing] = ({
                descriptor: {
                    descType: 'possession',
                    singular: `${thing} embedded in it`,
                    plural: `${thing} embedded in them`
                },
                ephitet: mkGen((rng) => choice(ephArr as Ephitet[], rng))
            }) satisfies PartFeature;
            return acc;
        }, {} as Record<(typeof embeddedArr)[number][0], PartFeature>),
        amber: {
            descriptor: {
                descType: 'possession',
                singular: new StringGenerator([amberGen, ' embedded in it']),
                plural: new StringGenerator([amberGen, ' embedded in them']),
            },
            ephitet: mkGen((rng) => ({ pre: ephOld.choice(rng) }))
        } as PartFeature
    },
    charm: {
        puritySeal: {
            descriptor: {
                descType: 'possession',
                singular: 'pieces of scripture affixed to it, each with a wax seal',
                plural: 'pieces of scripture affixed to them, each with a wax seal',
            },
            ephitet: { pre: 'Sanctified' }
        },
        emojis: {
            descriptor: {
                descType: 'possession',
                singular: mkGen((rng) => mkCharms(rng, 'singular')),
                plural: mkGen((rng) => mkCharms(rng, 'plural')),

            }
        },
        shrunken: {
            descriptor: {
                descType: 'possession',
                singular: 'a shrunken head tied to it',
                plural: 'a shrunken head tied to them',
            },
            ephitet: { pre: 'Headhunter' }
        },
        beadsWrap: {
            descriptor: {
                descType: 'possession',
                singular: 'a chain of glass beads wrapped around it',
                plural: 'glass beads dangling from them'
            },
            ephitet: { pre: 'Beaded' }
        },
        silverChainWrap: {
            descriptor: {
                descType: 'possession',
                singular: 'intricate silver chains wrapped around it',
                plural: 'intricate silver chains wrapped around them',
            },
            ephitet: { pre: 'Silver' }
        },
        goldChainWrap: {
            descriptor: {
                descType: 'possession',
                singular: 'intricate golden chains wrapped around it',
                plural: 'intricate golden chains wrapped around them',
            },
            ephitet: { pre: 'Gilded' }
        },
        ironChain: {
            descriptor: {
                descType: 'possession',
                singular: 'iron chains wrapped around it',
                plural: 'iron chains wrapped around them',
            },
            ephitet: { pre: 'Chained' }
        },
        amethystChain: {
            descriptor: {
                descType: 'possession',
                singular: 'an amethyst bracelet wrapped around it',
                plural: 'amethyst bracelet bracelets wrapped around them',
            },
            ephitet: { pre: 'Chained' }
        },
        anyJewelChain: {
            descriptor: {
                descType: 'possession',
                singular: new StringGenerator(['a', mkGen(rng => [MATERIALS.ruby, MATERIALS.emerald, MATERIALS.sapphire, MATERIALS.diamond, MATERIALS.amethyst].choice(rng).material), 'bracelet wrapped around it']),
                plural: new StringGenerator(['', mkGen(rng => [MATERIALS.ruby, MATERIALS.emerald, MATERIALS.sapphire, MATERIALS.diamond, MATERIALS.amethyst].choice(rng).material), 'bracelets wrapped around them']),
            },
            ephitet: { pre: 'Bejewelled' }
        },
        silkWrap: {
            descriptor: {
                descType: 'possession',
                singular: 'a silk sash wrapped around it',
                plural: 'silk sashes wrapped around them'
            },
            ephitet: { pre: 'Silken' }
        },
        peacockFeather: {
            descriptor: {
                descType: 'possession',
                singular: 'a peacock feather pinned to it',
                plural: 'peacock feathers pinned to them'
            },
            ephitet: { post: ' of the Peacock' }

        }
    },
    coating: {
        volcanoCracks: {
            descriptor: {
                descType: 'property',
                singular: ' is flecked with fiery cracks',
                plural: ' are flecked with fiery cracks',
            },
            ephitet: { pre: 'Volcanic' }
        },
        glitter: {
            descriptor: {
                descType: 'possession',
                singular: 'small flecks of glitter embedded just below the surface',
                plural: 'small flecks of glitter embedded just below the surface',
            },
            ephitet: { pre: 'Glittering' }
        },
        caseHardened: {
            descriptor: {
                descType: 'property',
                singular: " is split into multicolored regions with psychedelic shapes",
                plural: " are split into multicolored regions with psychedelic shapes",
            },
            ephitet: { pre: 'Case Hardened' }
        },
        oil: {
            descriptor: {
                descType: 'property',
                singular: " shines like a rainbow when viewed from the right angle",
                plural: ' shine like a rainbow when viewed from the right angle',
            },
            ephitet: mkGen((rng) => ephRainbow.choice(rng))
        },
        flames: mkGen((_, weapon) => {
            const colorByRarity = {
                common: "yellow",
                uncommon: weapon.isNegative ? "green" : "orange",
                rare: weapon.isNegative ? "blue" : "red",
                epic: weapon.isNegative ? "pink" : "purple",
                legendary: weapon.isNegative ? "white" : "cyan"
            } satisfies Record<WeaponRarity, string>;
            return {
                descriptor: {
                    descType: 'possession',
                    singular: `patterns on its surface depicting ${colorByRarity[weapon.rarity]} flames radiating outwards from the base`,
                    plural: `patterns on their surface depicting ${colorByRarity[weapon.rarity]} flames radiating outwards from the base`
                }
                ,
                ephitet: mkGen(rng => ephHot.choice(rng)),
            };
        }),
        pearlescent: mkGen((rng, weapon) => {
            const gradients = {
                common: ['pink and white', 'blue and white', 'yellow and white', 'green and white'],
                uncommon: ['green and blue', 'red and yellow', 'pink and purple'],
                rare: ['pink and blue', 'green and pink'],
                epic: ['purple and orange', 'cyan and pink', 'pink and orange', 'yellow and blue'],
                legendary: ['cyan, pink, and yellow', 'red, green, and blue', 'purple, green, and blue', 'pink, white, and blue', 'orange, white, and pink']
            } satisfies Record<WeaponRarity, string[]>;

            const gradient = gradients[weapon.rarity].choice(rng);

            return {
                descriptor: {
                    descType: 'property',
                    singular: ` has a sheen that changes between ${gradient} depending on the viewing angle`,
                    plural: ` have a sheen that changes between ${gradient} depending on the viewing angle`
                },
                ephitet: mkGen((rng) => ephRainbow.choice(rng))
            }
        }),
        squiggles: mkGen((rng) => {
            const desc = choice(['tin', 'silver', 'gold', 'amethyst', 'sapphire'] as const, rng);
            return {
                descriptor: {
                    descType: 'property',
                    singular: ` is covered in squiggly grooves, lined with ${desc}`,
                    plural: ` are covered in squiggly grooves, lined with ${desc}`
                },
                ephitet: { pre: 'Byzantine' } as Ephitet
            }
        }),
        celestialEngraving: mkGen((rng, weapon) => {
            const glows = gte(weapon.rarity, 'rare') || weapon.themes.includes('light');

            return ({
                descriptor: {
                    descType: 'property',
                    singular: ` is engraved with ${glows ? "luminous " : ""}depictions of the constellations`,
                    plural: ` are engraved with ${glows ? "luminous " : ""}depictions of the constellations`
                },
                ephitet: choice(ephWizard, rng) as Ephitet
            });
        }),
        wizardEngraving: mkGen((rng, weapon) => {
            const magi = choice([
                'a wizard', 'a sorcerer', 'an enchantress', 'a magi',
                ...(weapon?.themes?.includes?.('dark') ? ['a dark magician', 'a witch'] : []),
                ...(weapon?.themes?.includes?.('fire') ? ['a pyromancer'] : []),
                ...(weapon?.themes?.includes?.('ice') ? ['a cryomancer'] : []),
                ...(weapon?.themes?.includes?.('cloud') ? ['a hydromancer'] : []),
            ] as const, rng);

            return {
                descriptor: {
                    descType: 'property',
                    singular: ` is engraved with a portrait of ${magi}`,
                    plural: ` are engraved with depictions of duelling wizards`
                },
                ephitet: choice(ephWizard, rng) as Ephitet
            }
        }),
        animalEngraving: mkGen((rng, weapon) => {
            const pluralAnimal = choice([
                "dogs", "cats", "parrots", "owls", "mice", "snails", "bears", "lions", "badgers", "foxes", "spiders",
                ...(weapon?.themes?.includes?.('dark') ? ['crocodiles', 'sharks', 'snakes'] : []),
                ...(weapon?.themes?.includes?.('cloud') ? ["fish", "whales"] : []),
                ...(weapon?.themes?.includes?.('fire') ? ["rhinos", "gazelles", "buffallos", "impalas", "ibexes", "zebras", "giraffes", "crocodiles"] : []),
                ...(weapon?.themes?.includes?.('ice') ? ["aurochs", "mammoths", "mountain goats", "walruses", "narwhals", "reindeer"] : []),
            ] as const, rng);

            return {
                descriptor: {
                    descType: 'property',
                    singular: ` is engraved with depictions of dancing ${pluralAnimal}`,
                    plural: ` are engraved with depictions of dancing ${pluralAnimal}`
                },
                ephitet: choice(ephWizard, rng) as Ephitet
            }
        }),
        // warriorEngraving: {},
        // tricksterEngraving: {},
        pitted: {
            descriptor: {
                descType: 'property',
                singular: ' is pitted and scratched',
                plural: ' are pitted and scratched'
            },
            ephitet: mkGen(rng => ephAcid.choice(rng))
        },
        acidBurned: {
            descriptor: {
                descType: 'property',
                singular: ' has a number of dark and discolored sections',
                plural: ' have a number of dark and discolored sections'
            },
            ephitet: mkGen(rng => ephAcid.choice(rng))
        }
    },
    glyph: {
        oldCoatOfArms: {
            descriptor: {
                descType: 'possession',
                singular: 'the coat of arms of an ancient dynasty emblazoned on it',
                plural: 'the coat of arms of an ancient dynasty emblazoned on them',
            },
            ephitet: { pre: 'Heraldic' }
        },
        // TODO
        // artDeco: {},
        // artNoveau: {},
        // islamicGeometric: {}
    },
    sensorium: {
        eyes: {
            animalistic: {
                descriptor: {
                    descType: 'possession',
                    singular: mkGen((rng, weapon) => {
                        const [quantity, eye, arrangement] = eyeStructureGen.generate(rng, weapon, 'singular');
                        const color = eyeColorGen.generate(rng, weapon);
                        const animal = themedAnimal.generate(rng, weapon);

                        return `${quantity}${color} ${eye} shaped like ${animal}${arrangement}`;
                    }),
                    plural: mkGen((rng, weapon) => {
                        const [quantity, eye, arrangement] = eyeStructureGen.generate(rng, weapon, 'plural');
                        const color = eyeColorGen.generate(rng, weapon);
                        const animal = themedAnimal.generate(rng, weapon);

                        return `${quantity}${color} ${eye} shaped like ${animal}${arrangement}`;
                    }),
                },
            },
            deepSet: {
                descriptor: {
                    descType: 'possession',
                    singular: mkGen((rng, weapon) => {
                        const [quantity, eye, arrangement] = eyeStructureGen.generate(rng, weapon, 'singular');
                        const color = eyeColorGen.generate(rng, weapon);

                        return `${quantity}${color} ${eye}${arrangement}${arrangement === "" ? "" : ","} indented slightly into the surface`;
                    }),
                    plural: mkGen((rng, weapon) => {
                        const [quantity, eye, arrangement] = eyeStructureGen.generate(rng, weapon, 'plural');
                        const color = eyeColorGen.generate(rng, weapon);

                        return `${quantity}${color} ${eye}${arrangement}${arrangement === "" ? "" : ","} indented slightly into the surface`;
                    })
                },
            },
            beady: {
                descriptor: {
                    descType: 'possession',
                    singular: mkGen((rng, weapon) => {
                        const [quantity, eye, arrangement] = eyeStructureGen.generate(rng, weapon, 'singular');
                        const color = eyeColorGen.generate(rng, weapon);

                        return `${quantity}beady ${color} ${eye}${arrangement}`;
                    }),
                    plural: mkGen((rng, weapon) => {
                        const [quantity, eye, arrangement] = eyeStructureGen.generate(rng, weapon, 'plural');
                        const color = eyeColorGen.generate(rng, weapon);

                        return `${quantity}beady ${color} ${eye}${arrangement}`;
                    }),
                },
            },
        }
    }

} as const satisfies Record<string, Record<string, PartFeature | Generator<PartFeature, [Weapon]>> | Record<string, Record<string, PartFeature | Generator<PartFeature, [Weapon]>>>>;


// weapon parts

export const allParts = ['barrel', 'blade', 'blades', 'body', 'crossguard', 'grip', 'axeHead', 'maceHead', 'maceHeads', 'limbs', 'pommel', 'quiver', 'shaft', 'spearShaft', 'string', 'tip'] as const satisfies WeaponPartName[];

/**
 * The main / signature part the weapon
 */
export const businessEndParts = ['blade', 'blades', 'tip', 'prongs', 'axeHead', 'maceHead', 'maceHeads', 'body'] as const satisfies WeaponPartName[];


/** Parts of a weapon specialised for striking and clashing, usually made of metal.
*/
export const hardNonHoldingParts = ['blade', 'blades', 'tip', 'prongs', 'axeHead', 'maceHead', 'maceHeads', 'barrel', 'crossguard', 'pommel', 'chain', 'chains'] as const satisfies WeaponPartName[];

/**
 * Parts of a weapon that are used to hold it. Usually made of wood.
 */
export const holdingParts = ['body', 'grip', 'limbs', 'spearShaft'] as const satisfies WeaponPartName[];


/**
 * Parts of a weapon that a sentient weapon's eyes can be placed on.
 */
export const eyeAcceptingParts = ['crossguard', 'axeHead', 'maceHead', 'maceHeads', 'chain', 'chains', 'tip', 'prongs', 'body', 'base', 'quiver', 'limbs', 'rifleSight'] as const satisfies WeaponPartName[];

/**
 * Parts of a weapon that could have something wrapped around them (like a string or piece of cloth).
 */
export const wrappableParts = ['grip', 'crossguard', 'barrel', 'shaft', 'quiver', 'body', 'spearShaft'] as const satisfies WeaponPartName[];

/**
 * Parts of a weapon that a small object such as a gem could be embedded in.
 */
export const embeddableParts = ['crossguard', 'spearShaft', 'pommel', 'base', 'quiver', 'maceHead', 'maceHeads', 'chain'] as const satisfies WeaponPartName[];


/**
 * Parts of a weapon that visual indicators of a resource can go on.
 */
export const counterAcceptingParts = ['blade', 'body', 'shaft', 'spearShaft', 'maceHead', 'maceHeads', 'blades', 'limbs'] as const satisfies WeaponPartName[];

export const counterCapacityByRarity = {
    common: 2,
    uncommon: 2,
    rare: 3,
    epic: 4,
    legendary: 5
} as const satisfies Record<WeaponRarity, number>;

export const streakCapacityByRarity = {
    common: 4,
    uncommon: 4,
    rare: 4,
    epic: 6,
    legendary: 6
} as const satisfies Record<WeaponRarity, number>;

type GroupElement = {
    /**
     * UUID of the feature associated with this thing.
     */
    featureUUID: string;
};
/**
 * This function that enables descriptors to coordinate with other similar descriptors that may already be on a weapon.
 * @param source 
 * @parma maxInGroup ther
 * @param weapon 
 * @param rng 
 * @returns 
 */
export function pickOrLinkWithElement<TElem extends GroupElement = { featureUUID: string }, TTheme extends Theme = Theme, TSource extends Record<TTheme, TElem | TElem[]> = Record<TTheme, TElem | TElem[]>,>(source: TSource, maxInGroup: number, fallback: TElem, weapon: WeaponGivenThemes<[TTheme, ...TTheme[]]>, rng: PRNG): TElem & { theme: keyof TSource | 'void' } {

    function tryGetExisting(weapon: WeaponGivenThemes<[TTheme, ...TTheme[]]>): (TElem & { theme: TTheme })[] {
        const flatElem = [];
        for (const [k, v] of _.entries<TElem>(source)) {
            if (v instanceof Array) {
                v.forEach(core => flatElem.push({ ...core, theme: k as TTheme }))
            }
            else {
                flatElem.push({ ...v, theme: k as TTheme });
            }
        }

        // get a random core that is already present on the weapon. 
        // so long as this function is the only way to acquire a core, there should only ever be zero-or-one cores on the weapon
        const weaponUUIDs = gatherUUIDs(weapon);

        return flatElem.filter(x => weaponUUIDs.has(x.featureUUID));
    }

    function getNewCore(weapon: WeaponGivenThemes<[TTheme, ...TTheme[]]>, rng: PRNG): (TElem & { theme: TTheme | 'void' }) {
        const { chosen, theme } = pickForTheme(weapon, source, rng);
        const chosenOrFallBack = chosen ?? { ...fallback, theme: 'void' };
        return { ...(chosenOrFallBack instanceof Array ? chosenOrFallBack.choice(rng) : chosenOrFallBack), theme: theme ?? 'void' };
    }

    // get all the existing elements
    const existing = tryGetExisting(weapon);

    /* If the number of elements in this group that are already present on the weapon is at-or-over the maximum, pick one of the existing ones.
     * Otherwise generate a new one.
     */
    return existing.length >= maxInGroup ? existing.choice(rng) : getNewCore(weapon, rng);
}


interface WeaponEnergyCore extends GroupElement {
    /**
     * Adjective for the effect, for active power titles.
     */
    adj: string;
    /**
     * Descriptor for the effect, for power descriptions.
     * @example
     * "ultraviolet energy", "ice wind", "fire"
     */
    desc: string;
};

const wizardColoredEnergy = [
    {
        adj: 'Ultraviolet',
        desc: 'ultraviolet energy',
        featureUUID: 'energy-core-ultraviolet'
    },
    {
        adj: 'Azure',
        desc: 'azure energy',
        featureUUID: 'energy-core-azure'
    },
    {
        adj: 'Golden',
        desc: 'golden energy',
        featureUUID: 'energy-core-gold'
    },
] satisfies WeaponEnergyCore[];

const cores = {
    ice: {
        adj: 'Icy',
        desc: 'icy wind',
        featureUUID: 'energy-core-ice'
    },
    fire: {
        adj: 'Fiery',
        desc: 'fire',
        featureUUID: 'energy-core-fire'
    },

    cloud: {
        adj: 'Coruscating',
        desc: 'lightning',
        featureUUID: 'energy-core-aether'
    },

    light: [
        ...wizardColoredEnergy,
        {
            adj: 'Crimson',
            desc: 'crimson energy',
            featureUUID: 'energy-core-crimson'
        },
        {
            adj: 'Verdant',
            desc: 'green energy',
            featureUUID: 'energy-core-verdant'
        }
    ],
    sour: [
        {
            adj: 'Atomic',
            desc: 'atomic energy',
            featureUUID: 'energy-core-atomic'
        }
    ],
    dark: {
        adj: 'Dark',
        desc: 'dark energy',
        featureUUID: 'energy-core-dark'
    },

    wizard: [...wizardColoredEnergy, {
        adj: 'Arcane',
        desc: 'arcane energy',
        featureUUID: 'energy-core-wizard'
    }],
    steampunk: {
        adj: 'Fulminating',
        desc: 'lightning',
        featureUUID: 'energy-core-steampunk'
    },
    nature: {
        adj: 'Overgrown',
        desc: 'green energy',
        featureUUID: 'energy-core-nature'
    }
} as const satisfies Partial<Record<Theme, WeaponEnergyCore | WeaponEnergyCore[]>>;

export type PossibleCoreThemes = keyof typeof cores;

/**
 * If the weapon already has an energy core, get that one. Otherwise roll one at random.
 */
export function pickOrLinkWithEnergyCore(weapon: WeaponGivenThemes<[keyof typeof cores, ...(keyof typeof cores)[]]>, rng: PRNG) {
    const fallback = {
        adj: 'Void',
        desc: 'void energy',
        featureUUID: 'energy-core-void'
    } as const satisfies WeaponEnergyCore;


    return pickOrLinkWithElement<WeaponEnergyCore, keyof typeof cores>(cores, 1, fallback, weapon, rng)
}