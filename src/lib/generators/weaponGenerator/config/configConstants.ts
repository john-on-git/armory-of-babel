import { coldBiomeHorn as coldAnimalHorn, darkAnimalSkin, coldBiomeHorn as hotAnimalHorn, magicAnimalHorn } from "$lib/generators/foes";
import { mkGen, StringGenerator, type TGenerator } from "$lib/generators/recursiveGenerator";
import type { Descriptor, DescriptorText, Ephitet, Theme, Weapon, WeaponPartName, WeaponRarity, WeaponShapeGroup } from "$lib/generators/weaponGenerator/weaponGeneratorTypes";
import { choice } from "$lib/util/choice";
import { titleCase } from "$lib/util/string";
import _ from "lodash";
import type { PRNG } from "seedrandom";

// shapes

export const edgedWeaponShapeFamilies = ['dagger', 'sword', 'greatsword', 'axe', 'greataxe', 'polearm', 'sword (or bow)', 'dagger (or pistol)', 'sword (or musket)', 'greataxe (or musket)'] as const satisfies WeaponShapeGroup[];
export const bluntWeaponShapeFamilies = ['club', 'mace', 'staff'] as const satisfies WeaponShapeGroup[];
export const pointedWeaponShapeFamilies = ['spear', 'lance'] as const satisfies WeaponShapeGroup[];

export const swordlikeWeaponShapeFamilies = ['dagger', 'sword', 'greatsword', 'sword (or bow)', 'dagger (or pistol)', 'sword (or musket)'] as const satisfies WeaponShapeGroup[];
export const grippedWeaponShapeFamilies = ['dagger', 'sword', 'greatsword', 'axe', 'greataxe', 'polearm', 'sword (or bow)', 'dagger (or pistol)', 'sword (or musket)', 'greataxe (or musket)', 'club', 'mace'] as const satisfies WeaponShapeGroup[];
export const twoHandedWeaponShapeFamilies = ['staff', 'spear', 'polearm', 'greataxe', 'greatsword', 'sword (or musket)', 'greataxe (or musket)'] as const satisfies WeaponShapeGroup[]

export const shapeFamiliesWithoutPommels = ['club', 'staff'] as const satisfies WeaponShapeGroup[];

export const animeWeaponShapes = ['Tanto', 'Katana', "Naginata", "Nodachi", "Keyblade", "Transforming Sniper Scythle"] as const;
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
    } satisfies Descriptor)),

    // boring materials (cannot be the source of an ephitet)
    ..._.map([
        'copper',
        'tin',
        'bronze',
        'iron',
        'steel',
    ] as const, (metal) => ({
        material: metal,
    } satisfies Descriptor))
] satisfies Descriptor[];


const golds = ['gold', 'rose gold', 'white gold', 'purple gold', 'blue gold'] as const;

// export const eph_TEMPLATE = [] satisfies Ephitet[];

const ephSharp = ['Vorpal', 'Razor', 'Jagged', 'Agonizing', 'Spiked'];
export const ephCold = [{ pre: "Icebound" }, { pre: "Frostbound" }, { pre: "Frigid" }, { pre: "Silent" }, { post: " of the North Star" }, { pre: "Frostbound" }, { pre: "Icebound" }] satisfies Ephitet[];
export const ephHot = [{ pre: 'Fiery' }, { pre: 'Blazing' }, { post: ' of the Bonfire Keeper' }, { post: ' of the Scorchlands' }, { pre: 'Burning' }] satisfies Ephitet[];
const ephOld = ['Ancient', 'Abyssal', 'Primeval', 'Enduring', 'Primordial', 'Antediluvian'];
export const ephSky = [{ pre: 'Cloudborn' }, { pre: 'Zephyr' }, { post: ' of the Zephyr' }, { post: ' of the Skylands' }, { post: ' of the Cloud Giants' }, { post: ' of the Butterfly Lords' }, { post: ' of the Valkyrie Queen' }] satisfies Ephitet[];
export const ephWizard = [{ post: ' of the Wizard' }, { post: ' of Stars' }, { post: ' of the Cosmos' }] satisfies Ephitet[];
export const ephExplorer = [{ pre: "Explorer's" }, { pre: "Navigator's" }, { pre: "Pathfinder's" }, { post: ' of the Explorer' }, { post: ' of the Navigator' }] satisfies Ephitet[];
export const ephSteampunk = [...ephExplorer, { post: ' of the Empire' }, { pre: 'Clockwork' }, { pre: 'Machine' }, { pre: 'Steam-Powered' }, { pre: 'Automatic' }] satisfies Ephitet[];

