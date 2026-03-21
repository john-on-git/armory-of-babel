<script lang="ts">
    import WeaponDisplay from "$lib/components/weaponDisplay.svelte";
    import type { WeaponViewModel } from "$lib/generators/weaponGenerator/weaponGeneratorTypes.js";
    import FinderWorker from "./finderWorker.js?worker";

    /** Number of threads to create. Each thread will check every Nth weapon.
     * Must be kept synced with the matching variable in finderWorker.js.
     */
    export const N_THREADS = 16;

    /** Gives the completion status of each worker.
     */
    let workerResults = $state<("working" | "resolved" | "rejected")[] | null>(
        null,
    );

    let weapons = $state<WeaponViewModel[] | null>(null);

    /*
     * Manual utility to find weapons with a particular feature
     */
    async function findWeaponAsync() {
        try {
            const start = new Date();
            const workers = new Array(N_THREADS)
                .fill(null)
                .map(() => new FinderWorker());

            workerResults = new Array(N_THREADS).fill("working");

            const validWeapons = await Promise.any(
                workers.map((worker, workerStartIndex) => {
                    worker.postMessage(workerStartIndex);
                    return new Promise<WeaponViewModel[]>((res, rej) => {
                        worker.onmessage = (e) => {
                            if (workerResults !== null) {
                                workerResults[workerStartIndex] = "resolved";
                            }
                            res(e.data as unknown as WeaponViewModel[]);
                        };
                        worker.onerror = (e) => {
                            if (workerResults !== null) {
                                workerResults[workerStartIndex] = "rejected";
                            }
                            rej(e.error);
                        };
                    });
                }),
            );

            console.log(
                `Found weapon @ ${validWeapons.map((x) => x.id).join(", ")} (${validWeapons.map((x) => x.rarity).join(", ")})`,
            );
            console.log(`${new Date().getTime() - start.getTime()} ms`);

            weapons = validWeapons;

            // terminate any remaining workers
            workers.forEach((worker) => worker.terminate());
            workerResults = null;
        } catch (e) {
            console.log("Failed to find weapon.");
        }
    }
</script>

<button
    onclick={findWeaponAsync}
    disabled={workerResults !== null &&
        workerResults.some((workerResult) => workerResult === "working")}
    >Find Weapons Debug
</button>
{#if weapons !== null}
    {#each weapons as weapon}
        <h1 style="text-align:center">{weapon.id}</h1>
        <WeaponDisplay {weapon} fadeLock={true} />
        <hr />
    {/each}
{/if}
