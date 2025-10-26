import { pluralUnholyFoe, singularUnholyFoe, singularWildAnimalStructured, wildAnimalArr } from "$lib/generators/foes";
import { mkGen, StringGenerator, type Generator } from "$lib/generators/recursiveGenerator";
import { animeWeaponShapes, bluntWeaponShapeFamilies, businessEndParts, counterAcceptingParts, counterCapacityByRarity, edgedWeaponShapeFamilies, embeddableParts, ephBlack, ephBlue, ephCold, ephExplorer, ephGold, ephGreen, ephHot, ephPurple, ephRed, ephSky, ephSteampunk, ephWizard, eyeAcceptingParts, get5eDamageType, grippedWeaponShapeFamilies, holdingParts, linkWithEnergyCore, MATERIALS, MISC_DESC_FEATURES, pickOrLinkWithEnergyCore, pointedWeaponShapes, rangedWeaponShapeFamilies, shapeFamiliesWithoutPommels, smallDieWeaponShapeFamilies, streakCapacityByRarity, swordlikeWeaponShapeFamilies, twoHandedWeaponShapeFamilies, wrappableParts, type PossibleCoreThemes } from "$lib/generators/weaponGenerator/config/configConstantsAndUtils";
import { ProviderElement } from "$lib/generators/weaponGenerator/provider";
import { getBusinessEndDesc, multName, pronounLoc } from "$lib/generators/weaponGenerator/weaponDescriptionLogic";
import { genMaybeGen, hasUUIDs, maxDamage, modDamage, pickForTheme, textForDamage, toLang, toProviderSource } from "$lib/generators/weaponGenerator/weaponGeneratorLogic";
import { gte, lt, type ActivePower, type CapitalLetter, type CommonDieSize, type DamageDice, type DescriptorGenerator, type DescriptorType, type Ephitet, type PartFeature, type PassivePower, type Personality, type RechargeMethod, type Theme, type Weapon, type WeaponFeaturesTypes, type WeaponGivenThemes, type WeaponPowerCond, type WeaponRarity, type WeaponShape, type WeaponShapeGroup } from "$lib/generators/weaponGenerator/weaponGeneratorTypes";
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


const assassinationDamageMultByRarity = {
    common: 2,
    uncommon: 2,
    rare: 3,
    epic: 3,
    legendary: 4
} as const satisfies Record<WeaponRarity, number>;

