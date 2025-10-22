import { pluralUnholyFoe, singularUnholyFoe, singularWildAnimal } from "$lib/generators/foes";
import { mkGen, StringGenerator } from "$lib/generators/recursiveGenerator";
import { ProviderElement } from "$lib/generators/weaponGenerator/provider";
import { type ActivePower, type FeatureProviderCollection, type Language, type PassivePower, type Personality, type RechargeMethod, type Theme, type WeaponAdjective, type WeaponPowerCond, type WeaponShape } from "$lib/generators/weaponGenerator/weaponGeneratorTypes";
import { PrimitiveContainer, VersionController, type DeltaCollection, type ToPatchableArray } from "../../util/versionController";
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


const toLang = (theme: Theme, lang: string) => new ProviderElement<Language, WeaponPowerCond>(lang.replaceAll(/\s/g, '-').toLowerCase(), { language: true, desc: lang }, {

    themes: {
        any: [theme]
    }
})

export function toProviderSource<TKey extends string | number | symbol, T1, T2>(x: Record<TKey, T1[]>, map: (k: TKey, x: T1, i: number) => ProviderElement<T2, WeaponPowerCond>): ProviderElement<T2, WeaponPowerCond>[] {
    return Object.entries<T1[]>(x).map(([k, v]) => v.map((x, i) => map(k as TKey, x, i))).flat();
}


