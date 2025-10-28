import { page } from "$app/state";

export function isValidOdds(xs: unknown): xs is [number, number, number, number] {
    function isValidOdd(x: unknown): x is number {
        return typeof x === 'number' && !Number.isNaN(x) && Number.isFinite(x) && x >= 0 && x <= 1;
    };

    return Array.isArray(xs) && xs.length === 4 && xs.every(isValidOdd) && xs.every((_, i, xs) => (i === 0 || xs[i] >= xs[i - 1]));
}

export function getOddsFromURL(): [number, number, number, number] | null {
    const maybeOdds = page.url.searchParams.getAll("o").map(x => Number.parseFloat(x));

    if (isValidOdds(maybeOdds)) {
        return maybeOdds as [number, number, number, number];
    }
    return null;
}