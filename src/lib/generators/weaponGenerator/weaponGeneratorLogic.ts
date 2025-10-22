import "$lib/util/choice";
import '$lib/util/string';
import seedrandom from "seedrandom";
import { angloFirstNameGenerator, grecoRomanFirstNameGenerator } from "../nameGenerator";
import { mkGen, StringGenerator, type TGenerator } from "../recursiveGenerator";
import { ConditionalThingProvider, evComp, evQuant, type ProviderElement } from "./provider";
import { defaultWeaponRarityConfigFactory, WEAPON_TO_HIT } from "./weaponGeneratorConfigLoader";
import { type DamageDice, type FeatureProviderCollection, isRarity, type PassiveBonus, type Theme, type Weapon, type WeaponAdjective, type WeaponPowerCond, type WeaponPowerCondParams, weaponRaritiesOrd, type WeaponRarity, type WeaponRarityConfig } from "./weaponGeneratorTypes";

export class WeaponFeatureProvider<T> extends ConditionalThingProvider<T, WeaponPowerCond, WeaponPowerCondParams> {
    constructor(source: ProviderElement<T, WeaponPowerCond>[]) {
        super(source);
    }

    protected override condExecutor(UUID: string, cond: WeaponPowerCond, params: WeaponPowerCondParams): boolean {

        const ord = (x: WeaponRarity) => ({
            common: 0,
            uncommon: 1,
            rare: 2,
            epic: 3,
            legendary: 4,
        }[x])

        return (
            super.condExecutor(UUID, cond, params) && //uniqueness OK
            (!cond.isSentient || params.sentient) && // sentience OK
            (!cond.rarity || evComp(cond.rarity, params.rarity, ord)) && // rarity OK
            (!cond.themes || evQuant(cond.themes, params.themes)) && // themes OK
            (!cond.personality || evQuant(cond.personality, params.sentient ? params.sentient.personality : [])) && // personality OK
            (!cond.activePowers || evQuant(cond.activePowers, params.active.powers)) && // actives OK
            (!cond.passivePowers || evQuant(cond.passivePowers, params.passivePowers)) && // passives OK
            (!cond.languages || evQuant(cond.languages, params.sentient ? params.sentient.languages : [])) && // languages OK
            (!cond.shapeFamily || evQuant(cond.shapeFamily, params.shape.group)) // shapes OK
        );
    }
}

const articles = new Set(['the', 'a', 'an', 'by', 'of']);
function mkNonSentientNameGenerator(adjectiveProvider: WeaponFeatureProvider<WeaponAdjective>, weapon: Weapon, shape: string, rng: seedrandom.PRNG) {
    return mkGen(() => {
        const string = new StringGenerator([
            mkGen((x) => adjectiveProvider.draw(x, weapon).desc),
            mkGen(' '),
            mkGen(shape)
        ])?.generate(rng);
        return string.split(/\s/).map(x => articles.has(x) ? x : x.capFirst()).join(' ');
    });
}

function mkSentientNameGenerator(adjectiveProvider: WeaponFeatureProvider<WeaponAdjective>, weapon: Weapon, shape: string, rng: seedrandom.PRNG) {
    return mkGen(() => {
        const string = new StringGenerator([
            mkGen((rng) => [grecoRomanFirstNameGenerator, angloFirstNameGenerator].choice(rng).generate(rng)),
            mkGen([', ', ', the '].choice(rng)),
            mkGen((x) => adjectiveProvider.draw(x, weapon).desc),
            mkGen(' '),
            mkGen(shape)
        ])?.generate(rng);
        return string.split(/\s/).map(x => articles.has(x) ? x : x.capFirst()).join(' ');
    });
}

function generateRarity(weaponRarityConfig: WeaponRarityConfig, rng: seedrandom.PRNG): WeaponRarity {
    const n = rng();
    // sort the rarities into descending order
    const xs = (Object.entries(weaponRarityConfig) as [WeaponRarity, typeof weaponRarityConfig[WeaponRarity]][]).sort(weaponRaritiesOrd);
    for (const [k, v] of xs) {
        if (isRarity(k)) {
            if (n < v.percentile) {
                return k;
            }
        }
    }
    throw new Error('failed to generate rarity');
}

const genStr = (rng: seedrandom.PRNG, x: string | TGenerator<string>) => typeof x === 'string' ? x : x.generate(rng);

