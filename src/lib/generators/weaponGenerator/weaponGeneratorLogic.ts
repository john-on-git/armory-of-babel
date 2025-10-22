import { angloFirstNameGenerator, grecoRomanFirstNameGenerator } from "$lib/generators/nameGenerator";
import { type Generator } from "$lib/generators/recursiveGenerator";
import { allEyeProviders } from "$lib/generators/weaponGenerator/config/configConstants";
import { structuredDescToString } from "$lib/generators/weaponGenerator/weaponDescriptionLogic";
import "$lib/util/choice";
import '$lib/util/string';
import _ from "lodash";
import seedrandom, { type PRNG } from "seedrandom";
import { ConditionalThingProvider, evComp, evQuant, evQuantUUID, gatherUUIDs, ProviderElement } from "./provider";
import { defaultWeaponRarityConfigFactory, WEAPON_TO_HIT } from "./weaponGeneratorConfigLoader";
import { commonDieSizes, type DamageDice, type DescriptorCondParams, type DescriptorGenerator, type Ephitet, type FeatureProviderCollection, type Language, type PassiveBonus, type Pronouns, shapeToStructure, type StructuredDescription, type Theme, type Weapon, type WeaponGenerationParams, type WeaponGivenThemes, type WeaponPart, type WeaponPartName, type WeaponPowerCond, type WeaponPowerCondParams, weaponRarities, weaponRaritiesOrd, type WeaponRarity, type WeaponRarityConfig, type WeaponShape, weaponStructures, type WeaponViewModel } from "./weaponGeneratorTypes";

/**
 * Get the maximum amount of damage that can be dealt by a given roll.
 */
export function maxDamage(damage: DamageDice): number {
    let n = damage['const'] ?? 0;
    for (const k of commonDieSizes) {
        n += damage[`d${k}`] ?? 0;
    }
    return n;
}

/**
 * Apply a function to a weapon's damage, i.e. to multiply it by a given number.
 * 
 * 'damage as' will be omitted, and replaced with d6
 * @param damage the weapon's damage. 
 * @param f the function to apply
 * @returns the damage dice after the function was applied
 */
export function modDamage(damage: Weapon['damage'], f: (x: number) => number): DamageDice {
    const { as, d6, ...rest } = damage;
    return _.mapValues(
        {
            d6: 1 + (d6 ?? 0),
            ...rest
        },
        x => x === undefined ? undefined : f(x)
    );
}

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
            case 'Flail':
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

export function toProviderSource<TKey extends string | number | symbol, T1, T2>(x: Record<TKey, T1[]>, map: (k: TKey, x: T1, i: number) => ProviderElement<T2, WeaponPowerCond>): ProviderElement<T2, WeaponPowerCond>[] {
    return Object.entries<T1[]>(x).map(([k, v]) => v.map((x, i) => map(k as TKey, x, i))).flat();
}


export class WeaponFeatureProvider<T, TCond extends WeaponPowerCond = WeaponPowerCond, TParams extends WeaponPowerCondParams = WeaponPowerCondParams> extends ConditionalThingProvider<T, TCond, TParams> {
    constructor(source: ProviderElement<T, TCond>[], defaultAllowDuplicates = false) {
        super(source, defaultAllowDuplicates);
    }

    protected override condExecutor(element: ProviderElement<T, TCond>, params: TParams): boolean {

        const ord = (x: WeaponRarity) => ({
            common: 0,
            uncommon: 1,
            rare: 2,
            epic: 3,
            legendary: 4,
        }[x])

        return (
            super.condExecutor(element, params) && //uniqueness OK
            (!element.cond.isSentient || params.sentient) && // sentience OK
            (!element.cond.rarity || evComp(element.cond.rarity, params.rarity, ord)) && // rarity OK
            (!element.cond.themes || evQuant(element.cond.themes, params.themes)) && // themes OK
            (!element.cond.personality || evQuant(element.cond.personality, params.sentient ? params.sentient.personality : [])) && // personality OK
            (!element.cond.activePowers || evQuant(element.cond.activePowers, params.active.powers)) && // actives OK
            (!element.cond.passivePowers || evQuant(element.cond.passivePowers, params.passivePowers)) && // passives OK
            (!element.cond.languages || evQuant(element.cond.languages, params.sentient ? params.sentient.languages : [])) && // languages OK
            (!element.cond.shapeFamily || evQuant(element.cond.shapeFamily, params.shape.group)) && // shapes OK
            (!element.cond.shapeParticular || evQuant(element.cond.shapeParticular, params.shape.particular)) // shape particular OK
        );
    }
}

export class DescriptorProvider extends WeaponFeatureProvider<DescriptorGenerator, WeaponPowerCond, DescriptorCondParams> {
    constructor(source: ProviderElement<DescriptorGenerator, WeaponPowerCond>[], defaultAllowDuplicates = false) {
        super(source, defaultAllowDuplicates);
    }

