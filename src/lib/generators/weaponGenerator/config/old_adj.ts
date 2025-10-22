...(
    [
        "Silver-Plated"
    ].map(adj => new ProviderElement<WeaponAdjective, WeaponPowerCond>(adj.toLowerCase(), { desc: adj }, {}))
),
            ...(
    [
        "bronze",
        "iron",
        "steel",
    ].map(adj => new ProviderElement<WeaponAdjective, WeaponPowerCond>(adj.toLowerCase(), { desc: adj, }, {}))
),
            ...(
    [
        "fiery",
        "blazing",
        "roaring",
        "crackling"
    ].map(adj => new ProviderElement<WeaponAdjective, WeaponPowerCond>(adj.toLowerCase(), { desc: adj }, { themes: { any: ["fire"] } }))
),
            ...(
    [
        "icy",
        "frigid",
        "silent",
        "polar",
        "Frostbound",
        "Icebound"
    ].map(adj => new ProviderElement<WeaponAdjective, WeaponPowerCond>(adj.toLowerCase(), { desc: adj }, { themes: { any: ["ice"] } }))
),
            ...(
    [
        "Shadow-Wreathed",
        "stygian",
        "abyssal",
        "spiked",
        "Blood-Stained"
    ].map(adj => new ProviderElement<WeaponAdjective, WeaponPowerCond>(adj.toLowerCase(), { desc: adj }, { themes: { any: ["dark"] } }))
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
    ].map(adj => new ProviderElement<WeaponAdjective, WeaponPowerCond>(adj.toLowerCase(), { desc: adj }, { themes: { any: ["light"] } }))
),
            ...(
    [
        "saccharine",
        "candied",
        "Honey-Glazed",
        "Sugar-Glazed",
        "Honey-Frosted",
        "Sugar-Frosted"
    ].map(adj => new ProviderElement<WeaponAdjective, WeaponPowerCond>(adj.toLowerCase(), { desc: adj }, { themes: { any: ["sweet"] } }))
),
            ...(
    [
        "corroded",
        "corrosive"
    ].map(adj => new ProviderElement<WeaponAdjective, WeaponPowerCond>(adj.toLowerCase(), { desc: adj }, { themes: { any: ["sour"] } }))
),
            ...(
    [
        "Silk-Wrapped",
    ].map(adj => new ProviderElement<WeaponAdjective, WeaponPowerCond>(adj.toLowerCase(), { desc: adj }, { themes: { any: ["wizard"] } }))
),
            ...(
    [
        "crystal",
        "amethyst"
    ].map(adj => new ProviderElement<WeaponAdjective, WeaponPowerCond>(adj.toLowerCase(), { desc: adj, }, { themes: { any: ["wizard"] } }))
),
            ...(
    [
        "brass",
        "clockwork"
    ].map(adj => new ProviderElement<WeaponAdjective, WeaponPowerCond>(adj.toLowerCase(), { desc: adj, }, { themes: { any: ["steampunk"] } }))
),
            ...(
    [
        "heavy",
        "rough",
        "slag"
    ].map(adj => new ProviderElement<WeaponAdjective, WeaponPowerCond>(adj.toLowerCase(), { desc: adj }, { themes: { any: ["earth"] } }))
),
            ...(
    [
        "gossamer",
        "rusted",
    ].map(adj => new ProviderElement<WeaponAdjective, WeaponPowerCond>(adj.toLowerCase(), { desc: adj }, { themes: { any: ["cloud"] } }))
),
    new ProviderElement<WeaponAdjective, WeaponPowerCond>("tin",

        {
            desc: "tin",
        },
        {

            rarity: {
                lte: "uncommon"
            }
        }
    ),
    new ProviderElement<WeaponAdjective, WeaponPowerCond>("copper",

        {
            desc: "copper",
        },
        {

            rarity: {
                lte: "uncommon"
            }
        }
    ),
    new ProviderElement<WeaponAdjective, WeaponPowerCond>("oak",

        {
            desc: "oak",
        },
        {

            rarity: {
                lte: "uncommon"
            }
        }),
    new ProviderElement<WeaponAdjective, WeaponPowerCond>("pine",

        {
            desc: "pine",
        },
        {

            rarity: {
                lte: "uncommon"
            }
        }
    ),
    new ProviderElement<WeaponAdjective, WeaponPowerCond>("sandstone",

        {
            desc: "sandstone",
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
    new ProviderElement<WeaponAdjective, WeaponPowerCond>("granite",

        {
            desc: "granite",
        },
        {

            rarity: {
                gte: "epic"
            }
        }
    ),
    new ProviderElement<WeaponAdjective, WeaponPowerCond>("alabaster",

        {
            desc: "alabaster",
        },
        {

            rarity: {
                gte: "epic"
            }
        }
    ),
    new ProviderElement<WeaponAdjective, WeaponPowerCond>("marble",

        {
            desc: "marble",
        },
        {

            rarity: {
                gte: "epic"
            }
        }
    ),
    new ProviderElement<WeaponAdjective, WeaponPowerCond>("silver",

        {
            desc: "silver",
        },
        {

            rarity: {
                gte: "epic"
            }
        }
    ),
    new ProviderElement<WeaponAdjective, WeaponPowerCond>("gold",

        {
            desc: "gold",
        },
        {

            rarity: {
                gte: "epic"
            }
        }
    ),
    new ProviderElement<WeaponAdjective, WeaponPowerCond>("black-iron",

        {
            desc: "black iron",
        },
        {

            rarity: {
                gte: "epic"
            }
        }
    ),
    new ProviderElement<WeaponAdjective, WeaponPowerCond>("silver",

        {
            desc: "silver",
        },
        {

            rarity: {
                gte: "epic"
            }
        }
    ),
    new ProviderElement<WeaponAdjective, WeaponPowerCond>("mythril",

        {
            desc: "mythril",
        },
        {

            rarity: {
                gte: "epic"
            }
        }
    ),
    new ProviderElement<WeaponAdjective, WeaponPowerCond>("adamant",

        {
            desc: "adamant"
        },
        {

            rarity: {
                gte: "epic"
            }
        }
    ),
    new ProviderElement<WeaponAdjective, WeaponPowerCond>("cobalt",

        {
            desc: "cobalt",
        },
        {

            rarity: {
                gte: "epic"
            }
        }
    ),
    new ProviderElement<WeaponAdjective, WeaponPowerCond>("radium",

        {
            desc: "radium"
        },
        {

            rarity: {
                gte: "legendary"
            }
        }
    ),
    new ProviderElement<WeaponAdjective, WeaponPowerCond>("diamond",
        {
            desc: "diamond",
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
    new ProviderElement<WeaponAdjective, WeaponPowerCond>("opal",
        {
            desc: "opal",
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
    new ProviderElement<WeaponAdjective, WeaponPowerCond>("ruby",
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
    new ProviderElement<WeaponAdjective, WeaponPowerCond>("emerald",
        {
            desc: "emerald",
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
    new ProviderElement<WeaponAdjective, WeaponPowerCond>("sapphire",
        {
            desc: "sapphire",
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
    new ProviderElement<WeaponAdjective, WeaponPowerCond>("flint",
        {
            desc: "flint",
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
    new ProviderElement<WeaponAdjective, WeaponPowerCond>("onyx",
        {
            desc: "onyx",
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
    new ProviderElement<WeaponAdjective, WeaponPowerCond>("quartz",
        {
            desc: "quartz",
        },
        {

            rarity: {
                gte: "epic"
            }
        }
    ),
    new ProviderElement<WeaponAdjective, WeaponPowerCond>("glass",
        {
            desc: "glass",
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
    new ProviderElement<WeaponAdjective, WeaponPowerCond>("lumensteel",
        {
            desc: "lumensteel",
        },
        {
            rarity: {
                gte: "epic"
            }
        }
    ),
// new ProviderElement<WeaponAdjective, WeaponPowerCond>("TODO",

// ),