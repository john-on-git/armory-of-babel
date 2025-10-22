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

export const singularWildAnimalArr = [
    "a wolf",
    "a fox",
    "a bear",
    "a badger",
    "a hedgehog",
    "a python",
    "a cobra",
    "an elephant",
    "an anteater",
    "a giant ant",
    "a giant bee",
    "a giant dragonfly",
    "a hawk",
    "an owl",
    "an eagle",
    "a seal",
    "a tiger",
    "a lion",
    "a crow"
] as const;
export const singularWildAnimal = mkGen((rng) => choice(singularWildAnimalArr, rng));


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