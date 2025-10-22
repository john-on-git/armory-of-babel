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

export interface Delta<T extends Patchable> {
    add?: Iterable<T>;
    remove?: Set<string>;
    modify?: Record<string, RecursivePartial<T>>;
}

export type DeltaCollection<T2 extends Record<string | number | symbol, Patchable>> = {
    [k in keyof T2]?: Delta<T2[k]>
}


export class VersionController<TTarget extends Patchable, TDelta extends Record<string | number | symbol, TTarget>, TCollection extends DeltaCollection<TDelta> = DeltaCollection<TDelta>> {
    protected deltaCollections: [TCollection, ...TCollection[]];

    constructor(deltas: [TCollection, ...TCollection[]]) {
        this.deltaCollections = deltas;
    }

    /**
     * get the things for this version
     * @param v 
     * @returns the things for this version, or undefined if this version does not exist
     */
    getVersion(v: number): Record<keyof TCollection, TTarget[]> | undefined {

        if (v >= 0 && v < this.deltaCollections.length) {
            // build the base object
            const head = (Object.keys(this.deltaCollections[0]) as (keyof TCollection)[]).reduce<Record<keyof TCollection, TTarget[]>>((acc, k) => {
                acc[k] = [];
                return acc;
            }, {} as Record<keyof TCollection, TTarget[]>);


            // apply all the deltas in sequence
            for (const deltaCollection of this.deltaCollections.slice(0, v + 1)) {
                for (const k in deltaCollection) {
                    if (deltaCollection[k] !== undefined) {
                        // apply each of the three components to the head

                        // apply all the additions
                        if (deltaCollection[k].add !== undefined) {
                            head[k].push(...deltaCollection[k].add);
                        }

                        // apply all the removals
                        if (deltaCollection[k].remove !== undefined) {
                            // remove will be flagged as possibly undefined
                            // in the filter unless take a copy. odd
                            const remove = deltaCollection[k].remove;
                            head[k] = head[k].filter(x => !(remove.has(x.UUID)));
                        }

                        // apply all the updates
                        // check each object for modifications, and apply each one if it exists
                        if (deltaCollection[k].modify !== undefined) {
                            for (const x of head[k]) {
                                if (x.UUID in deltaCollection[k].modify) {
                                    x.patch(deltaCollection[k].modify[x.UUID]);
                                }
                            }
                        }
                    }
                }
            }

            return head;
        }
        else {
            return undefined;
        }
    }
}