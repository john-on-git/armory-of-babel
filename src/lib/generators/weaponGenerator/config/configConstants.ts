import { coldBiomeHorn as coldAnimalHorn, darkAnimalSkin, coldBiomeHorn as hotAnimalHorn } from "$lib/generators/foes";
import { mkGen, StringGenerator, type TGenerator } from "$lib/generators/recursiveGenerator";
import type { Descriptor, DescriptorText, Ephitet, Weapon, WeaponPartName, WeaponShapeGroup } from "$lib/generators/weaponGenerator/weaponGeneratorTypes";
import { capFirst } from "$lib/util/string";
import _ from "lodash";
import type { PRNG } from "seedrandom";

// shapes

export const edgedWeaponShapeFamilies = ['dagger', 'sword', 'greatsword', 'axe', 'greataxe', 'polearm', 'sword (or bow)', 'dagger (or pistol)', 'sword (or musket)', 'greataxe (or musket)'] as const satisfies WeaponShapeGroup[];
export const bluntWeaponShapeFamilies = ['club', 'mace', 'staff'] as const satisfies WeaponShapeGroup[];
export const pointedWeaponShapeFamilies = ['spear', 'lance'] as const satisfies WeaponShapeGroup[];
export const sharpWeaponShapeFamilies = [...edgedWeaponShapeFamilies, ...pointedWeaponShapeFamilies] as const satisfies WeaponShapeGroup[];

export const swordlikeWeaponShapeFamilies = ['dagger', 'sword', 'greatsword', 'sword (or bow)', 'dagger (or pistol)', 'sword (or musket)'] as const satisfies WeaponShapeGroup[];
export const grippedWeaponShapeFamilies = ['dagger', 'sword', 'greatsword', 'axe', 'greataxe', 'polearm', 'sword (or bow)', 'dagger (or pistol)', 'sword (or musket)', 'greataxe (or musket)', 'club', 'mace'] as const satisfies WeaponShapeGroup[];

export const animeWeaponShapes = ['Tanto', 'Katana', "Naginata", "Nodachi", "Keyblade", "Transforming Sniper Scythle"];

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
        'iron',
        'steel',

        'terracotta',
        'porcelain',

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
        ephitet: { pre: capFirst(metal) }
    } satisfies Descriptor))] satisfies Descriptor[];


const golds = ['gold', 'rose gold', 'white gold', 'purple gold', 'blue gold'] as const;

const ephSharp = ['Vorpal', 'Razor', 'Jagged', 'Agonizing', 'Spiked'];
const ephCold = [{ pre: "Icy" }, { pre: "Frigid" }, { pre: "Silent" }, { post: "of the North Star" }, { pre: "Frostbound" }, { pre: "Icebound" }] satisfies Ephitet[];
const ephOld = ['Ancient', 'Abyssal', 'Primeval', 'Enduring', 'Primordial', 'Antediluvian'];

const ephTransparent = [{ pre: 'Glass' }, { post: 'of Glass' }, { pre: 'Translucent' }] satisfies Ephitet[];
const ephGlowy = [{ pre: 'Brilliant' }, { pre: 'Radiant' }, { pre: 'Luminous' }, { pre: 'Glowing' }, { pre: 'Prismatic' }];

const ephWhite = ['White', 'Pale', 'Fair', 'Lucent', 'Pallid', 'Ivory'];
const ephBlack = [{ pre: 'Dark' }, { pre: 'Stygian' }, { pre: 'Abyssal' }, { post: 'of Chaos' }, { pre: 'Chaotic' }, { pre: 'Shadow-Wreathed' }];
const ephRed = [{ pre: 'Crimson' }, { pre: 'Bloodied' }, { pre: 'Bloody' }, { pre: 'Sanguine' }, { pre: 'Ruby' }, { post: ', Herald of the King in Red' }] satisfies Ephitet[];
const ephRainbow = ['Prismatic', 'Rainbow', 'Variegated', 'Multicolored', 'Kaleidosopic', 'Polychromatic']


