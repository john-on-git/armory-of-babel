import { pluralUnholyFoe, singularUnholyFoe, singularWildAnimal } from "$lib/generators/foes";
import { mkGen, StringGenerator, type TGenerator } from "$lib/generators/recursiveGenerator";
import { animeWeaponShapes, bluntWeaponShapeFamilies, edgedWeaponShapeFamilies, embeddableParts, ephBlack, ephBlue, ephCold, ephExplorer, ephGold, ephGreen, ephHot, ephPurple, ephRed, ephSky, ephSteampunk, eyeAcceptingParts, grippedWeaponShapeFamilies, holdingParts, importantPart, MATERIALS, MISC_DESC_FEATURES, mouthAcceptingParts, pointedWeaponShapes, shapeFamiliesWithoutPommels, twoHandedWeaponShapeFamilies, wrappableParts } from "$lib/generators/weaponGenerator/config/configConstants";
import { ProviderElement } from "$lib/generators/weaponGenerator/provider";
import { genMaybeGen, pickForTheme, textForDamage, toLang, toProviderSource } from "$lib/generators/weaponGenerator/weaponGeneratorLogic";
import { gte, lt, type ActivePower, type CommonDieSize, type DamageDice, type Descriptor, type PassivePower, type Personality, type RechargeMethod, type Theme, type Weapon, type WeaponFeaturesTypes, type WeaponPowerCond, type WeaponRarity, type WeaponShape } from "$lib/generators/weaponGenerator/weaponGeneratorTypes";
import { choice } from "$lib/util/choice";
import "$lib/util/string";
import { PrimitiveContainer, type DeltaCollection } from "$lib/util/versionController";
import _ from "lodash";

const agentOfExtractivism = mkGen((rng) =>
    [
        "a logging company",
        "a mining company",
        "a fur trader",
        "a poacher"
    ].choice(rng)
);

