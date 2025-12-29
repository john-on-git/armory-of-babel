import type { Weapon } from "$lib/generators/weaponGenerator/weaponGeneratorTypes";
import { choice } from "$lib/util/choice";
import { mkGen } from "./recursiveGenerator";

export const singularHolyFoe = mkGen((rng) => [
    "an angel",
    "a priest"
].choice(rng));

export const pluralHolyFoe = mkGen((rng) => [
    "angels",
    "priests",
].choice(rng))

export const singularUnholyFoe = mkGen((rng) => choice([
    "a satanist",
    "a cannibal",
    "a demon",

    "a vampire",
    "an undead",
    "a ghost",
    "a ghoul",
    "a wendigo",
    "a skinwalker",

    "an automaton",

    "an orc",
    "a goblin"
] as const, rng));

export const pluralUnholyFoe = mkGen((rng) => choice([
    "satanists",
    "cannibals",
    "demons",

    "vampires",
    "undead",
    "ghost",
    "ghouls",
    "wendigos",
    "shapeshifters",

    "automatons",

    "orcs",
    "goblins",
] as const, rng));

export const wildAnimalArr = [
    { article: 'a', singular: 'wolf', plural: "wolves" },
    { article: 'a', singular: 'fox', plural: "foxes" },
    { article: 'a', singular: 'bear', plural: "bears" },
    { article: 'a', singular: 'badger', plural: "badgers" },
    { article: 'a', singular: 'hedgehog', plural: "hedgehogs" },
    { article: 'a', singular: 'python', plural: "pythons" },
    { article: 'a', singular: 'cobra', plural: "cobras" },
    { article: 'an', singular: 'elephant', plural: "elephants" },
    { article: 'an', singular: 'anteater', plural: "anteaters" },
    { article: 'a', singular: 'giant ant', plural: "giant ants" },
    { article: 'a', singular: 'giant bee', plural: "giant bees" },
    { article: 'a', singular: 'giant dragonfly', plural: "giant dragonflies" },
    { article: 'a', singular: 'hawk', plural: "hawks" },
    { article: 'an', singular: 'owl', plural: "owls" },
    { article: 'an', singular: 'eagle', plural: "eagles" },
    { article: 'a', singular: 'seal', plural: "seals" },
    { article: 'a', singular: 'tiger', plural: "tigers" },
    { article: 'a', singular: 'lion', plural: "lions" },
    { article: 'an', singular: 'crow', plural: "crows" }
] as const satisfies { article: 'a' | 'an'; singular: string; plural: string }[];

export const singularWildAnimal = mkGen((rng) => {
    const { singular: animal, article } = choice(wildAnimalArr, rng) ?? wildAnimalArr[0];
    return `${article} ${animal}` as const;
});

export const singularWildAnimalStructured = mkGen((rng) => choice(wildAnimalArr, rng) ?? wildAnimalArr[0]);



const coldAndMagicHornsAndAntlers = [
    ["yeti", "horn"],
    ["white dragon", "horn"],
    ["minotaur", "horn"]
] as const satisfies [string, string][];

const hotAndMagicHornsAndAntlers = [
    ["red dragon", "horn"],
    ["orange dragon", "horn"],
    ["blue dragon", "horn"],
    ["satyr", "horn"],
    ["demon", "horn"],
    ["djinn", "skin"],
] as const satisfies [string, string][];

const coldBiomeHornsAndTusks = [
    ["auroch", "horn"],
    ["mammoth", "tusk"],
    ["mountain goat", "horn"],
    ["walrus", "tusk"],
    ["narwhal", "horn"],
    ["reindeer", "antler"],
    ...coldAndMagicHornsAndAntlers
] as const satisfies [string, string][];

const hotBiomeHornsAndAntlers = [
    ["rhino", "horn"],
    ["Arsinoitherium ", "horn"],
    ["gazelle", "horn"],
    ["buffallo", "horn"],
    ["impala", "antler"],
    ["ibex", "antler"],
    ...hotAndMagicHornsAndAntlers
] as const satisfies [string, string][];



const evilSkinAnimals = [
    ["human", "skin"],
    ["elf", "skin"],
    ["orc", "skin"],
    ["dwarf", "skin"],
    ["monkey", "skin"],
    ["seal", "fur"],
    ["puppy", "fur"],
    ["kitten", "fur"],
    ["crocodile", "skin"],
    ["cobra", "skin"],
] as const satisfies [string, string][];

export const coldBiomeHorn = mkGen((rng) => choice(coldBiomeHornsAndTusks, rng));
export const hotBiomeHorn = mkGen((rng) => choice(hotBiomeHornsAndAntlers, rng));
export const magicAnimalHorn = mkGen((rng, weapon: Weapon) => choice(
    [
        ...(weapon.themes.some(x => x === 'light') ? [
            ["moon dragon", "horn"],
        ] : []),
        ...(weapon.themes.some(x => x === 'light' || x === 'fire') ? [
            ["gold dragon", "horn"],
        ] : []),
        ...(weapon.themes.some(x => x === 'dark' || x === 'fire') ? [
            ["cacodemon", "leather"],
        ] : []),
        ...(weapon.themes.some(x => x === 'fire') ? hotAndMagicHornsAndAntlers : []),
        ...(weapon.themes.some(x => x === 'dark') ? [
            ["black dragon", "horn"],
            ["demon", "horn"],
        ] : []),
        ...(weapon.themes.some(x => x === 'ice') ? coldAndMagicHornsAndAntlers : []),
        ["purple dragon", "horn"],
        ["cyclops", "horn"]
    ] as const, rng));
export const darkAnimalSkin = mkGen((rng) => choice(evilSkinAnimals, rng));