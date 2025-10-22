import { angloFirstNameGenerator, grecoRomanFirstNameGenerator } from "$lib/generators/nameGenerator";
import { type TGenerator } from "$lib/generators/recursiveGenerator";
import { allEyeProviders, allMouthProviders } from "$lib/generators/weaponGenerator/config/configConstants";
import { structuredDescToString } from "$lib/generators/weaponGenerator/weaponDescriptionLogic";
import "$lib/util/choice";
import '$lib/util/string';
import _ from "lodash";
import seedrandom, { type PRNG } from "seedrandom";
import { ConditionalThingProvider, evComp, evQuant, evQuantUUID, gatherUUIDs, ProviderElement } from "./provider";
import { defaultWeaponRarityConfigFactory, WEAPON_TO_HIT } from "./weaponGeneratorConfigLoader";
import { type DamageDice, type DescriptorGenerator, type Ephitet, type FeatureProviderCollection, type Language, type PassiveBonus, type Pronouns, shapeToStructure, type StructuredDescription, type Theme, type Weapon, type WeaponGenerationParams, type WeaponPart, type WeaponPartName, type WeaponPowerCond, type WeaponPowerCondParams, weaponRarities, weaponRaritiesOrd, type WeaponRarity, type WeaponRarityConfig, type WeaponShape, weaponStructures, type WeaponViewModel } from "./weaponGeneratorTypes";


/**
 * Determines whether a weapon part is one or many.
 * @param name weaponpart to get name for
 * @returns the next word in the sentence after the weapon part
 */
export function getPlurality(name: WeaponPartName) {
    switch (name) {
        case 'blades':
        case 'limbs':
        case 'maceHeads':
        case 'chains':
        case 'prongs':
            return 'plural';
        default:
            return 'singular';
    }
}

function structureDescFor(shape: WeaponShape) {
    function getStructure(shape: WeaponShape) {

        switch (shape.particular) {
            case 'Macuahuitl':
            case 'Nunchuks':
            case 'Meteor Hammer':
            case 'Double Flail':
            case 'Triple Flail':
            case 'Quadruple Flail':
            case 'Quintuple Flail':
            case "Bident":
            case "Trident":
                return weaponStructures[shapeToStructure[shape.particular]];
            default:
                return weaponStructures[shapeToStructure[shape.group]];
        }
    }
    const structure = getStructure(shape);

    const structuredDesc = {
        business: structure.business.reduce((acc, partName) => {
            acc[partName] = {
                descriptors: []
            } satisfies WeaponPart;
            return acc;
        }, {} as Record<WeaponPartName, WeaponPart>),
        holding: structure.holding.reduce((acc, partName) => {
            acc[partName] = {
                descriptors: []
            } satisfies WeaponPart;
            return acc;
        }, {} as Record<WeaponPartName, WeaponPart>),
        other: structure.other.reduce((acc, partName) => {
            acc[partName] = {
                descriptors: []
            } satisfies WeaponPart;
            return acc;
        }, {} as Record<WeaponPartName, WeaponPart>),

    };
    return structuredDesc as StructuredDescription;
}

function hasUUIDs(weapon: Weapon, expectedUUIDs: readonly string[]) {
    const actualUUIDS = gatherUUIDs(weapon);
    for (const UUID of expectedUUIDs) {
        if (actualUUIDS.has(UUID)) {
            return true;
        }
    }
    return false;
}

function hasEyes(weapon: Weapon) { return hasUUIDs(weapon, allEyeProviders); }
function hasMouth(weapon: Weapon) { return hasUUIDs(weapon, allMouthProviders); }

export function toProviderSource<TKey extends string | number | symbol, T1, T2>(x: Record<TKey, T1[]>, map: (k: TKey, x: T1, i: number) => ProviderElement<T2, WeaponPowerCond>): ProviderElement<T2, WeaponPowerCond>[] {
    return Object.entries<T1[]>(x).map(([k, v]) => v.map((x, i) => map(k as TKey, x, i))).flat();
}


