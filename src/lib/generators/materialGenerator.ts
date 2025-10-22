import { mkGen } from "$lib/generators/recursiveGenerator";

export const metalGenerator = mkGen((rng) => {
    return [].choice(rng);
})