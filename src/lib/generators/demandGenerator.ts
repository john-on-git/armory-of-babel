import seedrandom from "seedrandom";
import { mkGen, type Generator } from "./recursiveGenerator";
import { ProviderElement } from "./weaponGenerator/provider";
import { WeaponFeatureProvider } from "./weaponGenerator/weaponGeneratorLogic";
import type { Weapon, WeaponPowerCond } from "./weaponGenerator/weaponGeneratorTypes";

interface Demand {
    desc: Generator<string, [Weapon & {
        sentient: Exclude<Weapon["sentient"], false>
    }]>;
}

const egoDieMult = {
    4: 1,
    6: 1,
    8: 1,
    10: 2,
    12: 2,
} as const satisfies Record<Exclude<Weapon["sentient"], false>['egoDie'], number>;

/**
 * Get the next ego die down.
 */
function subEgo(ego: Exclude<Weapon["sentient"], false>['egoDie']): number {
    switch (ego) {
        case 4:
            return 4;
        default:
            return ego - 2;
    }
}

/**
 * Note, these should really not call the rng because I think it'd be confusing if you kept getting the same demand but the charges changed.
 */
const demands = [
    new ProviderElement<Demand, WeaponPowerCond>('demand-help-faction',
        {
            desc: mkGen((_, weapon) => `Assist Faction (2d${weapon.sentient.egoDie} charges).`)
        },
        {}
    ),
    new ProviderElement<Demand, WeaponPowerCond>('demand-harm-faction',
        {
            desc: mkGen((_, weapon) => `Undermine Faction (2d${weapon.sentient.egoDie} charges).`)
        },
        {}
    ),
    new ProviderElement<Demand, WeaponPowerCond>('demand-poke-it',
        {
            desc: mkGen((_, weapon) => `Interact With Specific Dungeon Object (1d${weapon.sentient.egoDie} charges).`)
        },
        {}
    ),
    new ProviderElement<Demand, WeaponPowerCond>('demand-defeat-foe',
        {
            desc: mkGen(`Defeat Specific Foe (1 charge / foe HD).`)
        },
        {
            personality: {
                none: [{ desc: `Pacifist` }]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('demand-defeat-foe',
        {
            desc: mkGen((_, weapon) => `Display of Wielder's Loyalty (1d${weapon.sentient.egoDie} charges).`)
        },
        {
            personality: {
                any: [{ desc: `Jealous` }]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('demand-adornments',
        {
            desc: mkGen((_, weapon) => `New Adornments (1d${egoDieMult[weapon.sentient.egoDie]} charge/100 GP spent).`)
        },
        {
            personality: {
                any: [{ desc: `Greedy` }]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('demand-interesting-attack',
        {
            desc: mkGen((_, weapon) => `Perform an Interesting Attack (1d${subEgo(weapon.sentient.egoDie)} charges).`)
        },
        {
            personality: {
                any: [{ desc: `Standoffish` }, { desc: `Short Fuse` }, { desc: `Haughty` }, { desc: 'Antagonistic' }]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('demand-debate',
        {
            desc: mkGen((_, weapon) => `Destroy Foe in Debate (2d${(weapon.sentient.egoDie)} charges).`)
        },
        {
            personality: {
                any: [{ desc: `Logical` }]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('demand-book',
        {
            desc: mkGen((_, weapon) => `New Reading Material (1${subEgo(weapon.sentient.egoDie)} charges).`)
        },
        {
            personality: {
                any: [{ desc: `Curious` }, { desc: `Know-it-All` }]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('demand-alone-time',
        {
            desc: mkGen(`To be Left Alone This Session (all charges).`)
        },
        {
            personality: {
                any: [{ desc: `Depressive` }, { desc: `Lazy` }]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('demand-spellbook',
        {
            desc: mkGen((_, weapon) => `Acquire New Spell (3d${(weapon.sentient.egoDie)} charges).`)
        },
        {
            personality: {
                any: [{ desc: `Curious` }]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('demand-tourism',
        {
            desc: mkGen((_, weapon) => `Experience New Culture (3d${(weapon.sentient.egoDie)} charges).`)
        },
        {
            personality: {
                any: [{ desc: `Open-Minded` }, { desc: `Curious` }]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('demand-tech',
        {
            desc: mkGen((_, weapon) => `Acquire New Technology (3d${(weapon.sentient.egoDie)} charges).`)
        },
        {
            themes: {
                any: [`steampunk`]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('demand-material',
        {
            desc: mkGen((_, weapon) => `Craft Item Using Rare Material (2d${(weapon.sentient.egoDie)} charges).`)
        },
        {
            personality: {
                any: [{ desc: `Industrious` }]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('demand-destruction',
        {
            desc: mkGen((_, weapon) => `Destroy Specific Object (1d${weapon.sentient.egoDie} charges).`)
        },
        {
            personality: {
                any: [{ desc: `Vengeful` }, { desc: `Cruel` }, { desc: `Merciless` }, { desc: `Standoffish` }, { desc: `Short Fuse` }]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('demand-escort-mission',
        {
            desc: mkGen((_, weapon) => `Protect Specific NPC This Scene (1d${weapon.sentient.egoDie} charges).`)
        },
        {
            personality: {
                any: [{ desc: `Kind` }, { desc: `Compassionate` }]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('demand-present',
        {
            desc: mkGen((_, weapon) => `Give Gift to NPC (1d${weapon.sentient.egoDie} charges).`)
        },
        {
            personality: {
                any: [{ desc: `Kind` }, { desc: `Compassionate` }]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('demand-drama',
        {
            desc: mkGen((_, weapon) => `Incite Conflict With Specific NPC (1d${weapon.sentient.egoDie} charges).`)
        },
        {
            personality: {
                any: [{ desc: `Vengeful` }, { desc: `Cruel` }, { desc: `Merciless` }, { desc: `Standoffish` }, { desc: `Short Fuse` }]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('demand-pyromania',
        {
            desc: mkGen((_, weapon) => `Immediately Start a Fire (1d${subEgo(weapon.sentient.egoDie)} charges).`)
        },
        {
            themes: {
                any: [`fire`]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('demand-cryomania',
        {
            desc: mkGen((_, weapon) => `Cool Down Current Location (1d${subEgo(weapon.sentient.egoDie)} charges).`)
        },
        {
            themes: {
                any: [`ice`]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('demand-release-beast',
        {
            desc: mkGen((_, weapon) => `Release Specific Animal From Captivity (1d${subEgo(weapon.sentient.egoDie)} charges).`)
        },
        {
            themes: {
                any: [`nature`]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('demand-pet-dog',
        {
            desc: mkGen(`Pet Specific Animal (1 charge / animal HD).`)
        },
        {
            themes: {
                any: [`nature`]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('demand-treehugger',
        {
            desc: mkGen(`Hug Specific Tree (1 charge).`)
        },
        {
            themes: {
                any: [`nature`]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('demand-plant-a-tree-under-whose-shade-you-will-never-rest',
        {
            desc: mkGen((_, weapon) => `Plant Tree (1d${(weapon.sentient.egoDie)} charges).`)
        },
        {
            themes: {
                any: [`nature`]
            }
        }
    ),

    new ProviderElement<Demand, WeaponPowerCond>('demand-legit-temple',
        {
            desc: mkGen((_, weapon) => `Make Haste to Closest Temple (2d${(weapon.sentient.egoDie)} charges).`)
        },
        {
            themes: {
                any: [`light`]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('demand-simp-god',
        {
            desc: mkGen((_, weapon) => `Make Offering to God (1d${(weapon.sentient.egoDie)} charges).`)
        },
        {
            themes: {
                any: [`light`]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('demand-drama-religious-fire',
        {
            desc: mkGen((_, weapon) => `Insult Religion of Infidel (1d${(weapon.sentient.egoDie)} charges).`)
        },
        {
            themes: {
                all: [`light`]
            },
            personality: {
                any: [{ desc: `Vengeful` }, { desc: `Cruel` }, { desc: `Merciless` }, { desc: `Standoffish` }, { desc: `Short Fuse` }]
            }
        }
    ),

    new ProviderElement<Demand, WeaponPowerCond>('demand-sacrifice-acid',
        {
            desc: mkGen(`Dissolve Someone in Acid (1 charge / victim HD).`)
        },
        {
            themes: {
                all: [`sour`, `dark`],
            },
            personality: {
                any: [{ desc: `Vengeful` }, { desc: `Cruel` }, { desc: `Merciless` }, { desc: `Standoffish` }, { desc: `Short Fuse` }]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('demand-sacrifice-fire',
        {
            desc: mkGen(`Burn Someone Alive (1 charge / victim HD).`)
        },
        {
            themes: {
                all: [`fire`, `dark`]
            },
            personality: {
                any: [{ desc: `Vengeful` }, { desc: `Cruel` }, { desc: `Merciless` }, { desc: `Standoffish` }, { desc: `Short Fuse` }]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('demand-sacrifice-water',
        {
            desc: mkGen(`Drown Someone (1 charge / victim HD).`)
        },
        {
            themes: {
                all: [`cloud`, `dark`]
            },
            personality: {
                any: [{ desc: `Vengeful` }, { desc: `Cruel` }, { desc: `Merciless` }, { desc: `Standoffish` }, { desc: `Short Fuse` }]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('demand-sacrifice-fall',
        {
            desc: mkGen(`Drop Someone to Their Death (1 charge / victim HD).`)
        },
        {
            themes: {
                all: [`cloud`, `dark`]
            },
            personality: {
                any: [{ desc: `Vengeful` }, { desc: `Cruel` }, { desc: `Merciless` }, { desc: `Standoffish` }, { desc: `Short Fuse` }]
            }
        }
    ),
    new ProviderElement<Demand, WeaponPowerCond>('demand-sacrifice-ice',
        {
            desc: mkGen(`Freeze Someone to Death (1 charge / victim HD).`)
        },
        {
            themes: {
                all: [`ice`, `dark`]
            },
            personality: {
                any: [{ desc: `Vengeful` }, { desc: `Cruel` }, { desc: `Merciless` }, { desc: `Standoffish` }, { desc: `Short Fuse` }]
            }
        }
    ),
] satisfies ProviderElement<Demand, WeaponPowerCond>[];


/**
 * Issue a new demand / quest for this weapon. Each UTC calendar day corresponds to a unique demand.
 * @param weapon weapon that is issuing the demand
 * @param date the date to generate the demand for, each UTC calendar day corresponds to a new demand. If no date is provided, now is used.
 * @returns a string describing the demand
 */
export default function mkDemand(weapon: Weapon & {
    sentient: Exclude<Weapon["sentient"], false>;
}, date: Date = new Date()): string {
    const rng = seedrandom(`${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()}`);
    // TODO fix this unsafe cast by implementing a WeaponViewModelFeatureProvider
    // for now, this means that Conds of demandsProvider can only safely use certain conditions
    return new WeaponFeatureProvider<Demand>(demands).draw(rng, weapon).desc.generate(rng, weapon);
}