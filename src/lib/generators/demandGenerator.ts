import seedrandom from "seedrandom";
import { mkGen, type Generator } from "./recursiveGenerator";
import { ProviderElement } from "./weaponGenerator/provider";
import { WeaponFeatureProvider } from "./weaponGenerator/weaponGeneratorLogic";
import type { Weapon, WeaponPowerCond, WeaponViewModel } from "./weaponGenerator/weaponGeneratorTypes";

interface Demand {
    desc: Generator<string>;
}

const demands = [
    new ProviderElement<Demand, WeaponPowerCond>('demand-poke-it',
        {
            desc: mkGen("Interact With Specific Dungeon Object (d6 charges).")
        },
        {}
    ),
    new ProviderElement<Demand, WeaponPowerCond>('demand-defeat-foe',
        {
            desc: mkGen("Defeat Specific Foe (d6 charges).")
        },
        {
            personality: {
                none: [{ desc: "Pacifist" }]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('demand-defeat-foe',
        {
            desc: mkGen("Display of Wielder's Loyalty (d6 charges).")
        },
        {
            personality: {
                any: [{ desc: "Jealous" }]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('demand-adornments',
        {
            desc: mkGen("New Adornments (1 charge/100 GP spent).")
        },
        {
            personality: {
                any: [{ desc: "Greedy" }]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('demand-interesting-attack',
        {
            desc: mkGen("Perform an Interesting Attack (d4 charges).")
        },
        {
            personality: {
                any: [{ desc: "Standoffish" }, { desc: "Short Fuse" }, { desc: "Haughty" }, { desc: 'Antagonistic' }]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('demand-debate',
        {
            desc: mkGen("Destroy Foe in Debate (d6 charges).")
        },
        {
            personality: {
                any: [{ desc: "Logical" }]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('demand-book',
        {
            desc: mkGen("New Reading Material (d4 charges).")
        },
        {
            personality: {
                any: [{ desc: "Curious" }, { desc: "Know-it-All" }]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('demand-spellbook',
        {
            desc: mkGen("To be Left Alone This Session (d12 charges).")
        },
        {
            personality: {
                any: [{ desc: "Depressive" }, { desc: "Lazy" }]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('demand-spellbook',
        {
            desc: mkGen("Acquire New Spell (all charges).")
        },
        {
            personality: {
                any: [{ desc: "Curious" }]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('demand-tourism',
        {
            desc: mkGen("Experience New Culture (all charges).")
        },
        {
            personality: {
                any: [{ desc: "Open-Minded" }, { desc: "Curious" }]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('demand-tech',
        {
            desc: mkGen("Acquire New Technology (all charges).")
        },
        {
            themes: {
                any: ["steampunk"]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('demand-material',
        {
            desc: mkGen("Craft Item Using Rare Material (all charges).")
        },
        {
            personality: {
                any: [{ desc: "Industrious" }]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('demand-destruction',
        {
            desc: mkGen("Destroy Specific Object (d4 charges).")
        },
        {
            personality: {
                any: [{ desc: "Vengeful" }, { desc: "Cruel" }, { desc: "Merciless" }, { desc: "Standoffish" }, { desc: "Short Fuse" }]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('demand-escort-mission',
        {
            desc: mkGen("Protect Specific NPC This Scene (d4 charges).")
        },
        {
            personality: {
                any: [{ desc: "Kind" }, { desc: "Compassionate" }]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('demand-drama',
        {
            desc: mkGen("Incite Conflict With Specific NPC (d6 charges).")
        },
        {
            personality: {
                any: [{ desc: "Vengeful" }, { desc: "Cruel" }, { desc: "Merciless" }, { desc: "Standoffish" }, { desc: "Short Fuse" }]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('demand-pyromania',
        {
            desc: mkGen("Immediately Start a Fire (d4 charges).")
        },
        {
            themes: {
                any: ["fire"]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('demand-cryomania',
        {
            desc: mkGen("Cool Down Current Location (d4 charges).")
        },
        {
            themes: {
                any: ["ice"]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('demand-release-beast',
        {
            desc: mkGen("Release Specific Animal From Captivity (d4 charges).")
        },
        {
            themes: {
                any: ["nature"]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('demand-pet-dog',
        {
            desc: mkGen("Pet Specific Animal (charges based on danger).")
        },
        {
            themes: {
                any: ["nature"]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('demand-treehugger',
        {
            desc: mkGen("Hug Specific Tree (d4 charges).")
        },
        {
            themes: {
                any: ["nature"]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('demand-plant-a-tree-under-whose-shade-you-will-never-rest',
        {
            desc: mkGen("Plant Tree (d4 charges).")
        },
        {
            themes: {
                any: ["nature"]
            }
        }
    ),

    new ProviderElement<Demand, WeaponPowerCond>('demand-legit-temple',
        {
            desc: mkGen("Make Haste to Closest Temple (all charges).")
        },
        {
            themes: {
                any: ["light"]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('demand-simp-god',
        {
            desc: mkGen("Make Offering to God (all charges).")
        },
        {
            themes: {
                any: ["light"]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('demnand-drama-religious-fire',
        {
            desc: mkGen("Insult Religion of Infidel (all charges).")
        },
        {
            themes: {
                all: ["light"]
            },
            personality: {
                any: [{ desc: "Vengeful" }, { desc: "Cruel" }, { desc: "Merciless" }, { desc: "Standoffish" }, { desc: "Short Fuse" }]
            }
        }
    ),

    new ProviderElement<Demand, WeaponPowerCond>('demand-sacrifice-acid',
        {
            desc: mkGen("Dissolve Someone in Acid (1 charge per victim HD).")
        },
        {
            themes: {
                all: ["sour", "dark"],
            },
            personality: {
                any: [{ desc: "Vengeful" }, { desc: "Cruel" }, { desc: "Merciless" }, { desc: "Standoffish" }, { desc: "Short Fuse" }]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('demand-sacrifice-fire',
        {
            desc: mkGen("Burn Someone Alive (1 charge per victim HD).")
        },
        {
            themes: {
                all: ["fire", "dark"]
            },
            personality: {
                any: [{ desc: "Vengeful" }, { desc: "Cruel" }, { desc: "Merciless" }, { desc: "Standoffish" }, { desc: "Short Fuse" }]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('demand-sacrifice-water',
        {
            desc: mkGen("Drown Someone (1 charge per victim HD).")
        },
        {
            themes: {
                all: ["cloud", "dark"]
            },
            personality: {
                any: [{ desc: "Vengeful" }, { desc: "Cruel" }, { desc: "Merciless" }, { desc: "Standoffish" }, { desc: "Short Fuse" }]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('demand-sacrifice-fall',
        {
            desc: mkGen("Drop Someone to Their Death (1 charge per victim HD).")
        },
        {
            themes: {
                all: ["cloud", "dark"]
            },
            personality: {
                any: [{ desc: "Vengeful" }, { desc: "Cruel" }, { desc: "Merciless" }, { desc: "Standoffish" }, { desc: "Short Fuse" }]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('demand-sacrifice-ice',
        {
            desc: mkGen("Freeze Someone to Death (1 charge per victim HD).")
        },
        {
            themes: {
                all: ["ice", "dark"]
            },
            personality: {
                any: [{ desc: "Vengeful" }, { desc: "Cruel" }, { desc: "Merciless" }, { desc: "Standoffish" }, { desc: "Short Fuse" }]
            }
        }
    ),
] satisfies ProviderElement<Demand, WeaponPowerCond>[];

const demandsProvider = new WeaponFeatureProvider<Demand>(demands);

export default function mkDemand(weapon: Omit<WeaponViewModel, "sentient"> & {
    sentient: Exclude<WeaponViewModel["sentient"], false>;
}): string {
    const rng = seedrandom();
    // TODO fix this unsafe cast by implementing a WeaponViewModelFeatureProvider
    // for now, this means that Conds of demandsProvider can only safely use certain conditions
    return demandsProvider.draw(rng, weapon as unknown as Weapon).desc.generate(rng);
}