export default {
    themes: {
        add: ([
            "fire" as const,
            "ice" as const,
            "cloud" as const,
            "earth" as const,
            "light" as const,
            "dark" as const,
            "sweet" as const,
            "sour" as const,
            "wizard" as const,
            "steampunk" as const,
            "nature" as const
        ] satisfies Theme[]).map(theme => new PrimitiveContainer(theme))
    },
    nonRollableDescriptors: {
        add: [
            new ProviderElement('descriptor-damage-bonus-wizard',
                {
                    yields: 'feature',
                    generate: () => ({
                        descriptor: {
                            descType: 'property',
                            singular: ` glows with arcane energy`,
                            plural: ` glows with arcane energy`,
                            ephitet: mkGen((rng) => ephWizard.choice(rng)),
                        }
                    }),
                    applicableTo: { any: businessEndParts }
                },
                /**
                 * Can only be added by the passive power "damage-bonus-wizard"
                 */
                { never: true }
            ),
            new ProviderElement('descriptor-damage-bonus-dark',
                {
                    yields: 'feature',
                    generate: (rng, weapon) => {
                        const both = [
                            {
                                descType: 'property',
                                singular: ` leaves a wake of pure darkness behind it`,
                                plural: ` leave a wake of pure darkness behind them`,
                            } as const
                        ];

                        const edged = [
                            ...both
                        ];

                        const blunt = [
                            ...both
                        ];

                        const chosen = edgedWeaponShapeFamilies.includes(weapon.shape.particular as (typeof edgedWeaponShapeFamilies)[number])
                            ? edged.choice(rng)
                            : blunt.choice(rng);

                        return {
                            descriptor: {
                                ...chosen,
                                ephitet: mkGen((rng) => ephBlack.choice(rng)),
                            }
                        }
                    },
                    applicableTo: { any: businessEndParts }
                },
                /**
                 * Can only be added by the passive power "damage-bonus-dark"
                 */
                { never: true }
            ),
            new ProviderElement('descriptor-damage-bonus-light',
                {
                    yields: 'feature',
                    generate: (rng, weapon) => {

                        // attempt to link up with the weapon's energy core to get a more specific descriptor.
                        // only use the core type if it's a kind of energy, otherwise default to an unspecified kind of energy
                        const core = linkWithEnergyCore(rng, weapon);
                        const energyType = core?.desc.endsWith("energy") ? core.desc : "pure energy";

                        const both = [
                            {
                                descType: 'property',
                                singular: ` leaves a wake of ${energyType} behind it`,
                                plural: ` leave a wake of ${energyType} behind them`,
                            } as const
                        ];

                        const edged = [
                            {
                                descType: 'possession',
                                singular: ` a ribbon of ${energyType} running along the edge`,
                                plural: ` ribbons of ${energyType} running along the edges`,
                            } as const,
                            ...both
                        ];

                        const blunt = [
                            {
                                descType: 'property',
                                singular: ` is circled by rings of ${energyType}`,
                                plural: ` are circled by rings of ${energyType}`,
                            } as const,
                            ...both
                        ];

                        const chosen = edgedWeaponShapeFamilies.includes(weapon.shape.particular as (typeof edgedWeaponShapeFamilies)[number])
                            ? edged.choice(rng)
                            : blunt.choice(rng);

                        return {
                            descriptor: {
                                ...chosen,
                                ephitet: mkGen((rng) => ephBlack.choice(rng)),
                            }
                        }
                    },
                    applicableTo: { any: businessEndParts }
                },
                /**
                 * Can only be added by the passive power "damage-bonus-light"
                 */
                { never: true }
            ),
            new ProviderElement('defender-part',
                {
                    yields: 'feature',
                    generate: (rng) => {
                        const partials = [
                            {
                                descType: 'property',
                                singular: " is surrounded by a subtle field of shimmering air",
                                plural: " are surrounded by a subtle field of shimmering air"
                            },
                            {
                                descType: 'possession',
                                singular: " a spectral shield hovering just above it",
                                plural: " small spectral shields hovering just above them"
                            }
                        ] as const satisfies { descType: DescriptorType; singular: string; plural: string; }[];

                        const choice = partials.choice(rng);

                        return {
                            descriptor: {
                                ...choice,
                                ephitet: mkGen((rng) => [{ pre: `Aegis` }, { pre: `Defender's` }, { post: `of the Watchtower`, alliteratesWith: 'W' }].choice(rng)),
                            }
                        };
                    },
                    applicableTo: { any: [...holdingParts, 'crossguard', 'maceHeads'] }
                },
                /**
                 * Can only be added by the passive power "defender"
                 */
                { never: true }
            ),
            new ProviderElement('forced-celestial-wizard-coating',
                {
                    yields: 'feature',
                    generate: (...args) => MISC_DESC_FEATURES.coating.celestialEngraving.generate(...args),
                    applicableTo: { any: wrappableParts }
                },
                /**
                 * Can only be added by the passive power "expertise-astrology"
                 */
                { never: true }
            ),
            ...(wildAnimalArr.map(({ article, singular, plural }) =>
                new ProviderElement<DescriptorGenerator, { never: true }>(`carved-resembling-${singular.toLowerCase().replaceAll(/\s+/g, '-')}`,
                    {
                        yields: 'feature',
                        generate: () => ({
                            descriptor: {
                                descType: 'property',
                                singular: ` is carved to resemble ${article} ${singular}`,
                                plural: ` are carved to resemble ${article} ${plural}`,
                                ephitet: mkGen({ post: ` of the ${singular.toTitleCase()}`, alliteratesWith: singular[0].toUpperCase() as CapitalLetter }),
                            }
                        }),
                        applicableTo: { any: businessEndParts }
                    },
                    /**
                     * Can only be added by the passive power "weapon-animal-transformation"
                     */
                    { never: true }
                )
            )),
            new ProviderElement('streak-indicator',
                {
                    yields: 'feature',
                    generate: (_, weapon) => ({
                        descriptor: {
                            descType: 'property',
                            singular: ` has ${streakCapacityByRarity[weapon.rarity]} magical gems embedded along it`,
                            plural: ` have ${streakCapacityByRarity[weapon.rarity]} magical gems embedded in them`,
                            ephitet: mkGen({ pre: "Bejewelled" }),
                        }
                    }),
                    applicableTo: { any: counterAcceptingParts }
                },
                /**
                 * Can only be added by the passive power "streak"
                 */
                { never: true }
            ),
            new ProviderElement('counter-indicator',
                {
                    yields: 'feature',
                    generate: (_, weapon) => ({
                        descriptor: {
                            descType: 'property',
                            singular: ` has ${counterCapacityByRarity[weapon.rarity]} magical gems embedded along it`,
                            plural: ` have ${counterCapacityByRarity[weapon.rarity]} magical gems embedded along them`,
                            ephitet: mkGen({ pre: "Bejewelled" }),
                        }
                    }),
                    applicableTo: { any: counterAcceptingParts }
                },
                /**
                 * Can only be added by the passive power "counter"
                 */
                { never: true }
            ),
            new ProviderElement('necromantic-runes',
                {
                    yields: 'feature',
                    generate: () => ({
                        descriptor: {
                            descType: 'property',
                            singular: " is inscribed with jagged runes of necromancy",
                            plural: " are inscribed with jagged runes of necromancy",
                            ephitet: mkGen((rng) => ephBlack.choice(rng)),
                        }
                    }),
                    applicableTo: { any: businessEndParts }
                },
                /**
                 * Can only be added by the passive powers "trap-souls", "make-zombie"
                 */
                { never: true }
            ),
            new ProviderElement('mirror-finish-forced',
                {
                    yields: 'feature',
                    generate: () => ({
                        descriptor: {
                            descType: 'property',
                            singular: " is polished to a mirror finish",
                            plural: " are ",
                            ephitet: mkGen((rng) => [{ pre: 'Mirrored' }, { post: 'of ' }].choice(rng)),
                        }
                    }),
                    applicableTo: { any: businessEndParts }
                },
                /**
                 * Can only be added by the passive powers "mounted-dismount-resist", "disarm-immune"
                 */
                { never: true }),
            new ProviderElement('gripping-tentacle-descriptor-fire',
                {
                    yields: 'feature',
                    generate: () => ({
                        descriptor: {
                            descType: 'property',
                            singular: " glows with dim orange light",
                            plural: "pommel is not plural",
                            ephitet: mkGen((rng) => ephHot.choice(rng)),
                        }
                    }),
                    applicableTo: { any: ['pommel'] }
                },
                /**
                 * Can only be added by the passive power "stats-as-mirror"
                 */
                { never: true }
            ),
            new ProviderElement('gripping-tentacle-descriptor-ice',
                {
                    yields: 'feature',
                    generate: () => ({
                        descriptor: {
                            descType: 'property',
                            singular: " is freezing cold to the touch",
                            plural: "pommel is not plural",
                            ephitet: mkGen((rng) => ephCold.choice(rng)),
                        }
                    }),
                    applicableTo: { any: ['pommel'] }
                },
                /**
                 * Can only be added by the passive powers "mounted-dismount-resist", "disarm-immune"
                 */
                { never: true }
            ),
            new ProviderElement('gripping-tentacle-descriptor-dark',
                {
                    yields: 'feature',
                    generate: () => ({
                        descriptor: {
                            descType: 'property',
                            singular: " emits shadowy mist",
                            plural: "pommel is not plural",
                            ephitet: mkGen((rng) => ephBlack.choice(rng)),
                        }
                    }),
                    applicableTo: { any: ['pommel'] }
                },
                /**
                 * Can only be added by the passive powers "mounted-dismount-resist", "disarm-immune"
                 */
                { never: true }
            ),
            new ProviderElement('gripping-tentacle-descriptor-nature',
                {
                    yields: 'feature',
                    generate: () => ({
                        descriptor: {
                            descType: 'possession',
                            singular: " a vine extending from it, which usually wraps around the grip",
                            plural: "pommel is not plural",
                            ephitet: { pre: 'Ivy' },
                        }
                    }),
                    applicableTo: { any: ['pommel', 'maceHeads', 'limbs', 'spearShaft'] }
                },
                /**
                 * Can only be added by the passive powers "mounted-dismount-resist", "disarm-immune"
                 */
                { never: true }
            ),
            new ProviderElement('gripping-tentacle-descriptor-generic',
                {
                    yields: 'feature',
                    generate: () => ({
                        descriptor: {
                            descType: 'possession',
                            singular: " a tendril extending from it, which usually wraps around the grip",
                            plural: "pommel is not plural",
                            ephitet: { pre: 'Tendrilous' },
                        }
                    }),
                    applicableTo: { any: ['pommel'] }
                },
                /**
                 * Can only be added by the passive powers "mounted-dismount-resist", "disarm-immune"
                 */
                { never: true }
            ),
            new ProviderElement('generic-eyes',
                {
                    yields: 'feature',
                    generate: (rng, weapon) =>
                        genMaybeGen([
                            MISC_DESC_FEATURES.sensorium.eyes.beady,
                            MISC_DESC_FEATURES.sensorium.eyes.deepSet,
                            ...weapon.themes.includes('nature') ? [MISC_DESC_FEATURES.sensorium.eyes.animalistic] : [],
                        ].choice(rng), rng),
                    applicableTo: { any: eyeAcceptingParts }
                }, { never: true }
            ),
            new ProviderElement('material-telekill',
                {
                    yields: 'material',
                    generate: () => ({
                        material: 'telekill alloy',
                        ephitet: mkGen(() => ({ pre: 'Nullifying' }))
                    }),
                    applicableTo: { any: businessEndParts }
                },
                /**
                 * Can only be added by the passive power "psi-immune"
                 */
                { never: true }
            ),
            new ProviderElement('descriptor-wreathed-fire',
                {
                    yields: 'feature',
                    generate: () => ({
                        descriptor: {
                            descType: 'property',
                            singular: ` is wreathed in flames`,
                            plural: ` are wreathed in flames`,
                        },
                        ephitet: mkGen(rng => ephHot.choice(rng))
                    }),
                    applicableTo: { any: businessEndParts }
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
                    yields: 'feature',
                    generate: () => ({
                        descriptor: {
                            descType: 'property',
                            singular: ` is wreathed in lightless black flames`,
                            plural: ` are wreathed in lightless black flames`,
                        },
                        ephitet: mkGen((rng) => ephHot.choice(rng))
                    }),
                    applicableTo: { any: businessEndParts }
                },
                {
                    /**
                     * Can only be added by the passive power ""
                     */
                    never: true
                }
            ), new ProviderElement('descriptor-wreathed-ice',
                {
                    yields: 'feature',
                    generate: () => ({
                        descriptor: {
                            descType: 'property',
                            singular: ` is wreathed in icy mist`,
                            plural: ` are wreathed in icy mist`,
                        },
                        ephitet: mkGen(rng => ephCold.choice(rng))
                    }),
                    applicableTo: { any: businessEndParts }
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
                    yields: 'feature',
                    generate: () => ({
                        descriptor: {
                            descType: 'possession',
                            singular: `a clock embedded in it`,
                            plural: `clocks embedded in them`,
                        },
                        ephitet: { pre: "Timekeeper's" }
                    }),
                    applicableTo: { any: embeddableParts }
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
                    yields: 'feature',
                    generate: () => ({
                        descriptor: {
                            descType: 'possession',
                            singular: `a compass embedded in it`,
                            plural: `compass embedded in them`,
                        },
                        ephitet: mkGen(rng => ephExplorer.choice(rng))
                    }),
                    applicableTo: { any: embeddableParts }
                },
                {
                    /**
                     * Can only be added by the passive power "integrated-compass"
                     */
                    never: true
                }
            ),
            new ProviderElement('eat-to-heal-forced', {
                yields: 'material',
                generate: (rng) => {
                    return [
                        MATERIALS.hardCandy,
                        MATERIALS.rockCandy,
                        MATERIALS.gingerbread,
                    ].choice(rng);
                },
                applicableTo: { any: businessEndParts }
            }, {
                /**
                 * Can only be added by the passive power "eat-to-heal"
                 */
                never: true
            }
            ),

            new ProviderElement('injector-module-forced', {
                yields: 'feature',
                generate: () => (
                    {
                        descriptor: {
                            descType: 'possession',
                            singular: "a small glass vial built into it",
                            plural: 'a small glass vial built into it',
                        },
                        ephitet: { pre: 'Headhunter' }
                    }),
                applicableTo: { any: holdingParts }
            }, {
                /**
                 * Can only be added by the passive power "injector-module"
                 */
                never: true
            }),

            new ProviderElement('energy-core-void',
                {
                    yields: 'feature',
                    generate: () => {
                        return {
                            descriptor: {
                                descType: 'property',
                                singular: " hurts to look at. When it moves it leaves behind a wake of something that you can't quite describe, but it makes your eyes prickle with pins and needles",
                                plural: " hurt to look at. When they move it leaves behind a wake of something that you can't quite describe, but it makes your eyes prickle with pins and needles"
                            },
                            ephitet: mkGen((rng, weapon) => [{ pre: weapon.shape.particular }, { post: ` of ${weapon.id}` }, { pre: '[Object object]' }].choice(rng)),
                        }
                    },
                    applicableTo: { any: businessEndParts }
                },
                {
                    /**
                     * can be added by powers that call the function pickOrLinkWithEnergyCore
                     */
                    never: true
                }
            ),
            new ProviderElement('energy-core-fire',
                {
                    yields: 'feature',
                    generate: () => {
                        return {
                            descriptor: {
                                descType: 'possession',
                                singular: 'a superheated section running down the middle of it, which emits dim orange light, hissing subtly as you move it around',
                                plural: 'a superheated section in the middle of them, which emit dim orange light, hissing subtly as you move them around',
                            },
                            ephitet: mkGen(rng => ephHot.choice(rng)),
                        }
                    },
                    applicableTo: { any: businessEndParts }
                },
                {
                    /**
                     * can be added by powers that call the function pickOrLinkWithEnergyCore
                     */
                    never: true
                }
            ),
            new ProviderElement('energy-core-ice',
                {
                    yields: 'feature',
                    generate: () => {
                        return {
                            descriptor: {
                                descType: 'possession',
                                singular: 'a large crystal orb embedded in it, containing a howling blizzard',
                                plural: 'a large crystal orb embedded in them, containing a welter of winter weather'
                            },
                            ephitet: mkGen(rng => ephCold.choice(rng)),
                        }
                    },
                    applicableTo: { any: businessEndParts }
                },
                {
                    /**
                     * can be added by powers that call the function pickOrLinkWithEnergyCore
                     */
                    never: true
                }
            ),
            new ProviderElement('energy-core-ultraviolet',
                {
                    yields: 'feature',
                    generate: () => {
                        return {
                            descriptor: {
                                descType: 'possession',
                                singular: 'a glass bulb running down the middle which blasts ultraviolet light in all directions',
                                plural: 'a glass bulb running down the middle which blast ultraviolet light in all directions'
                            },
                            ephitet: mkGen(rng => ephPurple.choice(rng)),
                        }
                    },
                    applicableTo: { any: businessEndParts }
                },
                {
                    /**
                     * can be added by powers that call the function pickOrLinkWithEnergyCore
                     */
                    never: true
                }
            ),
            new ProviderElement('energy-core-azure',
                {
                    yields: 'feature',
                    generate: () => {
                        return {
                            descriptor: {
                                descType: 'possession',
                                singular: 'a river of sapphire curling through its center, waves of light ebb and flow within it',
                                plural: 'rivers of sapphire curling through them, waves of light ebb and flow within'
                            },
                            ephitet: mkGen(rng => ephBlue.choice(rng)),
                        }
                    },
                    applicableTo: { any: businessEndParts }
                },
                {
                    /**
                     * can be added by powers that call the function pickOrLinkWithEnergyCore
                     */
                    never: true
                }
            ),
            new ProviderElement('energy-core-crimson',
                {
                    yields: 'feature',
                    generate: () => {
                        return {
                            descriptor: {
                                descType: 'property',
                                singular: mkGen((_, __) => ` is partially transparent, revealing red veins which emit a diffuse crimson glow`),
                                plural: mkGen((_, __) => ` are partially transparent, revealing red veins, which emit a diffuse crimson glow`)
                            },
                            ephitet: mkGen(rng => ephRed.choice(rng)),
                        }
                    },
                    applicableTo: { any: businessEndParts }
                },
                {
                    /**
                     * can be added by powers that call the function pickOrLinkWithEnergyCore
                     */
                    never: true
                }
            ),
            new ProviderElement('energy-core-verdant',
                {
                    yields: 'feature',
                    generate: () => {
                        return {
                            descriptor: {
                                descType: 'possession',
                                singular: 'channels of brilliant green light spreading out from its base and across its surface in an organic fractal',
                                plural: 'channels of brilliant green light spreading out from their bases and across their surfaces in organic fractals'
                            },
                            ephitet: mkGen(rng => ephGreen.choice(rng)),
                        }
                    },
                    applicableTo: { any: businessEndParts }
                },
                {
                    /**
                     * can be added by powers that call the function pickOrLinkWithEnergyCore
                     */
                    never: true
                }
            ),
            new ProviderElement('energy-core-nature',
                {
                    yields: 'feature',
                    generate: () => {
                        return {
                            descriptor: {
                                descType: 'possession',
                                singular: 'luminous vines emerging from a crack in its centre, spreading outwards to wrap around it',
                                plural: 'luminous vines emerging from a crack in their centre, spreading outwards to wrap around them'
                            },
                            ephitet: mkGen(rng => ephGreen.choice(rng)),
                        }
                    },
                    applicableTo: { any: businessEndParts }
                },
                {
                    /**
                     * can be added by powers that call the function pickOrLinkWithEnergyCore
                     */
                    never: true
                }
            ),
            new ProviderElement('energy-core-atomic',
                {
                    yields: 'feature',
                    generate: () => {
                        return {
                            descriptor: {
                                descType: 'possession',
                                singular: ' a vein of radium running down the center',
                                plural: ' veins of radium running through them'
                            },
                            ephitet: mkGen(rng => [
                                { pre: 'Atomic' },
                                { pre: 'Nuclear' },
                                { post: ' of the Mushroom Bombs' },
                            ].choice(rng)),
                        }
                    },
                    applicableTo: { any: businessEndParts }
                },
                {
                    /**
                     * can be added by powers that call the function pickOrLinkWithEnergyCore
                     */
                    never: true
                }
            ),
            new ProviderElement('energy-core-gold',
                {
                    yields: 'feature',
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
                    applicableTo: { any: businessEndParts }
                },
                {
                    /**
                     * can be added by powers that call the function pickOrLinkWithEnergyCore
                     */
                    never: true
                }
            ),
            new ProviderElement('energy-core-dark',
                {
                    yields: 'feature',
                    generate: () => {
                        return {
                            descriptor: {
                                descType: 'property',
                                singular: " is shaped like a corkscrew, with a bolt of dark energy crackling eternally at its center",
                                plural: " are shaped like corkscrews, each has a bolt of dark energy crackling eternally at its center"
                            },
                            ephitet: mkGen(rng => ephBlack.choice(rng)),
                        }
                    },
                    applicableTo: { any: businessEndParts }
                },
                {
                    /**
                     * can be added by powers that call the function pickOrLinkWithEnergyCore
                     */
                    never: true
                }
            ),
            new ProviderElement('energy-core-aether',
                {
                    yields: 'feature',
                    generate: () => {
                        return {
                            descriptor: {
                                descType: 'possession',
                                singular: 'a large crack running down the middle of it, the edges glow with sky-blue energy, occasionally sparking with electricity',
                                plural: 'a large crack running down the middle of them, their edges glow with sky-blue energy, occasionally sparking with electricity'
                            },
                            ephitet: mkGen(rng => ephSky.choice(rng)),
                        }
                    },
                    applicableTo: { any: businessEndParts }
                },
                {
                    /**
                     * can be added by powers that call the function pickOrLinkWithEnergyCore
                     */
                    never: true
                }
            ),
            new ProviderElement('energy-core-steampunk',
                {
                    yields: 'feature',
                    generate: () => {
                        return {
                            descriptor: {
                                descType: 'possession',
                                singular: 'a glass tube running down the center, which crackles with electrical energy',
                                plural: 'glass tube running down their center, which crackle with electrical energy'
                            },
                            ephitet: mkGen(rng => ephSteampunk.choice(rng)),
                        }
                    },
                    applicableTo: { any: businessEndParts }
                },
                {
                    /**
                     * can be added by powers that call the function pickOrLinkWithEnergyCore
                     */
                    never: true
                }
            ),
            new ProviderElement('energy-core-wizard',
                {
                    yields: 'feature',
                    generate: () => {
                        return {
                            descriptor: {
                                descType: 'possession',
                                singular: 'a dense network of magical runes carved across it, which glows with arcane energy',
                                plural: 'magical runes carved across them, which glow with arcane energy'
                            },
                            ephitet: mkGen(rng => ephBlue.choice(rng)),
                        }
                    },
                    applicableTo: { any: businessEndParts }
                },
                {
                    /**
                     * can be added by powers that call the function pickOrLinkWithEnergyCore
                     */
                    never: true
                }
            ),
        ]
    },
    descriptors: {
        add: [
            new ProviderElement('descriptor-pommel-embed',
                {
                    yields: 'feature',
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
                                MISC_DESC_FEATURES.embedded["an acid diamond"],
                                MISC_DESC_FEATURES.embedded["a toxic pearl"]
                            ],
                            wizard: [
                                MISC_DESC_FEATURES.embedded["an amethyst"],
                                MISC_DESC_FEATURES.embedded["a piece of porphyry"],
                                MISC_DESC_FEATURES.embedded["a sapphire"],
                                MISC_DESC_FEATURES.embedded["a piece of lapis lazuli"]
                            ],
                            nature: [MISC_DESC_FEATURES.embedded.amber]
                        } as const satisfies Partial<Record<Theme, PartFeature[]>>;

                        return pickForTheme(weapon as WeaponGivenThemes<['ice' | 'fire' | 'cloud' | 'earth' | 'light' | 'dark' | 'wizard']>, embedsByTheme, rng).chosen.choice(rng);
                    },
                    applicableTo: { any: embeddableParts }
                },
                {
                    shapeFamily: { none: shapeFamiliesWithoutPommels },
                    themes: {
                        any: ['ice', 'fire', 'cloud', 'earth', 'light', 'dark', 'wizard']
                    }
                }
            ),
            new ProviderElement('material-primitive-hard',
                {
                    yields: 'material',
                    generate: (rng) => {
                        return [
                            MATERIALS.tin,
                            MATERIALS.copper,
                            MATERIALS.bronze,
                            MATERIALS.flint,
                        ].choice(rng);
                    },
                    applicableTo: { any: businessEndParts }
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
                    yields: 'material',
                    generate: (rng, weapon) => {
                        return [
                            MATERIALS['scarlet steel'],
                            MATERIALS.flint,
                            MATERIALS.obsidian,
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
                    applicableTo: { any: businessEndParts }
                },
                {
                    allowDuplicates: true,
                    themes: { any: ['fire'] }
                }
            ),
            new ProviderElement('material-fire-holding',
                {
                    yields: 'material',
                    generate: (rng) => genMaybeGen([
                        MATERIALS.scorchedWood,
                        MATERIALS.glass,
                        MATERIALS.quartz,
                        MATERIALS.porcelain,
                        MATERIALS.hotHorn
                    ].choice(rng), rng),
                    applicableTo: { any: holdingParts }
                },
                {
                    themes: { any: ['fire'] },
                    shapeFamily: { any: grippedWeaponShapeFamilies }
                }
            ),
            new ProviderElement('descriptor-fire-coating',
                {
                    yields: 'feature',
                    generate: (rng, weapon) => genMaybeGen<PartFeature, [Weapon]>([
                        MISC_DESC_FEATURES.coating.oil,
                        MISC_DESC_FEATURES.coating.flames,
                    ].choice(rng), rng, weapon),
                    applicableTo: { any: businessEndParts }
                },
                {
                    themes: { any: ['fire'] }
                }
            ),

            new ProviderElement('material-ice-hard',
                {
                    yields: 'material',
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
                    applicableTo: { any: businessEndParts }
                },
                {
                    allowDuplicates: true,
                    themes: { any: ['ice'] }
                }
            ),

            new ProviderElement('material-ice-holding',
                {
                    yields: 'material',
                    generate: (rng) => {
                        return genMaybeGen([
                            MATERIALS.ivory,
                            MATERIALS.pine,
                            MATERIALS.coldHorn
                        ].choice(rng), rng);
                    },
                    applicableTo: { any: holdingParts }
                },
                {
                    allowDuplicates: true,
                    themes: { any: ['ice'] },
                    shapeFamily: { any: grippedWeaponShapeFamilies }
                }
            ),

            new ProviderElement('material-cloud-hard',
                {
                    yields: 'material',
                    generate: (rng) => {
                        return [
                            MATERIALS["meteoric iron"],
                            MATERIALS.silver,
                            MATERIALS.glassLikeSteel
                        ].choice(rng);
                    },
                    applicableTo: { any: businessEndParts }
                },
                {
                    allowDuplicates: true,
                    themes: { any: ['cloud'] }
                }
            ),
            new ProviderElement('material-cloud-holding',
                {
                    yields: 'material',
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
                    applicableTo: { any: holdingParts }
                },
                {
                    allowDuplicates: true,
                    themes: { any: ['cloud'] },
                    shapeFamily: { any: grippedWeaponShapeFamilies }
                }
            ),
            new ProviderElement('descriptor-cloud-coating',
                {
                    yields: 'feature',
                    generate: (rng, weapon) => genMaybeGen<PartFeature, [Weapon]>([
                        MISC_DESC_FEATURES.coating.pearlescent,
                    ].choice(rng), rng, weapon),
                    applicableTo: { any: businessEndParts }
                },
                {
                    themes: { any: ['cloud'] }
                }
            ),


            new ProviderElement('material-earth-hard',
                {
                    yields: 'material',
                    generate: (rng, weapon) => {
                        return (
                            bluntWeaponShapeFamilies.includes(weapon.shape.group as (typeof bluntWeaponShapeFamilies)[number]) ?
                                [
                                    MATERIALS.flintChunk,
                                    MATERIALS.basaltChunk,
                                    MATERIALS.marbleChunk,
                                    MATERIALS.quartzChunk,
                                    MATERIALS.crystalChunk,
                                    MATERIALS.graniteChunk,
                                    MATERIALS.obsidianChunk,
                                    MATERIALS.alabasterChunk,
                                    MATERIALS.sandstoneChunk,
                                    MATERIALS.geodeQuartz,
                                    MATERIALS.geodeAmethyst,
                                    MATERIALS.geodeChalcedony,
                                    MATERIALS.geodeVermarine,
                                ]
                                : [
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
                                    MATERIALS.obsidian,
                                ]).choice(rng);
                    },
                    applicableTo: { any: businessEndParts }
                },
                {
                    allowDuplicates: true,
                    themes: { any: ['earth'] }
                }
            ),
            new ProviderElement('material-earth-holding',
                {
                    yields: 'material',
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
                    applicableTo: { any: holdingParts }
                },
                {
                    allowDuplicates: true,
                    themes: { any: ['earth'] },
                    shapeFamily: { any: grippedWeaponShapeFamilies }
                }
            ),
            new ProviderElement('descriptor-earth-coating',
                {
                    yields: 'feature',
                    generate: (rng, weapon) => genMaybeGen<PartFeature, [Weapon]>([
                        MISC_DESC_FEATURES.coating.volcanoCracks,
                    ].choice(rng), rng, weapon),
                    applicableTo: { any: businessEndParts }
                },
                {
                    themes: { any: ['earth'] }
                }
            ),

            new ProviderElement('material-dark-hard',
                {
                    yields: 'material',
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
                    applicableTo: { any: businessEndParts }
                },
                {
                    allowDuplicates: true,
                    themes: { any: ['dark'] }
                }
            ),

            new ProviderElement('material-dark-holding',
                {
                    yields: 'material',
                    generate: (rng) => {
                        return genMaybeGen([
                            MATERIALS.ebonyWood,
                            MATERIALS.darkLeather,
                            MATERIALS.darkLeather,
                        ].choice(rng), rng);
                    },
                    applicableTo: { any: holdingParts }
                },
                {
                    allowDuplicates: true,
                    themes: { any: ['dark'] },
                    shapeFamily: { any: grippedWeaponShapeFamilies }
                }
            ),

            new ProviderElement('misc-dark-coating',
                {
                    yields: 'feature',
                    generate: (rng) => genMaybeGen<PartFeature, []>([
                        MISC_DESC_FEATURES.coating.edgyPhrase,
                        MISC_DESC_FEATURES.coating.edgyImage,
                    ].choice(rng), rng),
                    applicableTo: { any: businessEndParts }
                },
                {
                    themes: { any: ['dark'] },
                }
            ),

            new ProviderElement('material-light-holding',
                {
                    yields: 'material',
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
                    applicableTo: { any: holdingParts }
                },
                {
                    allowDuplicates: true,
                    themes: { any: ['light'] },
                    shapeFamily: { any: grippedWeaponShapeFamilies }
                }
            ),

            new ProviderElement('material-dark-ice',
                {
                    yields: 'material',
                    generate: (rng) => {
                        return [
                            MATERIALS.iceBlood
                        ].choice(rng);
                    },
                    applicableTo: { any: businessEndParts }
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
                    yields: 'material',
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
                                        MATERIALS.lumensteel
                                    ]
                                    : []
                            )
                        ].choice(rng);
                    },
                    applicableTo: { any: businessEndParts }
                },
                {
                    allowDuplicates: true,
                    themes: { any: ['light'] }
                }
            ),

            new ProviderElement('material-sweet-hard',
                {
                    yields: 'material',
                    generate: (rng) => {
                        return [
                            MATERIALS.hardCandy,
                            MATERIALS.rockCandy,
                            MATERIALS.gingerbread,
                        ].choice(rng);
                    },
                    applicableTo: { any: businessEndParts }
                },
                {
                    allowDuplicates: true,
                    themes: { any: ['sweet'] },
                }
            ),
            new ProviderElement('material-sweet-holding',
                {
                    yields: 'material',
                    generate: (rng) => {
                        return [
                            MATERIALS.maple,
                            MATERIALS.liquoriceRoot,
                            MATERIALS.dateWood
                        ].choice(rng);
                    },
                    applicableTo: { any: holdingParts }
                },
                {
                    allowDuplicates: true,
                    themes: { any: ['sweet'] },
                    shapeFamily: { any: grippedWeaponShapeFamilies },
                }
            ),

            new ProviderElement('material-sour-hard',
                {
                    yields: 'material',
                    generate: (rng) => {
                        return [
                            MATERIALS.citrine,
                            MATERIALS.acidium
                        ].choice(rng);
                    },
                    applicableTo: { any: businessEndParts }
                },
                {
                    allowDuplicates: true,
                    themes: { any: ['sour'] }
                }
            ),
            new ProviderElement('material-sour-holding',
                {
                    yields: 'material',
                    generate: (rng) => {
                        return [
                            MATERIALS.lemonWood,
                        ].choice(rng);
                    },
                    applicableTo: { any: holdingParts }
                },
                {
                    allowDuplicates: true,
                    themes: { any: ['sour'] },
                    shapeFamily: { any: grippedWeaponShapeFamilies }
                }
            ),
            new ProviderElement('misc-sour-coating',
                {
                    yields: 'feature',
                    generate: (rng, weapon) => genMaybeGen([
                        MISC_DESC_FEATURES.coating.pitted,
                        MISC_DESC_FEATURES.coating.acidBurned,
                    ].choice(rng), rng, weapon),
                    applicableTo: { any: businessEndParts }
                },
                {
                    themes: { any: ['sour'] }
                }
            ),

            new ProviderElement('material-wizard-hard',
                {
                    yields: 'material',
                    generate: (rng, weapon) => {
                        return [
                            MATERIALS.crystal,
                            MATERIALS.quartz,
                            MATERIALS.amethyst,
                            ...bluntWeaponShapeFamilies.includes(weapon.shape.group as (typeof bluntWeaponShapeFamilies)[number]) ? [
                                MATERIALS.geodeAmethyst
                            ] : [],
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
                    applicableTo: { any: businessEndParts }
                },
                {
                    allowDuplicates: true,
                    themes: { any: ['wizard'] }
                }
            ),

            new ProviderElement('material-wizard-holding',
                {
                    yields: 'material',
                    generate: (rng, weapon) => {
                        return genMaybeGen([
                            MATERIALS.magicWood,
                            MATERIALS.magicHorn,
                            MATERIALS.magicHorn,
                            MATERIALS.magicHorn,
                            MATERIALS.magicHorn,
                        ].choice(rng), rng, weapon);
                    },
                    applicableTo: { any: holdingParts }
                },
                {
                    allowDuplicates: true,
                    themes: { any: ['wizard'] },
                    shapeFamily: { any: grippedWeaponShapeFamilies }
                }
            ),

            new ProviderElement('material-wizard-nature',
                {
                    yields: 'material',
                    generate: (rng) => {
                        return [
                            MATERIALS.wiseWood,
                        ].choice(rng);
                    },
                    applicableTo: { any: holdingParts }
                },
                {
                    allowDuplicates: false,
                    themes: {
                        all: ['wizard', 'nature']
                    }
                }
            ),
            new ProviderElement('misc-wizard-charm',
                {
                    yields: 'feature',
                    generate: (rng) => [
                        MISC_DESC_FEATURES.charm.silkWrap,
                        MISC_DESC_FEATURES.charm.amethystChain,
                        MISC_DESC_FEATURES.charm.beadsWrap,
                        MISC_DESC_FEATURES.charm.peacockFeather,
                    ].choice(rng),
                    applicableTo: { any: wrappableParts }
                },
                {
                    themes: { any: ['wizard'] }
                }
            ),
            new ProviderElement('misc-wizard-coating',
                {
                    yields: 'feature',
                    generate: (rng, weapon) => genMaybeGen([
                        MISC_DESC_FEATURES.coating.squiggles,
                        MISC_DESC_FEATURES.coating.celestialEngraving,
                        MISC_DESC_FEATURES.coating.wizardEngraving,
                    ].choice(rng), rng, weapon),
                    applicableTo: { any: businessEndParts }
                },
                {
                    themes: { any: ['wizard'] },
                    /**
                     * This is a forced descriptor. It may apply the same thing.
                     */
                    UUIDs: { none: ['forced-celestial-wizard-coating'] }
                }
            ),

            new ProviderElement('material-steampunk-hard',
                {
                    yields: 'material',
                    generate: (rng) => {
                        return [
                            MATERIALS.clockwork,
                            MATERIALS.tin,
                            MATERIALS.copper,
                            MATERIALS.brass,
                        ].choice(rng);
                    },
                    applicableTo: { any: businessEndParts }
                },
                {
                    allowDuplicates: true,
                    themes: { any: ['steampunk'] }
                }
            ),

            new ProviderElement('material-steampunk-holding',
                {
                    yields: 'material',
                    generate: (rng) => {
                        return genMaybeGen([
                            MATERIALS.copper,
                            MATERIALS.tin,
                            MATERIALS.brass,
                            MATERIALS.glass,
                            MATERIALS.porcelain
                        ].choice(rng), rng);
                    },
                    applicableTo: { any: holdingParts }
                },
                {
                    allowDuplicates: true,
                    themes: { any: ['steampunk'] },
                    shapeFamily: { any: grippedWeaponShapeFamilies }
                }
            ),
            new ProviderElement('material-nature-hard',
                {
                    yields: 'material',
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
                    applicableTo: { any: businessEndParts }
                },
                {
                    allowDuplicates: true,
                    themes: { any: ['nature'] }
                }
            ),

            new ProviderElement('material-nature-holding',
                {
                    yields: 'material',
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
                    applicableTo: { any: holdingParts }
                },
                {
                    allowDuplicates: true,
                    themes: { any: ['nature'] },
                    shapeFamily: { any: grippedWeaponShapeFamilies }
                }
            ),

            new ProviderElement('misc-charm-emojis',
                {
                    yields: 'feature',
                    generate: () => MISC_DESC_FEATURES.charm.emojis,
                    applicableTo: { any: wrappableParts }
                },
                {
                    // remove me when more abilities are added. this is just really over-represented at the moment & messing with the vibe
                    never: true,
                    allowDuplicates: false,
                    themes: {
                        any: ['nature', 'wizard', 'sweet']
                    }
                }
            ),

            new ProviderElement('club-staff-main-material',
                {
                    yields: 'material',
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
                    applicableTo: { any: holdingParts }
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
                    yields: 'material',
                    generate: () => ({
                        material: "two separate blades (adamant and mythrel), they're intertwined in a spiral pattern",
                        ephitet: { pre: 'Binary' }
                    }),
                    applicableTo: { any: businessEndParts }
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
                    yields: 'material',
                    generate: () => ({
                        material: "two separate parts, split down the middle: one half is boreal steel, the other scarlet steel",
                        ephitet: { pre: 'Bifurcated' }
                    }),
                    applicableTo: { any: businessEndParts }
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
                    yields: 'material',
                    generate: () => ({
                        material: "a glass tank containing an aquarium, the contents seem unaffected by movement",
                        ephitet: mkGen((rng) => [{ pre: 'Aero-' }, { post: ' of Bliss', alliteratesWith: 'B' } satisfies Ephitet].choice(rng))
                    }),
                    applicableTo: { any: businessEndParts }
                },
                {
                    themes: { all: ['cloud', 'ice'] },
                    rarity: { gte: 'epic' }
                }
            ),
            new ProviderElement('steam-blade',
                {
                    yields: 'material',
                    generate: () => ({
                        material: "hollow glass, filled with a roiling mix of magical fire and water",
                        ephitet: { pre: 'Steamy' }
                    }),
                    applicableTo: { any: businessEndParts }
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
                yields: 'material',
                generate: () => ({
                    material: "elementally infused metal, split into four distinct sections, each of which represents a different element",
                    ephitet: { post: ' of the Elemental Lord' }
                }),
                applicableTo: { any: businessEndParts }
            }, {
                rarity: {
                    gte: 'legendary'
                },
                themes: {
                    all: ['fire', 'earth', 'cloud', 'ice']
                },
                applicableTo: { any: businessEndParts },
                isMaterial: true
            }
            ),
        ]
    },
    personalities: {
        add: [
            new ProviderElement("pacifist",
                {
                    desc: "Pacifist."
                },
                {
                    themes: { none: ["dark"] },
                    // require some other personalities so that this one is unusually rare
                    UUIDs: { any: ['kind', 'honest'] }

                }
            ),
            new ProviderElement("jealous",
                {
                    desc: "Jealous."
                },
                {
                    themes: { none: ["light", "steampunk", "wizard"] },
                }
            ),
            new ProviderElement("vengeful",
                {
                    desc: "Vengeful."
                },
                {
                    themes: { any: ["fire", "ice", "dark", "sweet"] },
                }
            ),
            new ProviderElement<Personality, WeaponPowerCond>("cruel",
                {
                    desc: "Cruel."
                },
                {
                    themes: { any: ["sour", "dark"] },
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
            new ProviderElement<Personality, WeaponPowerCond>("logical",
                {
                    desc: "Logical."
                },
                {
                    themes: {
                        any: ["wizard", "light", "steampunk"]
                    },

                }
            ),
            new ProviderElement<Personality, WeaponPowerCond>("black-and-white-thinker",
                {
                    desc: "Black & White Thinker."
                },
                {
                    themes: {
                        any: ["ice", "light"]
                    },

                }
            ),
            new ProviderElement<Personality, WeaponPowerCond>("kind",
                {
                    desc: "Kind."
                },
                {
                    themes: {
                        any: ["fire", "sweet", "nature"]
                    },

                }
            ),
            new ProviderElement<Personality, WeaponPowerCond>("honest",
                {
                    desc: "Honest."
                },
                {
                    themes: {
                        any: ["fire", "light", "earth", "nature"]
                    },

                }
            ),
            new ProviderElement<Personality, WeaponPowerCond>("merciless",
                {
                    desc: "Merciless."
                },
                {
                    themes: {
                        any: ["ice", "sour", "dark"]
                    },

                }
            ),
            // if a personality is in here, it must only be present once. If it's in two themes add it as above
            // otherwise a weapon can have the same personality twice
            ...toProviderSource({
                fire: [
                    "compassionate",
                    "flirty",
                    "standoffish",
                    "short fuse",
                ],
                ice: [
                    "cold",
                    "formal",
                    "haughty",
                    "reserved",
                    "serious",
                    "stubborn",
                ],
                cloud: [
                    "easy-going",
                    "acquiescent",
                ],
                sweet: [
                    "excitable",
                    "manic",
                    "neurotic",
                ],
                sour: [
                    "antagonistic",
                    "manic",
                    "sassy"
                ],
                dark: [
                    "shy",
                    "tries to act mysterious",
                    "quiet",
                    "depressive",
                    "short fuse",
                    "sadistic",
                    "enjoys provoking others"
                ],
                light: [
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
            new ProviderElement(`defeat-foe`,
                {
                    desc: `a charge when used to defeat a foe`
                },
                {}
            ),
            new ProviderElement(`recharge-at-winter-solstice`,
                {
                    desc: `all charges at noon on the winter solstice`
                },
                {
                    themes: { any: [`ice`, `nature`, `light`] }
                }
            ),
            new ProviderElement(`recharge-at-summer-solstice`,
                {
                    desc: `all charges at noon on the summer solstice`
                },
                {
                    themes: { any: [`fire`, `nature`, `light`] }
                }
            ),
            new ProviderElement('drive-into-ground-dramatically',
                {
                    desc: `2d6 charges when driven into the ground while something important is happening, once per event`
                },
                {
                    themes: { any: [`earth`] },
                    // has to be straight, fairly long, and sharp
                    shapeFamily: { none: [...bluntWeaponShapeFamilies, 'dagger', 'axe', 'greataxe', 'greataxe (or musket)', 'sword (or bow)'] }
                }
            ),
            ...toProviderSource(
                {
                    fire: [
                        `all charges after being superheated`,
                    ],
                    ice: [
                        `all charges after being cooled to sub-zero`,
                        mkGen((_, weapon: Weapon) => `one charge whenever ${pronounLoc[weapon.pronouns].singular.possessive} wielder builds a snowman`),
                        mkGen((_, weapon: Weapon) => `one charge at the end of each scene where ${pronounLoc[weapon.pronouns].singular.possessive} wielder made an ice pun`),
                    ],
                    dark: [
                        `one charge upon absorbing a human soul`,
                        mkGen((_, weapon: Weapon) => `one charge at the end of each scene where ${pronounLoc[weapon.pronouns].singular.possessive} wielder destroyed an object unnecessarily`),
                        `all charges each day at the witching hour`,
                        mkGen((_, weapon: Weapon) => `one charge when ${pronounLoc[weapon.pronouns].singular.possessive} wielder defenestrates a priest, or all charges if it was a high ranking priest`)
                    ],
                    light: [
                        `all charges after an hour in a sacred space`,
                        `all charges each day at sunrise`,
                        mkGen(rng => `one charge each time you defeat ${singularUnholyFoe.generate(rng)}`)
                    ],
                    sweet: [
                        mkGen((_, weapon: Weapon) => `all charges each time ${pronounLoc[weapon.pronouns].singular.possessive} wielder hosts a feast`),
                        mkGen((_, weapon: Weapon) => `one charge each time ${pronounLoc[weapon.pronouns].singular.possessive} wielder gives a well-received compliment`)
                    ],
                    sour: [
                        `all charges after an hour immersed in acid`,
                        `all charges when used to fell a citrus tree`,
                        mkGen((_, weapon: Weapon) => `one charge each time ${pronounLoc[weapon.pronouns].singular.possessive} wielder insults someone`)
                    ],
                    cloud: [
                        `all charges when struck by lightning`,
                        mkGen((_, weapon: Weapon) => `all charges when ${pronounLoc[weapon.pronouns].singular.possessive} wielder survives a significant fall`),
                        `one charge each time you defeat a winged creature, or all charges if it was also a powerful foe`,
                    ],
                    wizard: [
                        `one charge when you cast one of your own spells`,
                        mkGen((_, weapon: Weapon) => `all charges when ${pronounLoc[weapon.pronouns].singular.possessive} wielder learns a new spell`),
                        mkGen((_, weapon: Weapon) => `all charges when ${pronounLoc[weapon.pronouns].singular.possessive} wielder wins a wizard duel`),
                        mkGen((_, weapon: Weapon) => `one charge when ${pronounLoc[weapon.pronouns].singular.possessive} wielder finishes reading a new book`),
                        mkGen((_, weapon: Weapon) => `all charges when ${pronounLoc[weapon.pronouns].singular.possessive} wielder views the night sky`),
                    ],
                    steampunk: [
                        mkGen((_, weapon: Weapon) => `all charges when ${pronounLoc[weapon.pronouns].singular.possessive} wielder invents something`),
                        mkGen((_, weapon: Weapon) => `all charges when ${pronounLoc[weapon.pronouns].singular.possessive} wielder throws a tea party`),
                        mkGen((_, weapon: Weapon) => `one charge when ${pronounLoc[weapon.pronouns].singular.possessive} wielder breaks news`),
                    ],
                    earth: [
                        mkGen((_, weapon: Weapon) => `one charge when ${pronounLoc[weapon.pronouns].singular.possessive} wielder throws a rock at something important`),
                        mkGen((_, weapon: Weapon) => `all charges when ${pronounLoc[weapon.pronouns].singular.possessive} wielder meditates atop a mountain`)
                    ],
                    nature: [
                        mkGen(rng => `all charges when its wielder drives ${agentOfExtractivism.generate(rng)} to bankruptcy`)
                    ]
                },
                (theme, x, i) => new ProviderElement<RechargeMethod, WeaponPowerCond>(
                    `${theme}-recharge-${i}`,
                    { desc: x },
                    { themes: { any: [theme as Theme] } }
                ))
        ]
    },
    actives: {
        add: [
            new ProviderElement("mirror-image",
                mkGen((rng, weapon) => {
                    const byTheme: Record<'wizard' | 'light' | 'dark', Pick<ActivePower, 'desc'>> = {
                        wizard: { desc: "Reflections" },
                        light: { desc: "Illusory Duplicate" },
                        dark: { desc: "Dark Reflection" },
                    }

                    const partial = pickForTheme(weapon, byTheme, rng)?.chosen ?? byTheme['wizard'];

                    return {
                        ...partial,
                        cost: 2,
                        additionalNotes: [
                            "The weapon emits two illusory duplicates of you, which appear to fight by your side.",
                            "When you are hit, there's a 1-in-2 chance that it targets a duplicate instead, destroying it and leaving you unharmed."
                        ]
                    }
                }),
                {
                    themes: { any: ['wizard', 'light', 'dark'] }
                }
            ),
            new ProviderElement("empower-ally-defensive-or-utility",
                mkGen((rng, weapon) => {
                    const armorQualityByRarity = {
                        common: "",
                        uncommon: " (+1)",
                        rare: " (+1)",
                        epic: " (+2)",
                        legendary: " (+2)"
                    } as const satisfies Record<WeaponRarity, `` | ` (+${number})`>;

                    // this can have a variety of effects depending on the theme.
                    // However we don't want multiple of these ally buffs, that's why it's all on a single ability 
                    const byTheme: Record<Theme, Omit<ActivePower, 'cost'>[]> = {
                        fire: [
                            {
                                desc: "Fiery Armor",
                                additionalNotes: [
                                    "The weapon launches a loop of harmless magical flames at another character, which curls around them.",
                                    "For the rest of the scene, foes that make a melee attack them are set on fire, as the flames billow out to ignite them"
                                ],
                            },
                            {
                                desc: "Hot Heels",
                                additionalNotes: [
                                    "You tap the weapon beside another character's feet, igniting them with harmless magical flames.",
                                    "For the rest of the scene, they move twice as fast."
                                ],
                            }
                        ],
                        cloud: [
                            {
                                desc: "Tesla Shield",
                                additionalNotes: [
                                    "The weapon zaps another character, charging them with electrical energy until the end of the scene.",
                                    "When a charged character is attacked, there's a 1-in-6 chance that lighting will spark out, stunning the attacker and interrupting the attack."
                                ],
                            },
                            {
                                desc: "Anbaric Armor",
                                additionalNotes: [
                                    "The weapon zaps another character, charging them with static electricity.",
                                    "A powerful static force repels anything physical within 10-ft of them, and blocks projectiles in or out.",
                                    "However, if they move, they take 3d6 damage as the energy discharges. The charge dissipates at the end of the scene" // Kaya, stay
                                ],
                            }
                        ],
                        ice: [
                            {
                                desc: "Frigid Plate",
                                additionalNotes: [
                                    "You level the weapon at another character, and the atmosphere freezes around them as armor.",
                                    `It has stats as plate${armorQualityByRarity[weapon.rarity]}. At the end of the scene, it shatters and falls off.`
                                ],
                            }
                        ],
                        earth: [
                            {
                                desc: "Stone Plate",
                                additionalNotes: [
                                    "You level the weapon at the ground below another character, and it rises up to engulf them as armor.",
                                    `It has stats as plate${armorQualityByRarity[weapon.rarity]}. At the end of the scene, it collapses into rubble and falls off.`
                                ],
                            }
                        ],
                        light: [
                            {
                                desc: "Bless",
                                additionalNotes: [
                                    "You level the weapon at another character, and they're briefly surrounded by divine light.",
                                    "For the rest of the scene, they gain 1d4 temporary hit points at the start of each of their turns."
                                ],
                            },
                            {
                                desc: "Protection from Curses",
                                additionalNotes: [
                                    "You level the weapon at another character, and they're briefly surrounded by divine light.",
                                    "For the rest of the scene, they cannot be cursed."
                                ],
                            }
                        ],
                        dark: [
                            {
                                desc: "Serpent's Gift",
                                additionalNotes: [
                                    "You press the weapon against another character, as shadows leak out of it and into them.",
                                    "For the rest of the scene, when they fail to sneak or deceive, there's a 1-in-2 chance that they succeed anyway."
                                ],
                            }
                        ],
                        sweet: [
                            {
                                desc: "Sugar Rush",
                                additionalNotes: [
                                    "You blast another character with a dusting of magical sugar, giving them extra energy.",
                                    "For the rest of the scene, they can take one additional action one each of their turns."
                                ],
                            }
                        ],
                        sour: [
                            {
                                desc: "Immunity",
                                additionalNotes: [
                                    "You blast another character with multicolored dust, increasing their vitality.",
                                    "For the rest of the scene, they are immune to poison and disease."
                                ],
                            }
                        ],
                        wizard: [
                            {
                                desc: "Ward Other",
                                additionalNotes: [
                                    "You wave the weapon at another character, as it summons sigils of arcane warding around them.",
                                    "For the rest of the scene, spells targeted at them have a 1-in-4 chance to deflect back at the caster."
                                ],
                            }
                        ],
                        steampunk: [
                            {
                                desc: "Defender Drone",
                                additionalNotes: [
                                    `The weapon produces a drone, which hovers above another character of your choice, projecting a force-field around them.`,
                                    `It confers the same benefits as wielding a shield. The drone is unarmored and has 1 HP. It falls to pieces at the end of the scene.`
                                ],
                            }
                        ],
                        nature: [
                            {
                                desc: "Beetle Plate",
                                additionalNotes: [
                                    "You level the weapon at another character, and it calls forth thousands of beetles to swarm around them as armor.",
                                    `The beetles have stats as plate${armorQualityByRarity[weapon.rarity]}. At the end of the scene, they scuttle off.`
                                ],
                            }
                        ]
                    };

                    const partial = pickForTheme(weapon, byTheme, rng)?.chosen?.choice(rng) ??
                        {
                            desc: "Buff",
                            additionalNotes: [
                                "You point the weapon at an ally.",
                                "For the rest of the scene, they deal +1 damage."
                            ],
                        } satisfies Omit<ActivePower, 'cost'>;

                    return {
                        ...partial,
                        cost: 1
                    }
                }),
                {
                    themes: { any: ['fire', 'ice', 'cloud', 'earth', 'light', 'dark', 'sweet', 'sour', 'wizard', 'steampunk', 'nature'] }
                }
            ),
            new ProviderElement("slow-bomb",
                mkGen((rng, weapon) => {
                    const core = pickOrLinkWithEnergyCore(rng, weapon);

                    const partialAbilityByTheme: Record<PossibleCoreThemes, { desc?: string; additional: string; noHover?: true }[]> = {
                        fire: [{ additional: "A ball of fire" }],
                        ice: [{ additional: "A sphere of ice" }],
                        cloud: [{ desc: "Ball Lightning", additional: "A ball of lightning" }],
                        light: [{ desc: `${core.adj} Pursuer`, additional: `An orb of ${core.desc}` }],
                        dark: [{ desc: "Annihilation", additional: "A black hole" }, { desc: "You're Next", additional: "A large shadowy head emerges from the ground in front of you.", noHover: true }],
                        wizard: [{ desc: "Ominous Orb", additional: `An orb of ${core.desc}` }],
                        sour: [{ additional: "A sphere of toxic waste" }],
                        steampunk: [{ additional: "A globe of steam" }],
                        nature: [{ desc: "Energy Ball", additional: `An orb of ${core.desc}` }],
                        void: [{ additional: "The number 404" }],
                    };

                    const partialAbility = partialAbilityByTheme[core.theme].choice(rng);

                    const dieSizeByRarity = {
                        common: [8],
                        uncommon: [8, 10, 10, 10],
                        rare: [10],
                        epic: [10],
                        legendary: [10, 10, 10, 12]
                    } as const satisfies Record<WeaponRarity, CommonDieSize[]>;

                    const dieSize = choice(dieSizeByRarity[weapon.rarity], rng);

                    return {
                        desc: partialAbility?.desc ?? "Slow Bomb",
                        cost: 3,
                        additionalNotes: [
                            `${partialAbility.noHover ? partialAbility.additional : `${partialAbility.additional} forms at the weapon's tip, hovering around eye level`}. At the start of each of your turns, it moves 10-ft closer to the nearest foe.`,
                            `If touched, it explodes with a 30-ft radius. Targets save, taking 10d${dieSize} damage on a fail and half as much on a success.`
                        ],
                        descriptorPartGenerator: core.featureUUID
                    }
                }),
                {
                    themes: { any: ['fire', 'ice', 'cloud', 'light', 'dark', 'sour', 'wizard', 'steampunk', 'nature'] }
                }
            ),
            new ProviderElement("pin-to-wall",
                mkGen((_, weapon) => {
                    // If it has an animal transformation, it must be into a snake.
                    // Not having one is also fine, because we could roll the transformation later, and that ability will link in with the python desc we add here.
                    const hasAnimalTransformation = hasUUIDs(weapon, ['weapon-animal-transformation']);
                    const isSnakelike = !hasUUIDs(weapon, ['carved-resembling-python', 'carved-resembling-cobra', 'carved-resembling-snake']);
                    const validForSnakeMode = !hasAnimalTransformation || isSnakelike;

                    return {
                        desc: "Wrap",
                        cost: 1,
                        additionalNotes: [
                            `Upon a hit, you ${weapon.sentient ? "signal" : "will"} the weapon to bind the target.`,
                            `Its shaft coils around the target${validForSnakeMode ? " like a snake, binding" : "'s body to bind"} them in place.`,
                            "They may save at the end of each of their turns to break free of the weapon."
                        ],
                        // only add the descriptor if it's not snakelike, or it will conflict
                        ...(!isSnakelike ? { descriptorPartGenerator: 'carved-resembling-python' } : {}),
                    }
                }),
                {
                    shapeFamily: { any: ['spear'] },
                }
            ),
            new ProviderElement("chaos-cast",
                {
                    desc: "Chaos Cast",
                    cost: 1,
                    additionalNotes: [
                        "The weapon casts a randomly chosen spell, centered on the wielder.",
                        "The spell is cast instantly, and its normal resource costs are ignored.",
                        "If you are using a magic system with spells levelled 1-9, the spell can be of 1st, 2nd, or 3rd level."
                    ]
                },
                {
                    shapeFamily: { any: ['staff'] },
                    themes: { any: ['wizard'] }
                }
            ),
            new ProviderElement("compelled-duel",
                {
                    desc: "Compelled Duel",
                    cost: "at will",
                    additionalNotes: [
                        "You challenge another (armed) character to a duel, and the weapon's magic compels them to agree.",
                        "Until one of you is defeated, neither of you can attack any other characters.",
                        "If both duellists' weapons use charges, the winner's weapon absorbs all charges of the loser's weapon."
                    ]
                },
                { shapeFamily: { any: ['sword', 'sword (or musket)'] } }
            ),
            new ProviderElement("reveal-hidden",
                mkGen((_, weapon) => rangedWeaponShapeFamilies.includes(weapon.shape.group as (typeof rangedWeaponShapeFamilies)[number])
                    ? {
                        desc: "Revealing Shot",
                        cost: 1,
                        additionalNotes: [
                            "You empower a shot to reveal the unseen. The target cannot be affected by magical illusions, such as invisibility,.",
                            "Targets may save to ignore the effect. Once it's applied, they save at the end of each of their turns, ending it upon a success."
                        ]
                    }
                    : {
                        desc: "Flare",
                        cost: 3,
                        additionalNotes: [
                            "You fire a flare from the weapon's tip, which targets everything it illuminates. Targets cannot be affected by magical illusions such as invisibility.",
                            "Targets may save to ignore the effect. Once it's applied, they save at the end of each of their turns, ending it upon a success."
                        ]
                    }),
                {
                    themes: { any: ["light", "fire", "wizard", "steampunk"] },
                }
            ),
            new ProviderElement('banishment',
                {
                    desc: 'Banishment',
                    cost: 4,
                    additionalNotes: [
                        "You empower an attack to banish a foe.",
                        "The target must save or be magically transported back to their home."
                    ]
                },
                { themes: { any: ['light', 'dark', 'wizard'] } }
            ),
            new ProviderElement("stone-prison",
                {
                    desc: "Stone Prison",
                    cost: 2,
                    additionalNotes: [
                        "You strike the earth with the weapon, drawing out an earthen chain.",
                        "It starts attached to the weapon's tip, then transfers to the next character you hit. Whatever the chain is attached to is bound within 30-ft of the origin.",
                        "The chain has 10,000 HP. It shatters after 24 hours, or when you command it to."
                    ]
                },
                { themes: { any: ["earth"] } }
            ),
            new ProviderElement("fore-strike",
                mkGen((_, weapon) => {
                    const rangeByRarity = {
                        common: 40,
                        uncommon: 40,
                        rare: 40,
                        epic: 50,
                        legendary: 60
                    } satisfies Record<WeaponRarity, number>;

                    return {
                        cost: 2,
                        desc: 'Fore!',
                        additionalNotes: [
                            'Upon landing a blow, you empower it with extra force.',
                            `The target is knocked away from you (${rangeByRarity[weapon.rarity]}-ft). If it causes them to hit something, they take ${textForDamage(modDamage(weapon.damage))} damage.`
                        ]
                    }
                }),
                {
                    shapeFamily: { any: bluntWeaponShapeFamilies }
                }
            ),
            new ProviderElement("mist-mode",
                {
                    cost: '1 charge to activate, and 1 charge each turn to maintain',
                    desc: 'Mist Mode',
                    additionalNotes: [
                        'You transform into mist.',
                        'Mist Mode can be activated in response to being targeted by an attack, causing it to miss.'
                    ]
                },
                {
                    themes: { any: ['cloud', 'wizard', 'dark'] }
                }
            ),
            new ProviderElement('roulette-shot', {
                desc: 'Roulette',
                cost: 1,
                additionalNotes: [
                    `You fire an enchanted shot. Roll on the table below to decide the effect.
                    \r1. Dragon's Breath. Target is set on fire.
                    \r2. Explosive. Everyone within melee range of the target takes equal damage.
                    \r3. Flash Powder. Target must save or be stunned during their next turn.
                    \r4. Hammer Shot. Shatters every bone in a random limb of the target.
                    \r5. Wither Shot. Target takes double damage until the start of your next turn.
                    \r6. Wormhole. You swap places with the target.`,
                ]
            }, {
                rarity: { gte: 'legendary' },
                shapeFamily: { any: ['dagger (or pistol)', 'sword (or musket)', 'greataxe (or musket)'] }
            }),
            new ProviderElement('return-to-home',
                {
                    cost: 3,
                    desc: 'Return',
                    additionalNotes: [
                        'The weapon is bound to a particular location, you can slice the air to open a portal to it. It stays open for 1 minute before collapsing.',
                        'The location is fixed and decided by the referee. Typical locations include the place the weapon was forged, or the fortress of a previous wielder.'
                    ]
                },
                { shapeFamily: { any: edgedWeaponShapeFamilies } }
            ),
            new ProviderElement("standard-projectile",
                mkGen((rng, weapon) => {

                    const damage = textForDamage(modDamage(weapon.damage, x => 2 * x));
                    const core = pickOrLinkWithEnergyCore(rng, weapon);

                    const projectileByTheme = {
                        ice: "a snowflake shuriken",
                        fire: weapon.themes.includes('cloud') ? "a pressurised stream of steam" : "a fiery chakram",
                        cloud: weapon.themes.includes('fire') ? "a pressurised stream of steam" : "a pressurized stream of water, razor-sharp",
                        steampunk: "an arc of electricity",
                        light: `a wave of ${core.desc}`,
                        dark: `a wave of ${core.desc}`,
                        wizard: `a wave of ${core.desc}`,
                        void: `a wave of ${core.desc}`,
                        nature: `a wave of ${core.desc}`,
                        sour: `a wave of ${core.desc}`
                    } as const satisfies Record<PossibleCoreThemes | 'void', string>;

                    const titleByTheme = {
                        fire: weapon.themes.includes('cloud') ? "Steam Blast" : "Ring of Fire",
                        ice: "Ice Blast",
                        cloud: weapon.themes.includes('fire') ? "Steam Blast" : "Pressure Washer",
                        steampunk: "Arc Blast",
                        nature: `${core.adj} Blast`,
                        light: `${core.adj} Blast`,
                        dark: `${core.adj} Blast`,
                        wizard: `${core.adj} Blast`,
                        void: `${core.adj} Blast`,
                        sour: `${core.adj} Blast`
                    } as const satisfies Record<PossibleCoreThemes | 'void', string>;

                    return {
                        cost: 2,

                        desc: titleByTheme[core.theme],
                        additionalNotes: [`You strike at the air, launching ${projectileByTheme[core.theme]}.`, `It deals ${damage} damage, range as sling.`],
                        descriptorPartGenerator: core.featureUUID
                    }
                }),
                {
                    themes: { any: ['fire', 'ice', 'light', 'dark', 'wizard', 'cloud', 'steampunk'] },
                    rarity: { gte: 'rare' },
                    // waste of a slot if you can already shoot
                    shapeFamily: { none: rangedWeaponShapeFamilies }
                }
            ),
            new ProviderElement("shuffle",
                mkGen((rng, weapon) => {
                    const numTargetsByRarity = {
                        common: 2,
                        uncommon: 4,
                        rare: 4,
                        epic: 4,
                        legendary: 4,
                    } as const satisfies Record<WeaponRarity, number>;

                    const byTheme = {
                        cloud: {
                            desc: 'Gust of the Fox King',
                            additionalNotes: [`The weapon spews forth magical mist, briefly obscuring the scene. When it dissipates, up to ${numTargetsByRarity[weapon.rarity]} characters of your choice have switched places.`]
                        },

                        wizard: {
                            desc: 'Switch Trick',
                            additionalNotes: [`You point the weapon at up to ${numTargetsByRarity[weapon.rarity]} characters of your choice. They switch places in a flash of smoke.`]
                        }
                    } as const satisfies Partial<Record<Theme, Pick<ActivePower, 'additionalNotes' | 'desc'>>>;

                    return {
                        cost: 3,
                        ...pickForTheme(weapon, byTheme, rng).chosen ?? byTheme['cloud']
                    }
                }),
                {
                    themes: {
                        any: ['cloud', 'wizard']
                    }
                }
            ),
            new ProviderElement("stasis",
                mkGen((rng, weapon) => {
                    const byTheme = {
                        dark: {
                            desc: "Tenth Circle",
                            additionalNotes: [
                                "The target is snapped up whole by a titanic thing from the space-between-spaces",
                                "It emerges from an edge, targeting something within 15-ft.",
                                "Targets save at the end of each of their turns, ending the effect on a success. The chance is 20% for a character with no modifiers."
                            ]
                        },
                        ice: {
                            desc: "Cryostasis",
                            additionalNotes: [
                                "You imprison the target in a block of eternal ice, which magically freezes them until it's destroyed.",
                                mkGen((__, weapon) => {
                                    // It has HP equal to 3x the weapon's damage
                                    const { as, d6, ...rest } = weapon.damage;
                                    const iceHP = _.mapValues(
                                        {
                                            d6: 1 + (d6 ?? 0),
                                            ...rest
                                        },
                                        x => x === undefined ? undefined : x * 3
                                    );

                                    return `It has ${textForDamage(iceHP)} hit points, and is as strong as steel.`;
                                })
                            ]
                        }
                    } as const satisfies Partial<Record<Theme, Pick<ActivePower, 'additionalNotes' | 'desc'>>>;

                    return {
                        cost: 3,
                        ...pickForTheme(weapon, byTheme, rng).chosen ?? byTheme['ice']
                    }
                }),
                {
                    themes: { any: ["dark", "ice"] },
                }
            ),
            new ProviderElement("turn-ethereal",
                {
                    desc: "Spirit Skim",
                    cost: 3,
                    additionalNotes: [
                        "You enter the spirit realm until the end of your next turn.",
                        "You become partially transparent. Living things, and structures smaller than a shipping container, can't physically interact with you, but you can interact with ghosts & spirits as if they were physical.",
                        "If you end your turn inside something, the weapon automatically extends the effect. If it lacks the charge to do so, that part of your body is permanently trapped in the spirit realm."
                    ]
                },
                {
                    themes: { any: ["light"] },
                }
            ),
            new ProviderElement("shadow-walk",
                {
                    desc: "Shadow Walk",
                    cost: 3,
                    additionalNotes: [
                        "You enter the shadow realm until the end of your next turn.",
                        "You become invisible to living things, and they can't physically interact with you. You can interact with ghosts & spirits as if they were physical."
                    ]
                },
                {
                    themes: { any: ["dark"] },
                }
            ),
            new ProviderElement("spectral-strike",
                mkGen((_, weapon) => rangedWeaponShapeFamilies.includes(weapon.shape.group as (typeof rangedWeaponShapeFamilies)[number])
                    ? {
                        desc: "Spectral Shot",
                        cost: 2,
                        additionalNotes: [
                            "You empower an attack to bypass defenses. The projectile can phase through terrain and ignores the effects of armor."
                        ]
                    }
                    : {
                        desc: "Spectral Strike",
                        cost: 2,
                        additionalNotes: [
                            "You empower an attack to bypass defenses. During the attack the weapon can phase through terrain, and ignores the effects of armor."
                        ]
                    }),
                {
                    themes: { any: ["dark", "light", "wizard", "cloud"] },
                }
            ),
            new ProviderElement("extra-accuracy-attack",
                mkGen((_, weapon) => {

                    const bonusByRarity = {
                        common: "1d4",
                        uncommon: "1d6",
                        rare: "1d8",
                        epic: "1d10",
                        legendary: "1d12"
                    } as const satisfies Record<WeaponRarity, `1d${CommonDieSize}`>;

                    if (weapon.shape.group === "greataxe (or musket)") {
                        return {
                            desc: "Hold Breath",
                            cost: 1,
                            additionalNotes: [
                                `You hold your breath to steady your aim, granting +${bonusByRarity[weapon.rarity]} to hit this attack.`
                            ]
                        }
                    }
                    else {
                        const desc =
                            rangedWeaponShapeFamilies.includes(weapon.shape.group as (typeof rangedWeaponShapeFamilies)[number])
                                ? "Focus Shot"
                                : "Focus Strike";

                        return {
                            desc,
                            cost: 1,
                            additionalNotes: [
                                `${weapon.sentient === false ? "The weapon magically sharpens your focus" : "You mentally sync with the weapon"}, granting +${bonusByRarity[weapon.rarity]} to hit this attack.`
                            ]
                        };
                    }
                }),
                {}
            ),
            new ProviderElement("extra-damage-attack",
                mkGen((rng, weapon) => {
                    const reasonsByTheme = {
                        fire: ["a burst of fire explodes from the weapon", `the ${getBusinessEndDesc(weapon.shape)} is momentarily superheated`, ...(weapon.themes.includes('cloud') ? ["the weapon produces a blast of steam"] : [])],
                        ice: [`the ${getBusinessEndDesc(weapon.shape)} momentarily drops to absolute zero`],
                        cloud: [`lightning sparks from ${getBusinessEndDesc(weapon.shape)}`, ...(weapon.themes.includes('fire') ? ["the weapon produces a blast of steam"] : [])],
                        earth: [`magma erupts from ${getBusinessEndDesc(weapon.shape)}`],
                        light: [`light surrounds ${getBusinessEndDesc(weapon.shape)}`],
                        dark: [`shadowy tentacles burst from ${getBusinessEndDesc(weapon.shape)}`, `shadows coil around ${getBusinessEndDesc(weapon.shape)}`],
                        sweet: ["the power of friendship surges within you", `molten caramel whips around ${getBusinessEndDesc(weapon.shape)}`, `magical hearts whip around ${getBusinessEndDesc(weapon.shape)}`, `magical stars whip around ${getBusinessEndDesc(weapon.shape)}`],
                        sour: [(() => {
                            switch (get5eDamageType(weapon.shape)) {
                                case "bludgeoning":
                                    return "acid oozes from the weapon's surface";
                                case "piercing":
                                    return "the weapon injects acid into the target";
                                case "slashing":
                                    return "acid flows around the weapon's edge";
                            }
                        })()],
                        wizard: ["arcane power surges through the weapon"],
                        steampunk: ["the weapon produces an explosive blast", "the weapon produces a blast of steam"],
                        nature: [(() => {
                            const { singular: animal } = singularWildAnimalStructured.generate(rng);
                            return `the weapon projects a spectral ${animal} that attacks the target`;
                        })()]
                    } as const satisfies Record<Theme, string[]>;

                    const numDieByRarity = {
                        common: [1, 1, 1, 1, 2],
                        uncommon: [1, 1, 2],
                        rare: [1, 2, 2],
                        epic: [2, 2, 3],
                        legendary: [2, 3]
                    } as const satisfies Record<WeaponRarity, [number, ...number[]]>;
                    const dieSizeByRarity = {
                        common: [6, 6, 6, 6, 8, 8, 10],
                        uncommon: [6, 6, 8, 8, 8, 8, 10],
                        rare: [8, 8, 8, 8, 10, 10, 8],
                        epic: [8, 8, 10, 10, 10, 10, 12],
                        legendary: [10, 10, 10, 10, 12, 12]
                    } as const satisfies Record<WeaponRarity, [CommonDieSize, ...CommonDieSize[]]>;

                    const reason = pickForTheme(weapon, reasonsByTheme, rng)?.chosen?.choice(rng) ?? "the power of friendship surges within you";

                    const numDie = numDieByRarity[weapon.rarity].choice(rng);
                    const dieSize = dieSizeByRarity[weapon.rarity].choice(rng);
                    const damage = `${numDie}d${dieSize}`;

                    /**
                     * @example
                     * [1*6,1*8,1*10,1*12, 2*6,2*8,2*10,2*12, 3*6,3*8,3*10,3*12].map(n => Math.floor(Math.log(n))) === [1,2,2,2, 2,2,2,3, 2,3,3,3]
                     */
                    const cost = Math.floor(Math.log(numDie * dieSize));

                    return {
                        desc: "Empowered Attack",
                        cost: cost,
                        additionalNotes: [
                            `You empower an attack to deal an additional ${damage} damage, as ${reason}.`,
                        ]
                    };
                }),
                {}
            ),
            new ProviderElement("extra-range-attack",
                mkGen((rng, weapon) => {
                    const reasonsByTheme = {
                        fire: [`${getBusinessEndDesc(weapon.shape)} projects a fiery aura`, `${getBusinessEndDesc(weapon.shape)} is engulfed by a larger fiery copy`],
                        earth: [`${getBusinessEndDesc(weapon.shape)} projects a volcanic aura`, "the weapon's surface cracks and then solidifies in larger form"],
                        ice: [`razor-sharp snowflakes whip around ${getBusinessEndDesc(weapon.shape)}`, "ice solidifies around the weapon to form a larger copy"],
                        cloud: [`razor-wind whips around ${getBusinessEndDesc(weapon.shape)}`, `lightning sparks from ${getBusinessEndDesc(weapon.shape)}, forming a larger copy`],
                        light: [],
                        dark: ["the weapon is surrounded by a larger shadow of itself"],
                        wizard: ["motes of arcane energy whip around the weapon", "the weapon projects a larger spectral copy of itself"],
                        steampunk: ["the weapon transforms into its extended mode"],
                        sweet: [],
                        sour: [],
                        nature: []
                    } as const satisfies Record<Theme, string[]>;

                    const rangeIncreaseByRarity = {
                        common: 10,
                        uncommon: 10,
                        rare: 10,
                        epic: 20,
                        legendary: 20
                    } as const satisfies Record<WeaponRarity, number>;

                    const choice = pickForTheme(weapon, reasonsByTheme, rng);
                    const reason = choice.chosen?.choice(rng) ?? "the weapon projects a larger spectral copy of itself";

                    return {
                        desc: "Distant Strike",
                        cost: 1,
                        additionalNotes: [
                            `For one attack, ${reason}, increasing its range by ${rangeIncreaseByRarity[weapon.rarity]}-ft.`,
                        ]
                    };
                }),
                { shapeFamily: { none: rangedWeaponShapeFamilies } }
            ),
            new ProviderElement("mana-vampire-strike",
                {
                    desc: 'Mana Drain',
                    cost: 5,
                    additionalNotes: [
                        "Upon landing a blow, you empower it to steal magic from the target's mind. Choose one of their spells at random. ",
                        "They expend resources as if the spell was cast, the spell is then stored inside the weapon for you to cast later (at no cost).",
                        "Only one spell can be stored at a time."
                    ],
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
                        "Upon landing a blow, you empower it to drain the target's life force. You regain HP equal to the damage dealt.",
                        "HP gained in this way can heal you over your natural cap, but any HP over the cap is lost at the end of the scene.",
                    ],
                },
                {
                    themes: { any: ['dark'] },
                    rarity: {
                        gte: 'rare'
                    }
                }
            ),
            new ProviderElement("disease-strike",
                mkGen((rng, weapon) => {
                    const [desc, additional] = ([
                        ['Inflict Scurvy', 'scurvy'], ['Inflict Plague', 'the black death'], ['Inflict Consumption', 'tuberculosis'],
                        ['Inflict Pox', 'smallpox'], ['Unfortunate News', 'coronavirus'],
                        ['Inflict Ebola', 'ebola'], ['Inflict Malaria', 'malaria'], ['Inflict Leprosy', 'leprosy'],
                        ['Inflict Tetanus', 'super-tetanus'], ['Inflict Toxiplasmosis', 'hyper-toxiplasmosis (-15 to social saves against felines)'],
                        ...(gte(weapon.rarity, 'rare') ? [['Turn Rabid', 'rabies'], ['Inflict Rage', 'the rage virus']] as const : [])
                    ] as const satisfies ((readonly [string, string])[])).choice(rng);

                    return {
                        desc,
                        cost: 2,
                        additionalNotes: [
                            `Upon landing a blow, you empower it to inflict disease. The target must save or contract ${additional}.`,
                        ]
                    }
                }),
                {
                    themes: { any: ["sour", "nature"] },
                    UUIDs: { none: ['caustic-strike'] }
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
                        rare: "for 24 hours",
                        epic: "for a week",
                        legendary: "until you choose to end it"
                    } as const satisfies Record<WeaponRarity, string>;
                    return {
                        desc: "You Are Being Watched",
                        cost: 3,
                        additionalNotes: [
                            "Upon landing a blow (on a person), you empower it to draw divine attention to them.",
                            `You magically know the target's location. The effect lasts ${durationByRarity[weapon.rarity]}, or until the target dies.`
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
                        common: { cost: 2, endChance: [4, 6], damage: [4, 4, 4, 6] },
                        uncommon: { cost: 2, endChance: [6, 8], damage: [4, 4, 4, 6] },
                        rare: { cost: 2, endChance: [8, 10], damage: [4, 4, 6] },
                        epic: { cost: 3, endChance: [10], damage: [4, 6] },
                        legendary: { cost: 3, endChance: [10], damage: [6] }
                    } as const satisfies Record<WeaponRarity, { cost: number; endChance: CommonDieSize[]; damage: CommonDieSize[] }>;

                    const effects = {
                        fire: { title: "Lingering Flames", desc: "fire" },
                        sour: { title: "Caustic Chain", desc: "acid" },
                        nature: { title: "Toxicity", desc: "poison" }
                    } satisfies Partial<Record<Theme, { title: string, desc: string }>>;

                    const effect = pickForTheme(weapon as WeaponGivenThemes<['fire' | 'sour']>, effects, rng).chosen;
                    return {
                        desc: effect.title,
                        cost: numbersByRarity[weapon.rarity].cost,
                        additionalNotes: [
                            `Infuse a strike with lingering ${effect.desc}, dealing d${numbersByRarity[weapon.rarity].damage.choice(rng)} damage to the target at the start of each of their turns.`,
                            `Each time it deals damage, the effect has a 1-in-${numbersByRarity[weapon.rarity].endChance.choice(rng)} chance of wearing off.`
                        ]

                    }
                }),
                {
                    themes: { any: ["fire", "sour", "nature"] }
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
                    themes: { any: ['earth'] },
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
                    themes: { any: ['cloud'] }
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
            new ProviderElement("weapon-animal-transformation",
                mkGen((rng, weapon) => {
                    // if we already have the spear snake ability "pin-to-wall", link with that
                    const { article, singular } = hasUUIDs(weapon, ['carved-resembling-python']) ? { article: 'a', singular: 'python' } as const : singularWildAnimalStructured.generate(rng);

                    return {
                        desc: "Animal Transformation",
                        cost: 2,
                        additionalNotes: [
                            `The weapon transforms into ${article} ${singular} until the end of the scene, or until it dies.`,
                            "You can command it to turn back into its regular form early."
                        ],
                        descriptorPartGenerator: `carved-resembling-${singular.toLowerCase().replaceAll(/\s+/g, '-')}`
                    };
                }),
                {
                    themes: { any: ["nature"], },
                    rarity: { lte: 'rare' },
                    UUIDs: { none: ['summon-animal-weak', 'summon-animal-strong'] }
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
                    },
                    UUIDs: { none: ['summon-demon'] }
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
                { desc: "Darkness", cost: 1 },
                { themes: { any: ["dark"] } }
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
                    },
                    UUIDs: { none: ['commune-demon'] }
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
                    UUIDs: { none: ['cast-heal'] }
                }
            ),
            new ProviderElement("cast-heal",
                mkGen((_, weapon) => ({
                    desc: "Heal",
                    cost: 1,
                    additionalNotes: [
                        `Motes of light whip around the weapon as it releases a burst of healing energy. It heals ${textForDamage(modDamage(weapon.damage, n => n + weapon.toHit))} HP, range as sling.`,
                    ]
                })),
                {
                    shapeFamily: { any: bluntWeaponShapeFamilies },
                    themes: { any: ['light'] },
                    UUIDs: { none: ['sweetberry'] }
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
                        "You wave the weapon at a character. They must save or waste their turn vomiting."
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
            new ProviderElement("disarm",
                mkGen((rng, weapon) => {

                    const byTheme = {
                        earth: {
                            desc: "Magnetize",
                            additionalNotes: [
                                "Magnetic forces rip a magnetic from your opponent's hand.",
                                "If they successfully save, they simply drop the object. If they fail, you may also choose to pull it into your grip."
                            ]
                        },
                    } as const satisfies Partial<Record<Theme, Pick<ActivePower, 'desc' | 'additionalNotes'>>>;

                    const partial = pickForTheme(weapon, byTheme, rng)?.chosen ?? {
                        desc: "Disarm",
                        additionalNotes: [
                            "The weapon magically guides your hand to disarm an opponent.",
                            "They are forced to drop an object they're holding, no save."
                        ]
                    } satisfies Pick<ActivePower, 'desc' | 'additionalNotes'>;

                    return {
                        ...partial,
                        cost: 2,
                    }
                }),
                {}
            ),
            new ProviderElement("deny-disarm",
                mkGen((rng, weapon) => {
                    const partialAbilitiesByTheme = {
                        fire: { partialDesc: "a metal tentacle extends from the pommel to wrap around your forearm", partialDescriptionPartGenerator: "gripping-tentacle-descriptor-fire" },
                        ice: { partialDesc: "magical ice freezes around your forearm", partialDescriptionPartGenerator: "gripping-tentacle-descriptor-ice" },
                        dark: { partialDesc: "shadowy tentacles extend from the pommel to wrap around your forearm", partialDescriptionPartGenerator: "gripping-tentacle-descriptor-dark" },
                        nature: { partialDesc: "the vine on the pommel wraps around your forearm", partialDescriptionPartGenerator: "gripping-tentacle-descriptor-nature" }
                    } satisfies Partial<Record<Theme, { partialDesc: string; partialDescriptionPartGenerator: string }>>;

                    const { partialDesc, partialDescriptionPartGenerator } = pickForTheme(weapon, partialAbilitiesByTheme, rng).chosen ?? {
                        partialDesc: "the tendril on the weapon's pommel grips around your forearm", partialDescriptionPartGenerator: "gripping-tentacle-descriptor-generic"
                    };
                    return {
                        desc: `Deny Disarm`,
                        cost: 1,
                        additionalNotes: [
                            `In response to an attempt to disarm you, ${partialDesc}, foiling the attempt.`
                        ],
                        descriptorPartGenerator: [partialDescriptionPartGenerator]
                    }
                }),
                {
                }
            ),
            new ProviderElement("parry",
                mkGen((rng, weapon) => {
                    type ParryPartial = Pick<ActivePower, 'desc'> & { reasons: string[] };

                    const byTheme = {
                        wizard: {
                            desc: "Magic Shield",
                            reasons: ["the weapon projects a magical force-field"]
                        },
                        light: {
                            desc: "Spirit Step",
                            reasons: ["you briefly duck into the spirit realm"]
                        },
                        dark: {
                            desc: "Shadow Step",
                            reasons: ["you briefly duck into the shadow realm"]
                        },
                        earth: {
                            desc: "Stoneskin",
                            reasons: ["you briefly turn to stone"]
                        },
                        fire: {
                            desc: "Steelskin",
                            reasons: ["you briefly turn to steel"]
                        }
                    } as const satisfies Partial<Record<Theme, ParryPartial>>;

                    const partial = pickForTheme(weapon, byTheme, rng)?.chosen ?? {
                        desc: "Parry",
                        reasons: ["the weapon magically guides your hand to parry the blow"]
                    } satisfies ParryPartial;

                    return {
                        desc: partial.desc,
                        cost: 2,
                        additionalNotes: [`In response to being attacked, ${partial.reasons.choice(rng)}.`, "The attacker suffers -5 to hit."],
                    }
                }),
                {}
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
            new ProviderElement("dash-attack",
                mkGen((rng, weapon) => {
                    const numDiceByRarity = {
                        common: [2],
                        uncommon: [2],
                        rare: [2, 2, 2, 3],
                        epic: [2, 3],
                        legendary: [3]
                    } as const satisfies Record<WeaponRarity, number[]>

                    return weapon.themes.includes('cloud')
                        ? {
                            desc: "Zephyr Dash",
                            cost: 2,
                            additionalNotes: [
                                "Move up to 4× your normal movement to attack someone.",
                                `If you hit, they attack deals an additional ${numDiceByRarity[weapon.rarity].choice(rng)} damage, and they must save or be knocked down.`
                            ]
                        }
                        : {
                            desc: "Dash",
                            cost: 1,
                            additionalNotes: [
                                "Move up to 2× your normal movement to attack someone.",
                                "If you hit, they must save or be knocked down."
                            ]
                        }
                }
                ),
                {}
            ),
            new ProviderElement("wind-blast",
                mkGen((_, weapon) => {
                    const damageByRarity = {
                        common: "",
                        uncommon: "take 1d4 damage, ",
                        rare: "take 1d6 damage, ",
                        epic: "take 1d10 damage, ",
                        legendary: "take 1d12 damage, "
                    } as const satisfies Record<WeaponRarity, string>;
                    return {
                        desc: "Wind Blast",
                        cost: 2,
                        additionalNotes: [
                            `Characters in melee range must save, or ${damageByRarity[weapon.rarity]}be thrown back out of melee range, and knocked down.`
                        ]
                    }
                }),
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
                        "Summon a chomp-flower. It has stats as a shark, but can't move."
                    ]
                },
                {
                    themes: { any: ["nature"] },
                }
            ),
            new ProviderElement("grappling-hook",
                mkGen((rng, weapon) => {
                    interface HookDetails {
                        /** Sentence (without full stop) that justifies why the hook exists.
                         */
                        reason: string;
                        hookPluralCap: `${CapitalLetter}${string}`;
                        title: string;
                    }
                    const generic = { reason: "The weapon has an integrated grappling hook", hookPluralCap: "Hooks", title: "Grappling Hook" } satisfies HookDetails;

                    const byTheme = {
                        nature: { reason: "Launch a vine from the weapon", hookPluralCap: "Vines", title: "Vine Hook" },
                        steampunk: generic,
                    } satisfies Partial<Record<Theme, HookDetails>>;

                    const chosen = pickForTheme(weapon, byTheme, rng).chosen ?? generic;

                    return {
                        desc: chosen?.title,
                        cost: 1,
                        additionalNotes: [
                            `${chosen.reason}. It can stay attached to the weapon at one end, or detach to link two objects together.`,
                            `${chosen.hookPluralCap} can be up to 50-ft long${chosen.hookPluralCap === "Hooks" ? "" : " and are as strong as steel"}.`,
                            "Hitting a moving target such as a foe is difficult, it requires an attack at -10 to hit."
                        ]
                    };
                }),
                {
                    themes: { any: ["nature", "steampunk"] },
                }
            ),
            new ProviderElement('jump', {
                desc: 'Jump',
                cost: 1,
                additionalNotes: [
                    'Jump up to 5× as far as you are naturally capable of.'
                ]
            }, {
                themes: { any: ['nature'] }
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

                    const themeSpecificAnimals = pickForTheme(weapon, animalsByTheme[quantity] as Record<keyof (typeof animalsByTheme)[typeof quantity], string[]>, rng).chosen ?? [];

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
                    themes: { any: ['nature'] },
                    rarity: {
                        lte: 'rare'
                    },
                    UUIDs: { none: ['weapon-animal-transformation'] }
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
                            sweet: ["a giant mosquito from the sugar swamps"],

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

                    const themeSpecificAnimals = pickForTheme(weapon, animalsByTheme[quantity] as Record<keyof (typeof animalsByTheme)[typeof quantity], string[]>, rng).chosen ?? [];

                    const allAnimals = [...sharedAnimals[quantity], ...themeSpecificAnimals];

                    return {

                        desc: 'Summon Animal',
                        cost: 5,
                        additionalNotes: [`Call ${quantity}${allAnimals.choice(rng)} to your aid. ${quantity === '' ? 'It returns' : 'They return'} to nature at the end of the scene.`]
                    }
                }), {
                themes: { any: ['nature'] },
                rarity: {
                    gte: 'epic'
                },
                UUIDs: { none: ['weapon-animal-transformation'] }
            }),
            new ProviderElement('immovable-bc-earth', {
                desc: 'Immovable',
                cost: 1,
                additionalNotes: ["If something attempts to move you against your will, you can expend a charge to be unaffected by it."]
            },
                {
                    themes: { any: ['earth'] },
                    UUIDs: { none: ['immovable-bc-weapon-shape'] }
                }
            ),
            new ProviderElement('immovable-bc-weapon-shape', {
                desc: 'Immovable',
                cost: 1,
                additionalNotes: ["If something attempts to move you against your will, you can expend a charge to be unaffected by it."]
            },
                {
                    shapeFamily: {
                        any: ['greatsword', 'greataxe']
                    },
                    UUIDs: { none: ['immovable-bc-earth'] }
                }
            ),
            new ProviderElement("assassinate-lethal",
                mkGen((_rng, weapon) => ({
                    desc: "Assassination",
                    cost: 1,
                    additionalNotes: [`You perform a special sneak attack, targeting an enemy that hasn't noticed you. It deals ${multName(assassinationDamageMultByRarity[weapon.rarity])} damage.`]
                })),
                {

                    shapeFamily: { any: ['dagger'] },
                }
            ),
            new ProviderElement("assassinate-nonlethal",
                mkGen((_rng, weapon) => ({
                    desc: "Assassination",
                    cost: 1,
                    additionalNotes: [`You perform a special sneak attack, targeting an enemy that hasn't noticed you. If their HP is ${maxDamage(modDamage(weapon.damage, x => x * assassinationDamageMultByRarity[weapon.rarity]))} or less, they are knocked unconscious.`]
                })),
                {

                    shapeFamily: { any: ['club'] },
                }
            ),
            new ProviderElement("lance-charge",
                mkGen((_rng) => ({
                    desc: "Tilt",
                    cost: 2,
                    additionalNotes: ["Upon landing a blow, you empower it with extra force. If the target is a rider they are forcibly dismounted, otherwise they are knocked over."]
                })),
                {

                    shapeFamily: { any: ['lance'] },
                }
            ),
            new ProviderElement("spin-attack",
                {
                    desc: "Spin Attack",
                    cost: 3,
                    additionalNotes: ["Make an attack against every character in the weapon's melee range."]
                },
                {

                    shapeFamily: {
                        any: ['greataxe', 'greataxe (or musket)', 'polearm'] //2h axe-like
                    },
                }
            ),
            new ProviderElement('detachable-gems', {
                desc: 'Gem of Greed',
                cost: 'you choose the number of charges to expend',
                additionalNotes: [
                    'The weapon has gems embedded throughout. You can expend charges to pry one off.',
                    'Characters that see the gem must save or be magically compelled to take it.',
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
                shapeParticular: { any: animeWeaponShapes }
            }),
            new ProviderElement('instant-door',
                mkGen((rng, weapon) => {
                    const wholeAbilityByTheme = {
                        fire: {
                            desc: 'Arc Cutter',
                            cost: 5,
                            additionalNotes: [
                                "A thin blade of fire surges from the weapon's tip, lasting for 1 minute.",
                                "It can cut through up to a foot of metal (or similar material)."
                            ]
                        },
                        sour: {
                            desc: 'Acid Edge',
                            cost: 5,
                            additionalNotes: [
                                "The weapon glows with caustic energy, lasting for 1 minute.",
                                "It can cut through any organic material, metal, and stone (but not glass)."
                            ]
                        },
                        wizard: {
                            desc: 'Instant Door',
                            cost: 5,
                            additionalNotes: [
                                "Trace the outline of the doorway on a surface using the weapon. A moment later, it's magically created.",
                                "The door can punch through a thin sheet of metal (except lead), or 10-ft of any other material."
                            ]
                        }
                    } satisfies Partial<Record<Theme, ActivePower>>;

                    return pickForTheme(weapon as WeaponGivenThemes<['fire' | 'wizard' | 'sour']>, wholeAbilityByTheme, rng).chosen;
                }), {
                rarity: {
                    gte: 'rare'
                },
                themes: {
                    any: ['fire', 'wizard', 'sour']
                }
            }
            ),
            new ProviderElement('source-spray',
                mkGen((rng, weapon) => {
                    const notesByTheme = {
                        sour: ["The weapon sprays acid in a precise pattern, etching an image of your choice onto a surface."],
                        earth: ["The weapon sprays colored chalk powder in a precise pattern, painting an image of your choice onto a surface."],
                        light: ["The weapon projects magical rays, which impress an image of your choice onto a surface. It remains in place until it's wiped off."]
                    } as const satisfies Partial<Record<Theme, string[]>>;
                    const additionalNotes = pickForTheme(weapon, notesByTheme, rng)?.chosen ?? notesByTheme['sour'];

                    return {
                        desc: 'Spray',
                        cost: 1,
                        additionalNotes
                    }
                }), {
                themes: { any: ['sour', 'earth', 'light'] }
            }),
            new ProviderElement('radial-slam', {
                desc: 'Slam',
                cost: 3,
                additionalNotes: [
                    "Slam the weapon into the ground, emitting a circular shockwave.",
                    mkGen((_, weapon) =>
                        `Characters within 20-ft must save, or be knocked down & take ${textForDamage(modDamage(weapon.damage, x => x * 3))} damage`,
                    )
                ]
            }, {
                themes: { any: ['earth'] },
                UUIDs: { none: ['linear-slam'] }
            }),
            new ProviderElement('linear-slam', {
                desc: 'Slam',
                cost: 3,
                additionalNotes: [
                    "Slam the weapon into the ground, emitting a shockwave that travels straight ahead for 60-ft.",
                    new StringGenerator([
                        // it deals damage equal to 3x the weapon's
                        "Characters within 20-ft must save, or be knocked down & take ",
                        mkGen((_rng, weapon) => textForDamage(modDamage(weapon.damage, x => x * 3))),
                        " damage"
                    ])
                ]
            }, {
                themes: { any: ['earth'] },
                UUIDs: { none: ['radial-slam'] }
            }),
            new ProviderElement('metaphysical-edit', {
                desc: 'Edit',
                cost: 3,
                additionalNotes: [
                    "Strike at the platonic form of an object, removing a letter from its name.",
                    "It physically transforms into the new object."
                ]
            }, {
                themes: { any: ['wizard'] },
                shapeFamily: { any: edgedWeaponShapeFamilies },
            }),
            new ProviderElement('gravity-gun',
                mkGen((rng, weapon) => {

                    const coreChoice = pickOrLinkWithEnergyCore(rng, weapon);

                    const effects = {
                        ice: `The weapon emits a vortex of ${coreChoice.desc}`,
                        fire: 'The weapon emit a fiery whip.',
                        light: `The weapon emits a tether of ${coreChoice.desc}.`,
                        dark: `The weapon emits a tether of ${coreChoice.desc}`,
                        sour: `The weapon emits a tether of ${coreChoice.desc}`,
                        wizard: "A hand made of magical force extends from the weapon's tip.",
                        steampunk: "A compartment opens at the weapon's tip, revealing a spring-loaded hand.",
                        nature: "A sturdy vine grows from the weapon's tip.",
                        cloud: "The weapon emits a vortex of air.",

                        void: 'The weapon emits a tether of void energy.',
                    } as const satisfies Record<PossibleCoreThemes | 'void', string>;

                    return {
                        desc: 'Kinesis',
                        cost: 1,
                        additionalNotes: [`${effects[coreChoice.theme]} It can lift and throw an object within 60-ft, weighing up to 500 lbs.`],
                        descriptorPartGenerator: coreChoice.featureUUID
                    }
                }), {
                themes: {
                    any: ['light', 'fire', 'nature', 'cloud']
                },
            }),
            new ProviderElement('frostbound', {
                desc: 'Icebound',
                cost: 1,
                additionalNotes: [
                    'Lock a mechanism in place with magical ice as strong as steel.',
                    'It stays frozen for 2d6 × 10 minutes.'
                ]
            }, {
                themes: { any: ['ice'] }
            }),
            new ProviderElement('rally-person', {
                desc: 'Rally',
                cost: 1,
                additionalNotes: [
                    'Targets one non-hostile character.',
                    'For the rest of the day they cannot feel fear, and their morale cannot break.'
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

            new ProviderElement("summon-structure",
                mkGen((rng, weapon) => {
                    const effects = {
                        ice: ['Ice Maker', 'Call forth a tempest of frigid air, which freezes into', 'of solid ice'],
                        fire: ['Pile of Glass', 'Molten glass bursts from the weapon, levitating into place to form', 'entirely of glass'],

                        light: ['Fantasy Form', 'Light emanates from the weapon, forming', 'of hard-light'],
                        dark: ['Shadow Copy', 'Rivers of shadow burst from the weapon, forming into', 'of pure darkness'],

                        wizard: ['Creation', 'Magically summon', 'of partially opaque magical force'],

                        sweet: ['Caramel Creation', 'Threads of molten sugar burst from the weapon, spinning into', 'of solid sugar'],
                    } as const satisfies Partial<Record<Theme, [string, string, string]>>;
                    const [desc, howItsMade, madeOf] = pickForTheme(weapon as WeaponGivenThemes<["fire" | "ice" | "dark" | "light" | "wizard" | "sweet"]>, effects, rng).chosen;
                    return {
                        desc,
                        cost: `a charge per month that an expert would need to produce a regular version of the object, rounding up`,
                        additionalNotes: [
                            `${howItsMade} a facsimile of an object of your choice.`,
                            `It's made ${madeOf}. Initially intangible, it finishes solidifying at the start of your next turn.`,
                            "Only replicates the form of the object, not any special functions. Its magical nature is obvious at a glance."
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
                    'A cloud of black smoke billows from the weapon, filling up to 27,000 ft³. It suffocates characters and is highly flammable.'
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
            new ProviderElement("disarm-immune",
                mkGen((rng, weapon) => {
                    const hpByRarity = {
                        common: 10,
                        uncommon: 20,
                        rare: 30,
                        epic: 40,
                        legendary: 50
                    } satisfies Record<WeaponRarity, number>;

                    const partialAbilitiesByTheme = {
                        fire: { partialDesc: "metal extends from the pommel", partialDescriptionPartGenerator: "gripping-tentacle-descriptor-fire" },
                        ice: { partialDesc: "magical ice freezes around your body and your mount's,", partialDescriptionPartGenerator: "gripping-tentacle-descriptor-ice" },
                        dark: { partialDesc: "shadowy tentacles extend from the pommel to wrap around your body and your mount's,", partialDescriptionPartGenerator: "gripping-tentacle-descriptor-dark" },
                        nature: { partialDesc: "the vine on the pommel wraps around your body and your mount's,", partialDescriptionPartGenerator: "gripping-tentacle-descriptor-nature" }
                    } satisfies Partial<Record<Theme, { partialDesc: string; partialDescriptionPartGenerator: string }>>;

                    const { partialDesc, partialDescriptionPartGenerator } = pickForTheme(weapon, partialAbilitiesByTheme, rng).chosen ?? {
                        partialDesc: "the tendril on the weapon's pommel extends to wrap,", partialDescriptionPartGenerator: "gripping-tentacle-descriptor-generic"
                    };
                    return {
                        miscPower: true,
                        desc: `While mounted, ${partialDesc} to wrap around your body and your mount's preventing you from being forcibly dismounted. It has ${hpByRarity} HP. If destroyed, regrowing it consumes 1 charge.`,
                        descriptorPartGenerator: [partialDescriptionPartGenerator]
                    }
                }),
                {
                    shapeFamily: { any: ["lance"] },
                }
            ),
            new ProviderElement("nightmare-attack",
                mkGen((_, weapon) => ({
                    miscPower: true,
                    desc: `Pricking a sleeping person with the weapon allows your mind${weapon.sentient ? " (and the weapon's)" : ""} to enter their dreams, while your body enters a trance-like state. Invaders choose their appearance within the dream, and can leave it at any time.`
                })),
                {
                    // most pointed or edged weapons, excluding few specific ones that seemed unwieldy (most 2h).
                    // 'greataxe (or musket)' only has one specific shape which is actually a scythe, which is why it's allowed
                    // I think specific shapes might be better but I'm going to end up forgetting to maintain that
                    shapeFamily: { any: ['dagger', 'sword', 'sword (or bow)', 'dagger (or pistol)', 'sword (or musket)', 'greataxe (or musket)', 'spear'] },
                    themes: { any: ['dark', 'wizard'] }
                }
            ),
            new ProviderElement("laser-pointer",
                {
                    miscPower: true,
                    desc: "There's a button on the side of the weapon. Pressing it causes a the tip to emit a harmless beam of light.",
                },
                {
                    themes: { any: ['light', 'wizard', 'steampunk'] }
                }
            ),
            new ProviderElement("invisible-on-kill",
                {
                    miscPower: true,
                    desc: `Whenever the wielder defeats a foe, they turn invisible until the start of their next turn.`,
                },
                {
                    rarity: { gte: 'rare' },
                    shapeFamily: { any: smallDieWeaponShapeFamilies }
                }
            ),
            new ProviderElement("damage-boost-on-kill",
                mkGen((rng, weapon) => {
                    const damageBoostByRarity = {
                        common: [4, 6],
                        uncommon: [4, 6, 8],
                        rare: [4, 6, 8, 10],
                        epic: [6, 8, 10, 12],
                        legendary: [8, 10, 12]
                    } satisfies Record<WeaponRarity, CommonDieSize[]>;
                    const damageDie = damageBoostByRarity[weapon.rarity].choice(rng);

                    return {
                        miscPower: true,
                        desc: `Whenever the wielder defeats a foe, the weapon gains 1d${damageDie} damage until the end of their turn (stacks).`,
                    }
                }),
                {
                    rarity: { gte: 'rare' },
                    shapeFamily: { none: rangedWeaponShapeFamilies }
                }
            ),
            new ProviderElement("attack-on-kill",
                {
                    miscPower: true,
                    desc: `Whenever the wielder defeats a foe, they may immediately make another attack.`,
                },
                {
                    rarity: { gte: 'rare' },
                    shapeFamily: { none: rangedWeaponShapeFamilies }
                }
            ),
            new ProviderElement("move-on-kill",
                mkGen((rng, weapon) => {
                    const distanceByRarity = {
                        common: [10],
                        uncommon: [10],
                        rare: [10],
                        epic: [10, 10, 10, 10, 20],
                        legendary: [10, 10, 10, 20]
                    } satisfies Record<WeaponRarity, number[]>;

                    const distance = distanceByRarity[weapon.rarity].choice(rng);

                    const actions = ["move", "leap"] as const;
                    const actionByRarity = {
                        common: [0,],
                        uncommon: [0, 0, 0, 0, 0, 1],
                        rare: [0, 0, 0, 1],
                        epic: [0, 0, 1],
                        legendary: [0, 1]
                    } as const satisfies Record<WeaponRarity, (0 | 1)[]>;

                    const action = actions[actionByRarity[weapon.rarity].choice(rng)];

                    const withoutTriggeringOpporunity = gte(weapon.rarity, 'epic') ? ' (without triggering opportunity attacks)' as const : '' as const;

                    return {
                        miscPower: true,
                        desc: `Whenever the wielder defeats a foe, they may immediately ${action} up to ${distance}-ft${withoutTriggeringOpporunity}.`,
                    }
                }),
                {}
            ),
            new ProviderElement("temp-hp-on-kill",
                mkGen((rng, weapon) => {
                    const dieSizeByRarity = {
                        common: [4, 4, 4, 4, 6, 6],
                        uncommon: [4, 4, 6, 6, 6, 6],
                        rare: [4, 6, 6, 6, 8, 8, 10],
                        epic: [8, 8, 10, 10, 10, 10, 12],
                        legendary: [8, 10, 10, 10, 10, 12, 12, 12, 12]
                    } satisfies Record<WeaponRarity, CommonDieSize[]>;

                    const dieSize = dieSizeByRarity[weapon.rarity].choice(rng);

                    return {
                        miscPower: true,
                        desc: `Whenever the wielder defeats a foe, they gain 1d${dieSize} temporary hit points.`,
                    }
                }),
                {}
            ),
            new ProviderElement("damage-bonus-wizard",
                {
                    miscPower: true,
                    bonus: {
                        addDamageDie: { d6: 1 }
                    },
                    descriptorPartGenerator: 'descriptor-damage-bonus-wizard'
                },
                {
                    themes: { any: ["wizard"] },
                }
            ),
            new ProviderElement("damage-bonus-lightning",
                {
                    miscPower: true,
                    bonus: {
                        addDamageDie: { d6: 1 }
                    },
                },
                {
                    themes: { any: ["cloud"] },
                }
            ),
            new ProviderElement("damage-bonus-dark",
                {
                    miscPower: true,
                    bonus: {
                        addDamageDie: { d6: 1 }
                    },
                    descriptorPartGenerator: 'descriptor-damage-bonus-dark'
                },
                {
                    themes: { any: ["dark"] },
                    UUIDs: { none: ['damage-bonus-dark-fire'] }
                }
            ),
            new ProviderElement("damage-bonus-light",
                {
                    miscPower: true,
                    bonus: {
                        addDamageDie: { d6: 1 }
                    },
                    descriptorPartGenerator: 'descriptor-damage-bonus-light'
                },
                {
                    themes: { any: ["light"] },
                }
            ),
            new ProviderElement("damage-bonus-fire",
                {
                    miscPower: true,
                    bonus: {
                        addDamageDie: { d6: 1 }
                    },
                    descriptorPartGenerator: 'descriptor-wreathed-fire'
                },
                {

                    themes: { any: ["fire"] },
                    UUIDs: { none: ['damage-bonus-dark-fire', 'damage-bonus-ice-sharp', 'damage-bonus-ice-blunt'] }
                }
            ),
            new ProviderElement("damage-bonus-dark-fire",
                {
                    miscPower: true,
                    bonus: {
                        addDamageDie: { d6: 1 }
                    },
                    descriptorPartGenerator: 'descriptor-wreathed-dark-fire'
                },
                {
                    themes: { any: ["dark"] },
                    UUIDs: { none: ['damage-bonus-fire', 'damage-bonus-ice-sharp', 'damage-bonus-ice-blunt', 'damage-bonus-dark'] }
                }
            ),
            new ProviderElement("damage-bonus-ice-blunt",
                {
                    miscPower: true,
                    desc: undefined,
                    bonus: {
                        addDamageDie: { d6: 1 }
                    },
                    descriptorPartGenerator: 'descriptor-wreathed-ice'
                },
                {
                    themes: { any: ["ice"] },
                    shapeFamily: { none: swordlikeWeaponShapeFamilies },
                    UUIDs: { none: ['damage-bonus-fire', 'damage-bonus-dark-fire', 'damage-bonus-ice-sharp'] }
                }
            ),
            new ProviderElement("damage-bonus-ice-sharp",
                {
                    miscPower: true,
                    desc: "Wreathed in ice, always frozen into its sheath. It requires a strength save to draw.",
                    bonus: {
                        addDamageDie: { d10: 1 }
                    },
                    descriptorPartGenerator: 'descriptor-wreathed-ice'
                },
                {
                    themes: { any: ["ice"] },
                    shapeFamily: { any: swordlikeWeaponShapeFamilies },
                    UUIDs: { none: ['damage-bonus-fire', 'damage-bonus-dark-fire', 'damage-bonus-ice-blunt'] }
                }
            ),
            new ProviderElement("acrobatic-tool",
                mkGen((_, weapon) => {
                    const bonusByRarity = {
                        common: weapon.isNegative ? 5 : 3,
                        uncommon: weapon.isNegative ? 5 : 3,
                        rare: weapon.isNegative ? 6 : 5,
                        epic: weapon.isNegative ? 6 : 5,
                        legendary: weapon.isNegative ? 10 : 8
                    } as const satisfies Record<WeaponRarity, number>;

                    return { miscPower: true, desc: `The wielder gains a +${bonusByRarity[weapon.rarity]} bonus to feats of strength or agility that involve the weapon.`, };
                }),
                {
                    shapeFamily: { any: ['staff'] },
                    themes: { none: ['wizard'] }
                }
            ),
            new ProviderElement("beheading-strikes",
                mkGen((_, weapon) => {
                    const maxHDByRarity = {
                        common: 10, // this is probably the only thing the weapon does, so it should be a little more exciting
                        uncommon: 6,
                        rare: 6,
                        epic: 8,
                        legendary: 10
                    } as const satisfies Record<WeaponRarity, number>;

                    const maxHD = weapon.isNegative ? Math.ceil(maxHDByRarity[weapon.rarity] * 1.5) : maxHDByRarity[weapon.rarity];

                    return { miscPower: true, desc: `When this weapon's damage roll is the maximum possible, if the target has ${maxHD}HD or less, they are beheaded and instantly killed.`, };
                }),
                { shapeFamily: { any: ['sword', 'sword (or musket)'] } }
            ),
            new ProviderElement("stunning-strikes",
                { miscPower: true, desc: `When this weapon's damage roll is the maximum possible, the target is stunned (if your system has no stun mechanic, they skip their next turn).`, },
                { shapeFamily: { any: ['mace'] } }
            ),
            new ProviderElement('fear-immune',
                {
                    miscPower: true,
                    desc: "While the weapon is drawn the wielder cannot feel fear, and their morale cannot break.",
                },
                {
                    themes: { any: ['fire', 'ice', 'earth', 'cloud', 'light', 'dark', 'sweet', 'sour'] },
                }
            ),
            new ProviderElement("streak",
                mkGen((_, weapon) => {
                    return {
                        miscPower: true,
                        desc: "Streak.",
                        additionalNotes: [
                            "Upon a hit, the weapon gains +1 to hit.",
                            `It can store up to +${streakCapacityByRarity[weapon.rarity]}, and its gems light up to indicate the current streak.`,
                            "Upon a miss, the weapon's streak is reset to 0."
                        ],
                        descriptorPartGenerator: 'streak-indicator'
                    };
                }),
                {
                    UUIDs: { none: ["counter"] }
                }
            ),
            new ProviderElement("counter",
                mkGen((_, weapon) => {
                    return {
                        miscPower: true,
                        desc: "Counter.",
                        additionalNotes: [
                            "Upon a miss, the weapon gains 1 Counter.",
                            "Upon a hit, the wielder may expend all Counter to deal 1d6 additional damage per point expended.",
                            `It can store up to ${counterCapacityByRarity[weapon.rarity]} Counter, and its gems light up to indicate the current amount.`
                        ],
                        descriptorPartGenerator: 'counter-indicator'
                    };
                }),
                {
                    UUIDs: { none: ["streak"] }
                }
            ),
            new ProviderElement("attack-bubbles",
                mkGen((_, weapon) => {
                    const damageByRarity = {
                        common: "1d4",
                        uncommon: "1d4",
                        rare: "1d6",
                        epic: "1d6",
                        legendary: "1d8"
                    } as const satisfies Record<WeaponRarity, `${number}${keyof DamageDice}`>;
                    return {
                        miscPower: true,
                        desc: `Attacks with the weapon release bubbles which fill a 10-ft cube around the wielder. They obscure as mist, and disappear after a round.
                        If underwater, they explode on contact with foes, dealing ${damageByRarity[weapon.rarity]} to all characters in the cube.`,
                    };
                }),
                {
                    themes: { all: ['ice', 'cloud'] },
                    rarity: { gte: 'rare' }
                }
            ),
            new ProviderElement("underwater-propulsion",
                { miscPower: true, desc: `The weapon functions as a DPV, it can be used to swim as fast as a horse can gallop.`, },
                { themes: { all: ['ice', 'cloud'] } }
            ),
            new ProviderElement("underwater-warrior",
                { miscPower: true, desc: `For this weapon, the usual maluses for underwater fighting are converted into bonuses.`, },
                { themes: { all: ['ice', 'cloud'] } }
            ),
            new ProviderElement("quick",
                { miscPower: true, desc: `The wielder can make one more attack than they would normally be able to each turn.` },
                { shapeFamily: { any: smallDieWeaponShapeFamilies } }
            ),
            new ProviderElement("weakness-detector",
                mkGen((_, weapon) => ({
                    miscPower: true,
                    desc: `When the ${getBusinessEndDesc(weapon.shape)} is coated in the blood of a character with an elemental weakness, it glows the color of the element they're weak to, as bright as a torch.`,
                })),
                {
                    themes: { any: ['fire', 'earth', 'cloud', 'ice'] }
                }
            ),
            new ProviderElement("richochet-rounds",
                {
                    miscPower: true,
                    desc: "Shots can richochet off of objects and characters, aiming at something else. Each richochet imposes -10 to hit against the next target.",
                },
                {
                    rarity: { gte: 'rare' },
                    shapeFamily: { any: rangedWeaponShapeFamilies }
                }
            ),
            new ProviderElement("move-silently",
                {
                    miscPower: true,
                    desc: "Wielder is able to move completely silently.",
                },
                {
                    shapeFamily: { any: ["dagger", "club"] },
                    rarity: { gte: "epic" }
                }
            ),
            new ProviderElement("formation-fighting",
                mkGen((_rng) => {
                    return {
                        miscPower: true,
                        desc: `If you are within melee range of an ally wielding a polearm, both of you gain the same benefits as you would from wielding a shield.`,
                    }
                }),
                {
                    shapeFamily: { any: ["polearm"] },
                    rarity: { gte: "epic" }
                }
            ),
            new ProviderElement("kneecapper",
                {
                    miscPower: true,
                    desc: `When a character larger than the wielder is struck by the weapon, they must save or be knocked down.`
                },
                {
                    shapeFamily: { any: ["axe"] },
                }
            ),
            new ProviderElement("anti-air",
                {
                    miscPower: true,
                    desc: `Flying creatures shot by the weapon must save or become afflicted, preventing them from flying.`,
                    additionalNotes: [
                        'Victims save at the end of each of their turns, ending the effect on a success.'
                    ]
                },
                {
                    shapeFamily: { any: rangedWeaponShapeFamilies },
                    themes: { any: ['cloud', 'earth'] }
                }
            ),
            new ProviderElement("anti-ground",
                {
                    miscPower: true,
                    desc: `Burrowing creatures hit by the weapon must save or become afflicted, preventing them from digging or burrowing.`,
                    additionalNotes: [
                        'Victims save at the end of each of their turns, ending the effect on a success.'
                    ]
                },
                {
                    themes: { any: ['cloud', 'earth'] }
                }
            ),
            new ProviderElement("of-x-slaying",
                mkGen((rng, weapon) => {
                    const bonusByRarity = {
                        common: '1d8',
                        uncommon: '1d8',
                        rare: '2d8',
                        epic: '3d8',
                        legendary: '3d8'
                    } as const satisfies Record<WeaponRarity, `${number}d8`>;

                    return {
                        miscPower: true,
                        desc: `Deals ${bonusByRarity[weapon.rarity]} additional damage vs ${[
                            'dragons',
                            'giants',
                            'shapeshifters',
                            'fae',
                            'extraplanar creatures',
                            'demons',
                            ...((weapon.themes.includes('light')) ? ['undead'] : []),
                            ...((weapon.themes.includes('dark')) ? ['angels & gods'] : []),
                            ...((weapon.themes.includes('nature')) ? ['automatons', 'agents of industry'] : []),
                        ].choice(rng)}.`
                    };
                }),
                {
                    shapeFamily: { none: rangedWeaponShapeFamilies }
                }
            ),
            new ProviderElement("bonus-vs-stronger",
                mkGen((__, weapon) => {
                    const bonusByRarity = {
                        common: 5,
                        uncommon: 2,
                        rare: 3,
                        epic: 4,
                        legendary: 5
                    } as const satisfies Record<WeaponRarity, number>;

                    return {
                        miscPower: true,
                        desc: `+${bonusByRarity[weapon.rarity]} to hit and damage vs foes more powerful than the wielder.`
                    };
                }),
                {
                    UUIDs: { none: ['bonus-vs-weaker'] }
                }
            ),
            new ProviderElement("bonus-vs-weaker",
                mkGen((__, weapon) => {
                    const bonusByRarity = {
                        common: 1,
                        uncommon: 2,
                        rare: 3,
                        epic: 4,
                        legendary: 5
                    } as const satisfies Record<WeaponRarity, number>;

                    return {
                        miscPower: true,
                        desc: `+${bonusByRarity[weapon.rarity]} to hit and damage vs foes less powerful than the wielder.`
                    };
                }),
                {
                    themes: { any: ['dark'] },
                    UUIDs: { none: ['bonus-vs-stronger'] }
                }
            ),
            new ProviderElement("blade-of-truth",
                {
                    miscPower: true,
                    desc: "Characters touching the weapon cannot lie."
                }, {
                themes: { any: ["light"], },
                rarity: { gte: 'epic' }
            }
            ),
            new ProviderElement("detect-imposter-among-us",
                mkGen((_, weapon) => weapon.sentient === false
                    ? {
                        miscPower: true,
                        desc: `Touching the ${getBusinessEndDesc(weapon.shape)} dispels magical disguises, and causes shapeshifters to return to their normal form.`
                    }
                    : {
                        miscPower: true,
                        desc: "The weapon can see through magical disguises, and determine whether someone is a shapeshifter."
                    }
                ),
                {
                    themes: { any: ["light"], }
                }
            ),
            new ProviderElement("psi-immune",
                {
                    miscPower: true,
                    desc: "When the wielder saves against psionic effects, the effects of all relevant skills and bonuses are doubled.",
                    descriptorPartGenerator: 'material-telekill'
                },
                {
                    themes: { any: ["earth"], },
                }
            ),
            new ProviderElement("detect-unholy",
                mkGen(rng => {
                    return {
                        miscPower: true,
                        desc: `Glows like a torch when ${pluralUnholyFoe.generate(rng)} are near.`
                    }
                }),
                {
                    themes: { any: ["light"], },
                }
            ),
            new ProviderElement("destroy-undead",
                {
                    miscPower: true,
                    desc: `Undead creatures defeated using the weapon are reduced to ash in a flare of divine light. They can't regenerate.`
                },
                {
                    themes: { any: ["light"], }
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
            new ProviderElement("control-bees",
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
                mkGen(() => ({
                    miscPower: true,
                    desc: "Can reflect and focus sunlight as a damaging beam (2d6 damage, range 100-ft)."
                })),
                {

                    themes: { any: ["light"] }
                }
            ),
            new ProviderElement("magically-hovers",
                {
                    miscPower: true,
                    desc: "Can hover in the air to attack for you hands free. Commanding a floating weapon uses the same rules as followers / retainers.",
                },
                {
                    rarity: { gte: "rare" },
                    themes: { any: ["cloud", "wizard"] },
                    shapeFamily: { none: ['lance', ...twoHandedWeaponShapeFamilies] }
                }
            ),
            new ProviderElement("resistance-fire",
                {
                    miscPower: true,
                    desc: "Wielder takes half damage from fire."
                },
                {

                    themes: { any: ["fire"] },
                    rarity: { lte: "uncommon" }
                }
            ),
            new ProviderElement("immunity-fire",
                {

                    miscPower: true,
                    desc: "Wielder cannot be harmed by fire.",
                },
                {

                    themes: { any: ["fire"] },
                    rarity: { gte: "rare" }
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
                    desc: "Menacing aura. When the wielder saves to frighten or intimidate, the effects of all relevant skills and bonuses are doubled."
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
                    ],
                    descriptorPartGenerator: 'necromantic-runes'
                },
                {
                    themes: { any: ["dark"] },
                    rarity: { gte: 'rare' },
                    UUIDs: { none: ['make-zombie'] }
                }
            ),
            new ProviderElement("make-zombie",
                mkGen(rng => ({
                    miscPower: true,
                    desc: `Characters killed by the weapon rise immediately as ${['skeletons', 'zombies'].choice(rng)} under the wielder's control.`,
                    descriptorPartGenerator: 'necromantic-runes'
                })),
                {
                    themes: { any: ["dark"] },
                    rarity: { gte: 'rare' },
                    UUIDs: { none: ['traps-souls'] }
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
                    desc: "Extremely shiny, functions as a mirror.",
                    descriptorPartGenerator: 'mirror-finish-forced'
                },
                {
                    themes: { any: ["light"] }
                }
            ),
            new ProviderElement("vibe-wholesome",
                {
                    miscPower: true,
                    desc: "Wholesome aura. The wielder has a +1 bonus to reaction rolls."
                },
                {
                    themes: { any: ["light", "sweet"] }
                }
            ),
            new ProviderElement("expertise-cooking",
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
            new ProviderElement("resistance-poison",
                {
                    miscPower: true,
                    desc: "The effects of poison on the wielder are halved."

                },
                {
                    themes: { any: ["nature"] },
                    rarity: {
                        lte: "uncommon"
                    }
                }
            ),
            new ProviderElement("immunity-poison",
                {
                    miscPower: true,
                    desc: "Wielder is immune to poison."
                },
                {
                    themes: { any: ["nature"] }
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
                    descriptorPartGenerator: 'forced-celestial-wizard-coating'
                },
                {
                    themes: { any: ["wizard"] },
                    isSentient: true
                }
            ),
            new ProviderElement("free-magic-projectile",
                {
                    miscPower: true,
                    desc: "If you are not wounded, the weapon can also fire a spectral copy of itself as a projectile attack. Damage as weapon, range as bow.",
                },
                {
                    themes: { any: ["wizard"], },
                    rarity: {
                        gte: "rare"
                    },
                    UUIDs: {
                        none: ['standard-projectile', 'attack-wisps']
                    },
                    // waste of a slot if you can already shoot
                    shapeFamily: { none: rangedWeaponShapeFamilies }
                }
            ),
            new ProviderElement("attack-wisps",
                {
                    miscPower: true,
                    desc: "Wisps.",
                    additionalNotes: [
                        "Each hit you land with the weapon generates a wisp, which dissipate when combat ends.",
                        "On your turn, you can launch any number of wisps (instantly / as no action).",
                        "They deal d4 damage, range as bow."
                    ]
                },
                {
                    themes: { any: ["wizard"] },
                    rarity: {
                        gte: "epic"
                    },
                    UUIDs: {
                        none: ['standard-projectile', 'free-magic-projectile']
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
                    shapeFamily: { none: shapeFamiliesWithoutPommels },
                    UUIDs: { none: ['integrated-clock'] }
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
                    shapeFamily: { none: shapeFamiliesWithoutPommels },
                    UUIDs: { none: ['integrated-compass'] }
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
            new ProviderElement("flight",
                mkGen((rng, weapon) => {

                    /** Note, these all say "using the weapon" instead of "wielding the weapon", to clarify that you can use the ability
                     *  even when you aren't actually holding it. In 5e this would read "while you are attuned to". 
                     */
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
                                "a pair of dark & tattered angel wings",
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

                    const desc = genMaybeGen(pickForTheme(weapon, reasonsToFly, rng).chosen, rng);

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
            new ProviderElement("defender",
                mkGen((_rng, weapon) => {
                    const qualityByRarity = {
                        common: "",
                        uncommon: "",
                        rare: "+1 ",
                        epic: "+1 ",
                        legendary: "+2 "
                    } as const satisfies Record<WeaponRarity, string>;

                    return {
                        miscPower: true,
                        desc: `Wielding the weapon confers the same benefits as wielding a ${qualityByRarity[weapon.rarity]}shield.`,
                        descriptorPartGenerator: 'defender-part'
                    };
                }),
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
                    themes: { any: ['light'] },
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
                    UUIDs: { none: ['magic-pocket'] }
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
                    shapeFamily: { none: twoHandedWeaponShapeFamilies },
                    UUIDs: { none: ['instant-recall'] }
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
                    desc: "The weapon emits a 10-ft aura of flames, which ignites foes and objects. The aura is inactive while the weapon is sheathed."
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
            new ProviderElement<Generator<PassivePower, [Weapon]>, WeaponPowerCond>(
                "death-blast",
                mkGen<PassivePower, [Weapon]>((rng, weapon) => {
                    const { desc, featureUUID: featureUUID } = pickOrLinkWithEnergyCore(rng, weapon);

                    const damageByRarity = {
                        common: "1d6",
                        uncommon: "1d6",
                        rare: "1d6",
                        epic: "1d6",
                        legendary: "2d6"
                    } as const satisfies Record<WeaponRarity, `${number}${keyof Omit<DamageDice, 'const'>}`>;

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
            new ProviderElement('super-light',
                {
                    miscPower: true,
                    desc: "The weapon is extremely light, almost weightless."
                },
                {
                    rarity: { lte: 'uncommon' },
                    shapeFamily: { none: bluntWeaponShapeFamilies },
                    themes: { any: ['cloud'] }
                }
            ),
            new ProviderElement('warm-to-touch',
                {
                    miscPower: true,
                    desc: "The weapon is always warm to the touch."
                },
                {
                    rarity: { lte: 'uncommon' },
                    themes: { any: ['fire'] }
                }
            ),
            new ProviderElement('cold-to-touch',
                {
                    miscPower: true,
                    desc: "The weapon is always cold to the touch."
                },
                {
                    rarity: { lte: 'uncommon' },
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
                        any: ['greataxe', 'greataxe (or musket)']
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
                    shapeFamily: { any: ['club'] },
                }
            ),
            new ProviderElement('slenderblade',
                {
                    miscPower: true,
                    desc: "A mass of shadowy tentacles form around the wielder's shoulders. They function as an additional pair of arms."
                },
                {
                    themes: { any: ['dark'] }
                }
            ),
            new ProviderElement("transform-tool",
                mkGen((rng, weapon) => {
                    const isRare = gte(weapon.rarity, 'epic');

                    const toolType = {
                        ice: ['a set of ice picks', isRare ? 'a snowboard. Tricks restore charges (other players rate 0-5, then take average)' : 'a snowboard'],
                        fire: ['a lighter', 'an empty brass brazier'],

                        cloud: [isRare ? 'a surfboard. Tricks restore charges (other players rate 0-5, then take average)' : 'a surfboard', 'an umbrella'],
                        earth: [
                            isRare ? 'a pickaxe. Its magic allows one person to do the work of a dozen miners.' : 'a pickaxe',
                            isRare ? 'a shovel. Its magic allows one person to do the work of a dozen diggers' : 'a shovel',
                            isRare ? 'a chisel. Its magic allows one person to do the work of a dozen masons' : 'a chisel'
                        ],

                        sweet: ['a whisk', isRare ? 'an empty biscuit tin. A single object can be placed inside, stored in a pocket dimension when it turns back into its regular form' : 'an empty biscuit tin'],

                        wizard: [isRare ? 'a quill. It has a limitless supply of ink, in any color' : 'a quill'],

                        steampunk: ['a wrench', isRare ? 'a skateboard. Tricks restore charges (other players rate 0-5, then take average)' : 'a skateboard'],
                        nature: [isRare ? 'a smoking pipe. Its magic allows the user to control the smoke, directing it into any shape' : 'a smoking pipe', 'a bouquet of flowers'],

                    } satisfies Partial<Record<Theme, string[]>>;

                    const chosenTool = choice(pickForTheme(weapon as WeaponGivenThemes<["ice" | "fire" | "cloud" | "earth" | "nature" | "steampunk" | "wizard" | "sweet"]>, toolType, rng).chosen, rng);
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
                desc: 'Has a small vial built into it, which can be filled with fluid. When you land a blow with the weapon, you may expend the liquid, injecting it into the target.',
                descriptorPartGenerator: 'injector-module-forced'
            }, {
                themes: { any: ['sour'], },
                shapeParticular: { any: pointedWeaponShapes }
            }),
            new ProviderElement("potion-resistant",
                {
                    miscPower: true,
                    desc: "Poisons (and potions) that are delivered using the weapon have their effects doubled.",
                },
                {
                    themes: { any: ["sour"], },
                }
            ),
        ]
    },
    languages: {
        add: [
            ...(["The language of ice & snow."].map(x => toLang("ice", x))),
            ...(["The language of fire."].map(x => toLang("fire", x))),
            ...(["Angelic."].map(x => toLang("light", x))),
            ...(["Demonic."].map(x => toLang("dark", x))),
            ...(["Valkyrie."].map(x => toLang("cloud", x))),
        ]
    },
    shapes: {
        add: [
            ...toProviderSource(
                {
                    "greatclub": [
                        "Greathammer",
                        "Greatclub",
                        "Eveningstar",
                        "Lucerne",
                        "Kanabo",
                    ],
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
                        "Hammer",
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
                } satisfies
                Record<WeaponShapeGroup, ((Pick<WeaponShape, "particular"> & WeaponPowerCond) | string)[]> as
                Record<WeaponShapeGroup, ((Pick<WeaponShape, "particular"> & WeaponPowerCond) | string)[]>,
                (k, shapeOrShapename) => {
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
                                const shape = shapeOrShapename;
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