export const weaponFeatureVersionController = new VersionController<WeaponFeaturesTypes, DeltaCollection<WeaponFeaturesTypes>, ToPatchableArray<DeltaCollection<WeaponFeaturesTypes>>, FeatureProviderCollection>([
    {
        themes: {
            add: [
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
            ].map(theme => new PrimitiveContainer(theme))
        },
        adjectives: {
            add: [
                ...(
                    [
                        "bronze",
                        "iron",
                        "steel",
                        "Silver-Plated"
                    ].map(adj => new ProviderElement<WeaponAdjective, WeaponPowerCond>(adj.toLowerCase(), { desc: adj }, {}))
                ),
                ...(
                    [
                        "fiery",
                        "blazing",
                        "roaring",
                        "crackling",
                        "ruby",
                        "opal"
                    ].map(adj => new ProviderElement<WeaponAdjective, WeaponPowerCond>(adj.toLowerCase(), { desc: adj }, { themes: { any: ['fire'] } }))
                ),
                ...(
                    [
                        "icy",
                        "frigid",
                        "silent",
                        "polar",
                        "Frostbound",
                        "Icebound"
                    ].map(adj => new ProviderElement<WeaponAdjective, WeaponPowerCond>(adj.toLowerCase(), { desc: adj }, { themes: { any: ['ice'] } }))
                ),
                ...(
                    [
                        "Shadow-Wreathed",
                        "stygian",
                        "abyssal",
                        "spiked",
                        "Blood-Stained"
                    ].map(adj => new ProviderElement<WeaponAdjective, WeaponPowerCond>(adj.toLowerCase(), { desc: adj }, { themes: { any: ['dark'] } }))
                ),
                ...(
                    [
                        "rainbow",
                        "translucent",
                        "moonlit",
                        "glittery",
                        "luminous",
                        "glowing",
                        "solar",
                        "lunar",
                        "prismatic",
                    ].map(adj => new ProviderElement<WeaponAdjective, WeaponPowerCond>(adj.toLowerCase(), { desc: adj }, { themes: { any: ['light'] } }))
                ),
                ...(
                    [
                        "saccharine",
                        "candied",
                        "Honey-Glazed",
                        "Sugar-Glazed",
                        "Honey-Frosted",
                        "Sugar-Frosted"
                    ].map(adj => new ProviderElement<WeaponAdjective, WeaponPowerCond>(adj.toLowerCase(), { desc: adj }, { themes: { any: ['sweet'] } }))
                ),
                ...(
                    [
                        "corroded",
                        "corrosive"
                    ].map(adj => new ProviderElement<WeaponAdjective, WeaponPowerCond>(adj.toLowerCase(), { desc: adj }, { themes: { any: ['sour'] } }))
                ),
                ...(
                    [
                        "crystal",
                        "Silk-Wrapped",
                        "amethyst"
                    ].map(adj => new ProviderElement<WeaponAdjective, WeaponPowerCond>(adj.toLowerCase(), { desc: adj }, { themes: { any: ['wizard'] } }))
                ),
                ...(
                    [
                        "brass",
                        "clockwork"
                    ].map(adj => new ProviderElement<WeaponAdjective, WeaponPowerCond>(adj.toLowerCase(), { desc: adj }, { themes: { any: ['steampunk'] } }))
                ),
                ...(
                    [
                        "heavy",
                        "rough",
                        "slag"
                    ].map(adj => new ProviderElement<WeaponAdjective, WeaponPowerCond>(adj.toLowerCase(), { desc: adj }, { themes: { any: ['earth'] } }))
                ),
                ...(
                    [
                        "gossamer",
                        "rusted",
                        "silver"
                    ].map(adj => new ProviderElement<WeaponAdjective, WeaponPowerCond>(adj.toLowerCase(), { desc: adj }, { themes: { any: ['cloud'] } }))
                ),
                new ProviderElement<WeaponAdjective, WeaponPowerCond>('tin',

                    {
                        desc: "tin"
                    },
                    {

                        rarity: {
                            lte: "uncommon"
                        }
                    }
                ),
                new ProviderElement<WeaponAdjective, WeaponPowerCond>('copper',

                    {
                        desc: "copper"
                    },
                    {

                        rarity: {
                            lte: "uncommon"
                        }
                    }
                ),
                new ProviderElement<WeaponAdjective, WeaponPowerCond>('oak',

                    {
                        desc: "oak"
                    },
                    {

                        rarity: {
                            lte: "uncommon"
                        }
                    }),
                new ProviderElement<WeaponAdjective, WeaponPowerCond>('pine',

                    {
                        desc: "pine"
                    },
                    {

                        rarity: {
                            lte: "uncommon"
                        }
                    }
                ),
                new ProviderElement<WeaponAdjective, WeaponPowerCond>('sandstone',

                    {
                        desc: "sandstone"
                    },
                    {

                        rarity: {
                            lte: "uncommon"
                        },
                        themes: {
                            any: [
                                "fire",
                                "earth"
                            ]
                        }
                    },
                ),
                new ProviderElement<WeaponAdjective, WeaponPowerCond>('granite',

                    {
                        desc: "granite"
                    },
                    {

                        rarity: {
                            gte: "epic"
                        }
                    }
                ),
                new ProviderElement<WeaponAdjective, WeaponPowerCond>('alabaster',

                    {
                        desc: "alabaster"
                    },
                    {

                        rarity: {
                            gte: "epic"
                        }
                    }
                ),
                new ProviderElement<WeaponAdjective, WeaponPowerCond>('marble',

                    {
                        desc: "marble"
                    },
                    {

                        rarity: {
                            gte: "epic"
                        }
                    }
                ),
                new ProviderElement<WeaponAdjective, WeaponPowerCond>('silver',

                    {
                        desc: "silver"
                    },
                    {

                        rarity: {
                            gte: "epic"
                        }
                    }
                ),
                new ProviderElement<WeaponAdjective, WeaponPowerCond>('gold',

                    {
                        desc: "gold"
                    },
                    {

                        rarity: {
                            gte: "epic"
                        }
                    }
                ),
                new ProviderElement<WeaponAdjective, WeaponPowerCond>('black-iron',

                    {
                        desc: "black iron"
                    },
                    {

                        rarity: {
                            gte: "epic"
                        }
                    }
                ),
                new ProviderElement<WeaponAdjective, WeaponPowerCond>('silver',

                    {
                        desc: "silver"
                    },
                    {

                        rarity: {
                            gte: "epic"
                        }
                    }
                ),
                new ProviderElement<WeaponAdjective, WeaponPowerCond>('mythril',

                    {
                        desc: "mythril"
                    },
                    {

                        rarity: {
                            gte: "epic"
                        }
                    }
                ),
                new ProviderElement<WeaponAdjective, WeaponPowerCond>('adamant',

                    {
                        desc: "adamant"
                    },
                    {

                        rarity: {
                            gte: "epic"
                        }
                    }
                ),
                new ProviderElement<WeaponAdjective, WeaponPowerCond>('cobalt',

                    {
                        desc: "cobalt"
                    },
                    {

                        rarity: {
                            gte: "epic"
                        }
                    }
                ),
                new ProviderElement<WeaponAdjective, WeaponPowerCond>('radium',

                    {
                        desc: "radium"
                    },
                    {

                        rarity: {
                            gte: "legendary"
                        }
                    }
                ),
                new ProviderElement<WeaponAdjective, WeaponPowerCond>('diamond',
                    {
                        desc: "diamond"
                    },
                    {

                        rarity: {
                            gte: "epic"
                        },
                        themes: {
                            any: [
                                "light",
                                "earth"
                            ]
                        }
                    },
                ),
                new ProviderElement<WeaponAdjective, WeaponPowerCond>('ruby',
                    {
                        desc: "ruby"
                    },
                    {

                        rarity: {
                            gte: "epic"
                        },
                        themes: {
                            any: [
                                "fire",
                                "earth"
                            ]
                        },
                    }
                ),
                new ProviderElement<WeaponAdjective, WeaponPowerCond>('emerald',
                    {
                        desc: "emerald"
                    },
                    {

                        rarity: {
                            gte: "epic"
                        },
                        themes: {
                            any: [
                                "fire",
                                "earth",
                                "nature"
                            ]
                        }
                    },
                ),
                new ProviderElement<WeaponAdjective, WeaponPowerCond>('sapphire',
                    {
                        desc: "sapphire"
                    },
                    {

                        rarity: {
                            gte: "epic"
                        },
                        themes: {
                            any: [
                                "light",
                                "cloud",
                                "earth"
                            ]
                        }
                    },
                ),
                new ProviderElement<WeaponAdjective, WeaponPowerCond>('flint',
                    {
                        desc: "flint"
                    },
                    {

                        rarity: {
                            lte: "uncommon"
                        },
                        themes: {
                            any: [
                                "fire",
                                "dark",
                                "earth"
                            ]
                        }
                    },
                ),
                new ProviderElement<WeaponAdjective, WeaponPowerCond>('onyx',
                    {
                        desc: "onyx"
                    },
                    {

                        rarity: {
                            gte: "epic"
                        },
                        themes: {
                            any: [
                                "fire",
                                "dark",
                                "earth"
                            ]
                        }
                    },
                ),
                new ProviderElement<WeaponAdjective, WeaponPowerCond>('quartz',
                    {
                        desc: "quartz"
                    },
                    {

                        rarity: {
                            gte: "epic"
                        }
                    }
                ),
                new ProviderElement<WeaponAdjective, WeaponPowerCond>('glass',
                    {
                        desc: "glass"
                    },
                    {

                        rarity: {
                            gte: "epic"
                        },
                        themes: {
                            any: [
                                "ice",
                                "fire",
                                "light",
                                "cloud"
                            ]
                        }
                    },
                ),
                new ProviderElement<WeaponAdjective, WeaponPowerCond>('lumensteel',
                    {
                        desc: "lumensteel"
                    },
                    {

                        rarity: {
                            gte: "epic"
                        }
                    }
                ),
                // new ProviderElement<WeaponAdjective, WeaponPowerCond>('TODO',

                // ),
            ]
        },
        personalities: {
            add: [

                new ProviderElement<Personality, WeaponPowerCond>('vengeful',
                    {
                        desc: "Vengeful."
                    },
                    {
                        themes: {
                            any: ["fire", "ice", "dark", "sweet"]
                        },

                    }
                ),
                new ProviderElement<Personality, WeaponPowerCond>('cruel',
                    {
                        desc: "Cruel."
                    },
                    {
                        themes: {
                            any: ["sour", "dark"]
                        },

                    }
                ),
                new ProviderElement<Personality, WeaponPowerCond>('curious',
                    {
                        desc: "Curious."
                    },
                    {
                        themes: {
                            any: ["wizard", "steampunk", "cloud"]
                        },

                    }
                ),
                new ProviderElement<Personality, WeaponPowerCond>('know-it-all',
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
                    const formatted = personality.capFirst() + '.';
                    return new ProviderElement<Personality, WeaponPowerCond>(`${theme}-${personality.toLowerCase().replaceAll(/\s/g, '-')}-${i}`,
                        {
                            desc: mkGen(formatted)
                        },
                        {
                            themes: { all: [theme as Theme] },
                            allowDuplicates: true
                        }
                    )
                })
            ]
        },
        rechargeMethods: {
            add: [
                new ProviderElement<Personality, WeaponPowerCond>('recharge-at-winter-solstice',
                    {
                        desc: mkGen("all charges at noon on the winter solstice")
                    },
                    {

                        themes: {
                            any: ["ice", "nature"]
                        }
                    }
                ),
                new ProviderElement<Personality, WeaponPowerCond>('recharge-at-summer-solstice',
                    {
                        desc: mkGen("all charges at noon on the summer solstice")
                    },
                    {

                        themes: {
                            any: ["fire", "nature"]
                        }
                    }
                ),
                ...toProviderSource(
                    {
                        fire: [
                            mkGen("all charges after being superheated"),
                        ],
                        ice: [
                            mkGen("all charges after being cooled to sub-zero"),
                            mkGen("one charge whenever its wielder builds a snowman"),
                            mkGen("one charge at the end of each scene where its wielder made an ice pun")
                        ],
                        dark: [
                            mkGen("one charge upon absorbing a human soul"),
                            mkGen("one charge at the end of each scene where its wielder destroyed an object unnecessarily"),
                            mkGen("all charges each day at the witching hour"),
                            mkGen("one charge when its wielder defenestrates a priest, or all charges if it was a high ranking priest")
                        ],
                        light: [
                            mkGen("all charges after an hour in a sacred space"),
                            mkGen("all charges each day at sunrise"),
                            new StringGenerator([
                                mkGen("one charge each time you defeat a "),
                                singularUnholyFoe,
                            ])
                        ],
                        sweet: [
                            mkGen("one charge each time it eats an extravagant dessert"),
                            mkGen("all charges each time its wielder hosts a feast"),
                            mkGen("one charge whenever its wielder compliments someone")
                        ],
                        sour: [
                            mkGen("all charges after an hour immersed in acid"),
                            mkGen("all charges when used to fell a citrus tree"),
                            mkGen("one charge each time its wielder insults someone")
                        ],
                        cloud: [
                            mkGen("all charges when struck by lightning"),
                            mkGen('all charges when its wielder survives a significant fall'),
                            mkGen('one charge each time you defeat a winged creature, or all charges if it was also a powerful foe'),
                        ],
                        wizard: [
                            mkGen('one charge when you cast one of your own spells'),
                            mkGen('all charges when its wielder learns a new spell'),
                            mkGen('all charges when its wielder wins a wizard duel'),
                            mkGen('one charge when its wielder finishes reading a new book'),
                            mkGen('all charges when its wielder views the night sky'),
                        ],
                        steampunk: [
                            mkGen('all charges when its wielder invents something'),
                            mkGen('all charges when its wielder throws a tea party'),
                            mkGen("one charge when its wielder breaks news"),
                        ],
                        earth: [
                            mkGen('one charge when its wielder throws a rock at something important'),
                            mkGen('all charges when its wielder meditates atop a mountain'),
                            mkGen('all charges when driven into the ground while something important is happening')
                        ],
                        nature: [
                            mkGen("all charges")
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
                new ProviderElement<ActivePower, WeaponPowerCond>('weapon-animal-transformation',
                    {
                        desc: mkGen("Animal Transformation"),
                        cost: 2,
                        additionalNotes: [
                            new StringGenerator([
                                mkGen("The weapon transforms into "),
                                singularWildAnimal,
                                mkGen(" until the end of the scene.")
                            ]),
                            "You can command it to turn back into its regular form early."
                        ]
                    },
                    {
                        themes: {
                            any: ['nature'],
                        },
                        allowDuplicates: true
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>(
                    'fireball',
                    { desc: "Fire Ball", cost: 4 },
                    {
                        themes: { any: ['fire'] },
                        rarity: {
                            gte: "rare"
                        }
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('wall-of-fire',
                    {
                        desc: "Wall of Fire",
                        cost: 4
                    },
                    {
                        themes: { any: ['fire'] },
                        rarity: {
                            gte: "rare"
                        }
                    }),
                new ProviderElement<ActivePower, WeaponPowerCond>('control-hot-weather',
                    {
                        desc: "Control Weather",
                        cost: 2,
                        additionalNotes: [
                            "Must move conditions towards heatwave."
                        ],
                    },
                    {
                        themes: { any: ['fire'] },
                        rarity: {
                            lte: "rare"
                        }
                    }),
                new ProviderElement<ActivePower, WeaponPowerCond>('control-flames',
                    {
                        desc: "Control Flames",
                        cost: 1,
                        additionalNotes: [
                            "Flames larger than wielder submit only after a save."
                        ],
                    },
                    {
                        themes: { any: ['fire'] },
                        rarity: {
                            lte: "rare"
                        }
                    }),
                new ProviderElement<ActivePower, WeaponPowerCond>('summon-fire-elemental',
                    {
                        desc: "Summon Fire Elemental",
                        cost: 6,
                        additionalNotes: [
                            "Dissipates after 1 hour."
                        ],
                    },
                    {
                        themes: { any: ['fire'] },
                        rarity: {
                            gte: "epic"
                        }
                    }),
                new ProviderElement<ActivePower, WeaponPowerCond>('wall-of-ice',
                    {
                        desc: "Wall of Ice",
                        cost: 4,
                    },
                    {
                        themes: { any: ['ice'] },
                        rarity: {
                            gte: "rare"
                        }
                    }),
                new ProviderElement<ActivePower, WeaponPowerCond>('control-cold-weather',
                    {
                        desc: "Control Weather",
                        cost: 3,
                        additionalNotes: [
                            "Must move conditions towards blizzard."
                        ],
                    },
                    {
                        themes: { any: ['ice'] },
                        rarity: {
                            lte: "rare"
                        }
                    }),
                new ProviderElement<ActivePower, WeaponPowerCond>('ice-strike',
                    {
                        desc: "Chilling Strike",
                        cost: 2,
                        additionalNotes: [
                            "Upon hitting, you can choose to infuse the attack. Characters must save or be frozen solid next turn."
                        ],
                    },
                    {
                        themes: { any: ['ice'] },
                        rarity: {
                            lte: "rare"
                        }
                    }),
                new ProviderElement<ActivePower, WeaponPowerCond>('summon-ice-elemental',
                    {
                        desc: "Summon Ice Elemental",
                        cost: 6,
                        additionalNotes: [
                            "Dissipates after 1 hour."
                        ],
                    },
                    {
                        themes: { any: ['ice'] },
                        rarity: {
                            gte: "epic"
                        }
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('commune-demon',
                    {
                        desc: "Commune With Demon",
                        cost: 2,
                    },
                    {
                        themes: { any: ['dark'] },
                        rarity: {
                            gte: "uncommon"
                        }
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('turn-holy',
                    {
                        desc: "Turn Priests & Angels",
                        cost: 2,
                    },
                    {
                        themes: { any: ['dark'] },
                        rarity: {
                            gte: "uncommon"
                        }
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('darkness',
                    {
                        desc: "Darkness",
                        cost: 1
                    },
                    {
                        themes: { any: ['dark'] },
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('summon-demon',
                    {
                        desc: "Summon Demon",
                        cost: 6,
                        additionalNotes: [
                            "Returns to hell after 1 hour."
                        ],
                    },
                    {
                        themes: { any: ['dark'] },
                        rarity: {
                            gte: "epic"
                        }
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('commune-divinity',
                    {
                        desc: "Commune With Divinity",
                        cost: 2,
                    },
                    {
                        themes: { any: ['light'] },
                        rarity: {
                            gte: "uncommon"
                        }
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('turn-undead',
                    {
                        desc: "Turn Undead",
                        cost: 1
                    },
                    {
                        themes: { any: ['light'] },
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('light',
                    {
                        desc: "Light",
                        cost: 1
                    },
                    {
                        themes: { any: ['light'] },
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('summon-angel',
                    {
                        desc: "Summon Angel",
                        cost: 6,
                        additionalNotes: [
                            "Returns to heaven after 1 hour."
                        ],
                    },
                    {
                        themes: { any: ['light'] },
                        rarity: {
                            gte: "epic"
                        }
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('charm-person',
                    {
                        desc: "Charm Person",
                        cost: 2
                    },
                    {
                        themes: { any: ['sweet'] },
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('sweetberry',
                    {
                        desc: "Sweetberry",
                        cost: 1,
                        additionalNotes: [
                            "Create a small berry, stats as healing potion."
                        ]
                    },
                    {
                        themes: { any: ['sweet'] },
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('sugar-spray',
                    {
                        desc: "Sugar Spray",
                        cost: 1,
                        additionalNotes: [
                            "Sprays a sweet and sticky syrup, enough to coat the floor of a small room. Makes movement difficult."
                        ]
                    },
                    {
                        themes: { any: ['sweet'] },
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('caustic-strike',
                    {
                        desc: "Caustic Strike",
                        cost: 2,
                        additionalNotes: [
                            "Upon hitting, you can choose to infuse the attack. Melts objects, or damages armor of characters."
                        ]
                    },
                    {
                        themes: { any: ['sour'] },
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('locate-lemon',
                    {
                        desc: "Locate Lemon",
                        cost: 1,
                        additionalNotes: [
                            "Wielder learns the exact location of the closest lemon."
                        ]
                    },
                    {
                        themes: { any: ['sour'] },
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('cause-nausea',
                    {
                        desc: "Cause Nausea",
                        cost: 1,
                        additionalNotes: [
                            "Target must save or waste their turn vomiting."
                        ]
                    },
                    {
                        themes: { any: ['sour'] },
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('summon-acid-elemental',
                    {
                        desc: "Summon Acid Elemental",
                        cost: 6,
                        additionalNotes: [
                            "Dissipates after 1 hour."
                        ],
                    },
                    {
                        themes: { any: ['sour'] },
                        rarity: {
                            gte: "epic"
                        }
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('magic-missile',
                    {
                        desc: "Magic Missile",
                        cost: 2
                    },
                    {
                        themes: { any: ['wizard'] },
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('magic-shield',
                    {
                        desc: "Magic Shield",
                        cost: 2
                    },
                    {
                        themes: { any: ['wizard'] },
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('magic-parry',
                    {
                        desc: "Magic Parry",
                        cost: "equal to spell's level",
                        additionalNotes: [
                            "Deflect a harmful spell that was targeted at you specifically.",
                            "You save. On a success the spell is nullified.",
                            "If you succeeded with the best possible roll, the spell is instead reflected back at the attacker."
                        ]
                    },
                    {
                        themes: { any: ['wizard'] },
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('instant-message',
                    {
                        desc: "Instant Message",
                        cost: 1,
                        additionalNotes: [
                            "Point the weapon at someone in your line of sight, send them a telepathic message."
                        ]
                    },
                    {
                        themes: { any: ['wizard'] },
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('create-wizard-servant',
                    {
                        desc: "Create Servant",
                        cost: 3,
                        additionalNotes: [
                            "Create an small ichorous being that obeys you without question. It dissolves into sludge after 2d6 days."
                        ]
                    },
                    {
                        themes: { any: ['wizard'] },
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('summon-steam-elemental',
                    {
                        desc: "Summon Steam Elemental",
                        cost: 6,
                        additionalNotes: [
                            "Dissipates after 1 hour."
                        ],
                    },
                    {
                        themes: { any: ['steampunk'] },
                        rarity: {
                            gte: "epic"
                        }
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('power-machine',
                    {
                        desc: "Power Machine",
                        cost: 1,
                        additionalNotes: [
                            "Touching the weapon to a machine causes it to activate under magical power. It operates for 24 hours."
                        ]
                    },
                    {
                        themes: { any: ['steampunk'] },
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('summon-water-elemental',
                    {
                        desc: "Summon Water Elemental",
                        cost: 6,
                        additionalNotes: [
                            "Dissipates after 1 hour."
                        ],
                    },
                    {
                        themes: { any: ['cloud'] },
                        rarity: {
                            gte: "epic"
                        }
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('zephyr-strike',
                    {
                        desc: "Zephyr Strike",
                        cost: 2,
                        additionalNotes: [
                            "Move up to 4× your normal movement to attack someone.",
                            "They must save or be knocked down by the attack."
                        ]
                    },
                    {
                        themes: { any: ['cloud'] },
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('wind-blast',
                    {
                        desc: "Wind Blast",
                        cost: 2,
                        additionalNotes: [
                            "Characters in melee range must save, or be thrown back out of melee range and knocked down."
                        ]
                    },
                    {
                        themes: { any: ['cloud'] },
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('summon-lightning',
                    {
                        desc: "Summon Lightning",
                        cost: 4,
                        additionalNotes: [
                            "Summon a bolt of lightning to strike something in your line of sight."
                        ]
                    },
                    {
                        themes: { any: ['cloud'] },
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('wall-of-stone',
                    {
                        desc: "Wall of stone",
                        cost: 4,
                    },
                    {
                        themes: { any: ['earth'] },
                        rarity: {
                            gte: "rare"
                        }
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('petrify-person',
                    {
                        desc: "Petrify Person",
                        cost: 5,
                    },
                    {
                        themes: { any: ['earth'] },
                        rarity: {
                            gte: "rare"
                        }
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('cure-petrify',
                    {
                        desc: "Cure Petrification",
                        cost: 2
                    },
                    {
                        themes: { any: ['earth'] },
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('summon-earth-elemental',
                    {
                        desc: "Summon Earth Elemental",
                        cost: 6,
                        additionalNotes: [
                            "Crumbles after 1 hour."
                        ],
                    },
                    {
                        themes: { any: ['earth'] },
                        rarity: {
                            gte: "epic"
                        }
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('instant-tree',
                    {
                        desc: "Instant Tree",
                        cost: 1
                    },
                    {
                        themes: { any: ['nature'] },
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('summon-chomp-flower',
                    {
                        desc: "Instant Chomp-Flower",
                        cost: 2,
                        additionalNotes: [
                            "Stats as shark but can't move."
                        ]
                    },
                    {
                        themes: { any: ['nature'] },
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('vine-hook',
                    {
                        desc: "Vine Hook",
                        cost: 1,
                        additionalNotes: [
                            "Launch a vine from the weapon. It can stay attached to the weapon at one end, or detach to link two objects together.",
                            "Vines can be up to 50-ft long and are as strong as steel."
                        ]
                    },
                    {
                        themes: { any: ['nature'] },
                    }
                ),
            ]
        },
        passives: {
            add: [
                new ProviderElement<PassivePower, WeaponPowerCond>('detect-unholy',
                    {
                        miscPower: true,
                        desc: new StringGenerator([
                            mkGen("Glows like a torch when "),
                            pluralUnholyFoe,
                            mkGen(" are near")
                        ])
                    },
                    {

                        themes: {
                            any: ['light'],
                        },
                    }
                ),
                new ProviderElement<PassivePower, WeaponPowerCond>('command-critters',
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
                new ProviderElement<PassivePower, WeaponPowerCond>('detect-unholy',
                    {
                        miscPower: true,
                        desc: "Weapon can telepathically control bees within 100-ft. They can only understand simple commands."
                    },
                    {

                        themes: {
                            any: ["nature", "sweet"]
                        }
                    }
                ),
                new ProviderElement<PassivePower, WeaponPowerCond>('focus-light-beam',
                    {
                        miscPower: true,
                        desc: new StringGenerator(["Can reflect and focus ", mkGen((rng) => ['sun', 'moon'].choice(rng)), "light as a damaging beam (2d6 damage)."])
                    },
                    {

                        themes: { any: ['light'] }
                    }
                ),
                new ProviderElement<PassivePower, WeaponPowerCond>('move-silently',
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
                new ProviderElement<PassivePower, WeaponPowerCond>('magically-hovers',
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
                new ProviderElement<PassivePower, WeaponPowerCond>('resistance-fire',
                    {
                        miscPower: true,
                        desc: "Wielder takes half damage from fire."
                    },
                    {

                        themes: { any: ['fire'] }
                    }
                ),
                new ProviderElement<PassivePower, WeaponPowerCond>('immunity-fire',
                    {

                        miscPower: true,
                        desc: "Wielder cannot be harmed by fire.",
                    },
                    {

                        themes: { any: ['fire'] },
                        rarity: {
                            gte: "rare"
                        }
                    }
                ),
                new ProviderElement<PassivePower, WeaponPowerCond>('damage-bonus-fire',
                    {
                        miscPower: true,
                        desc: "Wreathed in flames, glows like a torch",
                        bonus: {
                            addDamageDie: {
                                d6: 1
                            }
                        }
                    },
                    {

                        themes: { any: ['fire'] }
                    }
                ),
                new ProviderElement<PassivePower, WeaponPowerCond>('expertise-blacksmithing',
                    {

                        miscPower: true,
                        desc: "Weapon is an expert blacksmith.",
                    },
                    {

                        themes: { any: ['fire'] },
                        isSentient: true
                    }
                ),
                new ProviderElement<PassivePower, WeaponPowerCond>('resistance-cold',
                    {

                        miscPower: true,
                        desc: "Wielder takes half damage from ice & cold."
                    },
                    {

                        themes: { any: ['ice'] }
                    }
                ),
                new ProviderElement<PassivePower, WeaponPowerCond>('immunity-cold',
                    {
                        miscPower: true,
                        desc: "Wielder cannot be harmed by ice & cold."
                    },
                    {

                        themes: { any: ['ice'] }
                    }
                ),
                new ProviderElement<PassivePower, WeaponPowerCond>('damage-bonus-ice-blunt',
                    {
                        miscPower: true,
                        desc: "Wreathed in frigid mist.",
                        bonus: {
                            addDamageDie: {
                                d6: 1
                            }
                        },
                    },
                    {

                        themes: { any: ['ice'] },
                        shapeFamily: {
                            none: [
                                "dagger",
                                "sword",
                                "greatsword"
                            ]
                        }
                    }
                ),
                new ProviderElement<PassivePower, WeaponPowerCond>('damage-bonus-ice-sharp',
                    {
                        miscPower: true,
                        desc: "Wreathed in ice, always frozen into its sheath. Requires a strength save to draw.",
                        bonus: {
                            addDamageDie: {
                                d10: 1
                            }
                        },
                    },
                    {

                        themes: { any: ['ice'] },
                        shapeFamily: {
                            any: [
                                "dagger",
                                "sword",
                                "greatsword"
                            ]
                        }
                    }
                ),
                new ProviderElement<PassivePower, WeaponPowerCond>('sense-cold-weather',
                    {
                        miscPower: true,
                        desc: "1-in-2 chance to sense icy weather before it hits, giving just enough time to escape."
                    },
                    {

                        themes: { any: ['ice'] }
                    }
                ),
                new ProviderElement<PassivePower, WeaponPowerCond>('walk-on-ice',
                    {

                        miscPower: true,
                        desc: "Wielder can walk on any kind of ice without breaking it."
                    },
                    {

                        themes: { any: ['ice'] }
                    }
                ),
                new ProviderElement<PassivePower, WeaponPowerCond>('vibe-menacing',
                    {

                        miscPower: true,
                        desc: "Menacing aura. Bonus to saves to frighten & intimidate."
                    },
                    {
                        themes: { any: ['dark'] }
                    }
                ),
                new ProviderElement<PassivePower, WeaponPowerCond>('trap-souls',
                    {

                        miscPower: true,
                        desc: "Traps the souls of its victims. They haunt the weapon, and obey the wielder's commands."
                    },
                    {
                        themes: { any: ['dark'] }
                    }
                ),
                new ProviderElement<PassivePower, WeaponPowerCond>('damage-bonus-dark-flame',
                    {
                        miscPower: true,
                        desc: "Wreathed in lightless black flames.",
                        bonus: {
                            addDamageDie: {
                                d6: 1
                            }
                        }
                    },
                    {
                        themes: { any: ['dark'] }
                    }
                ),
                new ProviderElement<PassivePower, WeaponPowerCond>('resistance-radiant',
                    {
                        miscPower: true,
                        desc: "Wielder takes half damage from rays & beams."

                    },
                    {
                        themes: { any: ['light'] }
                    }
                ),
                new ProviderElement<PassivePower, WeaponPowerCond>('immunity-radiant',
                    {

                        miscPower: true,
                        desc: "Wielder is immune to the harmful effects of rays & beams."
                    },
                    {
                        themes: { any: ['light'] }
                    }
                ),
                new ProviderElement<PassivePower, WeaponPowerCond>('stats-as-mirror',
                    {
                        miscPower: true,
                        desc: "Extremely shiny, functions as a mirror."
                    },
                    {
                        themes: { any: ['light'] }
                    }
                ),
                new ProviderElement<PassivePower, WeaponPowerCond>('vibe-wholesome',
                    {
                        miscPower: true,
                        desc: "Wielder has a wholesome aura. Bonus to saves to spread cheer and/or appear nonthreatening."
                    },
                    {
                        themes: { any: ['light', 'sweet'] }
                    }
                ),
                new ProviderElement<PassivePower, WeaponPowerCond>('TODO',
                    {
                        miscPower: true,
                        desc: "Weapon is an expert chef.",
                    },
                    {
                        themes: { any: ['sweet'] },
                        isSentient: true
                    }
                ),
                new ProviderElement<PassivePower, WeaponPowerCond>('magically-learn-dessert-recipes',
                    {
                        miscPower: true,
                        desc: "The wielder magically knows the recipe of any dessert they taste."
                    },
                    {
                        themes: { any: ['sweet'] }
                    }
                ),
                new ProviderElement<PassivePower, WeaponPowerCond>('eat-to-heal',
                    {

                        miscPower: true,
                        desc: "Eat business end to heal HP equal to damage roll. Renders weapon unusable until it reforms, 24 hours later."
                    },
                    {
                        themes: { any: ['sweet'] }
                    }
                ),
                new ProviderElement<PassivePower, WeaponPowerCond>('expertise-alchemy',
                    {

                        miscPower: true,
                        desc: "Weapon is an expert alchemist.",
                    },
                    {
                        themes: { any: ['sour'] },
                        isSentient: true
                    }
                ),
                new ProviderElement<PassivePower, WeaponPowerCond>('resistance-acid',
                    {
                        miscPower: true,
                        desc: "Wielder takes half damage from corrosive chemicals."

                    },
                    {
                        themes: { any: ['sour'] }
                    }
                ),
                new ProviderElement<PassivePower, WeaponPowerCond>('immunity-acid',
                    {
                        miscPower: true,
                        desc: "Wielder is immune to the harmful effects of corrosive chemicals."
                    },
                    {
                        themes: { any: ['sour'] }
                    }
                ),
                new ProviderElement<PassivePower, WeaponPowerCond>('tastes-sour',
                    {
                        miscPower: true,
                        desc: "Licking the weapon cures scurvy. It tastes sour."
                    },
                    {
                        themes: { any: ['sour'] }
                    }
                ),
                new ProviderElement<PassivePower, WeaponPowerCond>('expertise-astrology',
                    {
                        miscPower: true,
                        desc: "Weapon is an expert astrologer.",
                    },
                    {
                        themes: { any: ['wizard'] },
                        isSentient: true
                    }
                ),
                new ProviderElement<PassivePower, WeaponPowerCond>('fire-magic-projectile',
                    {
                        miscPower: true,
                        desc: "If you are not wounded, the weapon can also fire a spectral copy of itself as a projectile attack. Damage as weapon, range as bow.",
                    },
                    {
                        themes: { any: ['wizard'], },
                        rarity: {
                            gte: "rare"
                        }
                    }
                ),
                new ProviderElement<PassivePower, WeaponPowerCond>('attack-wisps',
                    {
                        miscPower: true,
                        desc: "Each hit you land with the weapon generates a wisp. On your turn, you can launch any number of wisps at no cost. d4 damage, range as bow.",
                    },
                    {
                        themes: { any: ['wizard'] },
                        rarity: {
                            gte: "epic"
                        }
                    }
                ),
                new ProviderElement<PassivePower, WeaponPowerCond>('expertise-tinker',
                    {
                        miscPower: true,
                        desc: "Weapon is an expert tinkerer.",
                    },
                    {
                        isSentient: true,
                        themes: { any: ['steampunk'] },
                    }
                ),
                new ProviderElement<PassivePower, WeaponPowerCond>('integrated-compass',
                    {

                        miscPower: true,
                        desc: "Wielder always knows which way is north."
                    },
                    {
                        themes: { any: ['steampunk'] },
                    }
                ),
                new ProviderElement<PassivePower, WeaponPowerCond>('integrated-clock',
                    {
                        miscPower: true,
                        desc: "A widget on the weapon displays the time."
                    },
                    {
                        themes: { any: ['steampunk'] },
                    }
                ),
                new ProviderElement<PassivePower, WeaponPowerCond>('transform-bouquet',
                    {
                        miscPower: true,
                        desc: "Can transform into a bouquet of flowers."
                    },
                    {
                        themes: { any: ['nature'] },
                    }
                ),
                new ProviderElement<PassivePower, WeaponPowerCond>('shoot-water',
                    {
                        miscPower: true,
                        desc: "Can shoot an endless stream of water from its tip, pressure as garden hose."
                    },
                    {
                        themes: { any: ['cloud'] },
                    }
                ),
                new ProviderElement<PassivePower, WeaponPowerCond>('transform-umbrella',
                    {
                        miscPower: true,
                        desc: "Can transform into an umbrella."
                    },
                    {
                        themes: { any: ['cloud'] },
                    }
                ),
                new ProviderElement<PassivePower, WeaponPowerCond>('stealth-in-rough-weather',
                    {
                        miscPower: true,
                        desc: "Wielder gains a stealth bonus during rain & snow, as if invisible.",
                    },
                    {
                        themes: { any: ['cloud'] },
                        shapeFamily: {
                            any: [
                                "dagger",
                                "club"
                            ]
                        }
                    }
                ),
                new ProviderElement<PassivePower, WeaponPowerCond>('can-fly',
                    {
                        miscPower: true,
                        desc: "You can fly, as fast as you can walk.",
                    },
                    {
                        themes: { any: ['cloud', 'wizard'] },
                        rarity: {
                            gte: "legendary"
                        }
                    }
                ),
                new ProviderElement<PassivePower, WeaponPowerCond>('immunity-petrify',
                    {

                        miscPower: true,
                        desc: "Wielder cannot be petrified."
                    },
                    {
                        themes: { any: ['earth'] },
                    }
                ),
                new ProviderElement<PassivePower, WeaponPowerCond>('transform-pickaxe',
                    {
                        miscPower: true,
                        desc: "Can transform into a pickaxe."
                    },
                    {
                        themes: { any: ['earth'] },
                    }
                ),
                new ProviderElement<PassivePower, WeaponPowerCond>('expertise-jeweller',
                    {
                        miscPower: true,
                        desc: "Weapon is an expert jeweller. It can identify any gemstone.",
                    },
                    {
                        themes: { any: ['earth'] },
                    }
                ),
                new ProviderElement<PassivePower, WeaponPowerCond>('stats-as-shield',
                    {
                        miscPower: true,
                        desc: "Stats as (function as) a shield."
                    },
                    {
                        themes: { any: ['earth'] },
                    }
                ),
                new ProviderElement<PassivePower, WeaponPowerCond>('pertify-on-hit',
                    {

                        miscPower: true,
                        desc: "Unaware targets that are hit by the weapon must save or be petrified.",
                    },
                    {
                        themes: { any: ['earth'] },
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
                // new ProviderElement<MiscPower, WeaponPowerCond>('TODO',
                //     {

                //     },
                //     {
                //         themes: { any: ['TODO'] },
                //     }
                // ),
            ]
        },
        languages: {
            add: [
                ...(['The language of ice & snow.'].map(x => toLang('ice', x))),
                ...(['The language of fire.'].map(x => toLang('fire', x))),
                ...(['Angelic.'].map(x => toLang('light', x))),
                ...(['Demonic.'].map(x => toLang('dark', x)))
            ]
        },
        shapes: {
            add: [
                ...toProviderSource<string, (Pick<WeaponShape, 'particular'> & WeaponPowerCond) | string, WeaponShape>(
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
                            "Shortsword"
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
                            }
                        ],

                        "great-axe": [
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
                            },
                            {
                                particular: "Transforming Sniper Scythle",
                                rarity: {
                                    gte: "legendary"
                                }
                            }
                        ]
                    }, (k, shapeOrShapename) => {
                        switch (typeof shapeOrShapename) {
                            case 'string':
                                return new ProviderElement<WeaponShape, WeaponPowerCond>(`${k}-${shapeOrShapename}`,
                                    {
                                        particular: shapeOrShapename,
                                        group: k as WeaponShape['group']
                                    },
                                    {

                                    }
                                );
                            case 'object':
                                {
                                    const shape = shapeOrShapename as WeaponShape & WeaponPowerCond;
                                    if (shape !== null) {
                                        return new ProviderElement<WeaponShape, WeaponPowerCond>(`${k}-${shape.particular}`,
                                            {
                                                particular: shape.particular,
                                                group: k as WeaponShape['group']
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
                        throw new Error('invalid shape config');
                    }
                )
            ]
        }
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