export const MATERIALS = {
    lemonWood: {
        material: 'lemon tree wood',
        ephitet: mkGen((rng) => [{ pre: 'Lemony' }, { post: 'of the Lemon Lord' }].choice(rng))
    } as const,
    oak: {
        material: 'oak wood',
        ephitet: { pre: 'Oaken' }
    } as const,
    pine: {
        material: 'pine wood',
        ephitet: { post: 'of the Tundra' }
    } as const,
    cherryNormal: {
        material: 'cherry wood',
        ephitet: { pre: 'Cherry' }
    } as const,
    cherryAnime: {
        material: 'cherry wood',
        ephitet: { post: 'of the Sakura Forest' }
    } as const,
    maple: {
        material: 'maple wood',
        ephitet: mkGen((rng) => ({ pre: ephWhite.choice(rng) }))
    } as const,
    birch: {
        material: 'birch wood',
        ephitet: mkGen((rng) => ({ pre: ephWhite.choice(rng) }))
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
        ephitet: mkGen((rng) => [{ post: 'of the Skylands' }, { post: 'of the Skies' }].choice(rng))
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

    ivory: {
        material: 'ivory',
        ephitet: mkGen((rng) => ({ pre: ephWhite.choice(rng) }))
    } as const,

    hotHorn: mkGen((rng) => {
        const [creature, protrusionName] = hotAnimalHorn.generate(rng);

        return {
            material: `${creature} ${protrusionName}`,
            ephitet: { post: `of the ${creature.capFirst()}` }
        } as Descriptor;
    }),
    coldHorn: mkGen((rng) => {
        const [creature, protrusionName] = coldAnimalHorn.generate(rng);

        return {
            material: `${creature} ${protrusionName}`,
            ephitet: { post: `of the ${creature.capFirst()}` }
        } as Descriptor;
    }),
    darkLeather: mkGen((rng) => {
        const [creature, skinName] = darkAnimalSkin.generate(rng);

        return {
            material: `${creature} ${skinName}`,
            ephitet: { post: `of the ${creature.capFirst()}` }
        } as Descriptor;
    }),

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
        ephitet: mkGen((rng) => ({ pre: ['Verminous', 'Bug'].choice(rng) }))
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
const embeddedArr = [['a ruby', ephRed], ['an emerald', 'Emerald'], ['a sapphire', 'Sapphire'], ['an amethyst', 'Amethyst'], ['a pearl', 'Empearled']] as const;
export const MISC_DESC_FEATURES = {
    embedded: {
        ..._.reduce<(typeof embeddedArr)[number], Record<(typeof embeddedArr)[number][0], Descriptor>>(embeddedArr, (acc, [thing, ephitet]) => {
            acc[thing] = (
                typeof ephitet === 'string'
                    ? ({
                        descriptor: {
                            descType: 'possession',
                            singular: `${thing} embedded in it`,
                            plural: `each have ${thing} embedded in them`
                        },
                        ephitet: { pre: ephitet }
                    })
                    : ({
                        descriptor: {
                            descType: 'possession',
                            singular: `${thing} embedded in it`,
                            plural: `each have ${thing} embedded in them`
                        },
                        ephitet: mkGen((rng) => ephitet.choice(rng))
                    })) satisfies Descriptor;
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
                singular: "'s split into multicolored regions with psychedelic shapes",
                plural: "'re split into multicolored regions with psychedelic shapes",
            },
            ephitet: { pre: 'Case Hardened' }
        },
        oil: {
            descriptor: {
                descType: 'property',
                singular: " shines like a rainbow when viewed from the right angle",
                plural: ' shine like a rainbow when viewed from the right angle',
            },
            ephitet: mkGen((rng) => ({ pre: ephRainbow.choice(rng) }))
        },
        pearlescent: {
            descriptor: {
                descType: 'property',
                singular: ' changes between pink and blue depending on the viewing angle',
                plural: ' change between pink and blue depending on the viewing angle'
            },
            ephitet: mkGen((rng) => ({ pre: ephRainbow.choice(rng) }))
        }
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
    }

} as const satisfies Record<string, Record<string, Descriptor | TGenerator<Descriptor, [Weapon]>>>;

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
export const holdingParts = ['body', 'shaft', 'grip', 'limbs'] as const satisfies WeaponPartName[];

/**
 * Parts of a weapon that could have something wrapped around them (like a string or piece of cloth).
 */
export const wrappableParts = ['grip', 'crossguard', 'barrel', 'shaft', 'quiver', 'body'] as const satisfies WeaponPartName[];