const ephAcid = [{ pre: 'Toxic' }, { pre: 'Corrosive' }] satisfies Ephitet[];
const ephBug = [{ pre: 'Verminous' }, { post: " of the Isopod" }, { post: " of the Beetle" }, { post: " of the Queen Bee" }, { post: " of the Swarm" }, { post: " of the Hive" }] satisfies Ephitet[];

export const ephTransparent = [{ pre: 'Glass' }, { post: ' of Glass' }, { pre: 'Translucent' }] satisfies Ephitet[];
export const ephGlowy = [{ pre: 'Brilliant' }, { pre: 'Radiant' }, { pre: 'Luminous' }, { pre: 'Glowing' }, { pre: 'Prismatic' }];

export const ephWhite = [{ pre: 'White' }, { pre: 'Pale' }, { pre: 'Fair' }, { pre: 'Lucent' }, { pre: 'Pallid' }, { pre: 'Ivory' }, { post: ' of Selene' }] satisfies Ephitet[];
export const ephBlack = [{ pre: 'Dark' }, { pre: 'Stygian' }, { pre: 'Abyssal' }, { post: ' of Chaos' }, { pre: 'Chaotic' }, { pre: 'Shadow-Wreathed' }, { post: ' of Shadows' }];
export const ephRainbow = [{ pre: 'Prismatic' }, { post: ' of Rainbows' }, { pre: 'Variegated' }, { pre: 'Multicolored' }, { pre: 'Kaleidosopic' }, { pre: 'Polychromatic' }]

export const ephRed = [{ pre: 'Crimson' }, { pre: 'Blood Stained' }, { pre: 'Bloody' }, { pre: 'Sanguine' }, { pre: 'Ruby' }, { post: ' of the King in Red' }] satisfies Ephitet[];
// TODO these need more stuff
export const ephPurple = [{ pre: 'Purple' }, { pre: 'Ultraviolet' }] satisfies Ephitet[];
export const ephBlue = [{ pre: 'Blue' }, { pre: 'Cerulean' }, { pre: 'Azure' }, { pre: 'Sapphire' }] satisfies Ephitet[];
export const ephGreen = [{ pre: 'Green' }, { pre: 'Emerald' }, { post: ' of Val Verde' }] satisfies Ephitet[];
export const ephGold = [{ pre: 'Golden' }, { pre: 'Auric' }, { post: ' of the Sun' }, { post: ' of Ra' }] satisfies Ephitet[];


export const MATERIALS = {
    lemonWood: {
        material: 'lemon tree wood',
        ephitet: mkGen((rng) => [{ pre: 'Lemony' }, { post: ' of the Lemon Lord' }].choice(rng))
    } as const,
    oak: {
        material: 'oak wood',
        ephitet: { pre: 'Oaken' }
    } as const,
    pine: {
        material: 'pine wood',
        ephitet: { post: ' of the Tundra' }
    } as const,
    cherryNormal: {
        material: 'cherry wood',
        ephitet: { pre: 'Cherry' }
    } as const,
    cherryAnime: {
        material: 'cherry wood',
        ephitet: { post: ' of the Sakura Forest' }
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
        ephitet: { pre: 'Iron' }
    } as const,
    aetherWood: {
        material: 'wood from a sky-land tree',
        ephitet: mkGen((rng) => [{ post: ' of the Skylands' }, { post: ' of the Skies' }].choice(rng))
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
        ephitet: { post: ' of the Cedar Copse' }
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
            ephitet: { post: ` of the ${creature}` }
        } as Descriptor;
    }),
    coldHorn: mkGen((rng) => {
        const [creature, protrusionName] = coldAnimalHorn.generate(rng);

        return {
            material: `${creature} ${protrusionName}`,
            ephitet: { post: ` of the ${creature}` }
        } as Descriptor;
    }),
    magicHorn: mkGen((rng) => {
        const [creature, protrusionName] = magicAnimalHorn.generate(rng);

        return {
            material: `${creature} ${protrusionName}`,
            ephitet: { post: ` of the ${creature}` }
        } as Descriptor;
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
                    return { post: ` of the ${creature}` };
            }
        }

        return {
            material: `${creature} ${skinName}`,
            ephitet: ephFor(creature)
        } as Descriptor;
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
        ephitet: mkGen((rng) => ephGlowy.choice(rng))
    } as const,
    darkness: {
        material: 'pure darkness',
        ephitet: mkGen((rng) => ephBlack.choice(rng))
    } as const,
    darkSteel: {
        material: 'shadow steel',
        ephitet: { post: ' of Shadows' }
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
        ephitet: { pre: 'Candied' }
    } as const,
    rockCandy: {

        material: 'rock candy',
        ephitet: { pre: 'Candied' }
    } as const,
    liquoriceRoot: {

        material: 'liquorice root',
        ephitet: { pre: 'Liquorice' }
    } as const,
    dateWood: {
        material: 'date tree wood',
        ephitet: { pre: 'Candied' }
    } as const,

    ..._.reduce<(typeof golds)[number], Record<(typeof golds)[number], Descriptor>>(golds, (acc, metal) => {
        acc[metal] = ({
            material: metal,
            ephitet: { pre: 'Golden' }
        } satisfies Descriptor)
        return acc;
    }, {} as Record<(typeof golds)[number], Descriptor>),

    ..._.mapKeys(simpleMaterials, x => x.material) as Record<(typeof simpleMaterials)[number]['material'], (typeof simpleMaterials)[number]>,
} as const satisfies Record<string, Descriptor | TGenerator<Descriptor, [Weapon]>>;