    /**
     * Returns true if it's possible to place the descriptor on the weapon.
     * should really be based on it & not its cond, so I suppose this is not really quite right...
     */
    protected placementIsPossible(thing: DescriptorGenerator, params: DescriptorCondParams): boolean {
        function entries<K extends string, V>(x: Record<K, V> | null): [K, V][] {
            return x === null ? [] : _.entries(x) as [K, V][];
        }
        function vals<T>(x: Record<string | number | symbol, T> | null): T[] {
            return x === null ? [] : _.values(x);
        }

        // there must be least one part that can accept the element 
        return vals(params.description).flatMap(entries).some(([k, v]) => {
            // the element must be applicable to this part, and if the element is a material the part can't already have a material
            return evQuant(thing.applicableTo, k) && (!(thing.yields === 'material') || v.material === undefined)
        });
    }

    protected override condExecutor(element: ProviderElement<DescriptorGenerator, WeaponPowerCond>, params: DescriptorCondParams): boolean {
        return (
            super.condExecutor(element, params) &&
            this.placementIsPossible(element.thing, params) // placement possible
        )
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



/**
 * Handle a possibly invalid request for a descriptor. Applying the descriptor if it's valid, or ignoring it and printing an error if it isn't.
 * @param UUID the UUID of the requested descriptor, or undefined if one wasn't requested
 */
function tryPushProvider(UUID: string | undefined, featureDescriptorProviders: Set<string>, descriptorIndex: Record<string, DescriptorGenerator & { UUID: string }>, silent: boolean = false) {
    if (UUID !== undefined) {
        if (descriptorIndex[UUID]) {
            featureDescriptorProviders.add(UUID);
        }
        else if (!silent) {
            console.error(`\x1b[31mfeature requested the descriptor "${UUID}" but it was falsey: implement this descriptor.`)
        }
    }
}

/**
 * Apply a descriptorPartGenerator to the weapon, if one was requested.
 */
function descriptorPartGenerator(weapon: Weapon, rng: PRNG, descriptorPartGenerator: string[] | string | undefined, featureDescriptorProviders: Set<string>, descriptorIndex: Record<string, DescriptorGenerator & { UUID: string }>, silent: boolean = false) {

    const alreadySeenProviders = (UUIDSource: string | string[] = []): boolean => UUIDSource instanceof Array ? UUIDSource.some(x => featureDescriptorProviders.has(x)) : featureDescriptorProviders.has(UUIDSource);
    const pushProviders = (UUIDSource: string | string[] = []): void => UUIDSource instanceof Array ? UUIDSource.forEach(x => tryPushProvider(x, featureDescriptorProviders, descriptorIndex, silent)) : tryPushProvider(UUIDSource, featureDescriptorProviders, descriptorIndex, silent);

    const applyAllDescriptionPartProviders = (weapon: Weapon, rng: PRNG, UUIDSource: string | string[] = []): void => UUIDSource instanceof Array ? UUIDSource.forEach(x => applyDescriptionPartProvider(rng, descriptorIndex[x], weapon, silent)) : applyDescriptionPartProvider(rng, descriptorIndex[UUIDSource], weapon, silent);


    // we must immediately apply the descriptorPartGenerator, if it has one
    // this is because other powers may expect to see its UUID on the weapon
    if (descriptorPartGenerator !== undefined) {
        if (!alreadySeenProviders(descriptorPartGenerator)) {
            applyAllDescriptionPartProviders(weapon, rng, descriptorPartGenerator);
        }
        pushProviders(descriptorPartGenerator);
    }
}

/**
 * Apply a bonus to the weapon, if one was requested.
 */
function applyBonuses(weapon: Weapon, bonus: PassiveBonus | undefined) {
    if (bonus !== undefined) {

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
}
function applyDescriptionPartProvider(rng: seedrandom.PRNG, descriptorGenerator: DescriptorGenerator & { UUID: string }, weapon: Weapon, silent = false) {
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
        else if (!silent) {
            console.error(weapon.rarity, '\x1b[31mfailed to get a part for', descriptorGenerator.UUID);
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
        else if (!silent) {
            console.error(weapon.rarity, '\x1b[31mfailed to get a part for', descriptorGenerator.UUID);
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
                return { post: ' of the Sky' };
            case "earth":
                return { post: ' of the Earth' };
            case "light":
                return { pre: 'Divine' };
            case "dark":
                return { pre: 'Evil' };
            case "sweet":
                return { pre: 'Sugary' };
            case "sour":
                return { pre: 'Acid' };
            case "wizard":
                return { pre: 'Magic' };
            case "steampunk":
                return { pre: 'Clockwork' };
            case "nature":
                return { post: " of the Forest" };
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


        return alliterativeEphitets.choice(rng) ?? ephitets.choice(rng) ?? fallbackEph(weapon.themes.choice(rng));
    }
}

//export function genMaybeGen<T, TArgs extends Array<unknown>, TUnion extends T | ((TGenerator<T, TArgs>)) = T | ((TGenerator<T, TArgs>))>(x: TUnion, rng: seedrandom.PRNG, ...args: TArgs): T;
export function genMaybeGen<T, TArgs extends Array<unknown>>(x: T | ((Generator<T, TArgs>)), rng: seedrandom.PRNG, ...args: TArgs): T {
    return typeof x === 'object' && x !== null && 'generate' in x ? x.generate(rng, ...args) : x;
}

const DEFAULT_CONFIG = defaultWeaponRarityConfigFactory();

export function mkWeapon(rngSeed: string, featureProviders: FeatureProviderCollection, weaponRarityConfig: WeaponRarityConfig = DEFAULT_CONFIG, maybeRarity?: WeaponRarity, silent = false): { weaponViewModel: WeaponViewModel, params: WeaponGenerationParams } {

    // features may provide pieces of description. they are stored here so we don't have to gather UUIDs.
    // this doesn't really matter rn because we do this constantly anyway when checking conds, but maybe in the future :(
    const featureDescriptorProviders = new Set<string>();

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

            // apply all the update requests that were attached to the power
            descriptorPartGenerator(weapon, rng, gennedChoice.descriptorPartGenerator, featureDescriptorProviders, featureProviders.descriptorIndex, silent);
            applyBonuses(weapon, gennedChoice.bonus);
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

            // apply all the update requests that were attached to the power
            descriptorPartGenerator(weapon, rng, gennedChoice.descriptorPartGenerator, featureDescriptorProviders, featureProviders.descriptorIndex, silent);
            applyBonuses(weapon, gennedChoice.bonus);
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

            // apply all the update requests that were attached to the power
            descriptorPartGenerator(weapon, rng, gennedChoice.descriptorPartGenerator, featureDescriptorProviders, featureProviders.descriptorIndex, silent);
            applyBonuses(weapon, gennedChoice.bonus);
        }
    }

    // set the weapon's max charges to be enough to cast its most expensive power, if it was previously lower
    weapon.active.maxCharges =
        weapon.active.powers
            .filter(x => x.cost != 'at will')
            .reduce((acc, x) => Math.max(typeof x.cost === 'string' ? 1 : x.cost, acc), weapon.active.maxCharges);

    /*
     * Generate the rest of the structured description.
     */

    const maxDescriptors = weapon.themes.length * (1 + Math.floor(rng() * 2));
    let nDescriptors = 0;

    // first, apply theme-based descriptors, up to the cap
    while (nDescriptors < maxDescriptors) {
        // TODO, in order to stop all misses, we need to 
        // draw based on what it's applicable to, and whether it's a material
        try {
            const descriptorProvider = featureProviders.descriptors.draw(rng, weapon);
            applyDescriptionPartProvider(rng, descriptorProvider, weapon, silent);
        }
        catch (e) {
            // this error is almost definitely "provider failed to draw". It means we don't have enough descriptors. just log it and stop trying to generate any more 
            console.error(e);
            break;
        }
        nDescriptors++;
    }

    // if it is sentient, also apply eyes
    if (weapon.sentient) {
        if (!hasEyes(weapon)) {
            applyDescriptionPartProvider(rng, featureProviders.descriptorIndex['generic-eyes'], weapon, silent);
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


export function mkWeaponsForAllRarities(rngSeed: string, featureProviders: FeatureProviderCollection, weaponRarityConfig?: WeaponRarityConfig, silent = false) {
    return {
        weapons: weaponRarities.reduce((acc, rarity) => {
            acc[rarity] = mkWeapon(rngSeed, featureProviders, weaponRarityConfig, rarity, silent).weaponViewModel
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
export function pickForTheme<TTheme extends Theme, TOut, TWeapon extends Weapon>(weapon: TWeapon, mapsTo: Record<TTheme, TOut>, rng: PRNG): TWeapon extends WeaponGivenThemes<[TTheme]> ? { chosen: TOut, theme: TWeapon['themes'][number] } : { chosen: TOut | undefined, theme: TWeapon['themes'][number] | undefined } {
    const chosenTheme = (weapon.themes.filter(theme => theme in mapsTo)).choice(rng) as TTheme;
    return {
        chosen: mapsTo[chosenTheme],
        theme: chosenTheme
    } as TWeapon extends WeaponGivenThemes<[TTheme]> ? { chosen: TOut, theme: TWeapon['themes'][number] } : { chosen: TOut | undefined, theme: TWeapon['themes'][number] | undefined };
}

export function textForDamage(damage: DamageDice & { as?: string }): string {
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