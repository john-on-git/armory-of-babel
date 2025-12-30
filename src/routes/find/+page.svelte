<script lang="ts">
    import type { WeaponViewModel } from "$lib/generators/weaponGenerator/weaponGeneratorTypes.js";
    import FinderWorker from "./finderWorker.js?worker";

    /** Number of threads to create. Each thread will check every Nth weapon.
     * Must be kept synced with the matching variable in finderWorker.js.
     */
    export const N_THREADS = 10;

    /*
     * Manual utility to find weapons with a particular feature
     */
    async function findWeaponAsync() {
        try {
            const start = new Date();
            const workers = new Array(N_THREADS)
                .fill(null)
                .map(() => new FinderWorker());

            const validWeapons = await Promise.any(
                workers.map((worker, workerStartIndex) => {
                    worker.postMessage(workerStartIndex);
                    return new Promise<WeaponViewModel[]>((res, rej) => {
                        worker.onmessage = (e) =>
                            res(e.data as unknown as WeaponViewModel[]);
                        worker.onerror = (e) => rej(e.error);
                    });
                }),
            );

            console.log(
                `Found weapon @ ${validWeapons.map((x) => x.id).join(", ")} (${validWeapons.map((x) => x.rarity).join(", ")})`,
            );
            console.log(`${new Date().getTime() - start.getTime()} ms`);

            // terminate any remaining workers
            workers.forEach((worker) => worker.terminate());
        } catch (e) {
            console.log("Failed to find weapon.");
        }
    }
</script>

<button onclick={findWeaponAsync}>Find Weapons Debug</button>
