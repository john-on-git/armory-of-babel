import { Patchable } from '$lib/util/versionController';
import _ from 'lodash';
import seedrandom from "seedrandom";

export type Quant<T> = { any: T[] } | { all: T[] } | { none: T[] }
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

export class ProviderElement<TThing, TCond extends Cond> extends Patchable {
    thing: TThing;
    cond: TCond;

    constructor(UUID: string, thing: TThing, cond: TCond) {
        super(UUID);
        this.thing = thing;
        this.cond = cond;
    }
}

export interface Cond {
    unique?: true;
}

export abstract class ConditionalThingProvider<TThing, TCond extends Cond, TParams extends object> {
    protected source: ProviderElement<TThing, TCond>[];

    constructor(source: ProviderElement<TThing, TCond>[]) {
        this.source = source;
    }

    protected condExecutor(UUID: string, cond: TCond, params: TParams): boolean {
        function recurse<T extends object>(UUID: string, x: T): boolean {
            // any entry has this UUID or has an element in its subtree with this UUID
            return Object.entries(x).some(([k, v]) => (k === 'UUID' && v === UUID) || (typeof v === 'object' && recurse(UUID, v)));
        }
        // unique implies no matching UUID (de-morgan's)
        return !cond.unique || !recurse(UUID, params)
    };

    // note that the complexity on this implementation is awful, O(n). it should build a decision tree on construction & be O(1)
    /**
     * returns a thing that is available given this condition
     * @param rng seedrandom randomness source to pick using
     * @param params the params that the return value's condition must hold for
     * @returns a random thing meeting that is valid for conditions
     */
    draw(rng: seedrandom.PRNG, params: TParams): TThing {
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