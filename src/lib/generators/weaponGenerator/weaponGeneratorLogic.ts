import { dev } from "$app/environment";
import { angloFirstNameGenerator, grecoRomanFirstNameGenerator } from "$lib/generators/nameGenerator";
import { mkGen, type TGenerator } from "$lib/generators/recursiveGenerator";
import "$lib/util/choice";
import '$lib/util/string';
import _ from "lodash";
import seedrandom from "seedrandom";
import { ConditionalThingProvider, evComp, evQuant, ProviderElement } from "./provider";
import { defaultWeaponRarityConfigFactory, WEAPON_TO_HIT } from "./weaponGeneratorConfigLoader";
import { type DamageDice, type DescriptorGenerator, type FeatureProviderCollection, getPlurality, isAre, isOrPossessionFor, isRarity, type Language, linkingIsOrPossessionFor, type PassiveBonus, pronounLoc, type Pronouns, structureDescFor, type Theme, type Weapon, type WeaponGenerationParams, type WeaponPart, type WeaponPartName, type WeaponPowerCond, type WeaponPowerCondParams, weaponRarities, weaponRaritiesOrd, type WeaponRarity, type WeaponRarityConfig, type WeaponViewModel } from "./weaponGeneratorTypes";

/**
 * 
 * @param _locale locale to generator the weapon for (not currently implemented)
 * @param weapon A weapon that has a description. If its description is null the behaviour is undefined. 
 */
function structuredDescToString(_locale: string, weapon: Weapon) {

    if (weapon.description === null) {
        throw new Error('cannot generate description for a weapon with null description');
    }
    else {
        const parts = Object.values(weapon.description).map(xs => Object.entries(xs)).flat().filter(([_, part]) => part.material !== undefined || part.descriptors.length > 0) as [WeaponPartName, WeaponPart][];

        function usesAnd(desc: WeaponPart) {
            return (desc.material !== undefined && desc.descriptors.length > 0) || desc.descriptors.length > 1;
        }

        let description = '';
        let i = 0;
        let usedAndThisSentence: boolean = false;
        for (const [partName, part] of parts) {
            const start = i === 0
                ? pronounLoc[weapon.pronouns].singular.possessive.capFirst()
                : usedAndThisSentence
                    ? weapon.pronouns === 'object' ? 'the' : pronounLoc[weapon.pronouns].singular.possessive
                    : weapon.pronouns === 'object' ? 'The' : pronounLoc[weapon.pronouns].singular.possessive.capFirst();


            // get all the descriptors, merging together any chains of 'has' / 'have' etc
            let hasChain = false;
            const descriptors: string[] = [];
            if (part.descriptors.length > 0) {
                // handle the first one separately if there's no material
                if (part.material === undefined) {
                    descriptors.push(`${isOrPossessionFor(partName, part.descriptors[0].descType)}${part.descriptors[0].desc}`);
                    hasChain = part.descriptors[0].descType === 'possession';
                }
                for (const descriptor of part.material === undefined ? part.descriptors.slice(1) : part.descriptors) {
                    // if this is possessive and the previous one was too, omit the possessiveness prefix
                    descriptors.push(descriptor.descType === 'possession' && hasChain ? descriptor.desc : `${linkingIsOrPossessionFor(partName, descriptor.descType)}${descriptor.desc}`);

                    hasChain = descriptor.descType === 'possession';
                }
            }

            if (dev) {
                for (const atom of [part.material, ...part.descriptors]) {
                    if (atom !== undefined && /^\s*$/.test(atom.desc)) {
                        console.error(`\x1b[31mSaw empty description atom: "${atom.desc}" (${atom.UUID})`);
                    }
                }
            }

            const materialStr = part.material === undefined ? '' : `${isAre(partName)} made of ${part.material.desc}${descriptors.length > 1
                ? ','
                : descriptors.length === 1
                    ? `, and `
                    : ''
                }`

            // join the descriptors together in a grammatical list: with commas and the word 'and' before the last element
            const descriptorsStr = descriptors.length > 1
                ? ` ${descriptors.slice(0, -1).join(', ')}, and ${descriptors[descriptors.length - 1]}`
                : descriptors.length === 1
                    ? `${descriptors[0]}`
                    : '';

            usedAndThisSentence = usedAndThisSentence || usesAnd(parts[i][1]);

            const partStr = `${start} ${partName} ${materialStr}${descriptorsStr}`;

            // if there's another part after this one, and it will not use the word 'and', merge it into this sentence
            // but don't merge more than two
            // otherwise end the current sentence
            let sentence: string;
            if (!usedAndThisSentence && (i < parts.length - 1) && !usesAnd(parts[i + 1][1])) {
                sentence = `${partStr}, and `
                usedAndThisSentence = true;
            }
            else {
                sentence = `${partStr}.${i === parts.length - 1 ? '' : ' '}`;
                usedAndThisSentence = false;
            }

            description += sentence;

            i++;
        }
        return description;
    }
}

