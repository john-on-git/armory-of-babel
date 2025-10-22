import type seedrandom from "seedrandom";

export { };
declare global {
  interface Array<T> {
    /**
     * Choose a (psuedo)random element from the Array.
     * @returns a random element from the Array.
     */
    choice: (rng: seedrandom.PRNG) => T;
  }
  interface Set<T> {
    /**
     * Choose a (psuedo)random element from the Set.
     * @returns a random element from the Set.
     */
    choice: (rng: seedrandom.PRNG) => T;
  }
}

export function choice<T>(set: Set<T>, rng: seedrandom.PRNG): T;
export function choice<T>(arr: T[] | readonly T[], rng: seedrandom.PRNG): T;
export function choice<T>(collection: Set<T> | T[] | readonly T[], rng: seedrandom.PRNG): T | undefined {
  if (collection instanceof Set) {
    const choice = Math.floor(collection.size * rng());
    let i = 0;
    for (const x of collection) {
      if (i == choice) {
        return x;
      }
      i++;
    }
  }
  else {
    return collection[Math.floor(collection.length * rng())];
  }
}

if (!Array.prototype.choice) {
  Array.prototype.choice = function (rng: seedrandom.PRNG) { return choice(this, rng); }
}
if (!Set.prototype.choice) {
  Set.prototype.choice = function (rng: seedrandom.PRNG) { return choice(this, rng); }
}