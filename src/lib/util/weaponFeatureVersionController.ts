import type { TGenerator } from "$lib/generators/recursiveGenerator";
import { ProviderElement } from "$lib/generators/weaponGenerator/provider";
import { type ActivePower, type Language, type MiscPower, type Theme, type WeaponPowerCond, type WeaponShape } from "$lib/generators/weaponGenerator/weaponGeneratorTypes";
import { PrimitiveContainer, VersionController } from "./versionController";

type WeaponFeaturesCollection = {
    themes: PrimitiveContainer<Theme>;
    adjectives: ProviderElement<{ name: string }, WeaponPowerCond>
    actives: ProviderElement<ActivePower, WeaponPowerCond>;
    passives: ProviderElement<MiscPower, WeaponPowerCond>;
    languages: ProviderElement<Language, WeaponPowerCond>;
    shapes: ProviderElement<TGenerator<WeaponShape>, WeaponPowerCond>;
}

const toLang = (theme: Theme, lang: string) => new ProviderElement<Language, WeaponPowerCond>(lang.replaceAll(/\s/, '-').toLowerCase(), { language: true, desc: lang }, {
    themes: {
        any: [theme]
    }
})

const weaponFeatureVersionController = new VersionController<WeaponFeaturesCollection[keyof WeaponFeaturesCollection], WeaponFeaturesCollection>([
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
                    ].map(adj => new ProviderElement<{ name: string }, WeaponPowerCond>(adj.toLowerCase(), { name: adj }, {}))
                ),
                ...(
                    [
                        "fiery",
                        "blazing",
                        "roaring",
                        "crackling",
                        "ruby",
                        "opal"
                    ].map(adj => new ProviderElement<{ name: string }, WeaponPowerCond>(adj.toLowerCase(), { name: adj }, { themes: { any: ['fire'] } }))
                ),
                ...(
                    [
                        "icy",
                        "frigid",
                        "silent",
                        "polar",
                        "Frostbound",
                        "Icebound"
                    ].map(adj => new ProviderElement<{ name: string }, WeaponPowerCond>(adj.toLowerCase(), { name: adj }, { themes: { any: ['ice'] } }))
                ),
                ...(
                    [
                        "Shadow-Wreathed",
                        "stygian",
                        "abyssal",
                        "spiked",
                        "Blood-Stained"
                    ].map(adj => new ProviderElement<{ name: string }, WeaponPowerCond>(adj.toLowerCase(), { name: adj }, { themes: { any: ['dark'] } }))
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
                    ].map(adj => new ProviderElement<{ name: string }, WeaponPowerCond>(adj.toLowerCase(), { name: adj }, { themes: { any: ['light'] } }))
                ),
                ...(
                    [
                        "saccharine",
                        "candied",
                        "Honey-Glazed",
                        "Sugar-Glazed",
                        "Honey-Frosted",
                        "Sugar-Frosted"
                    ].map(adj => new ProviderElement<{ name: string }, WeaponPowerCond>(adj.toLowerCase(), { name: adj }, { themes: { any: ['sweet'] } }))
                ),
                ...(
                    [
                        "corroded",
                        "corrosive"
                    ].map(adj => new ProviderElement<{ name: string }, WeaponPowerCond>(adj.toLowerCase(), { name: adj }, { themes: { any: ['sour'] } }))
                ),
                ...(
                    [
                        "crystal",
                        "Silk-Wrapped",
                        "amethyst"
                    ].map(adj => new ProviderElement<{ name: string }, WeaponPowerCond>(adj.toLowerCase(), { name: adj }, { themes: { any: ['wizard'] } }))
                ),
                ...(
                    [
                        "brass",
                        "clockwork"
                    ].map(adj => new ProviderElement<{ name: string }, WeaponPowerCond>(adj.toLowerCase(), { name: adj }, { themes: { any: ['steampunk'] } }))
                ),
                ...(
                    [
                        "heavy",
                        "rough",
                        "slag"
                    ].map(adj => new ProviderElement<{ name: string }, WeaponPowerCond>(adj.toLowerCase(), { name: adj }, { themes: { any: ['earth'] } }))
                ),
                ...(
                    [
                        "gossamer",
                        "rusted",
                        "silver"
                    ].map(adj => new ProviderElement<{ name: string }, WeaponPowerCond>(adj.toLowerCase(), { name: adj }, { themes: { any: ['cloud'] } }))
                ),
                new ProviderElement<{ name: string }, WeaponPowerCond>('tin',

                    {
                        "name": "tin"
                    },
                    {
                        "rarity": {
                            "lte": "uncommon"
                        }
                    }
                ),
                new ProviderElement<{ name: string }, WeaponPowerCond>('copper',

                    {
                        "name": "copper"
                    },
                    {
                        "rarity": {
                            "lte": "uncommon"
                        }
                    }
                ),
                new ProviderElement<{ name: string }, WeaponPowerCond>('oak',

                    {
                        "name": "oak"
                    },
                    {
                        "rarity": {
                            "lte": "uncommon"
                        }
                    }),
                new ProviderElement<{ name: string }, WeaponPowerCond>('pine',

                    {
                        "name": "pine"
                    },
                    {
                        "rarity": {
                            "lte": "uncommon"
                        }
                    }
                ),
                new ProviderElement<{ name: string }, WeaponPowerCond>('sandstone',

                    {
                        "name": "sandstone"
                    },
                    {
                        "rarity": {
                            "lte": "uncommon"
                        },
                        "themes": {
                            "any": [
                                "fire",
                                "earth"
                            ]
                        }
                    },
                ),
                new ProviderElement<{ name: string }, WeaponPowerCond>('granite',

                    {
                        "name": "granite"
                    },
                    {
                        "rarity": {
                            "gte": "epic"
                        }
                    }
                ),
                new ProviderElement<{ name: string }, WeaponPowerCond>('alabaster',

                    {
                        "name": "alabaster"
                    },
                    {
                        "rarity": {
                            "gte": "epic"
                        }
                    }
                ),
                new ProviderElement<{ name: string }, WeaponPowerCond>('marble',

                    {
                        "name": "marble"
                    },
                    {
                        "rarity": {
                            "gte": "epic"
                        }
                    }
                ),
                new ProviderElement<{ name: string }, WeaponPowerCond>('silver',

                    {
                        "name": "silver"
                    },
                    {
                        "rarity": {
                            "gte": "epic"
                        }
                    }
                ),
                new ProviderElement<{ name: string }, WeaponPowerCond>('gold',

                    {
                        "name": "gold"
                    },
                    {
                        "rarity": {
                            "gte": "epic"
                        }
                    }
                ),
                new ProviderElement<{ name: string }, WeaponPowerCond>('black-iron',

                    {
                        "name": "black iron"
                    },
                    {
                        "rarity": {
                            "gte": "epic"
                        }
                    }
                ),
                new ProviderElement<{ name: string }, WeaponPowerCond>('silver',

                    {
                        "name": "silver"
                    },
                    {
                        "rarity": {
                            "gte": "epic"
                        }
                    }
                ),
                new ProviderElement<{ name: string }, WeaponPowerCond>('mythril',

                    {
                        "name": "mythril"
                    },
                    {
                        "rarity": {
                            "gte": "epic"
                        }
                    }
                ),
                new ProviderElement<{ name: string }, WeaponPowerCond>('adamant',

                    {
                        "name": "adamant"
                    },
                    {
                        "rarity": {
                            "gte": "epic"
                        }
                    }
                ),
                new ProviderElement<{ name: string }, WeaponPowerCond>('cobalt',

                    {
                        "name": "cobalt"
                    },
                    {
                        "rarity": {
                            "gte": "epic"
                        }
                    }
                ),
                new ProviderElement<{ name: string }, WeaponPowerCond>('radium',

                    {
                        "name": "radium"
                    },
                    {
                        "rarity": {
                            "gte": "legendary"
                        }
                    }
                ),
                new ProviderElement<{ name: string }, WeaponPowerCond>('diamond',
                    {
                        "name": "diamond"
                    },
                    {
                        "rarity": {
                            "gte": "epic"
                        },
                        "themes": {
                            "any": [
                                "light",
                                "earth"
                            ]
                        }
                    },
                ),
                new ProviderElement<{ name: string }, WeaponPowerCond>('ruby',
                    {
                        "name": "ruby"
                    },
                    {
                        "rarity": {
                            "gte": "epic"
                        },
                        "themes": {
                            "any": [
                                "fire",
                                "earth"
                            ]
                        },
                    }
                ),
                new ProviderElement<{ name: string }, WeaponPowerCond>('emerald',
                    {
                        "name": "emerald"
                    },
                    {
                        "rarity": {
                            "gte": "epic"
                        },
                        "themes": {
                            "any": [
                                "fire",
                                "earth",
                                "nature"
                            ]
                        }
                    },
                ),
                new ProviderElement<{ name: string }, WeaponPowerCond>('sapphire',
                    {
                        "name": "sapphire"
                    },
                    {
                        "rarity": {
                            "gte": "epic"
                        },
                        "themes": {
                            "any": [
                                "light",
                                "cloud",
                                "earth"
                            ]
                        }
                    },
                ),
                new ProviderElement<{ name: string }, WeaponPowerCond>('flint',
                    {
                        "name": "flint"
                    },
                    {
                        "rarity": {
                            "lte": "uncommon"
                        },
                        "themes": {
                            "any": [
                                "fire",
                                "dark",
                                "earth"
                            ]
                        }
                    },
                ),
                new ProviderElement<{ name: string }, WeaponPowerCond>('onyx',
                    {
                        "name": "onyx"
                    },
                    {
                        "rarity": {
                            "gte": "epic"
                        },
                        "themes": {
                            "any": [
                                "fire",
                                "dark",
                                "earth"
                            ]
                        }
                    },
                ),
                new ProviderElement<{ name: string }, WeaponPowerCond>('quartz',
                    {
                        "name": "quartz"
                    },
                    {
                        "rarity": {
                            "gte": "epic"
                        }
                    }
                ),
                new ProviderElement<{ name: string }, WeaponPowerCond>('glass',
                    {
                        "name": "glass"
                    },
                    {
                        "rarity": {
                            "gte": "epic"
                        },
                        "themes": {
                            "any": [
                                "ice",
                                "fire",
                                "light",
                                "cloud"
                            ]
                        }
                    },
                ),
                new ProviderElement<{ name: string }, WeaponPowerCond>('lumensteel',
                    {
                        "name": "lumensteel"
                    },
                    {
                        "rarity": {
                            "gte": "epic"
                        }
                    }
                ),
                // new ProviderElement<{ name: string }, WeaponPowerCond>('TODO',

                // ),
            ]
        },
        actives: {
            add: [
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
                        "rarity": {
                            "gte": "rare"
                        }
                    }),
                new ProviderElement<ActivePower, WeaponPowerCond>('control-hot-weather',
                    {
                        "desc": "Control Weather",
                        "cost": 2,
                        "additionalNotes": [
                            "Must move conditions towards heatwave."
                        ],
                    },
                    {
                        themes: { any: ['fire'] },
                        "rarity": {
                            "lte": "rare"
                        }
                    }),
                new ProviderElement<ActivePower, WeaponPowerCond>('control-flames',
                    {
                        "desc": "Control Flames",
                        "cost": 1,
                        "additionalNotes": [
                            "Flames larger than wielder submit only after a save."
                        ],
                    },
                    {
                        themes: { any: ['fire'] },
                        "rarity": {
                            "lte": "rare"
                        }
                    }),
                new ProviderElement<ActivePower, WeaponPowerCond>('summon-fire-elemental',
                    {
                        "desc": "Summon Fire Elemental",
                        "cost": 6,
                        "additionalNotes": [
                            "Dissipates after 1 hour."
                        ],
                    },
                    {
                        themes: { any: ['fire'] },
                        "rarity": {
                            "gte": "epic"
                        }
                    }),
                new ProviderElement<ActivePower, WeaponPowerCond>('wall-of-ice',
                    {
                        "desc": "Wall of Ice",
                        "cost": 4,
                    },
                    {
                        themes: { any: ['ice'] },
                        "rarity": {
                            "gte": "rare"
                        }
                    }),
                new ProviderElement<ActivePower, WeaponPowerCond>('control-cold-weather',
                    {
                        "desc": "Control Weather",
                        "cost": 3,
                        "additionalNotes": [
                            "Must move conditions towards blizzard."
                        ],
                    },
                    {
                        themes: { any: ['ice'] },
                        "rarity": {
                            "lte": "rare"
                        }
                    }),
                new ProviderElement<ActivePower, WeaponPowerCond>('ice-strike',
                    {
                        "desc": "Chilling Strike",
                        "cost": 2,
                        "additionalNotes": [
                            "Upon hitting, you can choose to infuse the attack. Characters must save or be frozen solid next turn."
                        ],
                    },
                    {
                        themes: { any: ['ice'] },
                        "rarity": {
                            "lte": "rare"
                        }
                    }),
                new ProviderElement<ActivePower, WeaponPowerCond>('summon-ice-elemental',
                    {
                        "desc": "Summon Ice Elemental",
                        "cost": 6,
                        "additionalNotes": [
                            "Dissipates after 1 hour."
                        ],
                    },
                    {
                        themes: { any: ['ice'] },
                        "rarity": {
                            "gte": "epic"
                        }
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('commune-demon',
                    {
                        "desc": "Commune With Demon",
                        "cost": 2,
                    },
                    {
                        themes: { any: ['dark'] },
                        "rarity": {
                            "gte": "uncommon"
                        }
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('turn-holy',
                    {
                        "desc": "Turn Priests & Angels",
                        "cost": 2,
                    },
                    {
                        themes: { any: ['dark'] },
                        "rarity": {
                            "gte": "uncommon"
                        }
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('darkness',
                    {
                        "desc": "Darkness",
                        "cost": 1
                    },
                    {
                        themes: { any: ['dark'] },
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('summon-demon',
                    {
                        "desc": "Summon Demon",
                        "cost": 6,
                        "additionalNotes": [
                            "Returns to hell after 1 hour."
                        ],
                    },
                    {
                        themes: { any: ['dark'] },
                        "rarity": {
                            "gte": "epic"
                        }
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('commune-divinity',
                    {
                        "desc": "Commune With Divinity",
                        "cost": 2,
                    },
                    {
                        themes: { any: ['light'] },
                        "rarity": {
                            "gte": "uncommon"
                        }
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('turn-undead',
                    {
                        "desc": "Turn Undead",
                        "cost": 1
                    },
                    {
                        themes: { any: ['light'] },
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('light',
                    {
                        "desc": "Light",
                        "cost": 1
                    },
                    {
                        themes: { any: ['light'] },
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('summon-angel',
                    {
                        "desc": "Summon Angel",
                        "cost": 6,
                        "additionalNotes": [
                            "Returns to heaven after 1 hour."
                        ],
                    },
                    {
                        themes: { any: ['light'] },
                        "rarity": {
                            "gte": "epic"
                        }
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('charm-person',
                    {
                        "desc": "Charm Person",
                        "cost": 2
                    },
                    {
                        themes: { any: ['sweet'] },
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('sweetberry',
                    {
                        "desc": "Sweetberry",
                        "cost": 1,
                        "additionalNotes": [
                            "Create a small berry, stats as healing potion."
                        ]
                    },
                    {
                        themes: { any: ['sweet'] },
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('sugar-spray',
                    {
                        "desc": "Sugar Spray",
                        "cost": 1,
                        "additionalNotes": [
                            "Sprays a sweet and sticky syrup, enough to coat the floor of a small room. Makes movement difficult."
                        ]
                    },
                    {
                        themes: { any: ['sweet'] },
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('caustic-strike',
                    {
                        "desc": "Caustic Strike",
                        "cost": 2,
                        "additionalNotes": [
                            "Upon hitting, you can choose to infuse the attack. Melts objects, or damages armor of characters."
                        ]
                    },
                    {
                        themes: { any: ['sour'] },
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('locate-lemon',
                    {
                        "desc": "Locate Lemon",
                        "cost": 1,
                        "additionalNotes": [
                            "Wielder learns the exact location of the closest lemon."
                        ]
                    },
                    {
                        themes: { any: ['sour'] },
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('cause-nausea',
                    {
                        "desc": "Cause Nausea",
                        "cost": 1,
                        "additionalNotes": [
                            "Target must save or waste their turn vomiting."
                        ]
                    },
                    {
                        themes: { any: ['sour'] },
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('summon-acid-elemental',
                    {
                        "desc": "Summon Acid Elemental",
                        "cost": 6,
                        "additionalNotes": [
                            "Dissipates after 1 hour."
                        ],
                    },
                    {
                        themes: { any: ['sour'] },
                        "rarity": {
                            "gte": "epic"
                        }
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('magic-missile',
                    {
                        "desc": "Magic Missile",
                        "cost": 2
                    },
                    {
                        themes: { any: ['wizard'] },
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('magic-shield',
                    {
                        "desc": "Magic Shield",
                        "cost": 2
                    },
                    {
                        themes: { any: ['wizard'] },
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('magic-parry',
                    {
                        "desc": "Magic Parry",
                        "cost": "equal to spell's level",
                        "additionalNotes": [
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
                        "desc": "Instant Message",
                        "cost": 1,
                        "additionalNotes": [
                            "Point the weapon at someone in your line of sight, send them a telepathic message."
                        ]
                    },
                    {
                        themes: { any: ['wizard'] },
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('create-wizard-servant',
                    {
                        "desc": "Create Servant",
                        "cost": 3,
                        "additionalNotes": [
                            "Create an small ichorous being that obeys you without question. It dissolves into sludge after 2d6 days."
                        ]
                    },
                    {
                        themes: { any: ['wizard'] },
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('summon-steam-elemental',
                    {
                        "desc": "Summon Steam Elemental",
                        "cost": 6,
                        "additionalNotes": [
                            "Dissipates after 1 hour."
                        ],
                    },
                    {
                        themes: { any: ['steampunk'] },
                        "rarity": {
                            "gte": "epic"
                        }
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('power-machine',
                    {
                        "desc": "Power Machine",
                        "cost": 1,
                        "additionalNotes": [
                            "Touching the weapon to a machine causes it to activate under magical power. It operates for 24 hours."
                        ]
                    },
                    {
                        themes: { any: ['steampunk'] },
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('summon-water-elemental',
                    {
                        "desc": "Summon Water Elemental",
                        "cost": 6,
                        "additionalNotes": [
                            "Dissipates after 1 hour."
                        ],
                    },
                    {
                        themes: { any: ['cloud'] },
                        "rarity": {
                            "gte": "epic"
                        }
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('zephyr-strike',
                    {
                        "desc": "Zephyr Strike",
                        "cost": 2,
                        "additionalNotes": [
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
                        "desc": "Wind Blast",
                        "cost": 2,
                        "additionalNotes": [
                            "Characters in melee range must save, or be thrown back out of melee range and knocked down."
                        ]
                    },
                    {
                        themes: { any: ['cloud'] },
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('summon-lightning',
                    {
                        "desc": "Summon Lightning",
                        "cost": 4,
                        "additionalNotes": [
                            "Summon a bolt of lightning to strike something in your line of sight."
                        ]
                    },
                    {
                        themes: { any: ['cloud'] },
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('wall-of-stone',
                    {
                        "desc": "Wall of stone",
                        "cost": 4,
                    },
                    {
                        themes: { any: ['earth'] },
                        "rarity": {
                            "gte": "rare"
                        }
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('petrify-person',
                    {
                        "desc": "Petrify Person",
                        "cost": 5,
                    },
                    {
                        themes: { any: ['earth'] },
                        "rarity": {
                            "gte": "rare"
                        }
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('cure-petrify',
                    {
                        "desc": "Cure Petrification",
                        "cost": 2
                    },
                    {
                        themes: { any: ['earth'] },
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('summon-earth-elemental',
                    {
                        "desc": "Summon Earth Elemental",
                        "cost": 6,
                        "additionalNotes": [
                            "Crumbles after 1 hour."
                        ],
                    },
                    {
                        themes: { any: ['earth'] },
                        "rarity": {
                            "gte": "epic"
                        }
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('instant-tree',
                    {
                        "desc": "Instant Tree",
                        "cost": 1
                    },
                    {
                        themes: { any: ['nature'] },
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('summon-chomp-flower',
                    {
                        "desc": "Instant Chomp-Flower",
                        "cost": 2,
                        "additionalNotes": [
                            "Stats as shark but can't move."
                        ]
                    },
                    {
                        themes: { any: ['nature'] },
                    }
                ),
                new ProviderElement<ActivePower, WeaponPowerCond>('vine-hook',
                    {
                        "desc": "Vine Hook",
                        "cost": 1,
                        "additionalNotes": [
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
                new ProviderElement<MiscPower, WeaponPowerCond>('move-silently',
                    {
                        "miscPower": true,
                        "desc": "Wielder is able to move completely silently.",
                    },
                    {
                        "shapeFamily": {
                            "any": [
                                "dagger",
                                "club"
                            ]
                        },
                        "rarity": {
                            "gte": "epic"
                        }
                    }
                ),
                new ProviderElement<MiscPower, WeaponPowerCond>('magically-hovers',
                    {
                        "miscPower": true,
                        "desc": "Can hover in the air to attack for you hands free. Commanding a floating weapon uses the same rules as followers / retainers.",
                    },
                    {
                        "rarity": {
                            "gte": "rare"
                        },
                        "themes": {
                            "any": [
                                "cloud",
                                "wizard"
                            ]
                        }
                    }
                ),
                new ProviderElement<MiscPower, WeaponPowerCond>('resistance-fire',
                    {
                        "miscPower": true,
                        "desc": "Wielder takes half damage from fire."
                    },
                    {
                        themes: { any: ['fire'] }
                    }
                ),
                new ProviderElement<MiscPower, WeaponPowerCond>('immunity-fire',
                    {

                        "miscPower": true,
                        "desc": "Wielder cannot be harmed by fire.",
                    },
                    {
                        themes: { any: ['fire'] },
                        "rarity": {
                            "gte": "rare"
                        }
                    }
                ),
                new ProviderElement<MiscPower, WeaponPowerCond>('damage-bonus-fire',
                    {
                        "miscPower": true,
                        "desc": "Wreathed in flames, glows like a torch",
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
                new ProviderElement<MiscPower, WeaponPowerCond>('expertise-blacksmithing',
                    {

                        "miscPower": true,
                        "desc": "Weapon is an expert blacksmith.",
                    },
                    {
                        themes: { any: ['fire'] },
                        "isSentient": true
                    }
                ),
                new ProviderElement<MiscPower, WeaponPowerCond>('resistance-cold',
                    {

                        "miscPower": true,
                        "desc": "Wielder takes half damage from ice & cold."
                    },
                    {
                        themes: { any: ['ice'] }
                    }
                ),
                new ProviderElement<MiscPower, WeaponPowerCond>('immunity-cold',
                    {
                        "miscPower": true,
                        "desc": "Wielder cannot be harmed by ice & cold."
                    },
                    {
                        themes: { any: ['ice'] }
                    }
                ),
                new ProviderElement<MiscPower, WeaponPowerCond>('damage-bonus-ice-blunt',
                    {
                        "miscPower": true,
                        "desc": "Wreathed in frigid mist.",
                        "bonus": {
                            "addDamageDie": {
                                "d6": 1
                            }
                        },
                    },
                    {
                        themes: { any: ['ice'] },
                        "shapeFamily": {
                            "none": [
                                "dagger",
                                "sword",
                                "greatsword"
                            ]
                        }
                    }
                ),
                new ProviderElement<MiscPower, WeaponPowerCond>('damage-bonus-ice-sharp',
                    {
                        "miscPower": true,
                        "desc": "Wreathed in ice, always frozen into its sheath. Requires a strength save to draw.",
                        "bonus": {
                            "addDamageDie": {
                                "d10": 1
                            }
                        },
                    },
                    {
                        themes: { any: ['ice'] },
                        "shapeFamily": {
                            "any": [
                                "dagger",
                                "sword",
                                "greatsword"
                            ]
                        }
                    }
                ),
                new ProviderElement<MiscPower, WeaponPowerCond>('sense-cold-weather',
                    {
                        "miscPower": true,
                        "desc": "1-in-2 chance to sense icy weather before it hits, giving just enough time to escape."
                    },
                    {
                        themes: { any: ['ice'] }
                    }
                ),
                new ProviderElement<MiscPower, WeaponPowerCond>('walk-on-ice',
                    {

                        "miscPower": true,
                        "desc": "Wielder can walk on any kind of ice without breaking it."
                    },
                    {
                        themes: { any: ['ice'] }
                    }
                ),
                new ProviderElement<MiscPower, WeaponPowerCond>('vibe-menacing',
                    {

                        "miscPower": true,
                        "desc": "Menacing aura. Bonus to saves to frighten & intimidate."
                    },
                    {
                        themes: { any: ['dark'] }
                    }
                ),
                new ProviderElement<MiscPower, WeaponPowerCond>('trap-souls',
                    {

                        "miscPower": true,
                        "desc": "Traps the souls of its victims. They haunt the weapon, and obey the wielder's commands."
                    },
                    {
                        themes: { any: ['dark'] }
                    }
                ),
                new ProviderElement<MiscPower, WeaponPowerCond>('damage-bonus-dark-flame',
                    {
                        "miscPower": true,
                        "desc": "Wreathed in lightless black flames.",
                        "bonus": {
                            "addDamageDie": {
                                "d6": 1
                            }
                        }
                    },
                    {
                        themes: { any: ['dark'] }
                    }
                ),
                new ProviderElement<MiscPower, WeaponPowerCond>('resistance-radiant',
                    {
                        "miscPower": true,
                        "desc": "Wielder takes half damage from rays & beams."

                    },
                    {
                        themes: { any: ['light'] }
                    }
                ),
                new ProviderElement<MiscPower, WeaponPowerCond>('immunity-radiant',
                    {

                        "miscPower": true,
                        "desc": "Wielder is immune to the harmful effects of rays & beams."
                    },
                    {
                        themes: { any: ['light'] }
                    }
                ),
                new ProviderElement<MiscPower, WeaponPowerCond>('stats-as-mirror',
                    {
                        "miscPower": true,
                        "desc": "Extremely shiny, functions as a mirror."
                    },
                    {
                        themes: { any: ['light'] }
                    }
                ),
                new ProviderElement<MiscPower, WeaponPowerCond>('vibe-wholesome',
                    {
                        "miscPower": true,
                        "desc": "Wielder has a wholesome aura. Bonus to saves to spread cheer and/or appear nonthreatening."
                    },
                    {
                        themes: { any: ['light', 'sweet'] }
                    }
                ),
                new ProviderElement<MiscPower, WeaponPowerCond>('TODO',
                    {
                        "miscPower": true,
                        "desc": "Weapon is an expert chef.",
                    },
                    {
                        themes: { any: ['sweet'] },
                        isSentient: true
                    }
                ),
                new ProviderElement<MiscPower, WeaponPowerCond>('magically-learn-dessert-recipes',
                    {
                        "miscPower": true,
                        "desc": "The wielder magically knows the recipe of any dessert they taste."
                    },
                    {
                        themes: { any: ['sweet'] }
                    }
                ),
                new ProviderElement<MiscPower, WeaponPowerCond>('eat-to-heal',
                    {

                        "miscPower": true,
                        "desc": "Eat business end to heal HP equal to damage roll. Renders weapon unusable until it reforms, 24 hours later."
                    },
                    {
                        themes: { any: ['sweet'] }
                    }
                ),
                new ProviderElement<MiscPower, WeaponPowerCond>('expertise-alchemy',
                    {

                        "miscPower": true,
                        "desc": "Weapon is an expert alchemist.",
                    },
                    {
                        themes: { any: ['sour'] },
                        isSentient: true
                    }
                ),
                new ProviderElement<MiscPower, WeaponPowerCond>('resistance-acid',
                    {
                        "miscPower": true,
                        "desc": "Wielder takes half damage from corrosive chemicals."

                    },
                    {
                        themes: { any: ['sour'] }
                    }
                ),
                new ProviderElement<MiscPower, WeaponPowerCond>('immunity-acid',
                    {
                        "miscPower": true,
                        "desc": "Wielder is immune to the harmful effects of corrosive chemicals."
                    },
                    {
                        themes: { any: ['sour'] }
                    }
                ),
                new ProviderElement<MiscPower, WeaponPowerCond>('tastes-sour',
                    {
                        "miscPower": true,
                        "desc": "Licking the weapon cures scurvy. It tastes sour."
                    },
                    {
                        themes: { any: ['sour'] }
                    }
                ),
                new ProviderElement<MiscPower, WeaponPowerCond>('expertise-astrology',
                    {
                        "miscPower": true,
                        "desc": "Weapon is an expert astrologer.",
                    },
                    {
                        themes: { any: ['wizard'] },
                        "isSentient": true
                    }
                ),
                new ProviderElement<MiscPower, WeaponPowerCond>('fire-magic-projectile',
                    {
                        "miscPower": true,
                        "desc": "If you are not wounded, the weapon can also fire a spectral copy of itself as a projectile attack. Damage as weapon, range as bow.",
                    },
                    {
                        themes: { any: ['wizard'], },
                        "rarity": {
                            "gte": "rare"
                        }
                    }
                ),
                new ProviderElement<MiscPower, WeaponPowerCond>('attack-wisps',
                    {
                        "miscPower": true,
                        "desc": "Each hit you land with the weapon generates a wisp. On your turn, you can launch any number of wisps at no cost. d4 damage, range as bow.",
                    },
                    {
                        themes: { any: ['wizard'] },
                        "rarity": {
                            "gte": "epic"
                        }
                    }
                ),
                new ProviderElement<MiscPower, WeaponPowerCond>('expertise-tinker',
                    {
                        "miscPower": true,
                        "desc": "Weapon is an expert tinkerer.",
                    },
                    {
                        "isSentient": true,
                        themes: { any: ['steampunk'] },
                    }
                ),
                new ProviderElement<MiscPower, WeaponPowerCond>('integrated-compass',
                    {

                        "miscPower": true,
                        "desc": "Wielder always knows which way is north."
                    },
                    {
                        themes: { any: ['steampunk'] },
                    }
                ),
                new ProviderElement<MiscPower, WeaponPowerCond>('integrated-clock',
                    {
                        "miscPower": true,
                        "desc": "A widget on the weapon displays the time."
                    },
                    {
                        themes: { any: ['steampunk'] },
                    }
                ),
                new ProviderElement<MiscPower, WeaponPowerCond>('transform-bouquet',
                    {
                        "miscPower": true,
                        "desc": "Can transform into a bouquet of flowers."
                    },
                    {
                        themes: { any: ['nature'] },
                    }
                ),
                new ProviderElement<MiscPower, WeaponPowerCond>('shoot-water',
                    {
                        "miscPower": true,
                        "desc": "Can shoot an endless stream of water from its tip, pressure as garden hose."
                    },
                    {
                        themes: { any: ['cloud'] },
                    }
                ),
                new ProviderElement<MiscPower, WeaponPowerCond>('transform-umbrella',
                    {
                        "miscPower": true,
                        "desc": "Can transform into an umbrella."
                    },
                    {
                        themes: { any: ['cloud'] },
                    }
                ),
                new ProviderElement<MiscPower, WeaponPowerCond>('stealth-in-rough-weather',
                    {
                        "miscPower": true,
                        "desc": "Wielder gains a stealth bonus during rain & snow, as if invisible.",
                    },
                    {
                        themes: { any: ['cloud'] },
                        "shapeFamily": {
                            "any": [
                                "dagger",
                                "club"
                            ]
                        }
                    }
                ),
                new ProviderElement<MiscPower, WeaponPowerCond>('can-fly',
                    {
                        "miscPower": true,
                        "desc": "You can fly, as fast as you can walk.",
                    },
                    {
                        themes: { any: ['cloud', 'wizard'] },
                        "rarity": {
                            "gte": "legendary"
                        }
                    }
                ),
                new ProviderElement<MiscPower, WeaponPowerCond>('immunity-petrify',
                    {

                        "miscPower": true,
                        "desc": "Wielder cannot be petrified."
                    },
                    {
                        themes: { any: ['earth'] },
                    }
                ),
                new ProviderElement<MiscPower, WeaponPowerCond>('transform-pickaxe',
                    {
                        "miscPower": true,
                        "desc": "Can transform into a pickaxe."
                    },
                    {
                        themes: { any: ['earth'] },
                    }
                ),
                new ProviderElement<MiscPower, WeaponPowerCond>('expertise-jeweller',
                    {
                        "miscPower": true,
                        "desc": "Weapon is an expert jeweller. It can identify any gemstone.",
                    },
                    {
                        themes: { any: ['earth'] },
                    }
                ),
                new ProviderElement<MiscPower, WeaponPowerCond>('stats-as-shield',
                    {
                        "miscPower": true,
                        "desc": "Stats as (function as) a shield."
                    },
                    {
                        themes: { any: ['earth'] },
                    }
                ),
                new ProviderElement<MiscPower, WeaponPowerCond>('pertify-on-hit',
                    {

                        "miscPower": true,
                        "desc": "Unaware targets that are hit by the weapon must save or be petrified.",
                    },
                    {
                        themes: { any: ['earth'] },
                        "rarity": {
                            "gte": "rare"
                        },
                        "shapeFamily": {
                            "any": [
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

            ]
        }
    }
]);