const amberGen = new StringGenerator(['a nodule of amber preserving an ancient ', mkGen((rng) => ['mosquito', 'crustacean', 'lizard', 'dragonfly', 'hummingbird'].choice(rng))]);
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
    ['a black pearl', [{ post: ' of the Oyster King' }]],
    ['a dark sapphire', ephBlack],

    ['acid diamond', ephAcid],
    ['toxic pearl', ephAcid],
] as const;

const eyeStructureGen = mkGen((rng, weapon: Weapon) => [
    `one large eye: it's ${eyeColorGen.generate(rng, weapon)}`,
    `a pair of eyes: they're ${eyeColorGen.generate(rng, weapon)}`,
    `three eyes mounted in a triangle: they're ${eyeColorGen.generate(rng, weapon)}`,
    `four eyes mounted in two sets: they're ${eyeColorGen.generate(rng, weapon)}`,
    `a cluster of eyes: they're ${eyeColorGen.generate(rng, weapon)}`,
].choice(rng));

const eyeColorGen = mkGen((rng, weapon: Weapon) => {
    const effects = {
        fire: ['orange', 'red', 'yellow'],
        ice: ['blue', 'cyan', 'white'],
        cloud: ['blue', 'cyan', 'entirely white'],
        earth: ['orange', 'brown'],
        dark: ['jet black', 'red', 'black with a red spiral'],
        light: ['entirely white', 'blue', 'yellow', 'grey'],
        sweet: ['white', 'red', 'pink'],
        sour: ['yellow', 'green', 'lime'],
        wizard: ['purple', 'blue', 'gold'],
        steampunk: ['white', 'grey', 'gold'],
        nature: ['green', 'brown', 'hazel', 'blue']
    } satisfies Record<Theme, string[]>;

    return effects[weapon.themes.choice(rng)].choice(rng);
});

const eyeAnimalsArr = [
    "a mountain goat's",
    "a cuttlefish's",
    "an octopus'",
    "a wolf's",
    "a fox's",
    "a bear's",
    "a snake's",
    "a hawk's",
    "an owl's",
    "an eagle's",
    "a seal's",
    "a tiger's",
    "a lion's",
    "a crow's"
] as const;

