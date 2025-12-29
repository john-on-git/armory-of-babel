import seedrandom from "seedrandom";
import { mkGen, type Generator } from "./recursiveGenerator";
import { ProviderElement } from "./weaponGenerator/provider";
import { WeaponFeatureProvider } from "./weaponGenerator/weaponGeneratorLogic";
import type { Weapon, WeaponPowerCond, WeaponViewModel } from "./weaponGenerator/weaponGeneratorTypes";

interface Demand {
    desc: Generator<string>;
}

const demands = [
    new ProviderElement<Demand, WeaponPowerCond>('demand-adornments',
        {
            desc: mkGen("New Adornments (1 charge/100 GP spent).")
        },
        {}
    ),
    new ProviderElement<Demand, WeaponPowerCond>('demand-interesting-attack',
        {
            desc: mkGen("Perform an Interesting Attack (d4 charges).")
        },
        {}
    ),
    new ProviderElement<Demand, WeaponPowerCond>('demand-oil',
        {
            desc: mkGen((rng) =>
                `To be Polished With ${[
                    "a White Whale's Wax (all charges)",
                    "Giant Bees' Wax (d10 charges)",
                    'Clove Oil (d8 charges)',
                    "Frankincense Oil (d8 charges)",
                    "Myrrh Oil (d8 charges)",
                    'Oud Oil (d8 charges)',
                    'Sandalwood Oil (d6 charges)',
                    'Rose Oil (d6 charges)',
                    'Shellac Wax (d6 charges)',
                    'Palm Wax (d6 charges)',
                    'Oil (d4 charges)',
                    'Wax (d4 charges)'
                ].choice(rng)}.`
            )
        },
        {}
    ),
    new ProviderElement<Demand, WeaponPowerCond>('demand-book',
        {
            desc: mkGen("New Reading Material (d4 charges).")
        },
        {
            themes: {
                any: ["wizard", "steampunk"]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('demand-spellbook',
        {
            desc: mkGen("Acquire New Spell (all charges).")
        },
        {
            themes: {
                any: ["wizard"]
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
            desc: mkGen("Acquire Rare Crafting Material (all charges).")
        },
        {
            themes: {
                any: ["fire"]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('demand-poke-it',
        {
            desc: mkGen("Interact With Specific Dungeon Object (d6 charges).")
        },
        {}
    ),

    new ProviderElement<Demand, WeaponPowerCond>('demand-destruction',
        {
            desc: mkGen("Destroy Specific Object (d4 charges).")
        },
        {
            themes: {
                any: ["dark", "fire", "sour"]
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
    new ProviderElement<Demand, WeaponPowerCond>('demand-defeat-foe',
        {
            desc: mkGen("Defeat Specific Foe (d6 charges).")
        },
        {
            themes: {
                none: ["sweet"]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('demand-escort-mission',
        {
            desc: mkGen("Protect Specific NPC This Scene (d4 charges).")
        },
        {
            themes: {
                any: ["light"]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('demand-drama',
        {
            desc: mkGen("Incite Conflict With Specific NPC (d6 charges).")
        },
        {
            themes: {
                any: ["dark"]
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
                all: ["light", "fire"]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('demand-drama-religious-sour',
        {
            desc: mkGen("Insult Religion of Infidel (all charges).")
        },
        {
            themes: {
                all: ["light", "sour"]
            }
        }
    ),

    new ProviderElement<Demand, WeaponPowerCond>('demand-booze',
        {
            desc: mkGen("Dipped in Beverage Worth At Least 100 GP (d4 charges).")
        },
        {}
    ),
    new ProviderElement<Demand, WeaponPowerCond>('demand-sacrifice-acid',
        {
            desc: mkGen("Dissolve Someone in Acid (1 charge per victim HD).")
        },
        {
            themes: {
                all: ["sour", "dark"],
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