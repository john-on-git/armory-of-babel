import { mkGen, StringGenerator, type TGenerator } from "$lib/generators/recursiveGenerator";
import { edgedWeaponShapeFamilies, importantPart } from "$lib/generators/weaponGenerator/config/configConstants";
import { ProviderElement } from "$lib/generators/weaponGenerator/provider";
import { genMaybeGen, mkWepToGen, textForDamage } from "$lib/generators/weaponGenerator/weaponGeneratorLogic";
import type { ActivePower, DamageDice, PassivePower, Theme, Weapon, WeaponFeaturesTypes, WeaponPowerCond, WeaponRarity } from "$lib/generators/weaponGenerator/weaponGeneratorTypes";
import type { DeltaCollection } from "$lib/util/versionController";
import _ from "lodash";

export default {
    themes: {},
    descriptors: {

        /*TODO
 
            energy-core-void
            energy-core-ultraviolet

            energy-core-azure
            energy-core-crimson
            energy-core-verdant
            energy-core-atomic

            energy-core-gold
        */
        add: [
            new ProviderElement('energy-core-void',
                {
                    generate: () => {
                        return {
                            descriptor: { singular: '', plural: '' },
                            ephitet: { pre: '' },
                        }
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    /**
                     * Can only be added by passive power "death blast"
                     */
                    never: true
                }
            ),
            new ProviderElement('energy-core-fire',
                {
                    generate: () => {
                        return {
                            descriptor: {
                                descType: 'has',
                                singular: 'superheated section running down the middle of it (which emits dim orange light, hissing subtly as you move it around)',
                                plural: 'superheated section in the middle of them (which emit dim orange light, hissing subtly as you move them around)',
                            },
                            ephitet: { pre: '' },
                        }
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    /**
                     * Can only be added by passive power "death blast"
                     */
                    never: true
                }
            ),
            new ProviderElement('energy-core-ice',
                {
                    generate: () => {
                        return {
                            descriptor: {
                                descType: 'has',
                                singular: 'a large crystal orb embedded in it (which contains a howling blizzard)',
                                plural: 'a set of large crystal orbs embedded in them (contain a welter of winter weather)'
                            },
                            ephitet: { pre: '' },
                        }
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    /**
                     * Can only be added by passive power "death blast"
                     */
                    never: true
                }
            ),
            new ProviderElement('energy-core-ultraviolet',
                {
                    generate: () => {
                        return {
                            descriptor: { singular: '', plural: '' },
                            ephitet: { pre: '' },
                        }
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    /**
                     * Can only be added by passive power "death blast"
                     */
                    never: true
                }
            ),
            new ProviderElement('energy-core-azure',
                {
                    generate: () => {
                        return {
                            descriptor: { singular: '', plural: '' },
                            ephitet: { pre: '' },
                        }
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    /**
                     * Can only be added by passive power "death blast"
                     */
                    never: true
                }
            ),
            new ProviderElement('energy-core-crimson',
                {
                    generate: () => {
                        return {
                            descriptor: { singular: '', plural: '' },
                            ephitet: { pre: '' },
                        }
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    /**
                     * Can only be added by passive power "death blast"
                     */
                    never: true
                }
            ),
            new ProviderElement('energy-core-verdant',
                {
                    generate: () => {
                        return {
                            descriptor: { singular: '', plural: '' },
                            ephitet: { pre: '' },
                        }
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    /**
                     * Can only be added by passive power "death blast"
                     */
                    never: true
                }
            ),
            new ProviderElement('energy-core-atomic',
                {
                    generate: () => {
                        return {
                            descriptor: {
                                descType: 'has',
                                singular: 'an integrated nuclear reactor which gives it a healthy glow',
                                plural: 'an integrated nuclear reactor which gives them a healthy glow'
                            },
                            ephitet: { pre: '' },
                        }
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    /**
                     * Can only be added by passive power "death blast"
                     */
                    never: true
                }
            ),
            new ProviderElement('energy-core-gold',
                {
                    generate: () => {
                        return {
                            descriptor: { singular: '', plural: '' },
                            ephitet: { pre: '' },
                        }
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    /**
                     * Can only be added by passive power "death blast"
                     */
                    never: true
                }
            ),
            new ProviderElement('energy-core-dark',
                {
                    generate: () => {
                        return {
                            descriptor: {
                                singular: 'is shaped like a corkscrew (which surrounds a bolt of dark energy, eternally crackling at its center)',
                                plural: 'are shaped like corkscrews (each surrounds a bolt of dark energy, eternally crackling at its center)'
                            },
                            ephitet: { pre: '' },
                        }
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    /**
                     * Can only be added by passive power "death blast"
                     */
                    never: true
                }
            ),
            new ProviderElement('energy-core-aether',
                {
                    generate: () => {
                        return {
                            descriptor: {
                                descType: 'has',
                                singular: 'large crack running down the middle of it (the edges glow with sky-blue energy, occasionally sparking with electricity)',
                                plural: 'a large crack running down the middle of them (their edges glow with sky-blue energy, and  occasionally sparki with electricity)'
                            },
                            ephitet: { pre: '' },
                        }
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    /**
                     * Can only be added by passive power "death blast"
                     */
                    never: true
                }
            ),
            new ProviderElement('energy-core-steampunk',
                {
                    generate: () => {
                        return {
                            descriptor: {
                                descType: 'has',
                                singular: 'glass section running down the center (which crackles with electrical energy)',
                                plural: 'glass sections running down their center (which crackle with electrical energy)'
                            },
                            ephitet: { pre: '' },
                        }
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    /**
                     * Can only be added by passive power "death blast"
                     */
                    never: true
                }
            ),
        ]
    },
    personalities: {},
    rechargeMethods: {},
    actives: {
        add: [
            new ProviderElement<ActivePower, WeaponPowerCond>('jump', {
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
            new ProviderElement<ActivePower, WeaponPowerCond>('summon-animal-weak', {
                desc: 'Summon Animal',
                cost: 5,
                additionalNotes: [
                    mkWepToGen((rng) => {
                        const quantity = ['' as const, '1d6 ' as const, '2d6 ' as const].choice(rng);

                        const animal: Record<(typeof quantity), string[]> = {
                            '': ['a lion', 'a tiger', 'a caracal', 'an ape', 'a kangaroo', 'a horse', 'a boar'],
                            '1d6 ': ['wolves', 'coyotes', 'thylacines', 'junglefowl'],
                            '2d6 ': ['mice', 'crickets', 'geckos', 'snails']
                        }

                        return `Call ${quantity} ${animal[quantity].choice(rng)} to your aid. ${quantity === '' ? 'It returns' : 'They return'} to nature at the end of the scene.`
                    })
                ]
            }, {
                themes: {
                    any: ['nature']
                },
                rarity: {
                    lte: 'rare'
                }
            }),
            new ProviderElement<ActivePower, WeaponPowerCond>('summon-animal-strong', {
                desc: 'Summon Animal',
                cost: 5,
                additionalNotes: [
                    mkWepToGen((rng) => {
                        const quantity = ['' as const, '1d6 ' as const, '2d6 ' as const].choice(rng);

                        const animal: Record<(typeof quantity), string[]> = {
                            '': ['an elephant', 'a rhino', 'a bear', 'a dire wolf', 'a giant carnivorous snail', 'a moose', 'a honey badger', 'a silverback gorilla'],
                            '1d6 ': ['giant sea termites', 'giant fire ants', 'lions', 'tigers', 'caracals', 'apes', 'kangaroos', 'horses', 'boars'],
                            '2d6 ': ['rats', 'wolves', 'coyotes', 'beavers', 'owls', 'hawks', 'alpacas', 'ostriches', 'peacocks']
                        }

                        return `Call ${quantity}${animal[quantity].choice(rng)} to your aid. ${quantity === '' ? 'It returns' : 'They return'} to nature at the end of the scene.`
                    })
                ]
            }, {
                themes: {
                    any: ['nature']
                },
                rarity: {
                    gte: 'epic'
                }
            }),
            new ProviderElement<ActivePower, WeaponPowerCond>('immovable-bc-earth',
                {
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
            new ProviderElement<ActivePower, WeaponPowerCond>('immovable-bc-weapon-shape',
                {
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
            new ProviderElement<ActivePower, WeaponPowerCond>('detachable-gems', {
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
            new ProviderElement<ActivePower, WeaponPowerCond>('ultimate-attack', {
                desc: 'Ultimate Anime Attack',
                cost: 'all charges',
                additionalNotes: [
                    "This attack always hits. It deals damage = weapon damage × number of charges remaining.",
                    'Afterwards, the weapon explodes and is destroyed.'
                ]
            }, {
                rarity: {
                    lte: 'rare'
                },
            }),
            new ProviderElement<ActivePower, WeaponPowerCond>('instant-door', {
                desc: 'Instant Door',
                cost: 6,
                additionalNotes: [
                    "Trace the outline of the doorway on a surface using the weapon. A moment later, it's magically created.",
                    "The door can punch through a thin sheet of metal (except lead), or 10-ft of any other material."
                ]
            }, {
                rarity: {
                    gte: 'rare'
                },
            }),
            new ProviderElement<ActivePower, WeaponPowerCond>('acid-etch', {
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
            new ProviderElement<ActivePower, WeaponPowerCond>('radial-slam', {
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
            new ProviderElement<ActivePower, WeaponPowerCond>('linear-slam', {
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
            new ProviderElement<ActivePower, WeaponPowerCond>('metaphysical-edit', {
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
            new ProviderElement<ActivePower, WeaponPowerCond>('gravity-gun', {
                desc: 'Kinesis',
                cost: 1,
                additionalNotes: [
                    mkGen((rng, weapon) => {
                        const effects = {
                            light: 'The weapon emits a tether of luminous energy.',
                            fire: 'The weapon emit a fiery whip.',
                            nature: "A sturdy vine grows from the weapon's tip.",
                            cloud: "The weapon emits a vortex of air."
                        } satisfies Partial<Record<Theme, string>>;

                        const supportedThemesOfWeapon = weapon.themes.filter(theme => theme in effects) as (keyof typeof effects)[];

                        const tetherTheme = effects[supportedThemesOfWeapon.choice(rng)];
                        //const tetherTheme = typeof chosen === "string" ? chosen : chosen(rng)

                        return `${tetherTheme} It can lift and throw object an weighing up to 500 lbs.`;
                    })
                ]
            }, {
                themes: {
                    any: ['light', 'fire', 'nature', 'cloud']
                },
            })
        ]
    },
    passives: {
        add: [
            new ProviderElement<PassivePower, WeaponPowerCond>('antimagic-aura',
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
            new ProviderElement<PassivePower, WeaponPowerCond>('silence-aura',
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
            new ProviderElement<PassivePower, WeaponPowerCond>('fire-aura',
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
            new ProviderElement<PassivePower, WeaponPowerCond>('mist-aura',
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
            new ProviderElement<PassivePower, WeaponPowerCond>('ice-aura',
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
                    const weaponEnergyEffect = mkGen((rng, weapon: Weapon): WeaponEnergyEffect => {
                        const fallBack = {
                            desc: 'void energy',
                            featureUUID: 'energy-core-void'
                        } satisfies WeaponEnergyEffect;

                        const effects = {
                            fire: {
                                desc: 'fire',
                                featureUUID: 'energy-core-fire'
                            },
                            ice: {
                                desc: 'icy wind',
                                featureUUID: 'energy-core-ice'
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
                            cloud: {
                                desc: 'lightning',
                                featureUUID: 'energy-core-aether'
                            },
                            steampunk: {
                                desc: 'lightning',
                                featureUUID: 'energy-core-steampunk'
                            },
                        } satisfies Partial<Record<Theme, WeaponEnergyEffect | TGenerator<WeaponEnergyEffect, [Weapon]>>>;

                        const supportedThemesOfWeapon = weapon.themes.filter(theme => theme in effects) as (keyof typeof effects)[];
                        return genMaybeGen(effects[supportedThemesOfWeapon.choice(rng)], rng) ?? fallBack;
                    });

                    const { desc, featureUUID } = weaponEnergyEffect.generate(rng, weapon);

                    const damageByRarity: Record<WeaponRarity, `${number}${keyof Omit<DamageDice, 'const'>}`> = {
                        common: "1d6",
                        uncommon: "1d6",
                        rare: "1d6",
                        epic: "1d6",
                        legendary: "2d6"
                    }

                    return {
                        miscPower: true,

                        desc: `Anything killed by the weapon explodes in a blast of ${desc}. The blast deals ${damageByRarity[weapon.rarity]} damage, with a range of 10-ft.`,
                        descriptorPartGenerator: featureUUID
                    }
                }),
                {
                    themes: { any: ['fire', 'ice', 'light', 'dark', 'cloud', 'steampunk'] },
                    rarity: { gte: 'epic' }
                }
            ),
            new ProviderElement<PassivePower, WeaponPowerCond>('warm-to-touch',
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
            new ProviderElement<PassivePower, WeaponPowerCond>('cold-to-touch',
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
            new ProviderElement<PassivePower, WeaponPowerCond>('transform-pipe',
                {
                    miscPower: true,
                    desc: "Can transform into a smoking pipe."
                },
                {
                    rarity: {
                        eq: 'common'
                    },
                    themes: { any: ['nature'] }
                }
            ),
            new ProviderElement<PassivePower, WeaponPowerCond>('shrink-or-grow',
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
            new ProviderElement<PassivePower, WeaponPowerCond>('magic-pocket',
                {
                    miscPower: true,
                    desc: "The wielder can banish the weapon to a pocket plane, then withdraw it at will."
                },
                {
                    rarity: {
                        gte: 'epic'
                    },
                    shapeFamily: {
                        none: ['staff', 'spear', 'polearm', 'greataxe', 'greatsword', 'sword (or musket)', 'greataxe (or musket)']
                    },
                    UUIDs: {
                        none: ['instant-recall']
                    }
                }
            ),
            new ProviderElement<PassivePower, WeaponPowerCond>('the-axe',
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
            new ProviderElement<PassivePower, WeaponPowerCond>('the-horn',
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
            )
        ],
        modify: {
            'instant-recall': {
                cond: {
                    UUIDs: {
                        none: ['magic-pocket']
                    }
                }
            }
        }
    },
    languages: {},
    shapes: {}
} satisfies DeltaCollection<WeaponFeaturesTypes>;
