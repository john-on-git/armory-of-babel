import type { WeaponPowerCond } from '$lib/generators/weaponGenerator/weaponGeneratorTypes';
import { Patchable } from '$lib/util/versionController';
import _ from 'lodash';
import seedrandom from "seedrandom";

export type Quant<T> = { any: T[] | readonly T[] } | { all: T[] | readonly T[] } | { none: T[] | readonly T[] }
export function evQuant<T>(req: Quant<T>, actual: T | T[]) {
    const isArray = Array.isArray(actual);
    const eq: (x: T) => boolean = isArray ?
        (x) => actual.some(y => _.isEqual(x, y)) :
        (x) => _.isEqual(x, actual);
    const length = isArray ? actual.length : 1;

    if ('any' in req) {
        return length > 0 && req.any.some(eq);
    }
    else if ('all' in req) {
        return length > 0 && req.all.every(eq);
    }
    else if ('none' in req) {
        return length === 0 || !req.none.some(eq);
    }
    return true;
}

export type Comp<T> = { lte: T } | { eq: T } | { gte: T };
export function evComp<T>(comp: Comp<T>, x: T, ord: (x: T) => number) {
    if ('lte' in comp) {
        return ord(x) <= ord(comp.lte);
    }
    else if ('eq' in comp) {
        return ord(x) === ord(comp.eq);
    }
    else if ('gte' in comp) {
        return ord(x) >= ord(comp.gte);
    }
    return true;
}

export class ProviderElement<TThing, TCond extends WeaponPowerCond = WeaponPowerCond> extends Patchable {
    thing: TThing;
    cond: TCond;

    constructor(UUID: string, thing: TThing, cond: TCond) {
        super(UUID);
        this.thing = thing;
        this.cond = cond;
    }
}

export interface Cond {
    allowDuplicates?: boolean;
    UUIDs?: Quant<string>
    /**
     * If present, this will never be chosen.
     */
    never?: true;
}

export type WithUUID<T extends object> = { UUID: string; } & T;


/**
 * Get the values of all properties in this object, and all its children, with a given key (by iterating depth-first).
 * @param property the key to get values of
 * @param x the object
 * @param acc accumulator to gather the values inside
 * @returns the accumualtor, modified such that it contains all the values in the subtree
 */
function gatherProperties<T extends object>(property: string | number | symbol, x: T, acc: Set<string> = new Set<string>()): Set<string> {
    Object.values(x).forEach((x) => {
        if (typeof x === 'object' && x !== null && x !== undefined) {
            if (property in x) {
                acc.add(x.UUID);
            }
            gatherProperties(x, acc);
        }
    });
    return acc;
}

/**
 * get all the UUIDs of all patchables in the subtree.
 * @param x the object to gather UUIDs for
 * @param acc accumulator to gather the UUIDs inside
 * @returns the accumualtor, modified such that it contains all UUIDs in the subtree
 */
export function gatherUUIDs<T extends object>(x: T, acc: Set<string> = new Set<string>()): Set<string> {
    return gatherProperties('UUID', x, acc);
}

export function evQuantUUID(quantUUID: Quant<string>, x: { target: object } | { set: Set<string> }) {

    if ('target' in x) {

        const allIDs = gatherUUIDs(x);

        return evQuant(quantUUID, Array.from(allIDs.values()));
    }
    else {
        return evQuant(quantUUID, Array.from(x.set.values()));
    }
}

export abstract class ConditionalThingProvider<TThing, TCond extends Cond, TParams extends object> {
    protected source: ProviderElement<TThing, TCond>[];
    protected defaultAllowDuplicates: boolean;

    constructor(source: ProviderElement<TThing, TCond>[], defaultAllowDuplicates = false) {
        this.source = source;
        this.defaultAllowDuplicates = defaultAllowDuplicates;
    }

    protected condExecutor(UUID: string, cond: TCond, params: TParams): boolean {
        if (cond.never === true) {
            return false;
        }
        // if the cond doesn't use either of the conditions that require checking UUIDs, there's no point in checking the params' UUIDs. just return true
        if ((cond.allowDuplicates ?? this.defaultAllowDuplicates) && cond.UUIDs === undefined) {
            return true;
        }
        else {
            //otherwise get all the UUIDs in the target and evaluate the conditions
            const allIDs = gatherUUIDs(params);

            return (
                // uniqueness demanded -> no duplicates of this.UUID (de-morgan's)
                (cond.allowDuplicates || !allIDs.has(UUID)) &&

                // cond.others provided -> cond.others is satisfied (de-morgan's)
                (cond.UUIDs === undefined || evQuantUUID(cond.UUIDs, { set: allIDs }))
            );
        }
    };

    // note that the complexity on this implementation is awful, O(n). it should build a decision tree on construction & be O(1)
    /**
     * returns a thing that is available given this condition
     * @param rng seedrandom randomness source to pick using
     * @param params the params that the return value's condition must hold for
     * @returns a random thing meeting that is valid for conditions
     */
    draw(rng: seedrandom.PRNG, params: TParams): TThing & { UUID: string } {
        const choice = this.source.filter(x => this.condExecutor(x.UUID, x.cond, params)).choice(rng);
        if (choice === undefined) {
            throw new Error(`Provider failed to draw. No valid options for:\n${JSON.stringify(params, undefined, 1)}.\nFirst option:\n${JSON.stringify(this.source.length >= 1 ? this.source[0] : undefined)}`);
        }
        else {
            return {
                ...choice.thing,
                UUID: choice.UUID
            }
        }
    }

    // note that the complexity on ths implementation is awful, O(n). it should build a decision tree on construction & be O(1)
    /**
     * Returns the set of things whose condition holds for given params.
     * @param params the params to get all the things whose condition must hold for
     * @returns the set of things that may possibly be returned by calling this.draw with conditions 
     */
    available: (params: TParams) => Set<TThing> = (params) => new Set(this.source.filter(x => this.condExecutor(x.UUID, x.cond, params)).map(x => ({
        ...(x.thing),
        UUID: x.UUID
    })));
}