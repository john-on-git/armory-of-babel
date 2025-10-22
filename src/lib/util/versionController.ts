// this allows passing null or undefined even when T doesn't allow them
type RecursivePartial<T> = {
    [k in keyof T]?: T[k] extends object
    ? RecursivePartial<T[k]>
    : T[k] extends object | null
    ? RecursivePartial<T[k]> | null
    : T[k] extends object | null | undefined
    ? RecursivePartial<T[k]> | null | undefined
    : T[k];
};

export abstract class Patchable {
    UUID: string;

    constructor(UUID: string) {
        this.UUID = UUID;
    }

    patch(other: RecursivePartial<typeof this>) {
        function f<T extends object>(target: T, other: RecursivePartial<T>): T {
            for (const k of Object.keys(other) as (keyof typeof target)[]) {
                if (other[k] !== undefined) {
                    if (typeof target[k] === 'object' && target[k] !== null && other[k] !== null) {
                        // is object
                        target[k] = f(target[k], other[k]);
                    }
                    else if (typeof target[k] === typeof other[k]) {
                        // is primitive
                        target[k] = other[k] as never;
                    }
                    else {
                        throw new Error(`can't patch ${JSON.stringify(other)} onto ${JSON.stringify(target)}, type error`)
                    }
                }
            }
            return target;
        }
        f(this, other);
    };
}


export class PrimitiveContainer<T extends string | { toString: () => string }> extends Patchable {
    value: T;

    constructor(value: T) {
        super(typeof value === 'string' ? value : value.toString())
        this.value = value;
    }
};

export interface Delta<T extends Patchable> {
    add?: T[];
    remove?: Set<string>;
    modify?: Record<string, RecursivePartial<T>>;
}

export type DeltaCollection<T extends object> = {
    [k in keyof T]: T[k] extends Patchable ? Delta<T[k]> : never
}

export type ToPatchableArray<T extends object> = {
    [k in keyof T]: T[k] extends Patchable ? (T[k])[] : never;
}

// ^^^
// export type WrapPatchables<T extends object, TWrap<~>> = {
//     [k in keyof T]: T[k] extends Patchable ? TWrap<T[k]> : never;
// }

/**
 * This is an absolute disaster of a type. I think, to get it to work type-safely you'd need the higher-order type above ^,
 * So that Typescript would know that the two types have the same keys. I'm not 100% if that would even work, though.
 * This DOES seem to work, in some cases at least, though it may be possible to break it by using a complicated class heirarchy in the generic args.
 */
export class VersionController<
    TDelta extends object,
    TCollection extends DeltaCollection<TDelta> = DeltaCollection<TDelta>,
    TOut extends ToPatchableArray<DeltaCollection<TDelta>> = ToPatchableArray<DeltaCollection<TDelta>>,
    TPost = TOut
> {
    protected deltaCollections: [TCollection, ...TCollection[]];
    protected postGeneration: (x: TOut) => TPost;

    constructor(deltas: [TCollection, ...TCollection[]], postGeneration: (x: TOut) => TPost) {
        this.deltaCollections = deltas;
        this.postGeneration = postGeneration;
    }

    getLatestVersionNum(): number {
        return this.deltaCollections.length - 1;
    }

    /**
     * get the things for this version
     * @param v 
     * @returns the things for this version, or undefined if this version does not exist
     */
    getVersion(v: number): TPost | undefined {

        if (v >= 0 && v < this.deltaCollections.length) {
            // build the base object
            const head = (Object.keys(this.deltaCollections[0]) as (keyof TOut)[]).reduce<TOut>((acc, k) => {
                acc[k] = [] as unknown as TOut[keyof TOut];
                return acc;
            }, {} as TOut);


            // apply all the deltas in sequence
            for (const deltaCollection of this.deltaCollections.slice(0, v + 1)) {
                for (const k in deltaCollection) {
                    if (deltaCollection[k] !== undefined) {
                        // apply each of the three components to the head

                        // apply all the additions
                        if (deltaCollection[k].add !== undefined) {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            head[k as unknown as keyof TOut].push(...deltaCollection[k].add as any);
                        }

                        // apply all the removals
                        if (deltaCollection[k].remove !== undefined) {
                            // remove will be flagged as possibly undefined
                            // in the filter unless take a copy. odd
                            const remove = deltaCollection[k].remove;
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            head[k as unknown as keyof TOut] = (head[k as unknown as keyof TOut] as any).filter((x: { UUID: string; }) => !(remove.has(x.UUID))) as any;
                        }

                        // apply all the updates
                        // check each object for modifications, and apply each one if it exists
                        if (deltaCollection[k].modify !== undefined) {
                            for (const x of head[k as unknown as keyof TOut]) {
                                if (x.UUID in deltaCollection[k].modify) {
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    x.patch(deltaCollection[k as unknown as keyof TOut].modify?.[x.UUID] as any);
                                }
                            }
                        }
                    }
                }
            }

            return this.postGeneration(head);
        }
        else {
            return undefined;
        }
    }
}