export const MISC_DESC_FEATURES = {
    embedded: {
        ..._.reduce<(typeof embeddedArr)[number], Record<(typeof embeddedArr)[number][0], Descriptor>>(embeddedArr, (acc, [thing, ephArr]) => {
            acc[thing] = ({
                descriptor: {
                    descType: 'possession',
                    singular: `${thing} embedded in it`,
                    plural: `${thing} embedded in them`
                },
                ephitet: mkGen((rng) => choice(ephArr, rng))
            }) satisfies Descriptor;
            return acc;
        }, {} as Record<(typeof embeddedArr)[number][0], Descriptor>),
        amber: {
            descriptor: {
                descType: 'possession',
                singular: new StringGenerator([amberGen, 'embedded in it']),
                plural: new StringGenerator([amberGen, 'embedded in them']),
            },
            ephitet: mkGen((rng) => ({ pre: ephOld.choice(rng) }))
        } as Descriptor
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

            },
            ephitet: { pre: 'Charming' }
        },
        shrunken: {
            descriptor: {
                descType: 'possession',
                singular: 'a shrunken head tied to it',
                plural: 'a shrunken head tied to them',
            },
            ephitet: { pre: 'Headhunter' }
        },
    },
    coating: {
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
                singular: "split into multicolored regions with psychedelic shapes",
                plural: "split into multicolored regions with psychedelic shapes",
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
                uncommon: "orange",
                rare: "red",
                epic: "purple",
                legendary: "cyan"
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
                common: ['pink and white', 'blue and white', 'yellow and white'],
                uncommon: ['green and blue', 'red and yellow', 'pink and purple'],
                rare: ['pink and blue', 'green and pink'],
                epic: ['purple and orange', 'cyan and orange', 'yellow and blue'],
                legendary: ['pink, yellow, and blue', 'cyan, blue, and purple', 'purple, green, and blue']
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
        })
    },
    wrap: {
        bannerWrap: {
            descriptor: {
                descType: 'possession',
                singular: 'the flag of an ancient realm wrapped around it',
                plural: 'the flags of ancient realms wrapped around them',
            },
            ephitet: { pre: 'Bannered' }
        },
        pirateWrap: {
            descriptor: {
                descType: 'possession',
                singular: 'a scrap of a jolly roger wrapped around it',
                plural: 'the scraps of a jolly roger wrapped around them',
            },
            ephitet: { pre: "Pirate" }
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
    },
    sensorium: {
        // mouth: {},
        eyes: {
            animalistic: {
                descriptor: {
                    descType: 'possession',
                    singular: new StringGenerator([eyeStructureGen, ' and shaped like ', mkGen((rng) => [...eyeAnimalsArr].choice(rng))]),
                    plural: new StringGenerator([eyeStructureGen, ' and shaped like ', mkGen((rng) => [...eyeAnimalsArr].choice(rng))]),
                },
            },
            deepSet: {
                descriptor: {
                    descType: 'possession',
                    singular: new StringGenerator([eyeStructureGen, ", and idented slightly into the surface",]),
                    plural: new StringGenerator([eyeStructureGen, ", and idented slightly into the surface"])
                },
            },
            beady: {
                descriptor: {
                    descType: 'possession',
                    singular: new StringGenerator([eyeStructureGen, ', round and beady']),
                    plural: new StringGenerator([eyeStructureGen, ', round and beady']),
                },
            },
        }
    }

} as const satisfies Record<string, Record<string, Descriptor | TGenerator<Descriptor, [Weapon]>> | Record<string, Record<string, Descriptor | TGenerator<Descriptor, [Weapon]>>>>;


// weapon parts

export const allParts = ['barrel', 'blade', 'blades', 'body', 'crossguard', 'grip', 'head', 'heads', 'limbs', 'orb', 'pommel', 'quiver', 'shaft', 'string', 'tip'] as const satisfies WeaponPartName[];

/**
 * The main / signature part the weapon
 */
export const importantPart = ['blade', 'blades', 'tip', 'head', 'heads', 'body'] as const satisfies WeaponPartName[];


/** Parts of a weapon specialised for striking and clashing, usually made of metal.
*/
export const hardNonHoldingParts = ['blade', 'blades', 'tip', 'head', 'heads', 'barrel', 'crossguard', 'pommel', 'chain', 'chains'] as const satisfies WeaponPartName[];

/**
 * Parts of a weapon that are used to hold it. Usually made of wood.
 */
export const holdingParts = ['body', 'grip', 'limbs'] as const satisfies WeaponPartName[];


/**
 * Parts of a weapon that a sentient weapon's eyes can be placed on.
 */
export const eyeAcceptingParts = ['crossguard', 'head', 'heads', 'chain', 'chains', 'tip', 'body', 'base', 'quiver', 'limbs'] as const satisfies WeaponPartName[];

/**
 * Parts of a weapon that a sentient weapon's mouth can be placed on.
 */
export const mouthAcceptingParts = ['blade', 'blades', 'barrel', 'orb', 'head', 'heads', 'tip', 'base', 'quiver'] as const satisfies WeaponPartName[];

/**
 * Parts of a weapon that could have something wrapped around them (like a string or piece of cloth).
 */
export const wrappableParts = ['grip', 'crossguard', 'barrel', 'shaft', 'quiver', 'body'] as const satisfies WeaponPartName[];

/**
 * Parts of a weapon that a small object such as a gem could be embedded in.
 */
export const embeddableParts = ['crossguard', 'pommel', 'base', 'quiver', 'head', 'chain'] as const satisfies WeaponPartName[];