
abstract class Patchable {
    UUID: string;

    constructor(UUID: string) {
        this.UUID = UUID;
    }

    patch(other: typeof this) {
        for (const k of Object.keys(this) as (keyof this)[]) {
            this[k] = structuredClone(other[k]);
        }
    };
}

interface Delta<T extends Patchable> {
    add: Iterable<T>;
    remove: Set<string>;
    modify: Record<string, T>;
}

interface DeltaCollection<T extends Patchable> {
    [k: string | number | symbol]: Delta<T>;
}


export abstract class VersionController<T extends Patchable, TCollection extends DeltaCollection<T>> {
    protected deltaCollections: [TCollection, ...TCollection[]];

    constructor(deltas: [TCollection, ...TCollection[]]) {
        this.deltaCollections = deltas;
    }

    /**
     * get the features for this version
     * @param v 
     * @returns the features for this version, or undefined if this version does not exist
     */
    getVersion(v: number): Record<keyof TCollection, T[]> | undefined {

        if (v >= 0 && v < this.deltaCollections.length) {
            // build the base object
            const head = (Object.keys(this.deltaCollections[0]) as (keyof TCollection)[]).reduce<Record<keyof TCollection, T[]>>((acc, k) => {
                acc[k] = [];
                return acc;
            }, {} as Record<keyof TCollection, T[]>);

            // apply all the deltas in sequence
            for (const deltaCollection of this.deltaCollections) {
                for (const k in deltaCollection) {
                    // apply each of the three components to the head

                    // apply all the additions
                    head[k].push(...deltaCollection[k].add);

                    // apply all the removals
                    head[k].filter(x => !deltaCollection[k].remove.has(x.UUID));

                    // apply all the updates
                    // check each object for modifications, and apply each one if it exists
                    for (const x of head[k]) {
                        if (x.UUID in deltaCollection[k].modify) {
                            x.patch(deltaCollection[k].modify[x.UUID]);
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