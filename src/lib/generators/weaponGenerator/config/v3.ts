import { mkGen } from "$lib/generators/recursiveGenerator";
import { ProviderElement } from "$lib/generators/weaponGenerator/provider";
import { mkWepToGen } from "$lib/generators/weaponGenerator/weaponGeneratorLogic";
import type { ActivePower, DamageDice, PassivePower, WeaponPowerCond, WeaponRarity } from "$lib/generators/weaponGenerator/weaponGeneratorTypes";
import type seedrandom from "seedrandom";

export default {
    themes: {},
    adjectives: {},
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
                    desc: "Can transform into an pipe."
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
                    desc: "Can transform into a wooden pipe."
                },
                {
                    rarity: {
                        eq: 'common'
                    },
                    themes: { any: ['ice'] }
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
                        none: ['staff', 'spear', 'polearm', 'greataxe', 'greatsword', 'greatsword (or musket)']
                    },
                    UUIDs: {
                        none: ['instant-recall']
                    }
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
}