export function mkWeapon(featureProviders: FeatureProviderCollection, rngSeed: string, weaponRarityConfig: WeaponRarityConfig = defaultWeaponRarityConfigFactory()): Weapon {


    const rng = seedrandom(rngSeed);

    // decide power level
    const rarity = generateRarity(weaponRarityConfig, rng);
    const originalParams = weaponRarityConfig[rarity].paramsProvider(rng);
    const params = structuredClone(originalParams)

    // determine sentience
    const isSentient = rng() < params.sentienceChance;

    const toHit = WEAPON_TO_HIT[rarity].generate(rng);

    // init weapon
    const weapon: Weapon = {
        id: rngSeed,
        description: 'TODO',
        rarity,
        name: '',
        shape: {
            particular: "sword",
            group: "sword"
        },
        damage: {
            as: 'sword',
            const: toHit,
        },
        toHit,
        active: {
            maxCharges: params.nCharges,
            rechargeMethod: {
                desc: '',
            },
            powers: []
        },
        passivePowers: [],
        sentient: isSentient ? {
            personality: [],
            languages: ['Common.'],
            chanceOfMakingDemands: params.chanceOfMakingDemands
        } : false as const,

        themes: [],
        params,
    };

    // draw themes until we have enough to cover our number of powers
    const unusedThemes = new Set<Theme>(featureProviders.themeProvider); // this could be a provider but whatever go my Set<Theme>
    const minThemes = Math.max(
        1,
        Math.min(
            Math.ceil((params.nActive + params.nUnlimitedActive + params.nPassive) / 2),
            3
        ),
    );
    while (
        weapon.themes.length < minThemes ||
        featureProviders.activePowerProvider.available(weapon).size < params.nActive + params.nUnlimitedActive ||
        featureProviders.passivePowerOrLanguageProvider.available(weapon).size < params.nPassive
    ) {
        const choice = unusedThemes.choice(rng);
        if (choice != undefined) {
            unusedThemes.delete(choice);
            weapon.themes.push(choice);
        }
        else {
            // there were not enough themes available, but continue anyway in case we get lucky & still generate a valid weapon
            break;
        }
    }

    //determine shape
    weapon.shape = featureProviders.shapeProvider.draw(rng, weapon);
    weapon.damage.as = weapon.shape.group;

    // determine name
    weapon.name = (isSentient
        ? mkSentientNameGenerator(featureProviders.adjectiveProvider, weapon, weapon.shape.particular, rng)
        : mkNonSentientNameGenerator(featureProviders.adjectiveProvider, weapon, weapon.shape.particular, rng)
    ).generate(rng);


    // determine description
    weapon.description = 'TODO';

    if (weapon.sentient) {
        const nPersonalities = 2;
        while (weapon.sentient.personality.length < nPersonalities) {
            const choice = featureProviders.personalityProvider.draw(rng, weapon);
            if (choice != undefined) {
                weapon.sentient.personality.push({
                    ...choice,
                    desc: genStr(rng, choice?.desc)
                });
            }
        }
    }


    // draw passive powers
    for (let i = 0; i < params.nPassive; i++) {
        const choice = featureProviders.passivePowerOrLanguageProvider.draw(rng, weapon);
        if (choice != undefined) {
            if ('language' in choice && weapon.sentient) {
                weapon.sentient.languages.push(choice.desc);
            }
            else if ('miscPower' in choice) {
                if (choice.desc !== null) {
                    weapon.passivePowers.push({
                        ...choice,
                        desc: genStr(rng, choice.desc)
                    });
                }
                for (const k in choice.bonus) {
                    const bonus = k as keyof PassiveBonus
                    switch (bonus) {
                        case 'addDamageDie':
                            // apply all damage dice to the weapon
                            for (const k in choice.bonus.addDamageDie) {
                                const die = k as keyof DamageDice;
                                if (typeof choice.bonus.addDamageDie[die] === 'number') {
                                    if (weapon.damage[die] === undefined) {
                                        weapon.damage[die] = 0;
                                    }
                                    weapon.damage[die] += choice.bonus.addDamageDie[die];
                                }
                            }
                            break;
                        case "plus":
                            weapon.toHit += choice.bonus.plus ?? 0;

                            if (weapon.damage.const === undefined) {
                                weapon.damage.const = 0;
                            }
                            weapon.damage.const += 1;
                            break;
                        default:
                            return bonus satisfies never;
                    }
                }
            }
            else {
                // Probably because a passive power was missing a type key.
                // Or because a language was configured in an invalid way & did not require the weapon to be sentient.
                throw new Error('Could not assign passive power, config was invalid.');
            }
        }
    }

    // draw active powers
    const rechargeMethodChoice = featureProviders.rechargeMethodProvider.draw(rng, weapon);
    weapon.active.rechargeMethod = {
        ...rechargeMethodChoice,
        desc: genStr(rng, rechargeMethodChoice.desc)
    };
    for (let i = 0; i < params.nActive; i++) {
        const choice = featureProviders.activePowerProvider.draw(rng, weapon);
        if (choice != undefined) {
            weapon.active.powers.push({
                ...choice,
                desc: genStr(rng, choice.desc),
                additionalNotes: choice.additionalNotes?.map(x => genStr(rng, x))
            });
        }
    }

    for (let i = 0; i < params.nUnlimitedActive; i++) {
        const choice = featureProviders.activePowerProvider.draw(rng, weapon);
        if (choice != undefined) {
            weapon.active.powers.push({
                ...choice,
                cost: 'at will',
                desc: genStr(rng, choice.desc),
                additionalNotes: choice.additionalNotes?.map(x => genStr(rng, x))
            });
        }
    }

    // set the weapon's max charges to be enough to cast its most expensive power, if it was previously lower
    weapon.active.maxCharges =
        weapon.active.powers
            .filter(x => x.cost != 'at will')
            .reduce((acc, x) => Math.max(typeof x.cost === 'string' ? 0 : x.cost, acc), weapon.active.maxCharges);


    // TODO convert to viewmodel

    return weapon;
}

