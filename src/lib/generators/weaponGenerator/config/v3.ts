import { mkGen, StringGenerator } from "$lib/generators/recursiveGenerator";
import { edgedWeaponShapeFamilies } from "$lib/generators/weaponGenerator/config/configConstants";
import { ProviderElement } from "$lib/generators/weaponGenerator/provider";
import { mkWepToGen, textForDamage } from "$lib/generators/weaponGenerator/weaponGeneratorLogic";
import type { ActivePower, DamageDice, PassivePower, Theme, WeaponFeaturesTypes, WeaponPowerCond, WeaponRarity } from "$lib/generators/weaponGenerator/weaponGeneratorTypes";
import type { DeltaCollection } from "$lib/util/versionController";
import _ from "lodash";
import type seedrandom from "seedrandom";

export default {
    themes: {},
    descriptors: {},
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
                    any: new Set(['nature'])
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
                    any: new Set(['nature'])
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
                    any: new Set(['nature'])
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
                    themes: { any: new Set(['earth']) },
                    UUIDs: {
                        none: new Set(['immovable-bc-weapon-shape'])
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
                        any: new Set(['greatsword', 'greatsword'])
                    },
                    UUIDs: {
                        none: new Set(['immovable-bc-earth'])
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
                themes: { any: new Set(['earth']) },
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
                    any: new Set(['sour'])
                }
            }),
            new ProviderElement<ActivePower, WeaponPowerCond>('radial-slam', {
                desc: 'Slam',
                cost: 3,
                additionalNotes: [
                    "Slam the weapon into the ground, emitting a circular shockwave.",
                    (weapon) => {
                        // it deals damage equal to 3 * the weapon's 
                        const { as, d6, ...rest } = weapon.damage;
                        const slamDamage = _.mapValues(
                            {
                                d6: 1 + (d6 ?? 0),
                                ...rest
                            },
                            x => x === undefined ? undefined : x * 3
                        );
                        return new StringGenerator(["Characters within 20-ft must save, or be knocked down & take ", textForDamage(slamDamage), " damage"])
                    }
                ]
            }, {
                themes: {
                    any: new Set(['earth'])
                },
                UUIDs: {
                    none: new Set(['linear-slam'])
                }
            }),
            new ProviderElement<ActivePower, WeaponPowerCond>('linear-slam', {
                desc: 'Slam',
                cost: 3,
                additionalNotes: [
                    "Slam the weapon into the ground, emitting a shockwave that travels straight ahead for 60-ft.",
                    (weapon) => {
                        // it deals damage equal to 3 * the weapon's 
                        const { as, d6, ...rest } = weapon.damage;
                        const slamDamage = _.mapValues(
                            {
                                d6: 1 + (d6 ?? 0),
                                ...rest
                            },
                            x => x === undefined ? undefined : x * 3
                        );
                        return new StringGenerator(["Characters hit by the wave must save, or be knocked down & take ", textForDamage(slamDamage), " damage"])
                    }
                ]
            }, {
                themes: {
                    any: new Set(['earth'])
                },
                UUIDs: {
                    none: new Set(['radial-slam'])
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
                    any: new Set(['wizard'])
                },
                shapeFamily: {
                    any: edgedWeaponShapeFamilies
                },
            }),
            new ProviderElement<ActivePower, WeaponPowerCond>('gravity-gun', {
                desc: 'Kinesis',
                cost: 1,
                additionalNotes: [
                    (weapon) => mkGen((rng) => {
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
                    any: new Set(['light', 'fire', 'nature', 'cloud'])
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
                    themes: { none: new Set(['wizard']) },
                    UUIDs: {
                        none: new Set(['silence-aura', 'fire-aura', 'mist-aura', 'ice-aura'])
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
                    themes: { none: new Set(['wizard', 'fire']) },
                    UUIDs: {
                        none: new Set(['antimagic-aura', 'fire-aura', 'mist-aura', 'ice-aura'])
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
                    themes: { any: new Set(['fire']) },
                    UUIDs: {
                        none: new Set(['silence-aura', 'antimagic-aura', 'mist-aura', 'ice-aura'])
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
                    themes: { any: new Set(['cloud']) },
                    UUIDs: {
                        none: new Set(['silence-aura', 'antimagic-aura', 'fire-aura', 'ice-aura'])
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
                    themes: { any: new Set(['ice']) },
                    UUIDs: {
                        none: new Set(['silence-aura', 'antimagic-aura', 'fire-aura', 'mist-aura'])
                    }
                }
            ),
            new ProviderElement<PassivePower, WeaponPowerCond>(
                `death-blast`,
                {
                    miscPower: true,

                    desc: (weapon) => mkGen((rng) => {
                        const cloudOrSteampunkEffect = () => ['lightning', 'steam'].choice(rng)
                        const effects = {
                            fire: 'fire',
                            ice: 'icy wind',
                            light: (rng: seedrandom.PRNG) => ([
                                {
                                    pred: () => weapon.name.includes('Amethyst'),
                                    str: 'ultraviolet energy'
                                },
                                {
                                    pred: () => weapon.name.includes('Sapphire') || weapon.name.includes('Cobalt'),
                                    str: 'azure energy'
                                },
                                {
                                    pred: () => weapon.name.includes('Ruby'),
                                    str: 'crimson energy'
                                },
                                {
                                    pred: () => weapon.name.includes('Emerald'),
                                    str: 'verdant energy'
                                },
                                {
                                    pred: () => weapon.name.includes('Radium'),
                                    str: 'atomic energy'
                                },
                                {
                                    pred: () => weapon.name.includes('Gold'),
                                    str: 'golden energy'
                                },
                            ] as { pred: () => boolean, str: string }[]).filter(x => x.pred()).map(x => x.str).choice(rng),
                            dark: 'dark energy',
                            cloud: cloudOrSteampunkEffect,
                            steampunk: cloudOrSteampunkEffect
                        }
                        const damageByRarity: Record<WeaponRarity, `${number}${keyof Omit<DamageDice, 'const'>}`> = {
                            common: "1d6",
                            uncommon: "1d6",
                            rare: "1d6",
                            epic: "1d6",
                            legendary: "2d6"
                        }

                        const supportedThemesOfWeapon = weapon.themes.filter(theme => theme in effects) as (keyof typeof effects)[];

                        const chosen = effects[supportedThemesOfWeapon.choice(rng)];
                        const effect = typeof chosen === "string" ? chosen : chosen(rng)

                        return `Anything killed by the weapon explodes in a blast of ${effect}. The blast deals ${damageByRarity[weapon.rarity]} damage, with a range of 10-ft.`;
                    })
                },
                {
                    themes: { any: new Set(['fire', 'ice', 'light', 'dark', 'cloud', 'steampunk']) },
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
                    themes: { any: new Set(['fire']) }
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
                    themes: { any: new Set(['ice']) }
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
                    themes: { any: new Set(['nature']) }
                }
            ),
            new ProviderElement<PassivePower, WeaponPowerCond>('shrink-or-grow',
                {
                    miscPower: true,
                    desc: "Can transform into a 10-ft pole, or shrink to the size of a toothpick."
                },
                {
                    shapeFamily: {
                        any: new Set(['club', 'staff'])
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
                        none: new Set(['staff', 'spear', 'polearm', 'greataxe', 'greatsword', 'sword (or musket)', 'greataxe (or musket)'])
                    },
                    UUIDs: {
                        none: new Set(['instant-recall'])
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
                        any: new Set(['axe', 'greataxe'])
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
                        any: new Set(['club'])
                    },
                }
            )
        ],
        modify: {
            'instant-recall': {
                cond: {
                    UUIDs: {
                        none: new Set(['magic-pocket'])
                    }
                }
            }
        }
    },
    languages: {},
    shapes: {}
} satisfies DeltaCollection<WeaponFeaturesTypes>;