export class WeaponFeatureProvider<T> extends ConditionalThingProvider<T, WeaponPowerCond, WeaponPowerCondParams> {
    constructor(source: ProviderElement<T, WeaponPowerCond>[], defaultAllowDuplicates = false) {
        super(source, defaultAllowDuplicates);
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
        if (n < v.percentile) {
            return k;
        }
    }
    throw new Error('failed to generate rarity');
}
function applyBonuses(weapon: Weapon, bonus: PassiveBonus) {
    for (const k in bonus) {
        const bonusKind = k as keyof PassiveBonus
        switch (bonusKind) {
            case 'addDamageDie':
                // apply all damage dice to the weapon
                for (const k in bonus.addDamageDie) {
                    const die = k as keyof DamageDice;
                    if (typeof bonus.addDamageDie[die] === 'number') {
                        if (weapon.damage[die] === undefined) {
                            weapon.damage[die] = 0;
                        }
                        weapon.damage[die] += bonus.addDamageDie[die];
                    }
                }
                break;
            case "plus":
                weapon.toHit += bonus.plus ?? 0;

                if (weapon.damage.const === undefined) {
                    weapon.damage.const = 0;
                }
                weapon.damage.const += 1;
                break;
            case "addChargedPowers":
                weapon.params.nActive++;
                break;
            default:
                return bonusKind satisfies never;
        }
    }
}

function applyDescriptionPartProvider(rng: seedrandom.PRNG, descriptorGenerator: DescriptorGenerator & { UUID: string }, weapon: Weapon) {
    function choosePart(rng: seedrandom.PRNG, checkMaterial: boolean, applicableTo: DescriptorGenerator['applicableTo'] | undefined) {
        if (weapon.description === null) {
            return undefined
        }
        else {
            // get all the parts that we can apply this descriptor to
            const allApplicableParts = _
                .values(weapon.description)
                .flatMap(parts => _.entries(parts).filter(([partName, part]) =>
                    ((applicableTo === undefined) || evQuant(applicableTo, partName)) &&
                    (!checkMaterial || part.material === undefined) && // we can't apply a material to a part that already has one
                    evQuantUUID({ none: [descriptorGenerator.UUID] }, { target: part }))) as [WeaponPartName, WeaponPart][];
            // 2. choose one at random
            return allApplicableParts.choice(rng);
        }
    }

    // generate the thing.
    const descriptor = descriptorGenerator.generate(rng, weapon);

    // find the chosen part in structuredDesc and apply the provider's output to it 
    // if it's a material we also have to filter out parts that already have a material
    if ('material' in descriptor) {

        const choice = choosePart(rng, true, descriptorGenerator.applicableTo);

        // if we fail to get a part, try to handle it gracefully
        if (choice !== undefined) {
            choice[1].material = {
                desc: genMaybeGen(descriptor.material, rng, weapon),
                ephitet: genMaybeGen(descriptor.ephitet, rng, weapon),
                UUID: descriptorGenerator.UUID
            };
        }
    }
    else {
        const choice = choosePart(rng, false, descriptorGenerator.applicableTo);

        // if we fail to get a part, try to handle it gracefully
        if (choice !== undefined) {
            choice[1].descriptors.push({
                descType: descriptor.descriptor.descType,
                desc: genMaybeGen(descriptor.descriptor[getPlurality(choice[0])], rng, weapon, choice[0]),
                ephitet: genMaybeGen(descriptor.ephitet, rng, weapon),
                UUID: descriptorGenerator.UUID
            });
        }
    }
}

function pickEphitet(rng: seedrandom.PRNG, weapon: Weapon): Ephitet | undefined {
    function fallbackEph(theme: Theme): Ephitet {
        switch (theme) {
            case "fire":
                return { pre: 'Fiery' };
            case "ice":
                return { pre: 'Icy' };
            case "cloud":
                return { post: 'of the Sky', alliteratesWith: 'S' };
            case "earth":
                return { post: 'of the Earth', alliteratesWith: 'E' };
            case "light":
                return { pre: 'Divine' };
            case "dark":
                return { pre: 'Evil' };
            case "sweet":
                return { pre: 'Sugar' };
            case "sour":
                return { pre: 'Acid' };
            case "wizard":
                return { pre: 'Magic' };
            case "steampunk":
                return { pre: 'Clockwork' };
            case "nature":
                return { pre: "Treehugger's" };
            default:
                return { pre: theme };
        }
    }

    function isAlliterative(ephitet: Ephitet) {
        // Take the alliteratesWith if one was provided, then if it's pre, fall back to taking the first letter, otherwise count it as non illiterative
        const compareTo = ephitet?.alliteratesWith ?? ('pre' in ephitet ? ephitet.pre[0] : undefined);
        return compareTo !== undefined && weapon.shape.particular[0].localeCompare(compareTo, undefined, { sensitivity: "base" }) === 0;

    }

    if (weapon.description !== null) {
        const maybeEphitets = Object.values(weapon.description).flatMap((x) => Object.values(x).flatMap(y => 'material' in y ? [y.material, ...y.descriptors] : y.descriptors)).map(x => x?.ephitet);

        const ephitets = (maybeEphitets.filter(x => x !== undefined) as Ephitet[]);
        const alliterativeEphitets = (ephitets.filter(x => isAlliterative(x)) as Ephitet[]);

        console.log(weapon.shape.particular, ephitets, alliterativeEphitets, '\n');


        return alliterativeEphitets.choice(rng) ?? ephitets.choice(rng) ?? fallbackEph(weapon.themes.choice(rng));
    }
}

