import seedrandom from "seedrandom";
import { mkGen, StringGenerator, type TGenerator } from "./recursiveGenerator";
import { ProviderElement } from "./weaponGenerator/provider";
import { WeaponFeatureProvider } from "./weaponGenerator/weaponGeneratorLogic";
import type { Theme, Weapon, WeaponPowerCond } from "./weaponGenerator/weaponGeneratorTypes";

interface Demand {
    desc: TGenerator<string>;
}

const demands = [
    new ProviderElement<Demand, WeaponPowerCond>('TODO',
        {
            desc: mkGen("New Adornments (1 charge/100 GP spent).")
        },
        {}
    ),
    new ProviderElement<Demand, WeaponPowerCond>('TODO',
        {
            desc: mkGen("Perform an Interesting Attack (d4 charges).")
        },
        {}
    ),
    new ProviderElement<Demand, WeaponPowerCond>('TODO',
        {
            desc: new StringGenerator([
                "To be Polished With ",
                mkGen(rng => [
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
                ].choice(rng)),
                '.'
            ])
        },
        {}
    ),
    new ProviderElement<Demand, WeaponPowerCond>('TODO',
        {
            desc: mkGen("New Reading Material (d4 charges).")
        },
        {
            themes: {
                any: ["wizard", "steampunk"] satisfies Theme[]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('TODO',
        {
            desc: mkGen("Acquire New Spell (all charges).")
        },
        {
            themes: {
                any: ["wizard"] satisfies Theme[]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('TODO',
        {
            desc: mkGen("Acquire New Technology (all charges).")
        },
        {
            themes: {
                any: ["steampunk"] satisfies Theme[]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('TODO',
        {
            desc: mkGen("Acquire Rare Material (all charges).")
        },
        {
            themes: {
                any: ["fire"] satisfies Theme[]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('TODO',
        {
            desc: mkGen("Destroy Specific Object (d4 charges).")
        },
        {
            themes: {
                any: ["dark", "fire", "sour"] satisfies Theme[]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('TODO',
        {
            desc: mkGen("Immediately Start a Fire (d4 charges).")
        },
        {
            themes: {
                any: ["fire"] satisfies Theme[]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('TODO',
        {
            desc: mkGen("Cool Down Current Location (d4 charges).")
        },
        {
            themes: {
                any: ["ice"] satisfies Theme[]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('TODO',
        {
            desc: mkGen("Defeat Specific Foe (d6 charges).")
        },
        {
            themes: {
                none: ["sweet"] satisfies Theme[]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('TODO',
        {
            desc: mkGen("Protect Specific NPC This Scene (d4 charges).")
        },
        {
            themes: {
                any: ["light"] satisfies Theme[]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('TODO',
        {
            desc: mkGen("Incite Conflict With Specific NPC (d6 charges).")
        },
        {
            themes: {
                any: ["dark"] satisfies Theme[]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('TODO',
        {
            desc: mkGen("Interact With Specific Dungeon Object (d6 charges).")
        },
        {}
    ),

    new ProviderElement<Demand, WeaponPowerCond>('TODO',
        {
            desc: mkGen("Release Specific Animal From Captivity (d4 charges).")
        },
        {
            themes: {
                any: ["nature"] satisfies Theme[]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('TODO',
        {
            desc: mkGen("Pet Specific Animal (charges based on danger).")
        },
        {
            themes: {
                any: ["nature"] satisfies Theme[]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('TODO',
        {
            desc: mkGen("Hug Specific Tree (d4 charges).")
        },
        {
            themes: {
                any: ["nature"] satisfies Theme[]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('TODO',
        {
            desc: mkGen("Plant Tree (d4 charges).")
        },
        {
            themes: {
                any: ["nature"] satisfies Theme[]
            }
        }
    ),

    new ProviderElement<Demand, WeaponPowerCond>('TODO',
        {
            desc: mkGen("Make Haste to Closest Temple (all charges).")
        },
        {
            themes: {
                any: ["light"] satisfies Theme[]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('TODO',
        {
            desc: mkGen("Make Offering to God (all charges).")
        },
        {
            themes: {
                any: ["light"] satisfies Theme[]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('TODO',
        {
            desc: mkGen("Insult Religion of Infidel (all charges).")
        },
        {
            themes: {
                all: ["light", "fire"] satisfies Theme[]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('TODO',
        {
            desc: mkGen("Insult Religion of Infidel (all charges).")
        },
        {
            themes: {
                all: ["light", "sour"] satisfies Theme[]
            }
        }
    ),

    new ProviderElement<Demand, WeaponPowerCond>('TODO',
        {
            desc: mkGen("Food, Something Cold (d4 charges).")
        },
        {
            themes: {
                any: ["ice", "sweet"] satisfies Theme[]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('TODO',
        {
            desc: mkGen("Food, Something Spicy (d4 charges).")
        },
        {
            themes: {
                any: ["fire", "sweet"] satisfies Theme[]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('TODO',
        {
            desc: mkGen("Food, Something Sour (d4 charges).")
        },
        {
            themes: {
                any: ["sour", "sweet"] satisfies Theme[]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('TODO',
        {
            desc: mkGen("Food, Something Sweet (d4 charges).")
        },
        {
            themes: {
                any: ["sweet"] satisfies Theme[]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('TODO',
        {
            desc: mkGen("Food, Something Still Wriggling (d4 charges).")
        },
        {
            themes: {
                any: ["dark"] satisfies Theme[]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('TODO',
        {
            desc: mkGen("Beverage Worth At Least 100 GP (d4 charges).")
        },
        {}
    ),
    new ProviderElement<Demand, WeaponPowerCond>('TODO',
        {
            desc: mkGen("Dissolve Someone in Acid (1 charge per victim HD).")
        },
        {
            themes: {
                all: ["sour", "dark"] satisfies Theme[]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('TODO',
        {
            desc: mkGen("Burn Someone Alive (1 charge per victim HD).")
        },
        {
            themes: {
                all: ["fire", "dark"] satisfies Theme[]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('TODO',
        {
            desc: mkGen("Drown Someone (1 charge per victim HD).")
        },
        {
            themes: {
                all: ["cloud", "dark"] satisfies Theme[]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('TODO',
        {
            desc: mkGen("Drop Someone to Their Death (1 charge per victim HD).")
        },
        {
            themes: {
                all: ["cloud", "dark"] satisfies Theme[]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('TODO',
        {
            desc: mkGen("Freeze Someone to Death (1 charge per victim HD).")
        },
        {
            themes: {
                all: ["ice", "dark"] satisfies Theme[]
            }
        }
    ),
    // {
    //     new ProviderElement<Demand,WeaponPowerCond>('TODO',{
    //         desc: mkGen("TODO")
    //     },
    //     {}
    // }
] satisfies ProviderElement<Demand, WeaponPowerCond>[];

const demandsProvider = new WeaponFeatureProvider<Demand>(demands);

export default function mkDemand(weapon: Weapon): string {
    const rng = seedrandom();
    return demandsProvider.draw(rng, weapon).desc.generate(rng);
}