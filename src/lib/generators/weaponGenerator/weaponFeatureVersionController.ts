import { ProviderElement } from "$lib/generators/weaponGenerator/provider";
import { type ActivePower, type FeatureProviderCollection, type Language, type PassivePower, type Personality, type RechargeMethod, type Theme, type WeaponAdjective, type WeaponPowerCond, type WeaponShape } from "$lib/generators/weaponGenerator/weaponGeneratorTypes";
import { PrimitiveContainer, VersionController, type DeltaCollection, type ToPatchableArray } from "../../util/versionController";
import { mkGen } from "../recursiveGenerator";
import { v1 } from "./config/v1";
import { WeaponFeatureProvider } from "./weaponGeneratorLogic";

interface WeaponFeaturesTypes {
    themes: PrimitiveContainer<Theme>;
    adjectives: ProviderElement<WeaponAdjective, WeaponPowerCond>;
    personalities: ProviderElement<Personality, WeaponPowerCond>

    rechargeMethods: ProviderElement<RechargeMethod, WeaponPowerCond>;
    actives: ProviderElement<ActivePower, WeaponPowerCond>;

    passives: ProviderElement<PassivePower, WeaponPowerCond>;
    languages: ProviderElement<Language, WeaponPowerCond>;
    shapes: ProviderElement<WeaponShape, WeaponPowerCond>;
}


export function toLang(theme: Theme, lang: string): ProviderElement<Language, WeaponPowerCond> {
    return new ProviderElement<Language, WeaponPowerCond>(
        lang.replaceAll(/\s/g, '-').toLowerCase(),
        { language: true, desc: lang }, {
        themes: {
            any: [theme]
        }
    });
}

export function toProviderSource<TKey extends string | number | symbol, T1, T2>(x: Record<TKey, T1[]>, map: (k: TKey, x: T1, i: number) => ProviderElement<T2, WeaponPowerCond>): ProviderElement<T2, WeaponPowerCond>[] {
    return Object.entries<T1[]>(x).map(([k, v]) => v.map((x, i) => map(k as TKey, x, i))).flat();
}


export const weaponFeatureVersionController = new VersionController<WeaponFeaturesTypes, DeltaCollection<WeaponFeaturesTypes>, ToPatchableArray<DeltaCollection<WeaponFeaturesTypes>>, FeatureProviderCollection>([
    v1,
    {
        shapes: {},
        adjectives: {
            add: [
                new ProviderElement<WeaponAdjective, WeaponPowerCond>('pale', { desc: 'pale' }, { themes: { any: ['light'] } }),
            ]
        },
        actives: {
            add: [
                new ProviderElement<ActivePower, WeaponPowerCond>('frostbound', {
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
                new ProviderElement<ActivePower, WeaponPowerCond>('rally-person', {
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
                new ProviderElement<ActivePower, WeaponPowerCond>('homing-shot', {
                    desc: 'Homing Shot',
                    cost: 1,
                    additionalNotes: [
                        'Fire an enchanted shot, which always hits.'
                    ]
                }, {
                    shapeFamily: {
                        any: ['sword (or bow)', 'dagger (or pistol)', 'greatsword (or musket)']
                    }
                }),
                new ProviderElement<ActivePower, WeaponPowerCond>('binding-shot', {
                    desc: 'Binding Shot',
                    cost: 2,
                    additionalNotes: [
                        'Fire an enchanted shot, which anchors the target to a nearby surface.',
                        'They are stuck in place until they use their turn to successfully save and escape.'
                    ]
                }, {
                    themes: { any: ['nature', 'ice'] },
                    shapeFamily: {
                        any: ['sword (or bow)', 'dagger (or pistol)', 'greatsword (or musket)']
                    }
                }),
                new ProviderElement<ActivePower, WeaponPowerCond>('black-flame-blast', {
                    desc: 'Black Flame Blast',
                    cost: 3,
                    additionalNotes: [
                        'Summon a 20-ft cone of black flame, which deals 4d6 damage.',
                        'Damage inflicted by black flames can only be healed by magic.'
                    ]
                }, {
                    themes: { all: ['dark', 'fire'] }
                })
            ]
        },
        passives: {
            add: [
                new ProviderElement<PassivePower, WeaponPowerCond>('weapon-permanently-invisible',
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
                new ProviderElement<PassivePower, WeaponPowerCond>('instant-recall',
                    {
                        miscPower: true,
                        desc: "The wielder can summon the weapon into their hand at will, so long as it's on the same plane."
                    },
                    {
                        rarity: {
                            gte: 'uncommon'
                        },
                    }
                )
            ]
        },
        languages: {},
        themes: {},
        personalities: {},
        rechargeMethods: {},
    }
    , {
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
                        mkGen((rng) => {
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
                        mkGen((rng) => {
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
            ]
        },
        passives: {
            add: [
                new ProviderElement<PassivePower, WeaponPowerCond>('antimagic-aura',
                    {
                        miscPower: true,
                        desc: "Magical effects will not function within 10-ft of the weapon, unless they are generated by it. The aura is inactive while the weapon is sheathed."
                    },
                    {
                        rarity: {
                            gte: 'legendary'
                        },
                        themes: { none: ['wizard'] }
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
                        themes: { none: ['wizard'] }
                    }
                ),
                new ProviderElement<PassivePower, WeaponPowerCond>('flame-aura',
                    {
                        miscPower: true,
                        desc: "All sound is erased within 10-ft of the weapon. The aura is inactive while the weapon is sheathed."
                    },
                    {
                        rarity: {
                            gte: 'legendary'
                        },
                        themes: { none: ['wizard'] }
                    }
                )
            ]
        },
        languages: {},
        shapes: {}
    }
    // ,{
    //     themes: {},
    //     adjectives: {},
    //     personalities: {},
    //     rechargeMethods: {},
    //     actives: {},
    //     passives: {},
    //     languages: {},
    //     shapes: {}
    // }
], (x) => {
    return {
        themeProvider: (x.themes as PrimitiveContainer<Theme>[]).map(x => x.value),
        adjectiveProvider: new WeaponFeatureProvider(x.adjectives),
        personalityProvider: new WeaponFeatureProvider(x.personalities),
        shapeProvider: new WeaponFeatureProvider(x.shapes),
        rechargeMethodProvider: new WeaponFeatureProvider(x.rechargeMethods),
        activePowerProvider: new WeaponFeatureProvider(x.actives),
        passivePowerOrLanguageProvider: new WeaponFeatureProvider(x.passives),
        languageProvider: new WeaponFeatureProvider(x.languages)
    } satisfies FeatureProviderCollection
});