//export function genMaybeGen<T, TArgs extends Array<unknown>, TUnion extends T | ((TGenerator<T, TArgs>)) = T | ((TGenerator<T, TArgs>))>(x: TUnion, rng: seedrandom.PRNG, ...args: TArgs): T;
export function genMaybeGen<T, TArgs extends Array<unknown>>(x: T | ((TGenerator<T, TArgs>)), rng: seedrandom.PRNG, ...args: TArgs): T {
    return typeof x === 'object' && x !== null && 'generate' in x ? x.generate(rng, ...args) : x;
}

const DEFAULT_CONFIG = defaultWeaponRarityConfigFactory();

export function mkWeapon(rngSeed: string, featureProviders: FeatureProviderCollection, weaponRarityConfig: WeaponRarityConfig = DEFAULT_CONFIG, maybeRarity?: WeaponRarity): { weaponViewModel: WeaponViewModel, params: WeaponGenerationParams } {

    // features may provide pieces of description, which are stored here
    const featureDescriptorProviders = new Set<string>();
    /**
     * Handle a possibly invalid request for a descriptor. Applying the descriptor if it's valid, or ignoring it and printing an error if it isn't.
     * @param UUID the UUID of the requested descriptor, or undefined if one wasn't requested
     */
    function tryPushProvider(UUID: string | undefined) {
        if (UUID !== undefined) {
            if (featureProviders.descriptorIndex[UUID]) {
                featureDescriptorProviders.add(UUID);
            }
            else {
                console.error(`\x1b[31mfeature requested the descriptor "${UUID}" but it was falsey: implement this descriptor.`)
            }
        }
    }

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
                UUID: '',
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

    /*
     * Draw themes for the weapon, until we have enough to cover our target number of powers.
     * Note, since it's possible for powers to increase the number of powers, this could still theoretically fail, but it's not very likely.
     */
    const unusedThemes = new Set<Theme>(featureProviders.themeProvider); // this could be a provider but whatever go my Set<Theme>
    const minThemes =
        (params.nActive + params.nPassive + params.nUnlimitedActive) >= 3
            ? Math.ceil(rng() * 2)
            : 1;

    while (
        weapon.themes.length < minThemes ||
        featureProviders.activePowerProvider.available(weapon).size < params.nActive + params.nUnlimitedActive ||
        featureProviders.passivePowerProvider.available(weapon).size < params.nPassive
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
    const structuredDesc = structureDescFor(weapon.shape);
    /**
     * It's important that we attach it to the weapon.
     * When drawing descriptions, providers will check that the UUIDs of the previously drawn abilities are on the weapon. 
     * So missing this step will allow duplicate descriptors.  
    */
    weapon.description = structuredDesc;


    /*
     * Generate the personality if the weapon is sentient.
     */

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

    /*
     * Generate the powers.
     */

    // draw passive powers
    for (let i = 0; i < params.nPassive; i++) {
        const choice = featureProviders.passivePowerProvider.draw(rng, weapon);
        const gennedChoice = genMaybeGen(choice, rng, weapon);
        if (gennedChoice != undefined) {
            weapon.passivePowers.push({
                UUID: choice.UUID,
                ...gennedChoice,
                desc: genMaybeGen(gennedChoice.desc, rng, weapon)
            });

            tryPushProvider(gennedChoice.descriptorPartGenerator);

            if (gennedChoice.bonus) {
                applyBonuses(weapon, gennedChoice.bonus);
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
            const gennedChoice = genMaybeGen(choice, rng, weapon);
            weapon.active.powers.push({
                UUID: choice.UUID,
                ...gennedChoice
            });

            tryPushProvider(gennedChoice.descriptorPartGenerator);

            if (gennedChoice.bonus) {
                applyBonuses(weapon, gennedChoice.bonus);
            }
        }
    }

    for (let i = 0; i < params.nUnlimitedActive; i++) {
        const choice = featureProviders.activePowerProvider.draw(rng, weapon);
        if (choice != undefined) {
            const gennedChoice = genMaybeGen(choice, rng, weapon)
            weapon.active.powers.push({
                UUID: choice.UUID,
                ...gennedChoice,
                cost: 'at will',
            });

            tryPushProvider(gennedChoice.descriptorPartGenerator);

            if (gennedChoice.bonus) {
                applyBonuses(weapon, gennedChoice.bonus);
            }
        }
    }

    // set the weapon's max charges to be enough to cast its most expensive power, if it was previously lower
    weapon.active.maxCharges =
        weapon.active.powers
            .filter(x => x.cost != 'at will')
            .reduce((acc, x) => Math.max(typeof x.cost === 'string' ? 1 : x.cost, acc), weapon.active.maxCharges);

    /*
     * Generate the structured description.
     */

    const maxDescriptors = weapon.themes.length * (1 + Math.floor(rng() * 2));
    let nDescriptors = 0;


    // first, apply any descriptor parts provided by the weapon's features, up to the cap
    for (const UUID of featureDescriptorProviders.values()) {
        applyDescriptionPartProvider(rng, featureProviders.descriptorIndex[UUID], weapon);

        nDescriptors++;
        if (nDescriptors >= maxDescriptors) {
            break;
        }
    }

    // then, apply theme-based descriptors, up to the cap
    while (nDescriptors < maxDescriptors) {
        const descriptorProvider = featureProviders.descriptors.draw(rng, weapon);


        applyDescriptionPartProvider(rng, descriptorProvider, weapon);
        nDescriptors++;
    }

    // if it is sentient, also apply eyes and a mouth
    if (weapon.sentient) {
        if (!hasEyes(weapon)) {
            applyDescriptionPartProvider(rng, featureProviders.descriptorIndex['generic-eyes'], weapon);
        }
        if (!hasMouth(weapon)) {
            //applyDescriptionPartProvider(rng, featureProviders.descriptorIndex['generic-mouth'], weapon, structure, weapon.description);
        }
    }


    // then, generate the weapon's name, choosing an ephitet by picking a random descriptor to reference
    const ephitet = pickEphitet(rng, weapon);
    if (weapon.pronouns == 'object') {
        if (ephitet === undefined) {
            weapon.name = weapon.shape.particular;
        }
        else {
            weapon.name = 'pre' in ephitet
                ? `${ephitet.pre} ${weapon.shape.particular}`
                : `The ${weapon.shape.particular}${ephitet.post}`;
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
        description: structuredDescToString('en-GB', weapon),
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
        passivePowers: weapon.passivePowers.filter(power => power.desc !== null && power.desc !== undefined && power.desc.length > 0).map(power => ({
            desc: power.desc as string,
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
    console.clear();
    return {
        weapons: weaponRarities.reduce((acc, rarity) => {
            acc[rarity] = mkWeapon(rngSeed, featureProviders, weaponRarityConfig, rarity).weaponViewModel
            return acc;
        }, {} as Record<WeaponRarity, WeaponViewModel>),
        n: seedrandom(rngSeed)()
    };
}


/**
 * Draw a theme from a record of things organised by theme, based on a weapon with Themes.
 * Records used by this function should have their keys ordered in the same order as the Theme union type, or the behaviour is undefined.
 * @param weapon pick an option based on the themes of this weapon
 * @param mapsTo options to pick from
 * @param rng rng source to use
 * @returns an option of mapsTo that matches one of the Themes of weapon
 */
export function pickForTheme<TKey extends Theme, TRes>(weapon: Weapon, mapsTo: Record<TKey, TRes>, rng: PRNG): TRes {
    return mapsTo[(weapon.themes.filter(theme => theme in mapsTo) as (keyof typeof mapsTo)[]).choice(rng)];
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

export function toLang(theme: Theme, lang: string): ProviderElement<Language, WeaponPowerCond> {
    return new ProviderElement<Language, WeaponPowerCond>(
        lang.replaceAll(/\s/g, '-').toLowerCase(),
        { language: true, desc: lang }, {
        themes: {
            any: [theme]
        }
    });
}