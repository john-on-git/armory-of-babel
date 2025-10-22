import type { Pronouns } from "$lib/generators/weaponGenerator/weaponGeneratorTypes";
import "$lib/util/choice";
import type { PRNG } from "seedrandom";
import { mkGen, StringGenerator } from "./recursiveGenerator";

function genderedChoice(rng: PRNG, pronouns: Exclude<Pronouns, 'object'>, enbyNames: string[], femmNames: string[], mascNames: string[]) {
    function getNames(pronouns: Exclude<Pronouns, 'object'>): string[] {
        switch (pronouns) {
            case "enby":
                return enbyNames;
            case "femm":
                return femmNames;
            case "masc":
                return mascNames;
            default:
                return pronouns satisfies never;
        }
    }
    return getNames(pronouns).choice(rng);
}

const angloNamesByPartShortSuffixGenerator = new StringGenerator<[Exclude<Pronouns, 'object'>]>([
    mkGen(rng => [
        "vin",
        "gan",
        "rron",
        "sh",

        "rryl",
        "ley",
        "ya",
        "cy",
        "cey",
    ].choice(rng))
]);
const angloNamesByPartLongSuffixGenerator = new StringGenerator<[Exclude<Pronouns, 'object'>]>([
    mkGen(rng => ["t", "y", "rr", "nn", "s", "sh"].choice(rng)),
    mkGen(rng => [
        "on",
        "in",
        "ah",
        "ley",
        "leigh",
        "cy",
        "cey",
    ].choice(rng))
]);


export const angloNamesByPartGenerator = new StringGenerator<[Exclude<Pronouns, 'object'>]>([
    mkGen(rng => [
        "A",
        "Cha",
        "Ba",
        "Da",
        "Ka",
        "Ke",
        "Pe",
        "Ha",
        "Le",
        "La",
        "Cla",
    ].choice(rng)),
    mkGen((rng, ...args) => [angloNamesByPartShortSuffixGenerator, angloNamesByPartLongSuffixGenerator].choice(rng).generate(rng, ...args)),
]);
export const angloFirstNameGenerator = mkGen((rng, pronouns: Exclude<Pronouns, 'object'>) => [
    mkGen((...args: [typeof rng, typeof pronouns]) => genderedChoice(...args,
        [
            "Alex",
            "Sam",
            "Ellis",
            "Kai",
            "Ash",
            "Charlie",

        ],
        [
            "Mary",
            "Eve",
            "Ashley",
            "Alice",
            "Triss",
            "Stacy",
            "Lucy",
            "Lily",
            "Rose",
            "Elizabeth",
            "Jessica",
            "Emma",
            "Abigail",
            "Megan",
            "Sarah",
            "Julia",
            "Kate",
            "Karen",
            "Carol"
        ],
        [
            "Tom",
            "Richard",
            "Harry",
            "Edward",
            "Jack",
            "Paul",
            "George",
            "Logan",
            "Ethan",
            "Bill",
            "Winston",
            "Lewis",
            "Luke",
            "John",
            "Peter",
            "Philip",
            "Thomas",
            "Simon",
            "James",
            "Andrew"
        ])),
    angloNamesByPartGenerator
].choice(rng).generate(rng, pronouns));

export const grecoRomanFirstNameGenerator = new StringGenerator<[Exclude<Pronouns, 'object'>]>([
    mkGen((rng) => [
        "Lacri",
        "Lace",
        "Moro",
        "Ala",
        "Tri",
        "Be",
        "Di",
        "Ma",
        "Pe",
    ].choice(rng)),
    mkGen((rng) => [
        "mer",
        "v",
        "t",
        "c",
        "m",
        "n",
        "l",
        "s"
    ].choice(rng)),

    mkGen((rng, pronouns) => genderedChoice(rng, pronouns,
        ['e'],
        ["a", "ia", "ina", "ira"],
        ["ius", "us", "ion", "or"]
    ))
]);

// const swordLikeObjectifyingNameGenerator = (weapon: Weapon, adjectiveProvider: WeaponFeatureProvider<WeaponAdjective>) => mkGen((rng) =>
//     [
//         new StringGenerator<[Exclude<Pronouns, 'object'>]>([
//             mkGen((rng) =>
//                 genStr(rng, ((rng: PRNG) => [
//                     mkGen(rng => genStr(rng, Array.from(adjectiveProvider.available(weapon)).map(x => genStr(rng, x.desc)).filter(x => x.length <= 6).choice(rng))),
//                 ].choice(rng))(rng))
//             ),
//             mkGen([
//                 'slayer',
//                 'edge',
//                 'brandt',
//                 'tongue',
//                 'fang',
//                 'hammer',
//             ].choice(rng))
//         ])
//     ].choice(rng).generate(rng)
// );

// export const objectifyingNameFor: Record<string, (weapon: Weapon, adjectiveProvider: WeaponFeatureProvider<WeaponAdjective>) => TGenerator<string>> = {
//     // "club": TODO,
//     // "staff": TODO,

//     "dagger": swordLikeObjectifyingNameGenerator,
//     "sword": swordLikeObjectifyingNameGenerator,
//     "greatsword": swordLikeObjectifyingNameGenerator,
//     "sword (or bow)": swordLikeObjectifyingNameGenerator,

//     // "axe": TODO,
//     // "greataxe": TODO,

//     // "mace": TODO,

//     // "spear": TODO,

//     // "polearm": TODO,

//     // "lance": TODO,
//     // "dagger (or pistol)": TODO
//     // "sword (or musket)": TODO
// }

// export const mkObjectifyingNameGenerator = (weapon: Weapon, adjectiveProvider: WeaponFeatureProvider<WeaponAdjective>) => objectifyingNameFor[weapon.shape.group](weapon, adjectiveProvider);