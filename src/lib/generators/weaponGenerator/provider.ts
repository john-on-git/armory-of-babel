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
    allowDuplicates?: true;
    UUIDs?: Quant<string>
    /**
     * If present, this will never be chosen.
     */
    never?: true;
}


function gatherIDs<T extends object>(x: T, acc: Set<string>): Set<string> {
    // get all the UUIDs of all patchables in the subtree
    Object.values(x).forEach((x) => {
        if (typeof x === 'object' && x !== null && x !== undefined) {
            if ('UUID' in x) {
                acc.add(x.UUID);
            }
            gatherIDs(x, acc);
        }
    });
    return acc;
}

export function evQuantUUID(quantUUID: Quant<string>, x: { target: object } | { set: Set<string> }) {

    if ('target' in x) {

        const allIDs = gatherIDs(x, new Set());

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
        if ((cond.allowDuplicates || this.defaultAllowDuplicates) === true && cond.UUIDs === undefined) {
            return true;
        }
        else {
            //otherwise get all the UUIDs in the target and evaluate the conditions
            const allIDs = gatherIDs(params, new Set());

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