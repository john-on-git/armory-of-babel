import type { Pronouns } from "$lib/generators/weaponGenerator/weaponGeneratorTypes";
import "$lib/util/choice";
import type { PRNG } from "seedrandom";
import { mkGen, StringGenerator } from "./recursiveGenerator";

function genderedChoice(rng: PRNG, pronouns: Exclude<Pronouns, 'object' | 'enby'>, femmNames: string[], mascNames: string[]): string;
function genderedChoice(rng: PRNG, pronouns: Exclude<Pronouns, 'object'>, femmNames: string[], mascNames: string[], enbyNames: string[]): string;
function genderedChoice(rng: PRNG, pronouns: Exclude<Pronouns, 'object'>, femmNames: string[], mascNames: string[], enbyNames?: string[]): string {
    function getNames(pronouns: Exclude<Pronouns, 'object'>): string[] {
        switch (pronouns) {
            case "enby":
                return enbyNames as string[];
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

const angloNamesByPartShortSuffixGenerator = mkGen<string, [Exclude<Pronouns, 'object' | 'enby'>]>((...args) => genderedChoice(...args,
    [
        "rryl",
        "ley",
        "ya",
        "cy",
        "cey",
    ],
    [
        "vin",
        "gan",
        "rron",
        "sh",
    ]));

const angloNamesByPartLongSuffixGenerator = new StringGenerator<[Exclude<Pronouns, 'object' | 'enby'>]>([
    mkGen(rng => ["t", "y", "rr", "nn", "s", "sh"].choice(rng)),
    mkGen((...args) => genderedChoice(...args,
        [
            "ah",
            "ley",
            "leigh",
            "cy",
            "cey",
        ],
        [
            "on",
            "in",
        ]))
]);


export const angloNamesByPartGenerator = new StringGenerator<[Exclude<Pronouns, 'object' | 'enby'>]>([
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

const angloFixedNamedGenerator = mkGen((...args: [PRNG, Exclude<Pronouns, 'object'>]) => genderedChoice(...args,
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
    ],
    [
        "Alex",
        "Sam",
        "Ellis",
        "Kai",
        "Ash",
        "Charlie",
    ]));

/**
 * fixed first name generator lacks support for enby names at the moment.
 */
export const angloFirstNameGenerator = mkGen((rng, pronouns: Exclude<Pronouns, 'object'>) => pronouns === 'enby' ? angloFixedNamedGenerator.generate(rng, pronouns) : [
    angloFixedNamedGenerator,
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
        ["a", "ia", "ina", "ira"],
        ["ius", "us", "ion", "or"],
        ['as', "er"],
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