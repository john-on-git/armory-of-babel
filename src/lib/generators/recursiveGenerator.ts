import seedrandom from "seedrandom";

export interface LeafGenerator<T, TArgs extends Array<unknown> = []> {
    /**
     * Execute the random generator.
     * @returns one of the possible strings that the random generator can yield.
     */
    generate: (rng: seedrandom.PRNG, ...args: TArgs) => T;
}
export function mkGen<T, TArgs extends Array<unknown> = []>(x: T | ((rng: seedrandom.PRNG, ...args: TArgs) => T)): LeafGenerator<T, TArgs> {
    return x instanceof Function ? { generate: x } : { generate: () => x };
}
export type TGenerator<T, TArgs extends Array<unknown> = []> = LeafGenerator<T, TArgs> | RecursiveGenerator<T, TArgs>;

export abstract class RecursiveGenerator<T, TArgs extends Array<unknown> = [], TSubArgs extends TArgs = TArgs> {
    children: (TGenerator<T, TSubArgs>)[];

    constructor(children: (T | TGenerator<T, TSubArgs>)[]) {
        this.children = children.map(x => typeof x === 'object' && x !== null && 'generate' in x ? x : mkGen(x));
    }

    /**
     * Execute the random generator.
     * @returns one of the possible strings that the random generator can yield.
     */
    abstract generate: (rng: seedrandom.PRNG, ...args: TArgs) => T;
}

export class StringGenerator<TArgs extends Array<unknown> = []> extends RecursiveGenerator<string, TArgs> {
    generate: (rng: seedrandom.PRNG, ...args: TArgs) => string = (rng, ...args) => this.children.reduce((acc, x) => acc + x.generate(rng, ...args), "");
}