function applyDescriptionPartProvider(rng: seedrandom.PRNG, provider: DescriptorGenerator & { UUID: string }, weapon: Weapon, ...[structure, structuredDesc]: ReturnType<typeof structureDescFor>) {
    function choosePart(rng: seedrandom.PRNG, checkMaterial: boolean, applicableTo: DescriptorGenerator['applicableTo'] | undefined, ...[structure, structuredDesc]: ReturnType<typeof structureDescFor>) {
        const allApplicableParts = _
            .entries(structure)
            .flatMap(([k, parts]) =>
                parts.filter(part =>
                    ((applicableTo === undefined) || evQuant(applicableTo, part)) &&
                    (!checkMaterial || structuredDesc[k as keyof typeof structure][part].material === undefined)
                ).map(part => [k, part]) as [keyof typeof structure, WeaponPartName][]
            );
        // 2. choose one at random
        return allApplicableParts.choice(rng);
    }

    // generate the thing.
    const descriptor = provider.generate(rng, weapon);

    // find the chosen part in structuredDesc and apply the provider's output to it 
    // if it's a material we also have to filter out parts that already have a material
    if ('material' in descriptor) {

        const targetPart = choosePart(rng, true, provider.applicableTo, structure, structuredDesc);

        // if we fail to get a part, try to handle it gracefully
        if (targetPart !== undefined) {
            structuredDesc[targetPart[0]][targetPart[1]].material = {
                desc: genMaybeGen(descriptor.material, rng, weapon),
                ephitet: genMaybeGen(descriptor.ephitet, rng, weapon),
                UUID: provider.UUID
            };
        }
    }
    else {
        const targetPart = choosePart(rng, false, provider.applicableTo, structure, structuredDesc);

        // if we fail to get a part, try to handle it gracefully
        if (targetPart !== undefined) {
            const desc = genMaybeGen(descriptor.descriptor, rng, weapon);
            structuredDesc[targetPart[0]][targetPart[1]].descriptors.push({
                descType: desc.descType,
                desc: genMaybeGen(desc[getPlurality(targetPart[1])], rng, weapon, targetPart[1]),
                ephitet: genMaybeGen(descriptor.ephitet, rng, weapon),
                UUID: provider.UUID
            });
        }
    }
}

function pickEphitet(rng: seedrandom.PRNG, structuredDesc: ReturnType<typeof structureDescFor>[1]) {
    return Object.values(structuredDesc).flatMap((x) => Object.values(x).flatMap(y => 'material' in y ? [y.material, ...y.descriptors] : y.descriptors)).choice(rng)?.ephitet;
}

export function textForDamage(damage: DamageDice & { as?: string }) {
    function textForDamageKey(k: string, v: string | number | undefined): string {
        if (v === undefined || v === 0) {
            return '';
        }
        else {
            switch (k) {
                case 'const':
                    return v.toString();
                case 'as':
                    return `as ${v}`
                default:
                    return `${v}${k}`
            }
        }
    }
    return Object.entries(damage)
        .sort(([k1, _], [k2, __]) => {
            const ord = {
                as: 0,
                d20: 1,
                d12: 2,
                d10: 3,
                d8: 4,
                d6: 5,
                d4: 6,
                const: 7
            } satisfies Record<keyof typeof damage, number>;
            return ord[k1 as keyof typeof damage] - ord[k2 as keyof typeof damage];
        })
        .map(([k, v]) => textForDamageKey(k, v)).filter(x => x.length > 0).join(' + ');
}

export function mkWepToGen<T>(x: T | ((rng: seedrandom.PRNG) => T)) {
    return mkGen(x);
};

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
            (!cond.shapeFamily || evQuant(cond.shapeFamily, params.shape.group)) && // shapes OK
            (!cond.shapeParticular || evQuant(cond.shapeParticular, params.shape.particular)) // shape particular OK
        );
    }
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

//export function genMaybeGen<T, TArgs extends Array<unknown>, TUnion extends T | ((TGenerator<T, TArgs>)) = T | ((TGenerator<T, TArgs>))>(x: TUnion, rng: seedrandom.PRNG, ...args: TArgs): T;
export function genMaybeGen<T, TArgs extends Array<unknown>>(x: T | ((TGenerator<T, TArgs>)), rng: seedrandom.PRNG, ...args: TArgs): T {
    return typeof x === 'object' && x !== null && 'generate' in x ? x.generate(rng, ...args) : x;
}

