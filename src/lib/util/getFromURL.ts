

export function isValidOdd(x: unknown): x is number {
    return typeof x === 'number' && !Number.isNaN(x) && Number.isFinite(x) && x >= 0 && x <= 1;
};

export function getOddsFromURL(
    urlParams: URLSearchParams = new URLSearchParams(
        window.location.search,
    ),
): [number, number, number, number] | null {
    const maybeOdds = urlParams.getAll("rarityOdds").map(x => Number.parseFloat(x));

    if (maybeOdds.length === 4 && maybeOdds.every(isValidOdd)) {
        return maybeOdds as [number, number, number, number];
    }
    return null;
}