export default {
    themes: {
        add: ([
            "fire" as const,
            "ice" as const,
            "cloud" as const,
            "dark" as const,
            "light" as const,
            "sweet" as const,
            "sour" as const,
            "wizard" as const,
            "steampunk" as const,
            "nature" as const
        ] satisfies Theme[]).map(theme => new PrimitiveContainer(theme))
    },
    nonRollableDescriptors: {
        add: [
            new ProviderElement('vampire-mouth',
                {
                    generate: () => MISC_DESC_FEATURES.sensorium.mouth.vampire,
                    ephitet: '',
                    applicableTo: {
                        any: mouthAcceptingParts
                    }
                },
                {
                    never: true
                }
            ),
            new ProviderElement('generic-eyes',
                {
                    generate: (rng) =>
                        genMaybeGen([
                            MISC_DESC_FEATURES.sensorium.eyes.beady,
                            MISC_DESC_FEATURES.sensorium.eyes.deepSet,
                            MISC_DESC_FEATURES.sensorium.eyes.animalistic,
                        ].choice(rng), rng)
                    ,
                    applicableTo: {
                        any: eyeAcceptingParts
                    }
                },
                {
                    never: true
                }
            ), new ProviderElement('material-telekill',
                {
                    generate: () => ({
                        material: 'telekill alloy',
                        ephitet: mkGen(() => ({ pre: 'Nullifying' }))
                    }),
                    applicableTo: { any: importantPart }
                },
                {
                    /**
                     * Can only be added by the passive power "psi-immune"
                     */
                    never: true
                }
            ),
            new ProviderElement('descriptor-wreathed-fire',
                {
                    generate: () => ({
                        descriptor: {
                            descType: 'property',
                            singular: ` is wreathed in flames`,
                            plural: ` are wreathed in flames`,
                        },
                        ephitet: mkGen(rng => ephHot.choice(rng))
                    }),
                    applicableTo: { any: importantPart }
                },
                {
                    /**
                     * Can only be added by the passive power "integrated-clock"
                     */
                    never: true
                }
            ),
            new ProviderElement('descriptor-wreathed-dark-fire',
                {
                    generate: () => ({
                        descriptor: {
                            descType: 'property',
                            singular: ` is wreathed in lightless black flames`,
                            plural: ` are wreathed in lightless black flames`,
                        },
                        ephitet: mkGen((rng) => ephHot.choice(rng))
                    }),
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    /**
                     * Can only be added by the passive power ""
                     */
                    never: true
                }
            ), new ProviderElement('descriptor-wreathed-ice',
                {
                    generate: () => ({
                        descriptor: {
                            descType: 'property',
                            singular: ` is wreathed in icy mist`,
                            plural: ` are wreathed in icy mist`,
                        },
                        ephitet: mkGen(rng => ephCold.choice(rng))
                    }),
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    /**
                     * Can only be added by the passive powers "damage-bonus-ice" & "damage-bonus-ice-blunt"
                     */
                    never: true
                }
            ),
            new ProviderElement('descriptor-clock-embed-forced',
                {
                    generate: () => ({
                        descriptor: {
                            descType: 'possession',
                            singular: `a clock embedded in it`,
                            plural: `clocks embedded in them`,
                        },
                        ephitet: { pre: "Timekeeper's" }
                    }),
                    applicableTo: {
                        any: embeddableParts
                    }
                },
                {
                    /**
                     * Can only be added by the passive power "integrated-clock"
                     */
                    never: true
                }
            ),
            new ProviderElement('descriptor-compass-embed-forced',
                {
                    generate: () => ({
                        descriptor: {
                            descType: 'possession',
                            singular: `a compass embedded in it`,
                            plural: `compass embedded in them`,
                        },
                        ephitet: mkGen(rng => ephExplorer.choice(rng))
                    }),
                    applicableTo: {
                        any: embeddableParts
                    }
                },
                {
                    /**
                     * Can only be added by the passive power "integrated-compass"
                     */
                    never: true
                }
            ),
            new ProviderElement('eat-to-heal-forced', {
                generate: (rng) => {
                    return [
                        MATERIALS.hardCandy,
                        MATERIALS.rockCandy,
                        MATERIALS.gingerbread,
                    ].choice(rng);
                },
                applicableTo: {
                    any: importantPart
                }
            }, {
                /**
                 * Can only be added by the passive power "eat-to-heal"
                 */
                never: true
            }
            ),

            new ProviderElement('injector-module-forced', {
                generate: () => (
                    {
                        descriptor: {
                            descType: 'possession',
                            singular: "a small glass vial built into it",
                            plural: 'a small glass vial built into it',
                        },
                        ephitet: { pre: 'Headhunter' }
                    }),
                applicableTo: {
                    any: ['grip']
                }
            }, {
                /**
                 * Can only be added by the passive power "injector-module"
                 */
                never: true
            }),

            new ProviderElement('energy-core-void',
                {
                    generate: () => {
                        return {
                            descriptor: {
                                descType: 'property',
                                singular: " hurts to look at. When it moves it leaves behind a wake of something that you can't quite describe, but it makes your eyes prickle with pins and needles",
                                plural: " hurt to look at. When they move it leaves  behind a wake of something that you can't quite describe, but it makes your eyes prickle with pins and needles"
                            },
                            ephitet: mkGen((rng, weapon) => [{ pre: weapon.shape.particular }, { post: ` of ${weapon.id}` }, { pre: '[Object object]' }].choice(rng)),
                        }
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    /**
                     * Can only be added by the passive power "death blast"
                     */
                    never: true
                }
            ),
            new ProviderElement('energy-core-fire',
                {
                    generate: () => {
                        return {
                            descriptor: {
                                descType: 'possession',
                                singular: 'a superheated section running down the middle of it (which emits dim orange light, hissing subtly as you move it around)',
                                plural: 'a superheated section in the middle of them (which emit dim orange light, hissing subtly as you move them around)',
                            },
                            ephitet: mkGen(rng => ephHot.choice(rng)),
                        }
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    /**
                     * Can only be added by the passive power "death blast"
                     */
                    never: true
                }
            ),
            new ProviderElement('energy-core-ice',
                {
                    generate: () => {
                        return {
                            descriptor: {
                                descType: 'possession',
                                singular: 'a large crystal orb embedded in it (which contains a howling blizzard)',
                                plural: 'a set of large crystal orbs embedded in them (contain a welter of winter weather)'
                            },
                            ephitet: mkGen(rng => ephCold.choice(rng)),
                        }
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    /**
                     * Can only be added by the passive power "death blast"
                     */
                    never: true
                }
            ),
            new ProviderElement('energy-core-ultraviolet',
                {
                    generate: () => {
                        return {
                            descriptor: {
                                descType: 'possession',
                                singular: 'a glass bulb running down the middle (it blasts ultraviolet light in all directions)',
                                plural: 'a glass bulb running down the middle (blasting ultraviolet light in all directions)'
                            },
                            ephitet: mkGen(rng => ephPurple.choice(rng)),
                        }
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    /**
                     * Can only be added by the passive power "death blast"
                     */
                    never: true
                }
            ),
            new ProviderElement('energy-core-azure',
                {
                    generate: () => {
                        return {
                            descriptor: {
                                descType: 'possession',
                                singular: 'a river of sapphire curling through its center (waves of light ebb and flow within it)',
                                plural: 'rivers of sapphire curling through them (waves of light ebb and flow within)'
                            },
                            ephitet: mkGen(rng => ephBlue.choice(rng)),
                        }
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    /**
                     * Can only be added by the passive power "death blast"
                     */
                    never: true
                }
            ),
            new ProviderElement('energy-core-crimson',
                {
                    generate: () => {
                        return {
                            descriptor: {
                                descType: 'property',
                                singular: mkGen((_, __, partName) => ` is partially transparent, revealing a beating heart at its core, which emits a gentle crimson glow that diffuses through the ${partName}`),
                                plural: mkGen((_, __, partName) => ` are partially transparent, revealing luminous red veins, which spread a gentle crimson glow throughout the ${partName}`)
                            },
                            ephitet: mkGen(rng => ephRed.choice(rng)),
                        }
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    /**
                     * Can only be added by the passive power "death blast"
                     */
                    never: true
                }
            ),
            new ProviderElement('energy-core-verdant',
                {
                    generate: () => {
                        return {
                            descriptor: {
                                descType: 'possession',
                                singular: 'channels of brilliant green light, spreading out from its base and across its surface in an organic fractal',
                                plural: 'channels of brilliant green light, spreading out from their bases and across their surfaces in organic fractals'
                            },
                            ephitet: mkGen(rng => ephGreen.choice(rng)),
                        }
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    /**
                     * Can only be added by the passive power "death blast"
                     */
                    never: true
                }
            ),
            new ProviderElement('energy-core-atomic',
                {
                    generate: () => {
                        return {
                            descriptor: {
                                descType: 'possession',
                                singular: 'an integrated nuclear reactor which gives it a healthy glow',
                                plural: 'an integrated nuclear reactor which gives them a healthy glow'
                            },
                            ephitet: mkGen(rng => [
                                { pre: 'Atomic' },
                                { pre: 'Nuclear' },
                                { pre: 'of the Mushroom Bombs' },
                            ].choice(rng)),
                        }
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    /**
                     * Can only be added by the passive power "death blast"
                     */
                    never: true
                }
            ),
            new ProviderElement('energy-core-gold',
                {
                    generate: () => {
                        return {
                            descriptor: {
                                descType: 'property',
                                singular: " is criss-crossed by a complex system of geometric lines, which glow with golden energy",
                                plural: " are criss-crossed by a complex system of geometric lines, which glow with golden energy"
                            },
                            ephitet: mkGen(rng => ephGold.choice(rng)),
                        }
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    /**
                     * Can only be added by the passive power "death blast"
                     */
                    never: true
                }
            ),
            new ProviderElement('energy-core-dark',
                {
                    generate: () => {
                        return {
                            descriptor: {
                                descType: 'property',
                                singular: " is shaped like a corkscrew (which surrounds a bolt of dark energy, crackling eternally at its center)",
                                plural: " are shaped like corkscrews (each surrounds a bolt of dark energy, crackling eternally at its center)"
                            },
                            ephitet: mkGen(rng => ephBlack.choice(rng)),
                        }
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    /**
                     * Can only be added by the passive power "death blast"
                     */
                    never: true
                }
            ),
            new ProviderElement('energy-core-aether',
                {
                    generate: () => {
                        return {
                            descriptor: {
                                descType: 'possession',
                                singular: 'a large crack running down the middle of it (the edges glow with sky-blue energy, occasionally sparking with electricity)',
                                plural: 'a large crack running down the middle of them (their edges glow with sky-blue energy, and  occasionally sparki with electricity)'
                            },
                            ephitet: mkGen(rng => ephSky.choice(rng)),
                        }
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    /**
                     * Can only be added by the passive power "death blast"
                     */
                    never: true
                }
            ),
            new ProviderElement('energy-core-steampunk',
                {
                    generate: () => {
                        return {
                            descriptor: {
                                descType: 'possession',
                                singular: 'a glass tube running down the center (which crackles with electrical energy)',
                                plural: 'glass tube running down their center (which crackle with electrical energy)'
                            },
                            ephitet: mkGen(rng => ephSteampunk.choice(rng)),
                        }
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    /**
                     * Can only be added by the passive power "death blast"
                     */
                    never: true
                }
            ),
        ]
    },
    descriptors: {
        add: [
            // new ProviderElement('material-extravagant-hard',
            //     {
            //         generate: (rng) => {
            //             return [
            //                 MATERIALS.silver,
            //                 MATERIALS.gold,
            //                 MATERIALS["rose gold"],
            //                 MATERIALS['white gold'],
            //                 MATERIALS['purple gold'],
            //                 MATERIALS['blue gold'],
            //                 MATERIALS.platinum,
            //                 MATERIALS.palladium,
            //             ].choice(rng);
            //         },
            //         applicableTo: {
            //             any: importantPart
            //         }
            //     },
            //     {
            //         themes: {
            //             none: ['nature']
            //         }
            //     }
            // ),
            new ProviderElement('descriptor-pommel-embed',
                {
                    generate: (rng, weapon) => {
                        const embedsByTheme = {
                            ice: [
                                MISC_DESC_FEATURES.embedded["a piece of selenite"],
                                MISC_DESC_FEATURES.embedded["a piece of eternal ice"],
                                MISC_DESC_FEATURES.embedded["a sapphire"],
                                MISC_DESC_FEATURES.embedded["a piece of blue jade"]
                            ],
                            fire: [
                                MISC_DESC_FEATURES.embedded["a ruby"],
                                MISC_DESC_FEATURES.embedded["a garnet"],
                                MISC_DESC_FEATURES.embedded["a piece of carnelian"],
                                MISC_DESC_FEATURES.embedded["a tiger's eye stone"],
                                MISC_DESC_FEATURES.embedded["a topaz"],
                                MISC_DESC_FEATURES.embedded["a tourmaline"],
                                MISC_DESC_FEATURES.embedded['an opal']
                            ],
                            cloud: [
                                MISC_DESC_FEATURES.embedded["a piece of green jade"],
                                MISC_DESC_FEATURES.embedded["a piece of blue jade"],
                                MISC_DESC_FEATURES.embedded["a diamond"],
                                MISC_DESC_FEATURES.embedded['a piece of lapis lazuli'],
                                MISC_DESC_FEATURES.embedded['a sapphire']
                            ],
                            earth: [
                                MISC_DESC_FEATURES.embedded["a ruby"],
                                MISC_DESC_FEATURES.embedded["an emerald"],
                                MISC_DESC_FEATURES.embedded["a sapphire"],
                                MISC_DESC_FEATURES.embedded["an onyx"],
                                MISC_DESC_FEATURES.embedded["a garnet"],
                                MISC_DESC_FEATURES.embedded["a diamond"],
                                MISC_DESC_FEATURES.embedded["a piece of carnelian"],
                                MISC_DESC_FEATURES.embedded["a piece of lapis lazuli"],
                                MISC_DESC_FEATURES.embedded["a tiger's eye stone"],
                                MISC_DESC_FEATURES.embedded["a tourmaline"],
                                MISC_DESC_FEATURES.embedded["an opal"],
                            ],
                            light: [
                                MISC_DESC_FEATURES.embedded["a diamond"],
                                MISC_DESC_FEATURES.embedded["a pearl"],
                                MISC_DESC_FEATURES.embedded["a piece of selenite"],
                                MISC_DESC_FEATURES.embedded["a tourmaline"]
                            ],
                            dark: [
                                MISC_DESC_FEATURES.embedded["an onyx"],
                                MISC_DESC_FEATURES.embedded["a dark sapphire"]
                            ],
                            sweet: [
                                MISC_DESC_FEATURES.embedded["a tourmaline"]
                            ],
                            sour: [
                                MISC_DESC_FEATURES.embedded["a citrine"],
                                MISC_DESC_FEATURES.embedded["acid diamond"],
                                MISC_DESC_FEATURES.embedded["toxic pearl"]
                            ],
                            wizard: [
                                MISC_DESC_FEATURES.embedded["an amethyst"],
                                MISC_DESC_FEATURES.embedded["a piece of porphyry"],
                                MISC_DESC_FEATURES.embedded["a sapphire"],
                                MISC_DESC_FEATURES.embedded["a piece of lapis lazuli"]
                            ],
                            nature: [MISC_DESC_FEATURES.embedded.amber]
                        } as const satisfies Partial<Record<Theme, Descriptor[]>>;

                        return pickForTheme(weapon, embedsByTheme, rng).choice(rng);
                    },
                    applicableTo: {
                        any: embeddableParts
                    }
                },
                {
                    shapeFamily: {
                        none: shapeFamiliesWithoutPommels
                    },
                    themes: {
                        any: ['ice', 'fire', 'cloud', 'earth', 'light', 'dark', 'wizard']
                    },
                }
            ),
            new ProviderElement('material-primitive-hard',
                {
                    generate: (rng) => {
                        return [
                            MATERIALS.tin,
                            MATERIALS.copper,
                            MATERIALS.bronze,
                            MATERIALS.flint,
                        ].choice(rng);
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    allowDuplicates: true,
                    themes: {
                        any: ['nature', 'earth', 'fire']
                    }
                }
            ),

            new ProviderElement('material-fire-hard',
                {
                    generate: (rng, weapon) => {
                        return [
                            MATERIALS['scarlet steel'],
                            MATERIALS.flint,
                            MATERIALS.goldPlated,
                            MATERIALS.gold,
                            MATERIALS["rose gold"],
                            ...(
                                bluntWeaponShapeFamilies.includes(weapon.shape.group as "club" | "staff" | "mace")
                                    ? [MATERIALS.vitStone, MATERIALS.basalt]
                                    : []
                            )
                        ].choice(rng);
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    allowDuplicates: true,
                    themes: {
                        any: ['fire']
                    }
                }
            ),
            new ProviderElement('material-fire-holding',
                {
                    generate: (rng) => genMaybeGen([
                        MATERIALS.scorchedWood,
                        MATERIALS.glass,
                        MATERIALS.quartz,
                        MATERIALS.porcelain,
                        MATERIALS.hotHorn
                    ].choice(rng), rng),
                    applicableTo: {
                        any: holdingParts
                    }
                },
                {
                    themes: {
                        any: ['fire']
                    },
                    shapeFamily: {
                        any: grippedWeaponShapeFamilies
                    }
                }
            ),
            new ProviderElement('descriptor-fire-coating',
                {
                    generate: (rng, weapon) => genMaybeGen<Descriptor, [Weapon]>([
                        MISC_DESC_FEATURES.coating.oil,
                        MISC_DESC_FEATURES.coating.flames,
                    ].choice(rng), rng, weapon),
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    themes: {
                        any: ['fire']
                    },
                }
            ),

            new ProviderElement('material-ice-hard',
                {
                    generate: (rng, weapon) => {
                        return [
                            MATERIALS["boreal steel"],
                            MATERIALS.silver,
                            MATERIALS.silverPlated,
                            MATERIALS["white gold"],
                            ...(
                                gte(weapon.rarity, 'rare') ? [
                                    MATERIALS.iceLikeSteel,
                                    MATERIALS.glassLikeSteel,
                                    MATERIALS["glass"],
                                ] : []
                            )
                        ].choice(rng);
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    allowDuplicates: true,
                    themes: {
                        any: ['ice']
                    },
                }
            ),

            new ProviderElement('material-ice-holding',
                {
                    generate: (rng) => {
                        return genMaybeGen([
                            MATERIALS.ivory,
                            MATERIALS.pine,
                            MATERIALS.coldHorn
                        ].choice(rng), rng);
                    },
                    applicableTo: {
                        any: holdingParts
                    }
                },
                {
                    allowDuplicates: true,
                    themes: {
                        any: ['ice']
                    },
                    shapeFamily: {
                        any: grippedWeaponShapeFamilies
                    }
                }
            ),

            new ProviderElement('material-cloud-hard',
                {
                    generate: (rng) => {
                        return [
                            MATERIALS["meteoric iron"],
                            MATERIALS.silver,
                            MATERIALS.glassLikeSteel
                        ].choice(rng);
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    allowDuplicates: true,
                    themes: {
                        any: ['cloud']
                    }
                }
            ),
            new ProviderElement('material-cloud-holding',
                {
                    generate: (rng, weapon) => {
                        return genMaybeGen([
                            MATERIALS.alabaster,
                            MATERIALS.ivory,
                            MATERIALS.silver,
                            MATERIALS.silverPlated,
                            MATERIALS.aetherWood,
                            gte(weapon.rarity, 'legendary') ? MATERIALS.heavenlyPeachWood : MATERIALS.peachWood,
                        ].choice(rng), rng);
                    },
                    applicableTo: {
                        any: holdingParts
                    }
                },
                {
                    allowDuplicates: true,
                    themes: {
                        any: ['cloud']
                    },
                    shapeFamily: {
                        any: grippedWeaponShapeFamilies
                    }
                }
            ),
            new ProviderElement('descriptor-cloud-coating',
                {
                    generate: (rng, weapon) => genMaybeGen<Descriptor, [Weapon]>([
                        MISC_DESC_FEATURES.coating.pearlescent,
                    ].choice(rng), rng, weapon),
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    themes: {
                        any: ['cloud']
                    },
                }
            ),


            new ProviderElement('material-earth-hard',
                {
                    generate: (rng) => {
                        return [
                            MATERIALS.alabaster,
                            MATERIALS.bronze,
                            MATERIALS.diamond,
                            MATERIALS.amethyst,
                            MATERIALS.emerald,
                            MATERIALS.flint,
                            MATERIALS.fossils,
                            MATERIALS.gold,
                            MATERIALS["rose gold"],
                            MATERIALS["white gold"],
                            MATERIALS.granite,
                            MATERIALS.marble,
                            MATERIALS.onyx,
                            MATERIALS.quartz,
                            MATERIALS.ruby,
                            MATERIALS.sandstone,
                            MATERIALS.sapphire,
                        ].choice(rng);
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    allowDuplicates: true,
                    themes: {
                        any: ['earth']
                    }
                }
            ),
            new ProviderElement('material-earth-holding',
                {
                    generate: (rng) => {
                        return [
                            MATERIALS.alabaster,
                            MATERIALS.fossils,
                            MATERIALS.granite,
                            MATERIALS.marble,
                            MATERIALS.onyx,
                            MATERIALS.quartz,
                            MATERIALS.sandstone,
                        ].choice(rng);
                    },
                    applicableTo: {
                        any: holdingParts
                    }
                },
                {
                    allowDuplicates: true,
                    themes: {
                        any: ['earth']
                    },
                    shapeFamily: {
                        any: grippedWeaponShapeFamilies
                    }
                }
            ),

            new ProviderElement('material-dark-hard',
                {
                    generate: (rng, weapon) => {
                        return [
                            MATERIALS.obsidian,
                            MATERIALS.onyx,
                            MATERIALS["black iron"],
                            MATERIALS["meteoric iron"],
                            ...(
                                gte(weapon.rarity, 'rare') ? [
                                    MATERIALS.darkSteel,
                                    MATERIALS.adamantum,
                                    MATERIALS.darkness
                                ] : []
                            )
                        ].choice(rng);
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    allowDuplicates: true,
                    themes: {
                        any: ['dark']
                    },
                }
            ),

            new ProviderElement('material-dark-holding',
                {
                    generate: (rng) => {
                        return genMaybeGen([
                            MATERIALS.ebonyWood,
                            MATERIALS.darkLeather,
                            MATERIALS.darkLeather,
                        ].choice(rng), rng);
                    },
                    applicableTo: {
                        any: holdingParts
                    }
                },
                {
                    allowDuplicates: true,
                    themes: {
                        any: ['dark']
                    },
                    shapeFamily: {
                        any: grippedWeaponShapeFamilies
                    }
                }
            ),


            new ProviderElement('material-light-holding',
                {
                    generate: (rng, weapon) => {
                        return genMaybeGen([
                            MATERIALS.maple,
                            MATERIALS.birch,
                            MATERIALS.alabaster,
                            MATERIALS.ivory,
                            MATERIALS.glass,
                            MATERIALS.crystal,
                            MATERIALS.quartz,
                            MATERIALS.porcelain,
                            gte(weapon.rarity, 'legendary') ? MATERIALS.heavenlyPeachWood : MATERIALS.peachWood,
                        ].choice(rng), rng);
                    },
                    applicableTo: {
                        any: holdingParts
                    }
                },
                {
                    allowDuplicates: true,
                    themes: {
                        any: ['light']
                    },
                    shapeFamily: {
                        any: grippedWeaponShapeFamilies
                    }
                }
            ),

            new ProviderElement('material-dark-ice',
                {
                    generate: (rng) => {
                        return [
                            MATERIALS.iceBlood
                        ].choice(rng);
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    allowDuplicates: true,
                    themes: {
                        all: ['dark', 'ice']
                    }
                }
            ),

            new ProviderElement('material-light-hard',
                {
                    generate: (rng, weapon) => {
                        return [
                            MATERIALS.silver,
                            MATERIALS.silverPlated,
                            MATERIALS["white gold"],
                            MATERIALS.crystal,
                            gte(weapon.rarity, 'legendary') ? MATERIALS.heavenlyPeachWood : MATERIALS.peachWood,
                            ...(
                                gte(weapon.rarity, 'rare')
                                    ? [
                                        MATERIALS.light,
                                        MATERIALS.glass,
                                        MATERIALS.mythrel,
                                        MATERIALS.diamond,
                                    ]
                                    : []
                            )
                        ].choice(rng);
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    allowDuplicates: true,
                    themes: {
                        any: ['light']
                    },
                }
            ),

            new ProviderElement('material-sweet-hard',
                {
                    generate: (rng) => {
                        return [
                            MATERIALS.hardCandy,
                            MATERIALS.rockCandy,
                            MATERIALS.gingerbread,
                        ].choice(rng);
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    allowDuplicates: true,
                    themes: {
                        any: ['sweet']
                    }
                }
            ),
            new ProviderElement('material-sweet-holding',
                {
                    generate: (rng) => {
                        return [
                            MATERIALS.maple,
                            MATERIALS.liquoriceRoot,
                            MATERIALS.dateWood
                        ].choice(rng);
                    },
                    applicableTo: {
                        any: holdingParts
                    }
                },
                {
                    allowDuplicates: true,
                    themes: {
                        any: ['sweet']
                    },
                    shapeFamily: {
                        any: grippedWeaponShapeFamilies
                    }
                }
            ),

            new ProviderElement('material-sour-hard',
                {
                    generate: (rng) => {
                        return [
                            MATERIALS.citrine,
                            MATERIALS.acidium
                        ].choice(rng);
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    allowDuplicates: true,
                    themes: {
                        any: ['sour']
                    }
                }
            ),
            new ProviderElement('material-sour-holding',
                {
                    generate: (rng) => {
                        return [
                            MATERIALS.lemonWood,
                        ].choice(rng);
                    },
                    applicableTo: {
                        any: holdingParts
                    }
                },
                {
                    allowDuplicates: true,
                    themes: {
                        any: ['sour']
                    },
                    shapeFamily: {
                        any: grippedWeaponShapeFamilies
                    }
                }
            ),

            new ProviderElement('material-wizard-hard',
                {
                    generate: (rng, weapon) => {
                        return [
                            MATERIALS.crystal,
                            MATERIALS.quartz,
                            MATERIALS.amethyst,
                            ...(
                                lt(weapon.rarity, 'rare')
                                    ? [
                                        MATERIALS['tin'],
                                    ]
                                    : []
                            ),
                            ...(
                                gte(weapon.rarity, 'rare')
                                    ? [
                                        MATERIALS["blue gold"],
                                        MATERIALS['purple gold'],
                                        MATERIALS.cobalt,
                                        MATERIALS["glassLikeSteel"],
                                        MATERIALS.force,
                                        MATERIALS.sapphire,
                                    ] : []
                            )
                        ].choice(rng);
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    allowDuplicates: true,
                    themes: {
                        any: ['wizard']
                    }
                }
            ),

            new ProviderElement('material-wizard-holding',
                {
                    generate: (rng) => {
                        return genMaybeGen([
                            MATERIALS.magicWood,
                            MATERIALS.magicHorn,
                            MATERIALS.magicHorn,
                            MATERIALS.magicHorn,
                            MATERIALS.magicHorn,
                        ].choice(rng), rng);
                    },
                    applicableTo: {
                        any: holdingParts
                    }
                },
                {
                    allowDuplicates: true,
                    themes: {
                        any: ['wizard']
                    },
                    shapeFamily: {
                        any: grippedWeaponShapeFamilies
                    }
                }
            ),

            new ProviderElement('material-wizard-nature',
                {
                    generate: (rng) => {
                        return [
                            MATERIALS.wiseWood,
                        ].choice(rng);
                    },
                    applicableTo: {
                        any: holdingParts
                    }
                },
                {
                    allowDuplicates: false,
                    themes: {
                        all: ['wizard', 'nature']
                    }
                }
            ),
            new ProviderElement('misc-wizard-wrapping',
                {
                    generate: () => MISC_DESC_FEATURES.wrap.silkWrap,
                    applicableTo: {
                        any: wrappableParts
                    }
                },
                {
                    themes: {
                        any: ['wizard']
                    },
                }
            ),

            new ProviderElement('material-steampunk-hard',
                {
                    generate: (rng) => {
                        return [
                            MATERIALS.clockwork,
                            MATERIALS.tin,
                            MATERIALS.copper,
                            MATERIALS.brass,
                        ].choice(rng);
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    allowDuplicates: true,
                    themes: {
                        any: ['steampunk']
                    }
                }
            ),

            new ProviderElement('material-steampunk-holding',
                {
                    generate: (rng) => {
                        return genMaybeGen([
                            MATERIALS.copper,
                            MATERIALS.tin,
                            MATERIALS.brass,
                            MATERIALS.glass,
                            MATERIALS.porcelain
                        ].choice(rng), rng);
                    },
                    applicableTo: {
                        any: holdingParts
                    }
                },
                {
                    allowDuplicates: true,
                    themes: {
                        any: ['steampunk']
                    },
                    shapeFamily: {
                        any: grippedWeaponShapeFamilies
                    }
                }
            ),
            new ProviderElement('material-nature-hard',
                {
                    generate: (rng, weapon) => {
                        return [
                            MATERIALS.oak,
                            MATERIALS.birch,
                            animeWeaponShapes.includes(weapon.shape.particular as typeof animeWeaponShapes[number]) ? MATERIALS.cherryAnime : MATERIALS.cherryNormal,
                            MATERIALS.ebonyWood,
                            MATERIALS.maple,
                            MATERIALS.ivory,
                            MATERIALS.beetleShell,
                            MATERIALS.ironWood
                        ].choice(rng);
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    allowDuplicates: true,
                    themes: {
                        any: ['nature']
                    }
                }
            ),

            new ProviderElement('material-nature-holding',
                {
                    generate: (rng, weapon) => {
                        return genMaybeGen([
                            MATERIALS.oak,
                            MATERIALS.birch,
                            animeWeaponShapes.includes(weapon.shape.particular as typeof animeWeaponShapes[number]) ? MATERIALS.cherryAnime : MATERIALS.cherryNormal,
                            MATERIALS.ebonyWood,
                            MATERIALS.maple,
                            MATERIALS.ivory,
                            MATERIALS.beetleShell,
                            MATERIALS.ironWood
                        ].choice(rng), rng);
                    },
                    applicableTo: {
                        any: holdingParts
                    }
                },
                {
                    allowDuplicates: true,
                    themes: {
                        any: ['nature']
                    },
                    shapeFamily: {
                        any: grippedWeaponShapeFamilies
                    }
                }
            ),

            new ProviderElement('misc-charm-emojis',
                {
                    generate: () => MISC_DESC_FEATURES.charm.emojis,
                    applicableTo: {
                        any: wrappableParts
                    }
                },
                {
                    allowDuplicates: false,
                    themes: {
                        any: ['nature', 'wizard', 'sweet']
                    },
                }
            ),

            new ProviderElement('club-staff-main-material',
                {
                    generate: (rng, weapon) => {
                        return [
                            MATERIALS.oak,
                            MATERIALS.pine,
                            animeWeaponShapes.includes(weapon.shape.particular as typeof animeWeaponShapes[number]) ? MATERIALS.cherryAnime : MATERIALS.cherryNormal,
                            MATERIALS.ebonyWood,
                            MATERIALS.birch,
                            ...(
                                gte(weapon.rarity, 'rare') ? [
                                    MATERIALS.ironWood,
                                    MATERIALS.bloodWood
                                ] : []
                            )
                        ].choice(rng);
                    },
                    applicableTo: {
                        any: holdingParts
                    }
                },
                {
                    allowDuplicates: true,
                    shapeFamily: {
                        any: ['staff', 'club']
                    },
                    rarity: {
                        lte: 'rare',
                    }
                }
            ),
            new ProviderElement('light-and-dark-blade',
                {
                    generate: () => ({
                        material: "two separate blades (adamant and mythrel), they're intertwined in a spiral pattern",
                        ephitet: { pre: 'Binary' }
                    }),
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    rarity: {
                        gte: 'epic'
                    },
                    themes: {
                        all: ['light', 'dark']
                    }
                }
            ),
            new ProviderElement('ice-and-fire-blade',
                {
                    generate: () => ({
                        material: "two separate parts, split down the middle: one half is boreal steel, the other scarlet steel",
                        ephitet: { pre: 'Bifurcated' }
                    }),
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    rarity: {
                        gte: 'epic'
                    },
                    themes: {
                        all: ['ice', 'fire']
                    }
                }
            ),
            new ProviderElement('frutiger-blade',
                {
                    generate: () => ({
                        material: "a glass tank containing an aquarium, the contents seem unaffected by movement",
                        ephitet: { pre: 'Steamy' }
                    }),
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    rarity: {
                        gte: 'epic'
                    },
                    themes: {
                        all: ['cloud', 'light']
                    }
                }
            ),
            new ProviderElement('steam-blade',
                {
                    generate: () => ({
                        material: "hollow glass, filled with a roiling mix of magical fire and water",
                        ephitet: { pre: 'Steamy' }
                    }),
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    rarity: {
                        gte: 'epic'
                    },
                    themes: {
                        all: ['fire', 'cloud']
                    }
                }
            ),
            new ProviderElement('elemental-quadblade', {
                generate: () => ({
                    material: "elementally infused metal, split into four distinct sections, each of which represents a different element",
                    ephitet: { post: ' of the Elemental Lord' }
                }),
                applicableTo: {
                    any: importantPart
                }
            }, {
                rarity: {
                    gte: 'legendary'
                },
                themes: {
                    all: ['earth', 'cloud', 'fire']
                }
            }
            ),
        ]
    },
    personalities: {
        add: [

            new ProviderElement("vengeful",
                {
                    desc: "Vengeful."
                },
                {
                    themes: {
                        any: ["fire", "ice", "dark", "sweet"]
                    },

                }
            ),
            new ProviderElement<Personality, WeaponPowerCond>("cruel",
                {
                    desc: "Cruel."
                },
                {
                    themes: {
                        any: ["sour", "dark"]
                    },

                }
            ),
            new ProviderElement<Personality, WeaponPowerCond>("curious",
                {
                    desc: "Curious."
                },
                {
                    themes: {
                        any: ["wizard", "steampunk", "cloud"]
                    },

                }
            ),
            new ProviderElement<Personality, WeaponPowerCond>("know-it-all",
                {
                    desc: "Know-it-All."
                },
                {
                    themes: {
                        any: ["wizard", "steampunk"]
                    },

                }
            ),
            ...toProviderSource({
                fire: [
                    "compassionate",
                    "irritable",
                    "flirty",
                    "standoffish",
                    "zealous",
                    "wrathful",
                    "kind",
                    "honest",
                ],
                ice: [
                    "cold",
                    "formal",
                    "haughty",
                    "idealistic",
                    "pitiless",
                    "reserved",
                    "serious",
                    "stubborn",
                ],
                cloud: [
                    "easy-going",
                    "acquiescent",
                ],
                sweet: [
                    "kind",
                    "excitable",
                    "manic",
                    "neurotic",
                ],
                sour: [
                    "antagonistic",
                    "pitiless",
                    "manic",
                    "sassy"
                ],
                dark: [
                    "shy",
                    "tries to act mysterious",
                    "quiet",
                    "depressive",
                    "angry",
                    "sadistic",
                    "enjoys provoking others"
                ],
                light: [
                    "logical",
                    "honest",
                    "pious",
                    "zealous",
                ],
                wizard: [
                    "overconfident"
                ],
                steampunk: [
                    "open-minded",
                    "impatient",
                    "skeptic"
                ],
                nature: [
                    "superstitious",
                    "gullible",
                    "patient"
                ],
                earth: [
                    "callous",
                    "Strong Work Ethic",
                    "greedy",
                    "distrustful of strangers",
                    "Detail-Oriented"
                ]
            }, (theme, personality, i) => {
                const formatted = personality.toTitleCase() + ".";
                return new ProviderElement<Personality, WeaponPowerCond>(`${theme}-${personality.toLowerCase().replaceAll(/\s/g, "-")}-${i}`,
                    {
                        desc: formatted
                    },
                    {
                        themes: { all: [theme as Theme] },
                    }
                )
            })
        ]
    },
    rechargeMethods: {
        add: [
            new ProviderElement<Personality, WeaponPowerCond>("recharge-at-winter-solstice",
                {
                    desc: "all charges at noon on the winter solstice"
                },
                {

                    themes: {
                        any: ["ice", "nature", "light"]
                    }
                }
            ),
            new ProviderElement<Personality, WeaponPowerCond>("recharge-at-summer-solstice",
                {
                    desc: "all charges at noon on the summer solstice"
                },
                {

                    themes: {
                        any: ["fire", "nature", "light"]
                    }
                }
            ),
            ...toProviderSource(
                {
                    fire: [
                        "all charges after being superheated",
                    ],
                    ice: [
                        "all charges after being cooled to sub-zero",
                        "one charge whenever its wielder builds a snowman",
                        "one charge at the end of each scene where its wielder made an ice pun"
                    ],
                    dark: [
                        "one charge upon absorbing a human soul",
                        "one charge at the end of each scene where its wielder destroyed an object unnecessarily",
                        "all charges each day at the witching hour",
                        "one charge when its wielder defenestrates a priest, or all charges if it was a high ranking priest"
                    ],
                    light: [
                        "all charges after an hour in a sacred space",
                        "all charges each day at sunrise",
                        new StringGenerator([
                            "one charge each time you defeat ",
                            singularUnholyFoe,
                        ])
                    ],
                    sweet: [
                        "one charge each time it eats an extravagant dessert",
                        "all charges each time its wielder hosts a feast",
                        "one charge each time its wielder gives a well-received compliment"
                    ],
                    sour: [
                        "all charges after an hour immersed in acid",
                        "all charges when used to fell a citrus tree",
                        "one charge each time its wielder insults someone"
                    ],
                    cloud: [
                        "all charges when struck by lightning",
                        "all charges when its wielder survives a significant fall",
                        "one charge each time you defeat a winged creature, or all charges if it was also a powerful foe",
                    ],
                    wizard: [
                        "one charge when you cast one of your own spells",
                        "all charges when its wielder learns a new spell",
                        "all charges when its wielder wins a wizard duel",
                        "one charge when its wielder finishes reading a new book",
                        "all charges when its wielder views the night sky",
                    ],
                    steampunk: [
                        "all charges when its wielder invents something",
                        "all charges when its wielder throws a tea party",
                        "one charge when its wielder breaks news",
                    ],
                    earth: [
                        "one charge when its wielder throws a rock at something important",
                        "all charges when its wielder meditates atop a mountain",
                        "all charges when driven into the ground while something important is happening"
                    ],
                    nature: [
                        new StringGenerator(["all charges when its wielder drives ", agentOfExtractivism, " to bankruptcy"])
                    ]
                },
                (theme, x, i) => new ProviderElement<RechargeMethod, WeaponPowerCond>(`${theme}-recharge-${i}`,
                    {
                        desc: x
                    },
                    {
                        themes: { any: [theme as Theme] }
                    }
                ))
        ]
    },
    actives: {
        add: [
            new ProviderElement("mana-vampire-strike",
                {
                    desc: 'Mana Drain',
                    cost: 5,
                    additionalNotes: [
                        "Upon landing a blow, you empower it to steal magic from the target's mind. Choose one of their spells at random. They expend resources as if the spell was cast.",
                        "The spell is then stored inside the weapon for you to cast later, only one spell can be stored at a time.",
                    ],
                    descriptorPartGenerator: 'vampire-mouth'
                },
                {
                    themes: {
                        all: ['dark', 'wizard']
                    },
                    rarity: {
                        gte: 'epic'
                    }
                }
            ),
            new ProviderElement("vampire-strike",
                {
                    desc: 'Life Drain',
                    cost: 3,
                    additionalNotes: [
                        "Upon landing a blow, you empower it to drain the target's life force. You regain HP (or equivalent stat) equal to the damage dealt.",
                        "HP gained in this way can heal you over your natural cap, but any HP over the cap is lost at the end of the scene."
                    ],
                    descriptorPartGenerator: 'vampire-mouth'
                },
                {
                    themes: {
                        any: ['dark']
                    },
                    rarity: {
                        gte: 'rare'
                    }
                }
            ),
            new ProviderElement("caustic-strike",
                {
                    desc: "Mailleburn",
                    cost: 2,
                    additionalNotes: [
                        "Upon landing a blow, you empower it to melt the target's armor.",
                        "The armor is weaked by one step, or otherwise destroyed. If they are wearing multiple pieces of armor, choose one at random."
                    ]
                },
                {
                    themes: { any: ["sour"] },
                }
            ),
            new ProviderElement("light-strike",
                mkGen((_, weapon) => {
                    const durationByRarity = {
                        common: "until the end of the scene",
                        uncommon: "until the end of the scene",
                        rare: "for 24  hours",
                        epic: "for a week",
                        legendary: "until you choose to end it"
                    } as const satisfies Record<WeaponRarity, string>;
                    return {
                        desc: "You Are Being Watched",
                        cost: 3,
                        additionalNotes: [
                            "Upon landing a blow (on a person), you empower it to draw the attention of the divine powers. You gain supernatural knowledge of the target's exact location.",
                            `The effect lasts ${durationByRarity[weapon.rarity]}, or until the target dies.`
                        ],
                    };
                }),
                {
                    themes: { any: ["light"] },
                }
            ),
            new ProviderElement("ice-strike",
                {
                    desc: "Chilling Strike",
                    cost: 2,
                    additionalNotes: [
                        "Upon landing a blow, you empower it with frost. Characters must save or be frozen solid until the end of their next turn."
                    ],
                },
                {
                    themes: { any: ["ice"] },
                    rarity: {
                        lte: "rare"
                    }
                }
            ),
            new ProviderElement("linger-strike",
                mkGen((rng, weapon) => {
                    const numbersByRarity = {
                        common: { cost: 1, endChance: 6, damage: 4 },
                        uncommon: { cost: 1, endChance: 6, damage: 4 },
                        rare: { cost: 1, endChance: 8, damage: 4 },
                        epic: { cost: 2, endChance: 10, damage: 4 },
                        legendary: { cost: 2, endChance: 10, damage: 6 }
                    } as const satisfies Record<WeaponRarity, { cost: number; endChance: CommonDieSize; damage: CommonDieSize }>;

                    const effects = {
                        fire: { title: "Lingering Flames", desc: "fire" },
                        sour: { title: "Caustic Chain", desc: "acid" },
                    } satisfies Partial<Record<Theme, { title: string, desc: string }>>;

                    const effect = pickForTheme(weapon, effects, rng);
                    return {
                        desc: effect.title,
                        cost: numbersByRarity[weapon.rarity].cost,
                        additionalNotes: [
                            `Infuse a strike with lingering ${effect.desc}, dealing d${numbersByRarity[weapon.rarity].damage} damage to the target at the start of each of their turns.`,
                            `Each time it deals damage, the effect has a 1-in-${numbersByRarity[weapon.rarity].endChance} chance of wearing off.`
                        ]

                    }
                }),
                {
                    themes: { any: ["fire", "sour"] }
                }
            ),
            new ProviderElement("instant-castle",
                {
                    desc: 'Instant Castle',
                    cost: 9,
                    additionalNotes: [
                        'Raise a stone fort from the earth, made of smooth stone, the same kind as its surroundings. It has a diameter of 30-ft, and 30-ft high walls with battlements.',
                        'The entrance is a set of double doors, with a crossbar on the inside. A spiral staircase at the center leads up to the second floor.'
                    ]
                },
                {
                    themes: {
                        any: ['earth']
                    },
                    rarity: {
                        gte: 'legendary'
                    }
                }
            ),
            new ProviderElement("directional-slow",
                {
                    desc: 'Steadfast Storm',
                    cost: 3,
                    additionalNotes: [
                        'Summon a magical wind, blowing in one of the cardinal directions, which lasts until the end of the scene',
                        'Characters moving with the wind move twice as fast, and those moving against it are half as fast.',
                    ]
                },
                {
                    themes: {
                        any: ['cloud']
                    }
                }
            ),
            new ProviderElement("icy-terrain",
                {
                    desc: "Ice Sheet", cost: 2,
                    additionalNotes: [
                        mkGen((_, weapon) => {
                            const rangeByRarity = {
                                common: 30,
                                uncommon: 50,
                                rare: 80,
                                epic: 100,
                                legendary: 120
                            } as const satisfies Record<WeaponRarity, number>;
                            return `A wave of frost emanates from the weapon. Surfaces and bodies of liquid within a ${rangeByRarity[weapon.rarity]}-ft radius freeze into a solid sheet of ice.`;
                        })
                    ]

                },
                {
                    themes: { any: ["ice"] },
                    rarity: {
                        gte: "uncommon"
                    }
                }
            ),
            new ProviderElement('gravity-gun', {
                desc: 'Kinesis',
                cost: 1,
                additionalNotes: [
                    mkGen((rng, weapon) => {
                        const effects = {
                            fire: 'The weapon emit a fiery whip.',

                            cloud: "The weapon emits a vortex of air.",

                            light: 'The weapon emits a tether of luminous energy.',

                            nature: "A sturdy vine grows from the weapon's tip.",

                        } satisfies Partial<Record<Theme, string>>;

                        const tetherTheme = pickForTheme(weapon, effects, rng);

                        return `${tetherTheme} It can lift and throw object an weighing up to 500 lbs.`;
                    })
                ]
            }, {
                themes: {
                    any: ['light', 'fire', 'nature', 'cloud']
                },
            }),
            new ProviderElement("weapon-animal-transformation",
                mkGen(rng => ({
                    desc: "Animal Transformation",
                    cost: 2,
                    additionalNotes: [
                        `The weapon transforms into ${singularWildAnimal.generate(rng)} until the end of the scene, or until it dies.`,
                        "You can command it to turn back into its regular form early."
                    ]
                })),
                {
                    themes: {
                        any: ["nature"],
                    },
                    rarity: {
                        lte: 'rare'
                    },
                    UUIDs: {
                        none: ['summon-animal-weak', 'summon-animal-strong']
                    }
                }
            ),
            new ProviderElement("blast",
                { desc: "Fire Ball", cost: 4 },
                {
                    themes: { any: ["fire"] },
                    rarity: {
                        gte: "rare"
                    }
                }
            ),
            new ProviderElement("wall-of-fire",
                {
                    desc: "Wall of Fire",
                    cost: 4
                },
                {
                    themes: { any: ["fire"] },
                    rarity: {
                        gte: "rare"
                    }
                }),
            new ProviderElement("control-hot-weather",
                {
                    desc: "Control Weather",
                    cost: 2,
                    additionalNotes: [
                        "Must move conditions towards heatwave."
                    ],
                },
                {
                    themes: { any: ["fire"] },
                    rarity: {
                        lte: "rare"
                    }
                }),
            new ProviderElement("control-flames",
                {
                    desc: "Control Flames",
                    cost: 1,
                    additionalNotes: [
                        "Flames larger than wielder submit only after a save."
                    ],
                },
                {
                    themes: { any: ["fire"] },
                    rarity: {
                        lte: "rare"
                    }
                }),
            new ProviderElement("summon-fire-elemental",
                {
                    desc: "Summon Fire Elemental",
                    cost: 6,
                    additionalNotes: [
                        "Dissipates after 1 hour."
                    ],
                },
                {
                    themes: { any: ["fire"] },
                    rarity: {
                        gte: "epic"
                    }
                }),
            new ProviderElement("wall-of-ice",
                {
                    desc: "Wall of Ice",
                    cost: 4,
                },
                {
                    themes: { any: ["ice"] },
                    rarity: {
                        gte: "rare"
                    }
                }),
            new ProviderElement("control-cold-weather",
                {
                    desc: "Control Weather",
                    cost: 3,
                    additionalNotes: [
                        "Must move conditions towards blizzard."
                    ],
                },
                {
                    themes: { any: ["ice"] },
                    rarity: {
                        lte: "rare"
                    }
                }),
            new ProviderElement("summon-ice-elemental",
                {
                    desc: "Summon Ice Elemental",
                    cost: 6,
                    additionalNotes: [
                        "Dissipates after 1 hour."
                    ],
                },
                {
                    themes: { any: ["ice"] },
                    rarity: {
                        gte: "epic"
                    }
                }
            ),
            new ProviderElement("commune-demon",
                {
                    desc: "Commune With Demon",
                    cost: 2,
                },
                {
                    themes: { any: ["dark"] },
                    rarity: {
                        gte: "uncommon"
                    }
                }
            ),
            new ProviderElement("turn-holy",
                {
                    desc: "Turn Priests & Angels",
                    cost: 2,
                },
                {
                    themes: { any: ["dark"] },
                    rarity: {
                        gte: "uncommon"
                    }
                }
            ),
            new ProviderElement("darkness",
                {
                    desc: "Darkness",
                    cost: 1
                },
                {
                    themes: { any: ["dark"] },
                }
            ),
            new ProviderElement("summon-demon",
                {
                    desc: "Summon Demon",
                    cost: 6,
                    additionalNotes: [
                        "Returns to hell after 1 hour."
                    ],
                },
                {
                    themes: { any: ["dark"] },
                    rarity: {
                        gte: "epic"
                    }
                }
            ),
            new ProviderElement("commune-divinity",
                {
                    desc: "Commune With Divinity",
                    cost: 4,
                },
                {
                    themes: { any: ["light"] },
                    rarity: {
                        gte: "uncommon"
                    }
                }
            ),
            new ProviderElement("turn-undead",
                {
                    desc: "Turn Undead",
                    cost: 2
                },
                {
                    themes: { any: ["light"] },
                }
            ),
            new ProviderElement("light",
                {
                    desc: "Light",
                    cost: 1
                },
                {
                    themes: { any: ["light"] },
                }
            ),
            new ProviderElement("summon-angel",
                {
                    desc: "Summon Angel",
                    cost: 6,
                    additionalNotes: [
                        "Returns to heaven after 1 hour."
                    ],
                },
                {
                    themes: { any: ["light"] },
                    rarity: {
                        gte: "epic"
                    }
                }
            ),
            new ProviderElement("charm-person",
                {
                    desc: "Charm Person",
                    cost: 2
                },
                {
                    themes: { any: ["sweet"] },
                }
            ),
            new ProviderElement("sweetberry",
                {
                    desc: "Sweetberry",
                    cost: 3,
                    additionalNotes: [
                        "Create a small berry, stats as healing potion."
                    ]
                },
                {
                    themes: { any: ["sweet"] },
                }
            ),
            new ProviderElement("sugar-spray",
                {
                    desc: "Sugar Spray",
                    cost: 1,
                    additionalNotes: [
                        "Sprays a sweet and sticky syrup, enough to coat the floor of a small room. Makes movement difficult."
                    ]
                },
                {
                    themes: { any: ["sweet"] },
                }
            ),
            new ProviderElement("locate-lemon",
                {
                    desc: "Locate Lemon",
                    cost: 1,
                    additionalNotes: [
                        "Wielder learns the exact location of the closest lemon."
                    ]
                },
                {
                    themes: { any: ["sour"] },
                    rarity: {
                        lte: "uncommon"
                    }
                }
            ),
            new ProviderElement("cause-nausea",
                {
                    desc: "Cause Nausea",
                    cost: 1,
                    additionalNotes: [
                        "Target must save or waste their turn vomiting."
                    ]
                },
                {
                    themes: { any: ["sour"] },
                }
            ),
            new ProviderElement("summon-acid-elemental",
                {
                    desc: "Summon Acid Elemental",
                    cost: 6,
                    additionalNotes: [
                        "Dissipates after 1 hour."
                    ],
                },
                {
                    themes: { any: ["sour"] },
                    rarity: {
                        gte: "epic"
                    }
                }
            ),
            new ProviderElement("magic-missile",
                {
                    desc: "Magic Missile",
                    cost: 2
                },
                {
                    themes: { any: ["wizard"] },
                }
            ),
            new ProviderElement("magic-shield",
                {
                    desc: "Magic Shield",
                    cost: 2
                },
                {
                    themes: { any: ["wizard"] },
                }
            ),
            new ProviderElement("magic-parry",
                {
                    desc: "Magic Parry",
                    cost: "charges equal to spell's level",
                    additionalNotes: [
                        "Deflect a harmful spell that was targeted at you specifically.",
                        "You save. On a success the spell is nullified.",
                        "If you succeeded with the best possible roll, the spell is instead reflected back at the attacker."
                    ]
                },
                {
                    themes: { any: ["wizard"] },
                }
            ),
            new ProviderElement("instant-message",
                {
                    desc: "Instant Message",
                    cost: 1,
                    additionalNotes: [
                        "Point the weapon at someone in your line of sight, send them a telepathic message."
                    ]
                },
                {
                    themes: { any: ["wizard"] },
                }
            ),
            new ProviderElement("create-wizard-servant",
                {
                    desc: "Create Servant",
                    cost: 3,
                    additionalNotes: [
                        "Create an small ichorous being that obeys you without question. It dissolves into sludge after 2d6 days."
                    ]
                },
                {
                    themes: { any: ["wizard"] },
                }
            ),
            new ProviderElement("summon-steam-elemental",
                {
                    desc: "Summon Steam Elemental",
                    cost: 6,
                    additionalNotes: [
                        "Dissipates after 1 hour."
                    ],
                },
                {
                    themes: { any: ["steampunk"] },
                    rarity: {
                        gte: "epic"
                    }
                }
            ),
            new ProviderElement("power-machine",
                {
                    desc: "Power Machine",
                    cost: 1,
                    additionalNotes: [
                        "Touching the weapon to a machine causes it to activate under magical power. It operates for 24 hours."
                    ]
                },
                {
                    themes: { any: ["steampunk"] },
                }
            ),
            new ProviderElement("summon-water-elemental",
                {
                    desc: "Summon Water Elemental",
                    cost: 6,
                    additionalNotes: [
                        "Dissipates after 1 hour."
                    ],
                },
                {
                    themes: { any: ["cloud"] },
                    rarity: {
                        gte: "epic"
                    }
                }
            ),
            new ProviderElement("zephyr-dash",
                {
                    desc: "Zephyr Dash",
                    cost: 2,
                    additionalNotes: [
                        "Move up to 4× your normal movement to attack someone.",
                        "They must save or be knocked down by the attack."
                    ]
                },
                {
                    themes: { any: ["cloud"] },
                }
            ),
            new ProviderElement("wind-blast",
                {
                    desc: "Wind Blast",
                    cost: 2,
                    additionalNotes: [
                        "Characters in melee range must save, or be thrown back out of melee range and knocked down."
                    ]
                },
                {
                    themes: { any: ["cloud"] },
                }
            ),
            new ProviderElement("summon-lightning",
                {
                    desc: "Lightning Bolt",
                    cost: 4,
                    additionalNotes: [
                        "Summon a bolt of lightning to strike something in your line of sight."
                    ]
                },
                {
                    themes: { any: ["cloud"] },
                }
            ),
            new ProviderElement("wall-of-stone",
                {
                    desc: "Wall of stone",
                    cost: 4,
                },
                {
                    themes: { any: ["earth"] },
                    rarity: {
                        gte: "rare"
                    }
                }
            ),
            new ProviderElement("petrify-person",
                {
                    desc: "Petrify Person",
                    cost: 5,
                },
                {
                    themes: { any: ["earth"] },
                    rarity: {
                        gte: "rare"
                    }
                }
            ),
            new ProviderElement("cure-petrify",
                {
                    desc: "Cure Petrification",
                    cost: 2
                },
                {
                    themes: { any: ["earth"] },
                }
            ),
            new ProviderElement("summon-earth-elemental",
                {
                    desc: "Summon Earth Elemental",
                    cost: 6,
                    additionalNotes: [
                        "Crumbles after 1 hour."
                    ],
                },
                {
                    themes: { any: ["earth"] },
                    rarity: {
                        gte: "epic"
                    }
                }
            ),
            new ProviderElement("instant-tree",
                {
                    desc: "Instant Tree",
                    cost: 1
                },
                {
                    themes: { any: ["nature"] },
                }
            ),
            new ProviderElement("summon-chomp-flower",
                {
                    desc: "Instant Chomp-Flower",
                    cost: 2,
                    additionalNotes: [
                        "Stats as shark but can't move."
                    ]
                },
                {
                    themes: { any: ["nature"] },
                }
            ),
            new ProviderElement("vine-hook",
                {
                    desc: "Vine Hook",
                    cost: 1,
                    additionalNotes: [
                        "Launch a vine from the weapon. It can stay attached to the weapon at one end, or detach to link two objects together.",
                        "Vines can be up to 50-ft long and are as strong as steel."
                    ]
                },
                {
                    themes: { any: ["nature"] },
                }
            ),
            new ProviderElement('jump', {
                desc: 'Jump',
                cost: 1,
                additionalNotes: [
                    'Jump up to 5× as far as you are naturally capable of.'
                ]
            }, {
                themes: {
                    any: ['nature']
                }
            }),
            new ProviderElement('summon-animal-weak',
                mkGen((rng, weapon) => {

                    const quantity = ['' as const, '1d6 ' as const, '2d6 ' as const].choice(rng);

                    const sharedAnimals: Record<typeof quantity, string[]> = {
                        '': ['a caracal', 'an ape', 'a horse', 'a boar'],
                        '1d6 ': ['wolves', 'coyotes', 'thylacines', 'junglefowl', "hyraxes"],
                        '2d6 ': ['mice', 'crickets', 'geckos', 'snails', "kiwi birds"]
                    } as const;

                    const animalsByTheme = {
                        '': {
                            ice: ['a leopard seal', 'a white tiger'],
                            fire: ['a kangaroo', 'a lion', "a camel"],

                            cloud: ['an eagle'],
                            earth: ['a horse-sized earthworm'],

                            light: ['a sun bear'],
                        },
                        '1d6 ': {
                            ice: ['arctic foxes', 'rockhopper penguins'],
                            fire: ["magma toads", "fennec foxes"],

                            cloud: ['pidgeons', 'owls', 'flying fish'],
                            earth: ['giant naked mole rats'],

                            light: ["ray cats", "scarab beetles"],
                            dark: ['murder hornets'],
                        },
                        '2d6 ': {
                            ice: ['arctic hares'],
                            fire: ['salamanders', "elephant shrews"],

                            cloud: ['butterflies'],
                            earth: ['olms', 'moles'],

                            wizard: ['coin mimics', 'ink pot mimics'],
                        }
                    } as const satisfies Record<typeof quantity, Partial<Record<Theme, string[]>>>;

                    const themeSpecificAnimals = pickForTheme(weapon, animalsByTheme[quantity] as Record<keyof (typeof animalsByTheme)[typeof quantity], string[]>, rng) ?? [];

                    const chosenAnimal = [...sharedAnimals[quantity], ...themeSpecificAnimals].choice(rng);

                    return {
                        desc: `Summon ${chosenAnimal.toTitleCase()}`,
                        cost: 5,
                        additionalNotes: [
                            `Call ${quantity} ${chosenAnimal} to your aid. ${quantity === '' ? 'It returns' : 'They return'} to nature at the end of the scene.`
                        ]
                    }
                }),
                {
                    themes: {
                        any: ['nature']
                    },
                    rarity: {
                        lte: 'rare'
                    },
                    UUIDs: {
                        none: ['weapon-animal-transformation']
                    }
                }),
            new ProviderElement('summon-animal-strong',
                mkGen((rng, weapon) => {
                    const quantity = ['' as const, '1d6 ' as const, '2d6 ' as const].choice(rng);

                    const sharedAnimals: Record<(typeof quantity), string[]> = {
                        '': ['an elephant', 'a rhino', 'a bear', 'a dire wolf', 'a giant carnivorous snail', 'a moose', 'a honey badger', 'a silverback gorilla'],
                        '1d6 ': ['giant sea termites', 'giant fire ants', 'lions', 'tigers', 'caracals', 'apes', 'kangaroos', 'horses', 'boars'],
                        '2d6 ': ['rats', 'wolves', 'coyotes', 'beavers', 'owls', 'hawks', 'alpacas', 'ostriches', 'peacocks']
                    }

                    const animalsByTheme = {
                        '': {
                            fire: ['a phoenix'],
                            ice: ['an akhlut', 'a white tiger', 'a polar bear', "an elephant seal"],

                            cloud: ['a giant eagle', 'a wyvern', 'a kelpie', "a pegasus", 'a living cloud'],
                            earth: ['a giant death worm', 'a giant enemy crab'],

                            light: ["a pegasus", "a living star"],
                            dark: ["a cave troll", "a land shark", "an evil and intimidating horse"],

                            sour: ["a giant acid-spitting insect"],
                            sweet: ["a giant mosquito from the sugar swamps (targets save or suffer high blood sugar)"],

                            wizard: ["a witch's walking hut", "a unicorn", "a griffin", "a hippogriff"],
                            steampunk: ["motor snail (stats as horse, but twice as fast)"]
                        },
                        '1d6 ': {
                            fire: ["sapient jackals (stats as rogue/thief of ½ wielder's level)", "camels"],
                            ice: ['winter wolves', 'emperor penguins'],

                            light: ["sun dogs", "moon dogs"],
                            dark: ['hell hounds', 'zombie wolves'],

                            sour: ['giant plague rats', "giant bombardier beetles"],
                            sweet: ['fudge foxes'],

                            wizard: ['treasure chest mimic', 'flamingos'],
                        },
                        '2d6 ': {
                            ice: ['arctic foxes', 'rockhopper penguins'],
                            fire: ["magma toads", "fennec foxes"],

                            cloud: ['hawks', 'eagles', 'flying fish'],
                            earth: ['giant naked mole rats'],

                            light: ["ray cats", "scarab beetles"],
                            dark: ['murder hornets'],

                            sweet: ["candy cats", "caramel cats", "marzipan mice", "bumblebees"],
                            sour: ['lemon frogs', 'bombardier beetles'],

                            wizard: ['coin mimics', 'ink pot mimics'],
                        }
                    } as const satisfies Record<typeof quantity, Partial<Record<Theme, string[]>>>;

                    const themeSpecificAnimals = pickForTheme(weapon, animalsByTheme[quantity] as Record<keyof (typeof animalsByTheme)[typeof quantity], string[]>, rng) ?? [];

                    const allAnimals = [...sharedAnimals[quantity], ...themeSpecificAnimals];

                    return {

                        desc: 'Summon Animal',
                        cost: 5,
                        additionalNotes: [
                            `Call ${quantity}${allAnimals.choice(rng)} to your aid. ${quantity === '' ? 'It returns' : 'They return'} to nature at the end of the scene.`
                        ]
                    }
                }), {
                themes: {
                    any: ['nature']
                },
                rarity: {
                    gte: 'epic'
                },
                UUIDs: {
                    none: ['weapon-animal-transformation']
                }
            }),
            new ProviderElement('immovable-bc-earth', {
                desc: 'Immovable',
                cost: 1,
                additionalNotes: [
                    "If something attempts to move you against your will, you can expend a charge to be unaffected by it."
                ]
            },
                {
                    themes: { any: ['earth'] },
                    UUIDs: {
                        none: ['immovable-bc-weapon-shape']
                    }
                }
            ),
            new ProviderElement('immovable-bc-weapon-shape', {
                desc: 'Immovable',
                cost: 1,
                additionalNotes: [
                    "If something attempts to move you against your will, you can expend a charge to be unaffected by it."
                ]
            },
                {
                    shapeFamily: {
                        any: ['greatsword', 'greatsword']
                    },
                    UUIDs: {
                        none: ['immovable-bc-earth']
                    }
                }
            ),
            new ProviderElement('detachable-gems', {
                desc: 'Gem of Greed',
                cost: 'you choose the number of charges to expend',
                additionalNotes: [
                    'The weapon has gems embedded throughout. You can expend charges to pry one off.',
                    'NPCs that see the gem must save or be magically compelled to take it.',
                    'Affects a number of characters equal to the charges expended.'
                ]
            }, {
                themes: { any: ['earth'] },
            }),
            new ProviderElement('ultimate-attack', {
                desc: 'Ultimate Anime Attack',
                cost: 'all charges',
                additionalNotes: [
                    "This attack always hits. It deals damage = weapon damage × number of charges remaining.",
                    'Afterwards, the weapon explodes and is destroyed.'
                ],
                bonus: {
                    addChargedPowers: 1
                }
            }, {
                rarity: {
                    lte: 'rare'
                },
                shapeParticular: {
                    any: animeWeaponShapes
                }
            }),
            new ProviderElement('instant-door',
                mkGen((rng, weapon) => {
                    const wholeAbilityByTheme = {
                        fire: {
                            desc: 'Arc Cutter',
                            cost: 6,
                            additionalNotes: [
                                "A thin blade of fire surges from the weapon's tip, lasting for 1 minute.",
                                "It can cut through up to a foot of metal (or similar material)."
                            ]
                        },
                        sour: {
                            desc: 'Arc Cutter',
                            cost: 6,
                            additionalNotes: [
                                "The weapon glows with caustic energy, lasting for 1 minute.",
                                "It can melt through organic materials, metal, and stone (but not glass)."
                            ]
                        },
                        wizard: {
                            desc: 'Instant Door',
                            cost: 6,
                            additionalNotes: [
                                "Trace the outline of the doorway on a surface using the weapon. A moment later, it's magically created.",
                                "The door can punch through a thin sheet of metal (except lead), or 10-ft of any other material."
                            ]
                        }
                    } satisfies Partial<Record<Theme, ActivePower>>;

                    return pickForTheme(weapon, wholeAbilityByTheme, rng);
                }), {
                rarity: {
                    gte: 'rare'
                },
                themes: {
                    any: ['fire', 'wizard', 'sour']
                }
            }
            ),
            new ProviderElement('acid-etch', {
                desc: 'Spray',
                cost: 1,
                additionalNotes: [
                    "The weapon sprays acid in a precise pattern, etching an image of your choice onto a surface.",
                ]
            }, {
                themes: {
                    any: ['sour']
                }
            }),
            new ProviderElement('radial-slam', {
                desc: 'Slam',
                cost: 3,
                additionalNotes: [
                    "Slam the weapon into the ground, emitting a circular shockwave.",
                    new StringGenerator(["Characters within 20-ft must save, or be knocked down & take ", mkGen((_rng, weapon) => {
                        // it deals damage equal to 3 * the weapon's 
                        const { as, d6, ...rest } = weapon.damage;
                        const slamDamage = _.mapValues(
                            {
                                d6: 1 + (d6 ?? 0),
                                ...rest
                            },
                            x => x === undefined ? undefined : x * 3
                        );

                        return textForDamage(slamDamage)
                    }), " damage"])

                ]
            }, {
                themes: {
                    any: ['earth']
                },
                UUIDs: {
                    none: ['linear-slam']
                }
            }),
            new ProviderElement('linear-slam', {
                desc: 'Slam',
                cost: 3,
                additionalNotes: [
                    "Slam the weapon into the ground, emitting a shockwave that travels straight ahead for 60-ft.",
                    new StringGenerator(["Characters hit by the wave must save, or be knocked down & take ", mkGen((_rng, weapon) => {
                        // it deals damage equal to 3 * the weapon's 
                        const { as, d6, ...rest } = weapon.damage;
                        const slamDamage = _.mapValues(
                            {
                                d6: 1 + (d6 ?? 0),
                                ...rest
                            },
                            x => x === undefined ? undefined : x * 3
                        );
                        return textForDamage(slamDamage)
                    }), " damage"])
                ]
            }, {
                themes: {
                    any: ['earth']
                },
                UUIDs: {
                    none: ['radial-slam']
                }
            }),
            new ProviderElement('metaphysical-edit', {
                desc: 'Edit',
                cost: 3,
                additionalNotes: [
                    "Strike at the platonic form of an object, removing a letter from its name.",
                    "It physically transforms into the new object."
                ]
            }, {
                themes: {
                    any: ['wizard']
                },
                shapeFamily: {
                    any: edgedWeaponShapeFamilies
                },
            }),
            new ProviderElement('gravity-gun', {
                desc: 'Kinesis',
                cost: 1,
                additionalNotes: [
                    mkGen((rng, weapon) => {
                        const effects = {
                            fire: 'The weapon emit a fiery whip.',

                            light: 'The weapon emits a tether of luminous energy.',

                            cloud: "The weapon emits a vortex of air.",

                            nature: "A sturdy vine grows from the weapon's tip.",
                        } satisfies Partial<Record<Theme, string>>;

                        const tetherTheme = pickForTheme(weapon, effects, rng);
                        //const tetherTheme = typeof chosen === "string" ? chosen : chosen(rng)

                        return `${tetherTheme} It can lift and throw object an weighing up to 500 lbs.`;
                    })
                ]
            }, {
                themes: {
                    any: ['light', 'fire', 'nature', 'cloud']
                },
            }),
            new ProviderElement('frostbound', {
                desc: 'Bind',
                cost: 1,
                additionalNotes: [
                    'Lock a mechanism in place with magical ice as strong as steel.',
                    'It stays frozen for 2d6 × 10 minutes.'
                ]
            }, {
                themes: {
                    any: ['ice']
                }
            }),
            new ProviderElement('rally-person', {
                desc: 'Rally',
                cost: 1,
                additionalNotes: [
                    'Targets one non-hostile character.',
                    'For the rest of the day, their morale cannot break.'
                ]
            }, {
                themes: {
                    any: ['light', 'steampunk']
                }
            }),
            new ProviderElement('homing-shot', {
                desc: 'Homing Shot',
                cost: 1,
                additionalNotes: [
                    'Fire an enchanted shot, which always hits.'
                ]
            }, {
                shapeFamily: {
                    any: ['sword (or bow)', 'dagger (or pistol)', 'sword (or musket)', 'greataxe (or musket)']
                }
            }),
            new ProviderElement('binding-shot', {
                desc: 'Binding Shot',
                cost: 2,
                additionalNotes: [
                    'Fire an enchanted shot, which anchors the target to a nearby surface.',
                    'They are stuck in place until they use their turn to successfully save and escape.'
                ]
            }, {
                themes: { any: ['nature', 'ice'] },
                shapeFamily: {
                    any: ['sword (or bow)', 'dagger (or pistol)', 'sword (or musket)', 'greataxe (or musket)']
                }
            }),
            new ProviderElement('black-flame-blast', {
                desc: 'Black Flame Blast',
                cost: 3,
                additionalNotes: [
                    'Summon a 20-ft cone of black flame, which deals 4d6 damage.',
                    'Damage inflicted by black flames can only be healed by magic.'
                ]
            }, {
                themes: { all: ['dark', 'fire'] }
            }),

            new ProviderElement("summon-structure0",
                mkGen((rng, weapon) => {
                    const effects = {
                        ice: ['Ice Maker', 'Call forth a tempest of frigid air, which freezes into', 'of solid ice'],
                        fire: ['Pile of Glass', 'Molten glass bursts from the weapon, levitating into place to form', 'entirely of glass'],

                        light: ['Fantasy Form', 'Light emanates from the weapon, forming', 'of hard-light'],
                        dark: ['Dark Reflection', 'Rivers of shadow burst from the weapon, forming into', 'of pure darkness'],

                        wizard: ['Creation', 'Magically summon', 'of partially opaque magical force'],

                        sweet: ['Caramel Creation', 'Threads of molten sugar burst from the weapon, spinning into', 'of solid sugar'],
                    } as const satisfies Partial<Record<Theme, [string, string, string]>>;
                    const [desc, howItsMade, madeOf] = pickForTheme(weapon, effects, rng);
                    return {
                        desc,
                        cost: `a charge per month that an expert would need to produce a regular version of the object, rounding up`,
                        additionalNotes: [
                            `${howItsMade} a facsimile of an object of your choice. It's made ${madeOf}.`,
                            "Only replicates the structure of the object, not any special functions. Its magical nature is obvious at a glance."
                        ]
                    }
                }),
                {
                    themes: { any: ["fire", "ice", "dark", "light", "wizard", "sweet"] },
                }
            ),
            new ProviderElement('smoke-bomb', {
                desc: 'Smog',
                cost: 2,
                additionalNotes: [
                    'A cloud of black smoke billows from the weapon, filling up to 27,000 ft³. It chokes characters and is highly flammable.'
                ]
            }, {
                themes: {
                    any: ['fire', 'dark']
                }
            })
        ]
    },
    passives: {
        add: [
            new ProviderElement("potion-resistant",
                {
                    miscPower: true,
                    desc: "The effects of harmful potions and poisons on the wielder are halved.",
                },
                {
                    themes: {
                        any: ["wizard", "sour"],
                    },
                }
            ),
            new ProviderElement("psi-immune",
                {
                    miscPower: true,
                    desc: "When the wielder saves against psionic effects, the effect of all relevant skills or bonuses is doubled.",
                    descriptorPartGenerator: 'material-telekill'
                },
                {
                    themes: {
                        any: ["earth"],
                    },
                }
            ),
            new ProviderElement("detect-unholy",
                mkGen(rng => {
                    return {
                        miscPower: true,
                        desc: new StringGenerator([
                            mkGen("Glows like a torch when "),
                            pluralUnholyFoe,
                            mkGen(" are near")
                        ]).generate(rng)
                    }
                }),
                {

                    themes: {
                        any: ["light"],
                    },
                }
            ),
            new ProviderElement("command-critters",
                {
                    miscPower: true,
                    desc: "Cute animals follow the wielder's polite requests i.e. cats and forest birds."
                },
                {

                    themes: {
                        any: ["nature", "sweet"]
                    }
                }
            ),
            new ProviderElement("detect-unholy",
                {
                    miscPower: true,
                    desc: "The weapon can telepathically control bees within 100-ft. They can only understand simple commands."
                },
                {

                    themes: {
                        any: ["nature", "sweet"]
                    }
                }
            ),
            new ProviderElement("focus-light-beam",
                mkGen(rng => ({
                    miscPower: true,
                    desc: new StringGenerator(["Can reflect and focus ", mkGen((rng) => ["sun", "moon"].choice(rng)), "light as a damaging beam (2d6 damage)."]).generate(rng)
                })),
                {

                    themes: { any: ["light"] }
                }
            ),
            new ProviderElement("move-silently",
                {
                    miscPower: true,
                    desc: "Wielder is able to move completely silently.",
                },
                {

                    shapeFamily: {
                        any: [
                            "dagger",
                            "club"
                        ]
                    },
                    rarity: {
                        gte: "epic"
                    }
                }
            ),
            new ProviderElement("magically-hovers",
                {
                    miscPower: true,
                    desc: "Can hover in the air to attack for you hands free. Commanding a floating weapon uses the same rules as followers / retainers.",
                },
                {

                    rarity: {
                        gte: "rare"
                    },
                    themes: {
                        any: [
                            "cloud",
                            "wizard"
                        ]
                    }
                }
            ),
            new ProviderElement("resistance-fire",
                {
                    miscPower: true,
                    desc: "Wielder takes half damage from fire."
                },
                {

                    themes: { any: ["fire"] },
                    rarity: {
                        lte: "uncommon"
                    }
                }
            ),
            new ProviderElement("immunity-fire",
                {

                    miscPower: true,
                    desc: "Wielder cannot be harmed by fire.",
                },
                {

                    themes: { any: ["fire"] },
                    rarity: {
                        gte: "rare"
                    }
                }
            ),
            new ProviderElement("damage-bonus-fire",
                {
                    miscPower: true,
                    bonus: {
                        addDamageDie: {
                            d6: 1
                        }
                    },
                    descriptorPartGenerator: 'descriptor-wreathed-fire'
                },
                {

                    themes: { any: ["fire"] },
                    UUIDs: {
                        none: ['damage-bonus-dark-fire', 'damage-bonus-ice', 'damage-bonus-ice-blunt']
                    }
                }
            ),
            new ProviderElement("expertise-blacksmithing",
                {

                    miscPower: true,
                    desc: "Weapon is an expert blacksmith.",
                },
                {

                    themes: { any: ["fire"] },
                    isSentient: true
                }
            ),
            new ProviderElement("resistance-cold",
                {

                    miscPower: true,
                    desc: "Wielder takes half damage from ice & cold."
                },
                {

                    themes: { any: ["ice"] },
                    rarity: {
                        lte: "uncommon"
                    }
                }
            ),
            new ProviderElement("immunity-cold",
                {
                    miscPower: true,
                    desc: "Wielder cannot be harmed by ice & cold."
                },
                {

                    themes: { any: ["ice"] }
                }
            ),
            new ProviderElement("damage-bonus-ice-blunt",
                {
                    miscPower: true,
                    desc: undefined,
                    bonus: {
                        addDamageDie: {
                            d6: 1
                        }
                    },
                    descriptorPartGenerator: 'descriptor-wreathed-ice'
                },
                {

                    themes: { any: ["ice"] },
                    shapeFamily: {
                        none: [
                            "dagger",
                            "sword",
                            "greatsword"
                        ]
                    },
                    UUIDs: {
                        none: ['damage-bonus-dark-fire', 'damage-bonus-ice', 'damage-bonus-dark-fire']
                    }
                }
            ),
            new ProviderElement("damage-bonus-ice-sharp",
                {
                    miscPower: true,
                    desc: "Wreathed in ice, always frozen into its sheath. Requires a strength save to draw.",
                    bonus: {
                        addDamageDie: {
                            d10: 1
                        }
                    },
                    descriptorPartGenerator: 'descriptor-wreathed-ice'
                },
                {

                    themes: { any: ["ice"] },
                    shapeFamily: {
                        any: [
                            "dagger",
                            "sword",
                            "greatsword"
                        ]
                    },
                    UUIDs: {
                        none: ['damage-bonus-fire', 'damage-bonus-dark-fire', 'damage-bonus-ice-blunt']
                    }
                }
            ),
            new ProviderElement("sense-cold-weather",
                {
                    miscPower: true,
                    desc: "1-in-2 chance to sense icy weather before it hits, giving just enough time to escape."
                },
                {

                    themes: { any: ["ice"] }
                }
            ),
            new ProviderElement("walk-on-ice",
                {

                    miscPower: true,
                    desc: "Wielder can walk on any kind of ice without breaking it."
                },
                {

                    themes: { any: ["ice"] }
                }
            ),
            new ProviderElement("vibe-menacing",
                {

                    miscPower: true,
                    desc: "Menacing aura. Bonus to saves to frighten & intimidate."
                },
                {
                    themes: { any: ["dark"] }
                }
            ),
            new ProviderElement("trap-souls",
                {

                    miscPower: true,
                    desc: "Traps the souls of its victims.",
                    additionalNotes: [
                        "Their ghosts are bound to the weapon, and obey the wielder's commands.",
                        "Can store up to 4 ghosts, and starts with 1d4 already inside."
                    ]
                },
                {
                    themes: { any: ["dark"] },
                    rarity: {
                        gte: 'rare'
                    }
                }
            ),
            new ProviderElement("damage-bonus-dark-flame",
                {
                    miscPower: true,
                    bonus: {
                        addDamageDie: {
                            d6: 1
                        }
                    },
                    descriptorPartGenerator: 'descriptor-wreathed-dark-fire'
                },
                {
                    themes: { any: ["dark"] },
                    UUIDs: {
                        none: ['damage-bonus-fire', 'damage-bonus-ice', 'damage-bonus-ice-blunt']
                    }
                }
            ),
            new ProviderElement("resistance-radiant",
                {
                    miscPower: true,
                    desc: "Wielder takes half damage from rays & beams."

                },
                {
                    themes: { any: ["light"] },
                    rarity: {
                        lte: "uncommon"
                    }
                }
            ),
            new ProviderElement("immunity-radiant",
                {

                    miscPower: true,
                    desc: "Wielder is immune to the harmful effects of rays & beams."
                },
                {
                    themes: { any: ["light"] }
                }
            ),
            new ProviderElement("stats-as-mirror",
                {
                    miscPower: true,
                    desc: "Extremely shiny, functions as a mirror."
                },
                {
                    themes: { any: ["light"] }
                }
            ),
            new ProviderElement("vibe-wholesome",
                {
                    miscPower: true,
                    desc: "Wielder has a wholesome aura. Bonus to saves to spread cheer and/or appear nonthreatening."
                },
                {
                    themes: { any: ["light", "sweet"] }
                }
            ),
            new ProviderElement("TODO",
                {
                    miscPower: true,
                    desc: "Weapon is an expert chef.",
                },
                {
                    themes: { any: ["sweet"] },
                    isSentient: true
                }
            ),
            new ProviderElement("magically-learn-dessert-recipes",
                {
                    miscPower: true,
                    desc: "The wielder magically knows the recipe of any dessert they taste."
                },
                {
                    themes: { any: ["sweet"] }
                }
            ),
            new ProviderElement("eat-to-heal",
                {

                    miscPower: true,
                    desc: "Eat business end to heal HP equal to damage roll. Renders weapon unusable until it reforms, 24 hours later.",
                    descriptorPartGenerator: 'eat-to-heal-forced'
                },
                {
                    themes: { any: ["sweet"] }
                }
            ),
            new ProviderElement("expertise-alchemy",
                {

                    miscPower: true,
                    desc: "Weapon is an expert alchemist.",
                },
                {
                    themes: { any: ["sour"] },
                    isSentient: true
                }
            ),
            new ProviderElement("resistance-acid",
                {
                    miscPower: true,
                    desc: "Wielder takes half damage from corrosive chemicals."

                },
                {
                    themes: { any: ["sour"] },
                    rarity: {
                        lte: "uncommon"
                    }
                }
            ),
            new ProviderElement("immunity-acid",
                {
                    miscPower: true,
                    desc: "Wielder is immune to the harmful effects of corrosive chemicals."
                },
                {
                    themes: { any: ["sour"] }
                }
            ),
            new ProviderElement("tastes-sour",
                {
                    miscPower: true,
                    desc: "Licking the weapon cures scurvy. It tastes sour."
                },
                {
                    themes: { any: ["sour"] }
                }
            ),
            new ProviderElement("expertise-astrology",
                {
                    miscPower: true,
                    desc: "Weapon is an expert astrologer.",
                },
                {
                    themes: { any: ["wizard"] },
                    isSentient: true
                }
            ),
            new ProviderElement("fire-magic-projectile",
                {
                    miscPower: true,
                    desc: "If you are not wounded, the weapon can also fire a spectral copy of itself as a projectile attack. Damage as weapon, range as bow.",
                },
                {
                    themes: { any: ["wizard"], },
                    rarity: {
                        gte: "rare"
                    }
                }
            ),
            new ProviderElement("attack-wisps",
                {
                    miscPower: true,
                    desc: "Each blow you land with the weapon generates a wisp, which dissipate when combat ends. On your turn, you can launch any number of wisps (instantly / as no action). d4 damage, range as bow.",
                },
                {
                    themes: { any: ["wizard"] },
                    rarity: {
                        gte: "epic"
                    }
                }
            ),
            new ProviderElement("expertise-tinker",
                {
                    miscPower: true,
                    desc: "Weapon is an expert tinkerer.",
                },
                {
                    isSentient: true,
                    themes: { any: ["steampunk"] },
                }
            ),
            new ProviderElement("integrated-compass",
                {

                    miscPower: true,
                    desc: "Wielder always knows which way is north.",
                    descriptorPartGenerator: "descriptor-compass-embed-forced"
                },
                {
                    themes: { any: ["steampunk"] },
                    shapeFamily: {
                        none: shapeFamiliesWithoutPommels
                    },
                    UUIDs: {
                        none: ['integrated-clock']
                    }
                }
            ),
            new ProviderElement("integrated-clock",
                {
                    miscPower: true,
                    desc: "A widget on the weapon displays the time.",
                    descriptorPartGenerator: "descriptor-clock-embed-forced"
                },
                {
                    themes: { any: ["steampunk"] },
                    shapeFamily: {
                        none: shapeFamiliesWithoutPommels
                    },
                    UUIDs: {
                        none: ['integrated-compass']
                    }
                }
            ),
            new ProviderElement("shoot-water",
                {
                    miscPower: true,
                    desc: "Can shoot an endless stream of water from its tip, pressure as garden hose."
                },
                {
                    themes: { any: ["cloud"] },
                }
            ),
            new ProviderElement("stealth-in-rough-weather",
                {
                    miscPower: true,
                    desc: "Wielder gains a stealth bonus during rain & snow, as if invisible.",
                },
                {
                    themes: { any: ["cloud"] },
                    shapeFamily: {
                        any: [
                            "dagger",
                            "club"
                        ]
                    }
                }
            ),
            new ProviderElement("can-fly",
                mkGen((rng, weapon) => {
                    const reasonsToFly = {
                        fire: new StringGenerator([
                            "While using the weapon, you can ",
                            mkGen((rng) => [
                                "use the weapon to wreathe yourself in flames. This allows you to fly for some reason",
                                "summon a pair of fiery wings. They allows you to fly",
                            ].choice(rng)),
                            ", as fast as you can walk."
                        ]),

                        cloud: "The weapon can magically summon a small cloud. You can use it to fly, as fast as you can walk.",
                        earth: "The weapon contains a lodestone. You can its magnetism to fly, as fast as you can walk.",

                        light: new StringGenerator([
                            "While using the weapon, you can summon ",
                            mkGen((rng) => [
                                "wings of light",
                                "a pair of angel wings",
                            ].choice(rng)),
                            ". They allow you to fly, as fast as you can walk."
                        ]),

                        dark: new StringGenerator([
                            "While using the weapon, you can summon ",
                            mkGen((rng) => [
                                "wings of black-light",
                                "a pair of skeletal wings",
                                "a pair of demonic wings",
                                "a pair of dark & blood-stained angel wings",
                                "wings made from pure darkness"
                            ].choice(rng)),
                            ". They allow you to fly, as fast as you can walk."
                        ]),
                        wizard: "You can magically levitate, as fast as you can walk.",

                        steampunk: "The weapon can detach a series of jet-powered widgets. You can use them to fly, as fast as you can walk.",
                        nature: new StringGenerator([
                            "While using the weapon, you can summon a pair of ",
                            mkGen((rng) => [
                                "bird",
                                "bat",
                                "butterfly",
                                "fairy",
                                "moth",
                                "bee",
                                "dragonfly",
                                "pterodactyl"
                            ].choice(rng)),
                            " wings. They allow you to fly, as fast as you can walk."
                        ])
                    } as const;

                    const desc = genMaybeGen(pickForTheme(weapon, reasonsToFly, rng), rng);

                    return {
                        miscPower: true,
                        desc,
                    }
                }
                ),
                {
                    themes: { any: ["cloud", "wizard"] },
                    rarity: {
                        gte: "legendary"
                    }
                }
            ),
            new ProviderElement("immunity-petrify",
                {

                    miscPower: true,
                    desc: "Wielder cannot be petrified."
                },
                {
                    themes: { any: ["earth"] },
                }
            ),
            new ProviderElement("expertise-jeweller",
                {
                    miscPower: true,
                    desc: "Weapon is an expert jeweller. It can identify any gemstone.",
                },
                {
                    themes: { any: ["earth"] },
                }
            ),
            new ProviderElement("stats-as-shield",
                {
                    miscPower: true,
                    desc: "Stats as (function as) a shield."
                },
                {
                    themes: { any: ["earth"] },
                }
            ),
            new ProviderElement('weapon-permanently-invisible',
                {
                    miscPower: true,
                    desc: 'The weapon is completely invisible, except to its wielder.'
                },
                {
                    themes: {
                        any: ['light']
                    },
                    rarity: {
                        gte: 'epic'
                    },
                    isSentient: true // If it can't call out to you, how will you know it's there?
                }
            ),
            new ProviderElement('instant-recall',
                {
                    miscPower: true,
                    desc: "The wielder can summon the weapon into their hand at will, so long as it's on the same plane."
                },
                {
                    rarity: {
                        gte: 'rare'
                    },
                    UUIDs: {
                        none: ['magic-pocket']
                    }
                }
            ),
            new ProviderElement('magic-pocket',
                {
                    miscPower: true,
                    desc: "The wielder can banish the weapon to a pocket plane, then withdraw it at will."
                },
                {
                    rarity: {
                        gte: 'epic'
                    },
                    shapeFamily: {
                        none: twoHandedWeaponShapeFamilies
                    },
                    UUIDs: {
                        none: ['instant-recall']
                    }
                }
            ),
            new ProviderElement("petrify-on-hit",
                {

                    miscPower: true,
                    desc: "Unaware targets that are hit by the weapon must save or be petrified.",
                },
                {
                    themes: { any: ["earth"] },
                    rarity: {
                        gte: "rare"
                    },
                    shapeFamily: {
                        any: [
                            "dagger"
                        ]
                    }
                }
            ),
            new ProviderElement('antimagic-aura',
                {
                    miscPower: true,
                    desc: "Magical effects will not function within 10-ft of the weapon, except those generated by it. The aura is inactive while the weapon is sheathed."
                },
                {
                    rarity: {
                        gte: 'legendary'
                    },
                    themes: { none: ['wizard'] },
                    UUIDs: {
                        none: ['silence-aura', 'fire-aura', 'mist-aura', 'ice-aura']
                    }
                }
            ),
            new ProviderElement('silence-aura',
                {
                    miscPower: true,
                    desc: "All sound is erased within 10-ft of the weapon. The aura is inactive while the weapon is sheathed."
                },
                {
                    rarity: {
                        gte: 'epic'
                    },
                    themes: { none: ['wizard', 'fire'] },
                    UUIDs: {
                        none: ['antimagic-aura', 'fire-aura', 'mist-aura', 'ice-aura']
                    }
                }
            ),
            new ProviderElement('fire-aura',
                {
                    miscPower: true,
                    desc: "The weapon emits a 10-ft aura of flames, which sets foes and objects alight. The aura is inactive while the weapon is sheathed."
                },
                {
                    rarity: {
                        gte: 'legendary'
                    },
                    themes: { any: ['fire'] },
                    UUIDs: {
                        none: ['silence-aura', 'antimagic-aura', 'mist-aura', 'ice-aura']
                    }
                }
            ),
            new ProviderElement('mist-aura',
                {
                    miscPower: true,
                    desc: "The weapon emits a 30-ft cloud of magical mist, which the wielder can see through clearly. When the weapon is sheathed, the mist is sucked inside."
                },
                {
                    rarity: {
                        gte: 'legendary'
                    },
                    themes: { any: ['cloud'] },
                    UUIDs: {
                        none: ['silence-aura', 'antimagic-aura', 'fire-aura', 'ice-aura']
                    }
                }
            ),
            new ProviderElement('ice-aura',
                {
                    miscPower: true,
                    desc: "The weapon emits a 30-ft aura of frost. It freezes objects, and foes move half as fast within it. The aura is inactive while the weapon is sheathed."
                },
                {
                    rarity: {
                        gte: 'legendary'
                    },
                    themes: { any: ['ice'] },
                    UUIDs: {
                        none: ['silence-aura', 'antimagic-aura', 'fire-aura', 'mist-aura']
                    }
                }
            ),
            new ProviderElement<TGenerator<PassivePower, [Weapon]>, WeaponPowerCond>(
                "death-blast",
                mkGen<PassivePower, [Weapon]>((rng, weapon) => {
                    type WeaponEnergyEffect = {
                        /**
                         * Text for the effect.
                         */
                        desc: string,
                        /**
                         * UUID of the feature that should be added to the weapon, if any.
                         */
                        featureUUID?: string,
                    };

                    const fallBack = {
                        desc: 'void energy',
                        featureUUID: 'energy-core-void'
                    } satisfies WeaponEnergyEffect;

                    const effects = {
                        ice: {
                            desc: 'icy wind',
                            featureUUID: 'energy-core-ice'
                        },
                        fire: {
                            desc: 'fire',
                            featureUUID: 'energy-core-fire'
                        },

                        cloud: {
                            desc: 'lightning',
                            featureUUID: 'energy-core-aether'
                        },

                        light: mkGen<WeaponEnergyEffect>((rng) => (([
                            {
                                desc: 'ultraviolet energy',
                                featureUUID: 'energy-core-ultraviolet'
                            },
                            {
                                desc: 'azure energy',
                                featureUUID: 'energy-core-azure'
                            },
                            {
                                desc: 'crimson energy',
                                featureUUID: 'energy-core-crimson'
                            },
                            {
                                desc: 'verdant energy',
                                featureUUID: 'energy-core-verdant'
                            },
                            {
                                desc: 'atomic energy',
                                featureUUID: 'energy-core-atomic'
                            },
                            {
                                desc: 'golden energy',
                                featureUUID: 'energy-core-gold'
                            },
                        ] satisfies WeaponEnergyEffect[])).choice(rng)),
                        dark: {
                            desc: 'dark energy',
                            featureUUID: 'energy-core-dark'
                        },

                        steampunk: {
                            desc: 'lightning',
                            featureUUID: 'energy-core-steampunk'
                        },
                    } satisfies Partial<Record<Theme, WeaponEnergyEffect | TGenerator<WeaponEnergyEffect, [Weapon]>>>;
                    const { desc, featureUUID } = genMaybeGen(pickForTheme(weapon, effects, rng) ?? fallBack, rng);

                    const damageByRarity: Record<WeaponRarity, `${number}${keyof Omit<DamageDice, 'const'>}`> = {
                        common: "1d6",
                        uncommon: "1d6",
                        rare: "1d6",
                        epic: "1d6",
                        legendary: "2d6"
                    }

                    return {
                        miscPower: true,

                        desc: `Anything killed by the weapon explodes in a blast of ${desc}. The blast deals ${damageByRarity[weapon.rarity]} damage, with a range of 10-ft. It does not harm the wielder.`,
                        descriptorPartGenerator: featureUUID
                    }
                }),
                {
                    themes: { any: ['fire', 'ice', 'light', 'dark', 'cloud', 'steampunk'] },
                    rarity: { gte: 'epic' }
                }
            ),
            new ProviderElement('warm-to-touch',
                {
                    miscPower: true,
                    desc: "The weapon is always warm to the touch."
                },
                {
                    rarity: {
                        eq: 'common'
                    },
                    themes: { any: ['fire'] }
                }
            ),
            new ProviderElement('cold-to-touch',
                {
                    miscPower: true,
                    desc: "The weapon is always cold to the touch."
                },
                {
                    rarity: {
                        eq: 'common'
                    },
                    themes: { any: ['ice'] }
                }
            ),
            new ProviderElement('shrink-or-grow',
                {
                    miscPower: true,
                    desc: "Can transform into a 10-ft pole, or shrink to the size of a toothpick."
                },
                {
                    shapeFamily: {
                        any: ['club', 'staff']
                    }
                }
            ),
            new ProviderElement('the-axe',
                {
                    miscPower: true,
                    desc: "The weapon is also a guitar. Your musical skill is doubled when you play it."
                },
                {
                    rarity: {
                        gte: 'epic'
                    },
                    shapeFamily: {
                        any: ['axe', 'greataxe']
                    },
                }
            ),
            new ProviderElement('the-horn',
                {
                    miscPower: true,
                    desc: "The weapon is also a horn. Your musical skill is doubled when you play it."
                },
                {
                    rarity: {
                        gte: 'epic'
                    },
                    shapeFamily: {
                        any: ['club']
                    },
                }
            ),
            new ProviderElement('slenderblade',
                {
                    miscPower: true,
                    desc: "A mass of shadowy tentacles form around the wielder's shoulders. They function as an additional pair of arms."
                },
                {
                    themes: {
                        any: ['dark']
                    }
                }
            ),
            new ProviderElement("transform-tool",
                mkGen((rng, weapon) => {
                    const isRare = gte(weapon.rarity, 'epic');

                    const toolType = {
                        ice: ['a set of ice picks', isRare ? 'a snowboard. Tricks restore charges (other players rate 0-5, then take average)' : 'a snowboard'],
                        fire: ['a lighter', 'an empty brass brazier'],

                        cloud: [isRare ? 'a surfboard. Tricks restore charges (other players rate 0-5, then take average)' : 'a surfboard', 'an umbrella'],
                        earth: [isRare ? 'a pickaxe. Its magic allows one person to do the work of a dozen miners.' : 'a pickaxe', isRare ? 'a shovel. Its magic allows one person to do the work of a dozen diggers' : 'a shovel'],

                        sweet: ['a whisk', isRare ? 'an empty biscuit tin. A single object can be placed inside, stored in a pocket dimension when it turns back into its regular form' : 'an empty biscuit tin'],

                        wizard: [isRare ? 'a quill. It has a limitless supply of ink, in any color' : 'a quill'],

                        steampunk: ['a wrench', isRare ? 'a skateboard. Tricks restore charges (other players rate 0-5, then take average)' : 'a skateboard'],
                        nature: [isRare ? 'a smoking pipe. Its magic allows the user to control the smoke, directing it into any shape' : 'a smoking pipe', 'a bouquet of flowers'],

                    } satisfies Partial<Record<Theme, string[]>>;

                    const chosenTool = choice(pickForTheme(weapon, toolType, rng), rng);
                    return {
                        miscPower: true,
                        desc: `Can transform into ${chosenTool}.`
                    }
                }),
                {
                    themes: { any: ["ice", "fire", "cloud", "earth", "nature", "steampunk", "wizard", "sweet"] },
                }
            ),
            new ProviderElement('injector-module', {
                miscPower: true,
                desc: 'Has a small vial embedded in the grip, which can be filled with fluid. When you land a blow with the weapon, you may expend the liquid, injecting it into the target.',
                descriptorPartGenerator: 'injector-module-forced'
            }, {
                themes: {
                    any: ['sour'],
                },
                shapeParticular: {
                    any: pointedWeaponShapes
                }
            })
            // new ProviderElement<MiscPower, WeaponPowerCond>("TODO",
            //     {

            //     },
            //     {
            //         themes: { any: ["TODO"] },
            //     }
            // ),
        ]
    },
    languages: {
        add: [
            ...(["The language of ice & snow."].map(x => toLang("ice", x))),
            ...(["The language of fire."].map(x => toLang("fire", x))),
            ...(["Angelic."].map(x => toLang("light", x))),
            ...(["Demonic."].map(x => toLang("dark", x)))
        ]
    },
    shapes: {
        add: [
            ...toProviderSource<string, (Pick<WeaponShape, "particular"> & WeaponPowerCond) | string, WeaponShape>(
                {
                    "club": [
                        {
                            particular: "Club",
                            rarity: {
                                lte: "uncommon"
                            }
                        },
                        {
                            particular: "Cudgel",
                            rarity: {
                                lte: "uncommon"
                            }
                        },
                        {
                            particular: "Rod",
                            rarity: {
                                lte: "uncommon"
                            }
                        }
                    ],
                    "staff": [
                        "Staff",
                        "Quarterstaff",
                        "Bo-Stick"
                    ],

                    "dagger": [
                        "Dagger",
                        "Knife",
                        "Dirk",
                        "Stiletto",
                        "Tanto",
                        "Khanjar",
                        "Kukri",
                    ],

                    "sword": [
                        "Longsword",
                        "Saber",
                        "Rapier",
                        "Foil",
                        "Epee",
                        "Machete",
                        "Scimitar",
                        "Gladius",
                        "Katana",
                        {
                            particular: "Flamberge",
                            rarity: {
                                gte: "rare"
                            }
                        },
                        {
                            particular: "Macuahuitl",
                            rarity: {
                                gte: "rare"
                            }
                        },
                        {
                            particular: "Khopesh",
                            rarity: {
                                gte: "rare"
                            }
                        },
                        {
                            particular: "Shotel",
                            rarity: {
                                gte: "rare"
                            }
                        },
                        {
                            particular: "Keyblade",
                            rarity: {
                                gte: "legendary"
                            }
                        }
                    ],
                    "axe": [
                        "Tomahawk",
                        "Hand-Axe",
                        "Axe",
                        "War-Axe",
                        "Battle-Axe"
                    ],
                    "mace": [
                        "Mace",
                        "Flail",
                        "Morning-Star",
                        "Shishpar",
                        "Nunchuks",
                        {
                            particular: "Meteor Hammer",
                            rarity: {
                                gte: "rare"
                            }
                        },
                        {
                            particular: "Double Flail",
                            rarity: {
                                gte: "rare"
                            }
                        },
                        {
                            particular: "Triple Flail",
                            rarity: {
                                gte: "epic"
                            }
                        },
                        {
                            particular: "Quadruple Flail",
                            rarity: {
                                gte: "legendary"
                            }
                        },
                        {
                            particular: "Quintuple Flail",
                            rarity: {
                                gte: "legendary"
                            },

                        }
                    ],

                    "greataxe": [
                        "Great-Axe",
                        {
                            particular: "Great-Scythe",
                            rarity: {
                                gte: "rare"
                            }
                        }
                    ],
                    "greatsword": [
                        "Greatsword",
                        "Claymore",
                        "Zweihander",
                        "Nodachi",
                        {
                            particular: "Ultra-Greatsword",
                            rarity: {
                                gte: "rare"
                            }
                        }
                    ],

                    "spear": [
                        "Spear",
                        "Trident",
                        {
                            particular: "Bident",
                            rarity: {
                                gte: "epic"
                            }
                        }
                    ],
                    "polearm": [
                        "Polearm",
                        "Halberd",
                        "Glaive",
                        "Naginata",
                        "Bardiche",
                        "Raven's Beak",
                        "Pike",
                        {
                            particular: "Crescent Blade",
                            rarity: {
                                gte: "legendary"
                            }
                        }
                    ],
                    "lance": [
                        "Lance"
                    ],

                    "sword (or bow)": [
                        {
                            particular: "Bladed Bow",
                            rarity: {
                                gte: "legendary"
                            }
                        }
                    ],
                    "dagger (or pistol)": [
                        {
                            particular: "Pistol Sword",
                            rarity: {
                                gte: "legendary"
                            }
                        }
                    ],
                    "sword (or musket)": [
                        {
                            particular: "Gunblade",
                            rarity: {
                                gte: "legendary"
                            }
                        }
                    ],
                    "greataxe (or musket)": [
                        {
                            particular: "Transforming Sniper Scythle",
                            rarity: {
                                gte: "legendary"
                            }
                        }
                    ]
                }, (k, shapeOrShapename) => {
                    switch (typeof shapeOrShapename) {
                        case "string":
                            return new ProviderElement<WeaponShape, WeaponPowerCond>(`${k}-${shapeOrShapename.toLocaleLowerCase()}`,
                                {
                                    particular: shapeOrShapename,
                                    group: k as WeaponShape["group"]
                                },
                                {

                                }
                            );
                        case "object":
                            {
                                const shape = shapeOrShapename as WeaponShape & WeaponPowerCond;
                                if (shape !== null) {
                                    return new ProviderElement<WeaponShape, WeaponPowerCond>(`${k.replaceAll(/\s/g, "-")}-${shape.particular.toLocaleLowerCase()}`,
                                        {
                                            particular: shape.particular,
                                            group: k as WeaponShape["group"]
                                        },
                                        {
                                            themes: shape?.themes,
                                            activePowers: shape?.activePowers,
                                            rarity: shape?.rarity,
                                            shapeFamily: shape?.shapeFamily,

                                        }
                                    )
                                }
                            }
                    }
                    throw new Error("invalid shape config");
                }
            )
        ]
    }
} satisfies DeltaCollection<WeaponFeaturesTypes>;