const DEFAULT_CONFIG = defaultWeaponRarityConfigFactory();

export function mkWeapon(rngSeed: string, featureProviders: FeatureProviderCollection, weaponRarityConfig: WeaponRarityConfig = DEFAULT_CONFIG, maybeRarity?: WeaponRarity): { weaponViewModel: WeaponViewModel, params: WeaponGenerationParams } {

    // features may provide pieces of description, which are stored here
    const featureDescriptorProviders: (DescriptorGenerator & { UUID: string })[] = [];

    const rng = seedrandom(rngSeed);

    // decide power level
    const rarity = (() => {
        if (maybeRarity === undefined) {
            // generate a random rarity if one wasn't provided
            return generateRarity(weaponRarityConfig, rng)
        }
        else {
            // otherwise we need to call rng() once to advance it, same as in the other branch.
            // this ensures that the same weapon will be generated in both branches
            rng();
            return maybeRarity;
        }
    })();
    const originalParams = weaponRarityConfig[rarity].paramsProvider(rng);
    const params = structuredClone(originalParams)

    // determine sentience
    const isSentient = rng() < params.sentienceChance;

    const toHit = WEAPON_TO_HIT[rarity].generate(rng);

    // init weapon
    const weapon: Weapon = {
        id: rngSeed,
        description: null,
        rarity,
        pronouns: isSentient ? (['enby', 'masc', 'femm', 'masc', 'femm', 'masc', 'femm', 'masc', 'femm', 'masc', 'femm'] satisfies Pronouns[]).choice(rng) : 'object',
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

    // generate the structure for the weapon's parts
    const [structure, structuredDesc] = structureDescFor(weapon.shape);
    /**
     * It's important that we attach it to the weapon.
     * When drawing descriptions, providers will check that the UUIDs of the previously drawn abilities are on the weapon. 
     * So missing this step will allow duplicate descriptors.  
    */
    weapon.description = structuredDesc;

    if (weapon.sentient) {
        const nPersonalities = 2;
        while (weapon.sentient.personality.length < nPersonalities) {
            const choice = featureProviders.personalityProvider.draw(rng, weapon);
            if (choice != undefined) {
                weapon.sentient.personality.push({
                    ...choice,
                    desc: genMaybeGen(choice?.desc, rng, weapon)
                });
            }
        }
    }


    // draw passive powers
    for (let i = 0; i < params.nPassive; i++) {
        const choice = genMaybeGen(featureProviders.passivePowerOrLanguageProvider.draw(rng, weapon), rng, weapon);
        if (choice != undefined) {
            if ('language' in choice && weapon.sentient) {
                weapon.sentient.languages.push(choice.desc);
            }
            else if ('miscPower' in choice) {
                if (choice.desc !== null) {
                    weapon.passivePowers.push({
                        ...choice,
                        desc: genMaybeGen(choice.desc, rng, weapon)
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

            if (choice.descriptorPartGenerator) {
                if (choice.descriptorPartGenerator in featureProviders.descriptorIndex) {

                    featureDescriptorProviders.push(featureProviders.descriptorIndex[choice.descriptorPartGenerator]);
                }
                else {
                    console.error(`\x1b[31mfeature requested the non-existent descriptor "${choice.descriptorPartGenerator}": implement this descriptor.`)
                }
            }
        }
    }

    // draw active powers
    const rechargeMethodChoice = featureProviders.rechargeMethodProvider.draw(rng, weapon);
    weapon.active.rechargeMethod = {
        ...rechargeMethodChoice,
        desc: genMaybeGen(rechargeMethodChoice.desc, rng, weapon)
    };
    for (let i = 0; i < params.nActive; i++) {
        const choice = featureProviders.activePowerProvider.draw(rng, weapon);
        if (choice != undefined) {
            weapon.active.powers.push({
                ...choice,
                desc: genMaybeGen(choice.desc, rng, weapon),
                additionalNotes: choice.additionalNotes?.map(x => genMaybeGen(x, rng, weapon))
            });

            if (choice.descriptorPartGenerator) {
                featureDescriptorProviders.push(featureProviders.descriptorIndex[choice.descriptorPartGenerator])
            }
        }
    }

    for (let i = 0; i < params.nUnlimitedActive; i++) {
        const choice = featureProviders.activePowerProvider.draw(rng, weapon);
        if (choice != undefined) {
            weapon.active.powers.push({
                ...choice,
                cost: 'at will',
                desc: genMaybeGen(choice.desc, rng, weapon),
                additionalNotes: choice.additionalNotes?.map(x => genMaybeGen(x, rng, weapon))
            });

            if (choice.descriptorPartGenerator) {
                featureDescriptorProviders.push(featureProviders.descriptorIndex[choice.descriptorPartGenerator])
            }
        }
    }

    // set the weapon's max charges to be enough to cast its most expensive power, if it was previously lower
    weapon.active.maxCharges =
        weapon.active.powers
            .filter(x => x.cost != 'at will')
            .reduce((acc, x) => Math.max(typeof x.cost === 'string' ? 0 : x.cost, acc), weapon.active.maxCharges);


    /** 
        Generate the weapon's description based on its parts.
        Ideas (???)

        • Some abilites have the side effect of adding a visual feature? Would need to be capped to prevent a sparkledog type situation.
        • How do we generate the material. Can only really have one or two.
        • Theme-based? Maybe if there aren't enough from abilities we just keep drawing.

        Ideas (bad)
        
        • Each part should be guaranteed at least one feature & material. Nah, kinda too much going on.

        TODO: 
            1. formatting descriptions for display
            2. why are Jest tests crashing?
    */

    const MAX_DESCRIPTORS = 5 + Math.floor(rng() * 2);
    let nDescriptors = 0;

    // first, apply any descriptor parts provided by the weapon's features, up to the cap
    for (const featureDescriptorProvider of featureDescriptorProviders) {
        applyDescriptionPartProvider(rng, featureDescriptorProvider, weapon, structure, weapon.description);

        nDescriptors++;
        if (nDescriptors >= MAX_DESCRIPTORS) {
            break;
        }
    }

    // then, apply theme-based descriptors, up to the cap
    while (nDescriptors < MAX_DESCRIPTORS) {

        const descriptorProvider = featureProviders.descriptors.draw(rng, weapon);
        applyDescriptionPartProvider(rng, descriptorProvider, weapon, structure, weapon.description);
        nDescriptors++;
    }

    // convert the structured description to a text block
    const description = structuredDescToString('en-GB', weapon);

    // then, generate the weapon's name, choosing an ephitet by picking a random descriptor to reference
    const ephitet = pickEphitet(rng, weapon.description);
    if (weapon.pronouns == 'object') {
        if (ephitet === undefined) {
            weapon.name = weapon.shape.particular;
        }
        else {
            weapon.name = 'pre' in ephitet
                ? `${ephitet.pre} ${weapon.shape.particular}`
                : `The ${weapon.shape.particular} ${ephitet.post}`;
        }
    }
    else {
        const personalName = [
            grecoRomanFirstNameGenerator, angloFirstNameGenerator,
        ].choice(rng).generate(rng, weapon.pronouns);

        if (ephitet === undefined) {
            weapon.name = `${personalName}, the ${weapon.shape.particular}`;
        } else {
            const ephitetAndShape = 'pre' in ephitet
                ? `${ephitet.pre} ${weapon.shape.particular}`
                : `${weapon.shape.particular} ${ephitet.post}`;

            weapon.name = `${personalName}, the ${ephitetAndShape}`;
        }
    }


    const weaponViewModel = {
        id: weapon.id,
        themes: weapon.themes,
        rarity: weapon.rarity,
        name: weapon.name,
        description,
        damage: weapon.damage,
        toHit: weapon.toHit,
        active: {
            maxCharges: weapon.active.maxCharges,
            rechargeMethod: genMaybeGen(weapon.active.rechargeMethod.desc, rng, weapon),
            powers: weapon.active.powers.map(power => ({
                desc: genMaybeGen(power.desc, rng, weapon),
                cost: power.cost,
                ...(power.additionalNotes === undefined ? {} : { additionalNotes: power.additionalNotes.map(desc => genMaybeGen(desc, rng, weapon)) })
            }))
        },
        passivePowers: weapon.passivePowers.map(power => ({
            desc: power.desc,
            ...(power.additionalNotes === undefined ? {} : { additionalNotes: power.additionalNotes.map(desc => genMaybeGen(desc, rng, weapon)) })
        })),
        sentient: weapon.sentient ? {
            personality: weapon.sentient.personality.map(x => genMaybeGen(x.desc, rng, weapon)),
            languages: weapon.sentient.languages,
            chanceOfMakingDemands: weapon.sentient.chanceOfMakingDemands
        } : false,
    } satisfies WeaponViewModel;

    return { weaponViewModel, params };
}


export function mkWeaponsForAllRarities(rngSeed: string, featureProviders: FeatureProviderCollection, weaponRarityConfig?: WeaponRarityConfig) {
    return {
        weapons: weaponRarities.reduce((acc, rarity) => {
            acc[rarity] = mkWeapon(rngSeed, featureProviders, weaponRarityConfig, rarity).weaponViewModel
            return acc;
        }, {} as Record<WeaponRarity, WeaponViewModel>),
        n: seedrandom(rngSeed)()
    };
}
