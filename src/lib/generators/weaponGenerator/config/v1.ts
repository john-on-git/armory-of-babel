import { pluralUnholyFoe, singularUnholyFoe, singularWildAnimal } from "$lib/generators/foes";
import { mkGen, StringGenerator, type TGenerator } from "$lib/generators/recursiveGenerator";
import { animeWeaponShapes, edgedWeaponShapeFamilies, ephBlack, ephBlue, ephCold, ephGreen, ephHot, ephRed, grippedWeaponShapeFamilies, holdingParts, importantPart, MATERIALS, MISC_DESC_FEATURES, wrappableParts } from "$lib/generators/weaponGenerator/config/configConstants";
import { ProviderElement } from "$lib/generators/weaponGenerator/provider";
import { genMaybeGen, mkWepToGen, textForDamage, toLang, toProviderSource } from "$lib/generators/weaponGenerator/weaponGeneratorLogic";
import { type ActivePower, type DamageDice, type PassivePower, type Personality, type RechargeMethod, type Theme, type Weapon, type WeaponFeaturesTypes, type WeaponPowerCond, type WeaponRarity, type WeaponShape } from "$lib/generators/weaponGenerator/weaponGeneratorTypes";
import "$lib/util/string";
import { PrimitiveContainer, type DeltaCollection } from "$lib/util/versionController";
import _ from "lodash";

const agentOfExtractivism = mkGen((rng) =>
    [
        "a logging company",
        "a mining company",
        "a fur trader",
        "a poacher"
    ].choice(rng)
);

export default {
    themes: {
        add: [
            "fire" as const,
            "ice" as const,
            "cloud" as const,
            "dark" as const,
            "light" as const,
            "sweet" as const,
            "sour" as const,
            "wizard" as const,
            "steampunk" as const,
            "nature" as const
        ].map(theme => new PrimitiveContainer(theme))
    },
    descriptors: {
        add: [
            new ProviderElement('material-extravagant-hard',
                {
                    generate: (rng) => {
                        return [
                            MATERIALS.silver,
                            MATERIALS.gold,
                            MATERIALS["rose gold"],
                            MATERIALS['white gold'],
                            MATERIALS['purple gold'],
                            MATERIALS['blue gold'],
                            MATERIALS.platinum,
                            MATERIALS.palladium,
                        ].choice(rng);
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    themes: {
                        none: ['nature']
                    }
                }
            ),
            new ProviderElement('material-primitive-hard',
                {
                    generate: (rng) => {
                        return [
                            MATERIALS.tin,
                            MATERIALS.copper,
                            MATERIALS.bronze,
                            MATERIALS.flint,
                        ].choice(rng);
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    themes: {
                        any: ['nature', 'earth', 'fire']
                    }
                }
            ),

            new ProviderElement('material-fire-hard',
                {
                    generate: (rng) => {
                        return [
                            MATERIALS['scarlet steel'],
                            MATERIALS.flint,
                            MATERIALS.goldPlated,
                            MATERIALS.gold,
                            MATERIALS["rose gold"],
                        ].choice(rng);
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    themes: {
                        any: ['fire']
                    }
                }
            ),
            new ProviderElement('material-fire-holding',
                {
                    generate: (rng) => genMaybeGen([
                        MATERIALS.scorchedWood,
                        MATERIALS.glass,
                        MATERIALS.quartz,
                        MATERIALS.porcelain,
                        MATERIALS.hotHorn
                    ].choice(rng), rng),
                    applicableTo: {
                        any: holdingParts
                    }
                },
                {
                    themes: {
                        any: ['fire']
                    },
                    shapeFamily: {
                        any: grippedWeaponShapeFamilies
                    }
                }
            ),

            new ProviderElement('material-ice-hard-mundane',
                {
                    generate: (rng) => {
                        return [
                            MATERIALS["boreal steel"],
                            MATERIALS.silver,
                            MATERIALS.silverPlated,
                            MATERIALS["white gold"],
                        ].choice(rng);
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    themes: {
                        any: ['ice']
                    },
                    rarity: {
                        lte: 'rare',
                    }
                }
            ),

            new ProviderElement('material-ice-hard-rare',
                {
                    generate: (rng) => {
                        return [
                            MATERIALS.iceLikeSteel,
                            MATERIALS.glassLikeSteel,
                            MATERIALS["glass"],
                            MATERIALS["boreal steel"],
                            MATERIALS.silver,
                            MATERIALS.silverPlated,
                            MATERIALS["white gold"],
                        ].choice(rng);
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    themes: {
                        any: ['ice']
                    },
                    rarity: {
                        gte: 'epic',
                    }
                }
            ),
            new ProviderElement('material-ice-holding',
                {
                    generate: (rng) => {
                        return genMaybeGen([
                            MATERIALS.ivory,
                            MATERIALS.pine,
                            MATERIALS.coldHorn
                        ].choice(rng), rng);
                    },
                    applicableTo: {
                        any: holdingParts
                    }
                },
                {
                    themes: {
                        any: ['ice']
                    },
                    shapeFamily: {
                        any: grippedWeaponShapeFamilies
                    }
                }
            ),

            new ProviderElement('material-cloud-hard',
                {
                    generate: (rng) => {
                        return [
                            MATERIALS["meteoric iron"],
                            MATERIALS.silver,
                            MATERIALS.iceLikeSteel,
                        ].choice(rng);
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    themes: {
                        any: ['cloud']
                    }
                }
            ),
            new ProviderElement('material-cloud-holding',
                {
                    generate: (rng, weapon) => {
                        return genMaybeGen([
                            MATERIALS.alabaster,
                            MATERIALS.ivory,
                            MATERIALS.silver,
                            MATERIALS.silverPlated,
                            MATERIALS.aetherWood,
                            weapon.rarity === 'legendary' ? MATERIALS.heavenlyPeachWood : MATERIALS.alabaster,
                        ].choice(rng), rng);
                    },
                    applicableTo: {
                        any: holdingParts
                    }
                },
                {
                    themes: {
                        any: ['cloud']
                    },
                    shapeFamily: {
                        any: grippedWeaponShapeFamilies
                    }
                }
            ),


            new ProviderElement('material-earth-hard',
                {
                    generate: (rng) => {
                        return [
                            MATERIALS.alabaster,
                            MATERIALS.bronze,
                            MATERIALS.diamond,
                            MATERIALS.amethyst,
                            MATERIALS.emerald,
                            MATERIALS.flint,
                            MATERIALS.fossils,
                            MATERIALS.gold,
                            MATERIALS["rose gold"],
                            MATERIALS["white gold"],
                            MATERIALS.granite,
                            MATERIALS.marble,
                            MATERIALS.onyx,
                            MATERIALS.quartz,
                            MATERIALS.ruby,
                            MATERIALS.sandstone,
                            MATERIALS.sapphire,
                        ].choice(rng);
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    themes: {
                        any: ['earth']
                    }
                }
            ),
            new ProviderElement('material-earth-holding',
                {
                    generate: (rng) => {
                        return [
                            MATERIALS.alabaster,
                            MATERIALS.fossils,
                            MATERIALS.granite,
                            MATERIALS.marble,
                            MATERIALS.onyx,
                            MATERIALS.quartz,
                            MATERIALS.sandstone,
                        ].choice(rng);
                    },
                    applicableTo: {
                        any: holdingParts
                    }
                },
                {
                    themes: {
                        any: ['earth']
                    },
                    shapeFamily: {
                        any: grippedWeaponShapeFamilies
                    }
                }
            ),

            new ProviderElement('material-dark-hard-mundane',
                {
                    generate: (rng) => {
                        return [
                            MATERIALS.obsidian,
                            MATERIALS.onyx,
                            MATERIALS["black iron"],
                            MATERIALS["meteoric iron"],
                        ].choice(rng);
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    themes: {
                        any: ['dark']
                    },
                    rarity: {
                        lte: 'rare',
                    }
                }
            ),
            new ProviderElement('material-dark-hard-rare',
                {
                    generate: (rng) => {
                        return [
                            MATERIALS["black iron"],
                            MATERIALS["meteoric iron"],
                            MATERIALS.adamantum,
                            MATERIALS.darkness
                        ].choice(rng);
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    themes: {
                        any: ['dark']
                    },
                    rarity: {
                        gte: 'epic',
                    }
                }
            ),

            new ProviderElement('material-dark-holding',
                {
                    generate: (rng) => {
                        return genMaybeGen([
                            MATERIALS.ebonyWood,
                            MATERIALS.darkLeather,
                            MATERIALS.darkLeather,
                        ].choice(rng), rng);
                    },
                    applicableTo: {
                        any: holdingParts
                    }
                },
                {
                    themes: {
                        any: ['dark']
                    },
                    shapeFamily: {
                        any: grippedWeaponShapeFamilies
                    }
                }
            ),

            new ProviderElement('material-dark-ice',
                {
                    generate: (rng) => {
                        return [
                            MATERIALS.iceBlood
                        ].choice(rng);
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    themes: {
                        all: ['dark', 'ice']
                    }
                }
            ),

            new ProviderElement('material-light-hard-mundane',
                {
                    generate: (rng) => {
                        return [
                            MATERIALS["white gold"],
                            MATERIALS.silver,
                            MATERIALS.silverPlated,
                            MATERIALS.crystal,
                        ].choice(rng);
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    themes: {
                        any: ['light']
                    },
                    rarity: {
                        lte: 'uncommon',
                    }
                }
            ),
            new ProviderElement('material-light-hard-rare',
                {
                    generate: (rng) => {
                        return [
                            MATERIALS.light,
                            MATERIALS.glass,
                            MATERIALS["white gold"],
                            MATERIALS.silver,
                            MATERIALS.silverPlated,
                            MATERIALS.mythrel,
                            MATERIALS.crystal,
                            MATERIALS.diamond,
                        ].choice(rng);
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    themes: {
                        any: ['light']
                    },
                    rarity: {
                        gte: 'rare',
                    }
                }
            ),
            new ProviderElement('eat-to-heal-forced',
                {
                    generate: (rng) => {
                        return [
                            MATERIALS.hardCandy,
                            MATERIALS.rockCandy,
                            MATERIALS.gingerbread,
                        ].choice(rng);
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    never: true
                }
            ),

            new ProviderElement('material-sweet-hard',
                {
                    generate: (rng) => {
                        return [
                            MATERIALS.hardCandy
                        ].choice(rng);
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    themes: {
                        any: ['sweet']
                    }
                }
            ),
            new ProviderElement('material-sweet-holding',
                {
                    generate: (rng) => {
                        return [
                            MATERIALS.maple,
                            MATERIALS.liquoriceRoot,
                            MATERIALS.dateWood
                        ].choice(rng);
                    },
                    applicableTo: {
                        any: holdingParts
                    }
                },
                {
                    themes: {
                        any: ['sweet']
                    },
                    shapeFamily: {
                        any: grippedWeaponShapeFamilies
                    }
                }
            ),

            new ProviderElement('material-sour-hard',
                {
                    generate: (rng) => {
                        return [
                            MATERIALS.citrine,
                            MATERIALS.acidium
                        ].choice(rng);
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    themes: {
                        any: ['sour']
                    }
                }
            ),
            new ProviderElement('material-sour-holding',
                {
                    generate: (rng) => {
                        return [
                            MATERIALS.lemonWood,
                        ].choice(rng);
                    },
                    applicableTo: {
                        any: holdingParts
                    }
                },
                {
                    themes: {
                        any: ['sour']
                    },
                    shapeFamily: {
                        any: grippedWeaponShapeFamilies
                    }
                }
            ),

            new ProviderElement('material-wizard-hard-mundane',
                {
                    generate: (rng) => {
                        return [
                            MATERIALS['tin'],
                            MATERIALS.quartz,
                            MATERIALS.crystal,
                            MATERIALS.amethyst
                        ].choice(rng);
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    themes: {
                        any: ['wizard']
                    },
                    rarity: {
                        lte: 'rare'
                    }
                }
            ),

            new ProviderElement('material-wizard-hard-rare',
                {
                    generate: (rng) => {
                        return [
                            MATERIALS["blue gold"],
                            MATERIALS['purple gold'],
                            MATERIALS.cobalt,
                            MATERIALS["glassLikeSteel"],
                            MATERIALS.force,
                            MATERIALS.quartz,
                            MATERIALS.sapphire,
                            MATERIALS.crystal,
                            MATERIALS.amethyst
                        ].choice(rng);
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    themes: {
                        any: ['wizard']
                    },
                    rarity: {
                        gte: 'rare'
                    }
                }
            ),

            new ProviderElement('material-wizard-nature',
                {
                    generate: (rng) => {
                        return [
                            MATERIALS.wiseWood,
                        ].choice(rng);
                    },
                    applicableTo: {
                        any: holdingParts
                    }
                },
                {
                    themes: {
                        all: ['wizard', 'nature']
                    }
                }
            ),
            new ProviderElement('misc-wizard-wrapping',
                {
                    generate: () => MISC_DESC_FEATURES.wrap.silkWrap,
                    applicableTo: {
                        any: wrappableParts
                    }
                },
                {
                    themes: {
                        any: ['wizard']
                    }
                }
            ),

            new ProviderElement('material-steampunk-hard',
                {
                    generate: (rng) => {
                        return [
                            MATERIALS.clockwork,
                            MATERIALS.tin,
                            MATERIALS.copper,
                            MATERIALS.brass,
                        ].choice(rng);
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    themes: {
                        any: ['steampunk']
                    }
                }
            ),

            new ProviderElement('material-nature-hard',
                {
                    generate: (rng, weapon) => {
                        return [
                            MATERIALS.oak,
                            MATERIALS.birch,
                            animeWeaponShapes.includes(weapon.shape.particular) ? MATERIALS.cherryNormal : MATERIALS.cherryAnime,
                            MATERIALS.ebonyWood,
                            MATERIALS.maple,
                            MATERIALS.ivory,
                            MATERIALS.beetleShell,
                            MATERIALS.ironWood
                        ].choice(rng);
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    themes: {
                        any: ['nature']
                    }
                }
            ),

            new ProviderElement('misc-charm-emojis',
                {
                    generate: () => MISC_DESC_FEATURES.charm.emojis,
                    applicableTo: {
                        any: wrappableParts
                    }
                },
                {
                    themes: {
                        any: ['nature', 'wizard', 'sweet']
                    }
                }
            ),

            new ProviderElement('club-staff-main-material-mundane',
                {
                    generate: (rng, weapon) => {
                        return [
                            MATERIALS.oak,
                            MATERIALS.pine,
                            MATERIALS.birch,
                            animeWeaponShapes.includes(weapon.shape.particular) ? MATERIALS.cherryNormal : MATERIALS.cherryAnime,
                            MATERIALS.ebonyWood,
                            MATERIALS.ironWood,
                        ].choice(rng);
                    },
                    applicableTo: {
                        any: holdingParts
                    }
                },
                {
                    shapeFamily: {
                        any: ['staff', 'club']
                    },
                    rarity: {
                        lte: 'rare',
                    }
                }
            ),
            new ProviderElement('club-staff-main-material-rare',
                {
                    generate: (rng) => {
                        return [
                            MATERIALS.oak,
                            MATERIALS.pine,
                            MATERIALS.birch,
                            MATERIALS.cherryNormal,
                            MATERIALS.ebonyWood,
                            MATERIALS.ironWood,
                            MATERIALS.bloodWood
                        ].choice(rng);
                    },
                    applicableTo: {
                        any: holdingParts
                    }
                },
                {
                    shapeFamily: {
                        any: ['staff', 'club']
                    },
                    rarity: {
                        lte: 'rare',
                    }
                }
            ),
            new ProviderElement('light-and-dark-blade',
                {
                    generate: () => ({
                        material: "two separate blades (adamant and mythrel), they're intertwined in a spiral pattern",
                        ephitet: { pre: 'Binary' }
                    }),
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    rarity: {
                        gte: 'epic'
                    },
                    themes: {
                        all: ['light', 'dark']
                    }
                }
            ),
            new ProviderElement('ice-and-fire-blade',
                {
                    generate: () => ({
                        material: "two separate parts, split down the middle: one half is boreal steel, the other scarlet steel",
                        ephitet: { pre: 'Bifurcated' }
                    }),
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    rarity: {
                        gte: 'epic'
                    },
                    themes: {
                        all: ['light', 'dark']
                    }
                }
            ),
            new ProviderElement('steam-blade',
                {
                    generate: () => ({
                        material: "a roiling mix of magical fire and water (which emits thick clouds of steam)",
                        ephitet: { pre: 'Steamy' }
                    }),
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    rarity: {
                        gte: 'epic'
                    },
                    themes: {
                        all: ['fire', 'cloud']
                    }
                }
            ),
            new ProviderElement('elemental-quadblade',
                {
                    generate: () => ({
                        material: "elementally infused metal, split into four distinct sections, each of which represents a different element",
                        ephitet: { post: 'of the Elemental Lord' }
                    }),
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    rarity: {
                        gte: 'legendary'
                    },
                    themes: {
                        all: ['earth', 'cloud', 'fire']
                    }
                }
            ),

            /*TODO
     
                // test links are for when weapon themes are  forced = ['light']
    
                energy-core-void
                energy-core-ultraviolet http://localhost:5173/?v=3&id=44174633692741450000&o=0.00&o=0.05&o=0.10&o=0.89 (epic)
    
                energy-core-azure
                energy-core-crimson
                energy-core-verdant: http://localhost:5173/?v=3&id=50765660529976975000&o=0.00&o=0.05&o=0.10&o=0.89 (legendary)
                energy-core-atomic
    
                energy-core-gold http://localhost:5173/?v=3&id=30740175778699964000&o=0.00&o=0.05&o=0.10&o=0.89 (legendary)
            */
            new ProviderElement('energy-core-void',
                {
                    generate: () => {
                        return {
                            descriptor: {
                                descType: 'possession',
                                singular: '',
                                plural: ''
                            },
                            ephitet: { pre: 'TODO' },
                        }
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    /**
                     * Can only be added by passive power "death blast"
                     */
                    never: true
                }
            ),
            new ProviderElement('energy-core-fire',
                {
                    generate: () => {
                        return {
                            descriptor: {
                                descType: 'possession',
                                singular: 'superheated section running down the middle of it (which emits dim orange light, hissing subtly as you move it around)',
                                plural: 'superheated section in the middle of them (which emit dim orange light, hissing subtly as you move them around)',
                            },
                            ephitet: mkGen((rng) => ephHot.choice(rng)),
                        }
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    /**
                     * Can only be added by passive power "death blast"
                     */
                    never: true
                }
            ),
            new ProviderElement('energy-core-ice',
                {
                    generate: () => {
                        return {
                            descriptor: {
                                descType: 'possession',
                                singular: 'a large crystal orb embedded in it (which contains a howling blizzard)',
                                plural: 'a set of large crystal orbs embedded in them (contain a welter of winter weather)'
                            },
                            ephitet: mkGen((rng) => ephCold.choice(rng)),
                        }
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    /**
                     * Can only be added by passive power "death blast"
                     */
                    never: true
                }
            ),
            new ProviderElement('energy-core-ultraviolet',
                {
                    generate: () => {
                        return {
                            descriptor: {
                                descType: 'possession',
                                singular: 'a glass bulb running down the middle (it blasts ultraviolet light in all directions)',
                                plural: 'glass bulb cylinders running down the middle (blasting ultraviolet light in all directions)'
                            },
                            ephitet: { pre: 'TODO' },
                        }
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    /**
                     * Can only be added by passive power "death blast"
                     */
                    never: true
                }
            ),
            new ProviderElement('energy-core-azure',
                {
                    generate: () => {
                        return {
                            descriptor: {
                                descType: 'possession',
                                singular: 'a river of sapphire curling through its center (waves of light ebb and flow within it)',
                                plural: 'rivers of sapphire curling through them (waves of light ebb and flow within)'
                            },
                            ephitet: mkGen((rng) => ephBlue.choice(rng)),
                        }
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    /**
                     * Can only be added by passive power "death blast"
                     */
                    never: true
                }
            ),
            new ProviderElement('energy-core-crimson',
                {
                    generate: () => {
                        return {
                            descriptor: {
                                descType: 'property',
                                singular: mkGen((_, __, partName) => `'s partially transparent, revealing a beating heart at its core, which emits a gentle crimson glow that diffuses through the ${partName}`),
                                plural: mkGen((_, __, partName) => `'re partially transparent, revealing luminous red veins, which spread a gentle crimson glow throughout the ${partName}`)
                            },
                            ephitet: mkGen((rng) => ephRed.choice(rng)),
                        }
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    /**
                     * Can only be added by passive power "death blast"
                     */
                    never: true
                }
            ),
            new ProviderElement('energy-core-verdant',
                {
                    generate: () => {
                        return {
                            descriptor: {
                                descType: 'possession',
                                singular: '',
                                plural: ''
                            },
                            ephitet: mkGen((rng) => ephGreen.choice(rng)),
                        }
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    /**
                     * Can only be added by passive power "death blast"
                     */
                    never: true
                }
            ),
            new ProviderElement('energy-core-atomic',
                {
                    generate: () => {
                        return {
                            descriptor: {
                                descType: 'possession',
                                singular: 'an integrated nuclear reactor which gives it a healthy glow',
                                plural: 'an integrated nuclear reactor which gives them a healthy glow'
                            },
                            ephitet: mkGen((rng) => [
                                { pre: 'Atomic' },
                                { pre: 'Nuclear' },
                                { pre: 'of the Mushroom Bombs' },
                            ].choice(rng)),
                        }
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    /**
                     * Can only be added by passive power "death blast"
                     */
                    never: true
                }
            ),
            new ProviderElement('energy-core-gold',
                {
                    generate: () => {
                        return {
                            descriptor: {
                                descType: 'property',
                                singular: "'s criss-crossed by a complex system of geometric lines, which glow with golden energy",
                                plural: "'re criss-crossed by a complex system of geometric lines, which glow with golden energy"
                            },
                            ephitet: { pre: 'TODO' },
                        }
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    /**
                     * Can only be added by passive power "death blast"
                     */
                    never: true
                }
            ),
            new ProviderElement('energy-core-dark',
                {
                    generate: () => {
                        return {
                            descriptor: {
                                descType: 'property',
                                singular: "'s shaped like a corkscrew (which surrounds a bolt of dark energy, crackling eternally at its center)",
                                plural: "'re shaped like corkscrews (each surrounds a bolt of dark energy, crackling eternally at its center)"
                            },
                            ephitet: mkGen((rng) => ephBlack.choice(rng)),
                        }
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    /**
                     * Can only be added by passive power "death blast"
                     */
                    never: true
                }
            ),
            new ProviderElement('energy-core-aether',
                {
                    generate: () => {
                        return {
                            descriptor: {
                                descType: 'possession',
                                singular: 'a large crack running down the middle of it (the edges glow with sky-blue energy, occasionally sparking with electricity)',
                                plural: 'a large crack running down the middle of them (their edges glow with sky-blue energy, and  occasionally sparki with electricity)'
                            },
                            ephitet: { pre: 'TODO' },
                        }
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    /**
                     * Can only be added by passive power "death blast"
                     */
                    never: true
                }
            ),
            new ProviderElement('energy-core-steampunk',
                {
                    generate: () => {
                        return {
                            descriptor: {
                                descType: 'possession',
                                singular: 'a glass tube running down the center (which crackles with electrical energy)',
                                plural: 'glass tube running down their center (which crackle with electrical energy)'
                            },
                            ephitet: { pre: 'TODO' },
                        }
                    },
                    applicableTo: {
                        any: importantPart
                    }
                },
                {
                    /**
                     * Can only be added by passive power "death blast"
                     */
                    never: true
                }
            ),
        ]
    },
    personalities: {
        add: [

            new ProviderElement("vengeful",
                {
                    desc: "Vengeful."
                },
                {
                    themes: {
                        any: ["fire", "ice", "dark", "sweet"]
                    },

                }
            ),
            new ProviderElement<Personality, WeaponPowerCond>("cruel",
                {
                    desc: "Cruel."
                },
                {
                    themes: {
                        any: ["sour", "dark"]
                    },

                }
            ),
            new ProviderElement<Personality, WeaponPowerCond>("curious",
                {
                    desc: "Curious."
                },
                {
                    themes: {
                        any: ["wizard", "steampunk", "cloud"]
                    },

                }
            ),
            new ProviderElement<Personality, WeaponPowerCond>("know-it-all",
                {
                    desc: "Know-it-All."
                },
                {
                    themes: {
                        any: ["wizard", "steampunk"]
                    },

                }
            ),
            ...toProviderSource({
                fire: [
                    "compassionate",
                    "irritable",
                    "flirty",
                    "standoffish",
                    "zealous",
                    "wrathful",
                    "kind",
                    "honest",
                ],
                ice: [
                    "cold",
                    "formal",
                    "haughty",
                    "idealistic",
                    "pitiless",
                    "reserved",
                    "serious",
                    "stubborn",
                ],
                cloud: [
                    "easy-going",
                    "acquiescent",
                ],
                sweet: [
                    "kind",
                    "excitable",
                    "manic",
                    "neurotic",
                ],
                sour: [
                    "antagonistic",
                    "pitiless",
                    "manic",
                    "sassy"
                ],
                dark: [
                    "shy",
                    "tries to act mysterious",
                    "quiet",
                    "depressive",
                    "angry",
                    "sadistic",
                    "enjoys provoking others"
                ],
                light: [
                    "logical",
                    "honest",
                    "pious",
                    "zealous",
                ],
                wizard: [
                    "overconfident"
                ],
                steampunk: [
                    "open-minded",
                    "impatient",
                    "skeptic"
                ],
                nature: [
                    "superstitious",
                    "gullible",
                    "patient"
                ],
                earth: [
                    "callous",
                    "Strong Work Ethic",
                    "greedy",
                    "distrustful of strangers",
                    "Detail-Oriented"
                ]
            }, (theme, personality, i) => {
                const formatted = personality.capFirst() + ".";
                return new ProviderElement<Personality, WeaponPowerCond>(`${theme}-${personality.toLowerCase().replaceAll(/\s/g, "-")}-${i}`,
                    {
                        desc: formatted
                    },
                    {
                        themes: { all: [theme as Theme] },
                    }
                )
            })
        ]
    },
    rechargeMethods: {
        add: [
            new ProviderElement<Personality, WeaponPowerCond>("recharge-at-winter-solstice",
                {
                    desc: mkWepToGen("all charges at noon on the winter solstice")
                },
                {

                    themes: {
                        any: ["ice", "nature"]
                    }
                }
            ),
            new ProviderElement<Personality, WeaponPowerCond>("recharge-at-summer-solstice",
                {
                    desc: mkWepToGen("all charges at noon on the summer solstice")
                },
                {

                    themes: {
                        any: ["fire", "nature"]
                    }
                }
            ),
            ...toProviderSource(
                {
                    fire: [
                        mkGen("all charges after being superheated"),
                    ],
                    ice: [
                        mkGen("all charges after being cooled to sub-zero"),
                        mkGen("one charge whenever its wielder builds a snowman"),
                        mkGen("one charge at the end of each scene where its wielder made an ice pun")
                    ],
                    dark: [
                        mkGen("one charge upon absorbing a human soul"),
                        mkGen("one charge at the end of each scene where its wielder destroyed an object unnecessarily"),
                        mkGen("all charges each day at the witching hour"),
                        mkGen("one charge when its wielder defenestrates a priest, or all charges if it was a high ranking priest")
                    ],
                    light: [
                        mkGen("all charges after an hour in a sacred space"),
                        mkGen("all charges each day at sunrise"),
                        new StringGenerator([
                            mkGen("one charge each time you defeat "),
                            singularUnholyFoe,
                        ])
                    ],
                    sweet: [
                        mkGen("one charge each time it eats an extravagant dessert"),
                        mkGen("all charges each time its wielder hosts a feast"),
                        mkGen("one charge each time its wielder gives a well-received compliment")
                    ],
                    sour: [
                        mkGen("all charges after an hour immersed in acid"),
                        mkGen("all charges when used to fell a citrus tree"),
                        mkGen("one charge each time its wielder insults someone")
                    ],
                    cloud: [
                        mkGen("all charges when struck by lightning"),
                        mkGen("all charges when its wielder survives a significant fall"),
                        mkGen("one charge each time you defeat a winged creature, or all charges if it was also a powerful foe"),
                    ],
                    wizard: [
                        mkGen("one charge when you cast one of your own spells"),
                        mkGen("all charges when its wielder learns a new spell"),
                        mkGen("all charges when its wielder wins a wizard duel"),
                        mkGen("one charge when its wielder finishes reading a new book"),
                        mkGen("all charges when its wielder views the night sky"),
                    ],
                    steampunk: [
                        mkGen("all charges when its wielder invents something"),
                        mkGen("all charges when its wielder throws a tea party"),
                        mkGen("one charge when its wielder breaks news"),
                    ],
                    earth: [
                        mkGen("one charge when its wielder throws a rock at something important"),
                        mkGen("all charges when its wielder meditates atop a mountain"),
                        mkGen("all charges when driven into the ground while something important is happening")
                    ],
                    nature: [
                        new StringGenerator(["all charges when its wielder drives ", agentOfExtractivism, " to bankruptcy"])
                    ]
                },
                (theme, x, i) => new ProviderElement<RechargeMethod, WeaponPowerCond>(`${theme}-recharge-${i}`,
                    {
                        desc: x
                    },
                    {
                        themes: { any: [theme as Theme] }
                    }
                ))
        ]
    },
    actives: {
        add: [
            new ProviderElement<ActivePower, WeaponPowerCond>('gravity-gun', {
                desc: 'Kinesis',
                cost: 1,
                additionalNotes: [
                    mkGen((rng, weapon) => {
                        const effects = {
                            light: 'The weapon emits a tether of luminous energy.',
                            fire: 'The weapon emit a fiery whip.',
                            nature: "A sturdy vine grows from the weapon's tip.",
                            cloud: "The weapon emits a vortex of air."
                        } satisfies Partial<Record<Theme, string>>;

                        const supportedThemesOfWeapon = weapon.themes.filter(theme => theme in effects) as (keyof typeof effects)[];

                        const tetherTheme = effects[supportedThemesOfWeapon.choice(rng)];
                        //const tetherTheme = typeof chosen === "string" ? chosen : chosen(rng)

                        return `${tetherTheme} It can lift and throw object an weighing up to 500 lbs.`;
                    })
                ]
            }, {
                themes: {
                    any: ['light', 'fire', 'nature', 'cloud']
                },
            }),
            new ProviderElement<ActivePower, WeaponPowerCond>("weapon-animal-transformation",
                {
                    desc: mkWepToGen("Animal Transformation"),
                    cost: 2,
                    additionalNotes: [
                        new StringGenerator([
                            mkGen("The weapon transforms into "),
                            singularWildAnimal,
                            mkGen(" until the end of the scene, or until it dies.")
                        ]),
                        "You can command it to turn back into its regular form early."
                    ]
                },
                {
                    themes: {
                        any: ["nature"],
                    }
                }
            ),
            new ProviderElement<ActivePower, WeaponPowerCond>(
                "fireball",
                { desc: "Fire Ball", cost: 4 },
                {
                    themes: { any: ["fire"] },
                    rarity: {
                        gte: "rare"
                    }
                }
            ),
            new ProviderElement<ActivePower, WeaponPowerCond>("wall-of-fire",
                {
                    desc: "Wall of Fire",
                    cost: 4
                },
                {
                    themes: { any: ["fire"] },
                    rarity: {
                        gte: "rare"
                    }
                }),
            new ProviderElement<ActivePower, WeaponPowerCond>("control-hot-weather",
                {
                    desc: "Control Weather",
                    cost: 2,
                    additionalNotes: [
                        "Must move conditions towards heatwave."
                    ],
                },
                {
                    themes: { any: ["fire"] },
                    rarity: {
                        lte: "rare"
                    }
                }),
            new ProviderElement<ActivePower, WeaponPowerCond>("control-flames",
                {
                    desc: "Control Flames",
                    cost: 1,
                    additionalNotes: [
                        "Flames larger than wielder submit only after a save."
                    ],
                },
                {
                    themes: { any: ["fire"] },
                    rarity: {
                        lte: "rare"
                    }
                }),
            new ProviderElement<ActivePower, WeaponPowerCond>("summon-fire-elemental",
                {
                    desc: "Summon Fire Elemental",
                    cost: 6,
                    additionalNotes: [
                        "Dissipates after 1 hour."
                    ],
                },
                {
                    themes: { any: ["fire"] },
                    rarity: {
                        gte: "epic"
                    }
                }),
            new ProviderElement<ActivePower, WeaponPowerCond>("wall-of-ice",
                {
                    desc: "Wall of Ice",
                    cost: 4,
                },
                {
                    themes: { any: ["ice"] },
                    rarity: {
                        gte: "rare"
                    }
                }),
            new ProviderElement<ActivePower, WeaponPowerCond>("control-cold-weather",
                {
                    desc: "Control Weather",
                    cost: 3,
                    additionalNotes: [
                        "Must move conditions towards blizzard."
                    ],
                },
                {
                    themes: { any: ["ice"] },
                    rarity: {
                        lte: "rare"
                    }
                }),
            new ProviderElement<ActivePower, WeaponPowerCond>("ice-strike",
                {
                    desc: "Chilling Strike",
                    cost: 2,
                    additionalNotes: [
                        "Upon hitting, you can choose to infuse the attack. Characters must save or be frozen solid next turn."
                    ],
                },
                {
                    themes: { any: ["ice"] },
                    rarity: {
                        lte: "rare"
                    }
                }),
            new ProviderElement<ActivePower, WeaponPowerCond>("summon-ice-elemental",
                {
                    desc: "Summon Ice Elemental",
                    cost: 6,
                    additionalNotes: [
                        "Dissipates after 1 hour."
                    ],
                },
                {
                    themes: { any: ["ice"] },
                    rarity: {
                        gte: "epic"
                    }
                }
            ),
            new ProviderElement<ActivePower, WeaponPowerCond>("commune-demon",
                {
                    desc: "Commune With Demon",
                    cost: 2,
                },
                {
                    themes: { any: ["dark"] },
                    rarity: {
                        gte: "uncommon"
                    }
                }
            ),
            new ProviderElement<ActivePower, WeaponPowerCond>("turn-holy",
                {
                    desc: "Turn Priests & Angels",
                    cost: 2,
                },
                {
                    themes: { any: ["dark"] },
                    rarity: {
                        gte: "uncommon"
                    }
                }
            ),
            new ProviderElement<ActivePower, WeaponPowerCond>("darkness",
                {
                    desc: "Darkness",
                    cost: 1
                },
                {
                    themes: { any: ["dark"] },
                }
            ),
            new ProviderElement<ActivePower, WeaponPowerCond>("summon-demon",
                {
                    desc: "Summon Demon",
                    cost: 6,
                    additionalNotes: [
                        "Returns to hell after 1 hour."
                    ],
                },
                {
                    themes: { any: ["dark"] },
                    rarity: {
                        gte: "epic"
                    }
                }
            ),
            new ProviderElement<ActivePower, WeaponPowerCond>("commune-divinity",
                {
                    desc: "Commune With Divinity",
                    cost: 4,
                },
                {
                    themes: { any: ["light"] },
                    rarity: {
                        gte: "uncommon"
                    }
                }
            ),
            new ProviderElement<ActivePower, WeaponPowerCond>("turn-undead",
                {
                    desc: "Turn Undead",
                    cost: 2
                },
                {
                    themes: { any: ["light"] },
                }
            ),
            new ProviderElement<ActivePower, WeaponPowerCond>("light",
                {
                    desc: "Light",
                    cost: 1
                },
                {
                    themes: { any: ["light"] },
                }
            ),
            new ProviderElement<ActivePower, WeaponPowerCond>("summon-angel",
                {
                    desc: "Summon Angel",
                    cost: 6,
                    additionalNotes: [
                        "Returns to heaven after 1 hour."
                    ],
                },
                {
                    themes: { any: ["light"] },
                    rarity: {
                        gte: "epic"
                    }
                }
            ),
            new ProviderElement<ActivePower, WeaponPowerCond>("charm-person",
                {
                    desc: "Charm Person",
                    cost: 2
                },
                {
                    themes: { any: ["sweet"] },
                }
            ),
            new ProviderElement<ActivePower, WeaponPowerCond>("sweetberry",
                {
                    desc: "Sweetberry",
                    cost: 3,
                    additionalNotes: [
                        "Create a small berry, stats as healing potion."
                    ]
                },
                {
                    themes: { any: ["sweet"] },
                }
            ),
            new ProviderElement<ActivePower, WeaponPowerCond>("sugar-spray",
                {
                    desc: "Sugar Spray",
                    cost: 1,
                    additionalNotes: [
                        "Sprays a sweet and sticky syrup, enough to coat the floor of a small room. Makes movement difficult."
                    ]
                },
                {
                    themes: { any: ["sweet"] },
                }
            ),
            new ProviderElement<ActivePower, WeaponPowerCond>("caustic-strike",
                {
                    desc: "Caustic Strike",
                    cost: 2,
                    additionalNotes: [
                        "Upon hitting, you can choose to infuse the attack. Melts objects, or damages armor of characters."
                    ]
                },
                {
                    themes: { any: ["sour"] },
                }
            ),
            new ProviderElement<ActivePower, WeaponPowerCond>("locate-lemon",
                {
                    desc: "Locate Lemon",
                    cost: 1,
                    additionalNotes: [
                        "Wielder learns the exact location of the closest lemon."
                    ]
                },
                {
                    themes: { any: ["sour"] },
                    rarity: {
                        lte: "uncommon"
                    }
                }
            ),
            new ProviderElement<ActivePower, WeaponPowerCond>("cause-nausea",
                {
                    desc: "Cause Nausea",
                    cost: 1,
                    additionalNotes: [
                        "Target must save or waste their turn vomiting."
                    ]
                },
                {
                    themes: { any: ["sour"] },
                }
            ),
            new ProviderElement<ActivePower, WeaponPowerCond>("summon-acid-elemental",
                {
                    desc: "Summon Acid Elemental",
                    cost: 6,
                    additionalNotes: [
                        "Dissipates after 1 hour."
                    ],
                },
                {
                    themes: { any: ["sour"] },
                    rarity: {
                        gte: "epic"
                    }
                }
            ),
            new ProviderElement<ActivePower, WeaponPowerCond>("magic-missile",
                {
                    desc: "Magic Missile",
                    cost: 2
                },
                {
                    themes: { any: ["wizard"] },
                }
            ),
            new ProviderElement<ActivePower, WeaponPowerCond>("magic-shield",
                {
                    desc: "Magic Shield",
                    cost: 2
                },
                {
                    themes: { any: ["wizard"] },
                }
            ),
            new ProviderElement<ActivePower, WeaponPowerCond>("magic-parry",
                {
                    desc: "Magic Parry",
                    cost: "charges equal to spell's level",
                    additionalNotes: [
                        "Deflect a harmful spell that was targeted at you specifically.",
                        "You save. On a success the spell is nullified.",
                        "If you succeeded with the best possible roll, the spell is instead reflected back at the attacker."
                    ]
                },
                {
                    themes: { any: ["wizard"] },
                }
            ),
            new ProviderElement<ActivePower, WeaponPowerCond>("instant-message",
                {
                    desc: "Instant Message",
                    cost: 1,
                    additionalNotes: [
                        "Point the weapon at someone in your line of sight, send them a telepathic message."
                    ]
                },
                {
                    themes: { any: ["wizard"] },
                }
            ),
            new ProviderElement<ActivePower, WeaponPowerCond>("create-wizard-servant",
                {
                    desc: "Create Servant",
                    cost: 3,
                    additionalNotes: [
                        "Create an small ichorous being that obeys you without question. It dissolves into sludge after 2d6 days."
                    ]
                },
                {
                    themes: { any: ["wizard"] },
                }
            ),
            new ProviderElement<ActivePower, WeaponPowerCond>("summon-steam-elemental",
                {
                    desc: "Summon Steam Elemental",
                    cost: 6,
                    additionalNotes: [
                        "Dissipates after 1 hour."
                    ],
                },
                {
                    themes: { any: ["steampunk"] },
                    rarity: {
                        gte: "epic"
                    }
                }
            ),
            new ProviderElement<ActivePower, WeaponPowerCond>("power-machine",
                {
                    desc: "Power Machine",
                    cost: 1,
                    additionalNotes: [
                        "Touching the weapon to a machine causes it to activate under magical power. It operates for 24 hours."
                    ]
                },
                {
                    themes: { any: ["steampunk"] },
                }
            ),
            new ProviderElement<ActivePower, WeaponPowerCond>("summon-water-elemental",
                {
                    desc: "Summon Water Elemental",
                    cost: 6,
                    additionalNotes: [
                        "Dissipates after 1 hour."
                    ],
                },
                {
                    themes: { any: ["cloud"] },
                    rarity: {
                        gte: "epic"
                    }
                }
            ),
            new ProviderElement<ActivePower, WeaponPowerCond>("zephyr-strike",
                {
                    desc: "Zephyr Strike",
                    cost: 2,
                    additionalNotes: [
                        "Move up to 4× your normal movement to attack someone.",
                        "They must save or be knocked down by the attack."
                    ]
                },
                {
                    themes: { any: ["cloud"] },
                }
            ),
            new ProviderElement<ActivePower, WeaponPowerCond>("wind-blast",
                {
                    desc: "Wind Blast",
                    cost: 2,
                    additionalNotes: [
                        "Characters in melee range must save, or be thrown back out of melee range and knocked down."
                    ]
                },
                {
                    themes: { any: ["cloud"] },
                }
            ),
            new ProviderElement<ActivePower, WeaponPowerCond>("summon-lightning",
                {
                    desc: "Summon Lightning",
                    cost: 4,
                    additionalNotes: [
                        "Summon a bolt of lightning to strike something in your line of sight."
                    ]
                },
                {
                    themes: { any: ["cloud"] },
                }
            ),
            new ProviderElement<ActivePower, WeaponPowerCond>("wall-of-stone",
                {
                    desc: "Wall of stone",
                    cost: 4,
                },
                {
                    themes: { any: ["earth"] },
                    rarity: {
                        gte: "rare"
                    }
                }
            ),
            new ProviderElement<ActivePower, WeaponPowerCond>("petrify-person",
                {
                    desc: "Petrify Person",
                    cost: 5,
                },
                {
                    themes: { any: ["earth"] },
                    rarity: {
                        gte: "rare"
                    }
                }
            ),
            new ProviderElement<ActivePower, WeaponPowerCond>("cure-petrify",
                {
                    desc: "Cure Petrification",
                    cost: 2
                },
                {
                    themes: { any: ["earth"] },
                }
            ),
            new ProviderElement<ActivePower, WeaponPowerCond>("summon-earth-elemental",
                {
                    desc: "Summon Earth Elemental",
                    cost: 6,
                    additionalNotes: [
                        "Crumbles after 1 hour."
                    ],
                },
                {
                    themes: { any: ["earth"] },
                    rarity: {
                        gte: "epic"
                    }
                }
            ),
            new ProviderElement<ActivePower, WeaponPowerCond>("instant-tree",
                {
                    desc: "Instant Tree",
                    cost: 1
                },
                {
                    themes: { any: ["nature"] },
                }
            ),
            new ProviderElement<ActivePower, WeaponPowerCond>("summon-chomp-flower",
                {
                    desc: "Instant Chomp-Flower",
                    cost: 2,
                    additionalNotes: [
                        "Stats as shark but can't move."
                    ]
                },
                {
                    themes: { any: ["nature"] },
                }
            ),
            new ProviderElement<ActivePower, WeaponPowerCond>("vine-hook",
                {
                    desc: "Vine Hook",
                    cost: 1,
                    additionalNotes: [
                        "Launch a vine from the weapon. It can stay attached to the weapon at one end, or detach to link two objects together.",
                        "Vines can be up to 50-ft long and are as strong as steel."
                    ]
                },
                {
                    themes: { any: ["nature"] },
                }
            ),
            new ProviderElement<ActivePower, WeaponPowerCond>('jump', {
                desc: 'Jump',
                cost: 1,
                additionalNotes: [
                    'Jump up to 5× as far as you are naturally capable of.'
                ]
            }, {
                themes: {
                    any: ['nature']
                }
            }),
            new ProviderElement<ActivePower, WeaponPowerCond>('summon-animal-weak', {
                desc: 'Summon Animal',
                cost: 5,
                additionalNotes: [
                    mkWepToGen((rng) => {
                        const quantity = ['' as const, '1d6 ' as const, '2d6 ' as const].choice(rng);

                        const animal: Record<(typeof quantity), string[]> = {
                            '': ['a lion', 'a tiger', 'a caracal', 'an ape', 'a kangaroo', 'a horse', 'a boar'],
                            '1d6 ': ['wolves', 'coyotes', 'thylacines', 'junglefowl'],
                            '2d6 ': ['mice', 'crickets', 'geckos', 'snails']
                        }

                        return `Call ${quantity} ${animal[quantity].choice(rng)} to your aid. ${quantity === '' ? 'It returns' : 'They return'} to nature at the end of the scene.`
                    })
                ]
            }, {
                themes: {
                    any: ['nature']
                },
                rarity: {
                    lte: 'rare'
                }
            }),
            new ProviderElement<ActivePower, WeaponPowerCond>('summon-animal-strong', {
                desc: 'Summon Animal',
                cost: 5,
                additionalNotes: [
                    mkWepToGen((rng) => {
                        const quantity = ['' as const, '1d6 ' as const, '2d6 ' as const].choice(rng);

                        const animal: Record<(typeof quantity), string[]> = {
                            '': ['an elephant', 'a rhino', 'a bear', 'a dire wolf', 'a giant carnivorous snail', 'a moose', 'a honey badger', 'a silverback gorilla'],
                            '1d6 ': ['giant sea termites', 'giant fire ants', 'lions', 'tigers', 'caracals', 'apes', 'kangaroos', 'horses', 'boars'],
                            '2d6 ': ['rats', 'wolves', 'coyotes', 'beavers', 'owls', 'hawks', 'alpacas', 'ostriches', 'peacocks']
                        }

                        return `Call ${quantity}${animal[quantity].choice(rng)} to your aid. ${quantity === '' ? 'It returns' : 'They return'} to nature at the end of the scene.`
                    })
                ]
            }, {
                themes: {
                    any: ['nature']
                },
                rarity: {
                    gte: 'epic'
                }
            }),
            new ProviderElement<ActivePower, WeaponPowerCond>('immovable-bc-earth',
                {
                    desc: 'Immovable',
                    cost: 1,
                    additionalNotes: [
                        "If something attempts to move you against your will, you can expend a charge to be unaffected by it."
                    ]
                },
                {
                    themes: { any: ['earth'] },
                    UUIDs: {
                        none: ['immovable-bc-weapon-shape']
                    }
                }
            ),
            new ProviderElement<ActivePower, WeaponPowerCond>('immovable-bc-weapon-shape',
                {
                    desc: 'Immovable',
                    cost: 1,
                    additionalNotes: [
                        "If something attempts to move you against your will, you can expend a charge to be unaffected by it."
                    ]
                },
                {
                    shapeFamily: {
                        any: ['greatsword', 'greatsword']
                    },
                    UUIDs: {
                        none: ['immovable-bc-earth']
                    }
                }
            ),
            new ProviderElement<ActivePower, WeaponPowerCond>('detachable-gems', {
                desc: 'Gem of Greed',
                cost: 'you choose the number of charges to expend',
                additionalNotes: [
                    'The weapon has gems embedded throughout. You can expend charges to pry one off.',
                    'NPCs that see the gem must save or be magically compelled to take it.',
                    'Affects a number of characters equal to the charges expended.'
                ]
            }, {
                themes: { any: ['earth'] },
            }),
            new ProviderElement<ActivePower, WeaponPowerCond>('ultimate-attack', {
                desc: 'Ultimate Anime Attack',
                cost: 'all charges',
                additionalNotes: [
                    "This attack always hits. It deals damage = weapon damage × number of charges remaining.",
                    'Afterwards, the weapon explodes and is destroyed.'
                ]
            }, {
                rarity: {
                    lte: 'rare'
                },
            }),
            new ProviderElement<ActivePower, WeaponPowerCond>('instant-door', {
                desc: 'Instant Door',
                cost: 6,
                additionalNotes: [
                    "Trace the outline of the doorway on a surface using the weapon. A moment later, it's magically created.",
                    "The door can punch through a thin sheet of metal (except lead), or 10-ft of any other material."
                ]
            }, {
                rarity: {
                    gte: 'rare'
                },
            }),
            new ProviderElement<ActivePower, WeaponPowerCond>('acid-etch', {
                desc: 'Spray',
                cost: 1,
                additionalNotes: [
                    "The weapon sprays acid in a precise pattern, etching an image of your choice onto a surface.",
                ]
            }, {
                themes: {
                    any: ['sour']
                }
            }),
            new ProviderElement<ActivePower, WeaponPowerCond>('radial-slam', {
                desc: 'Slam',
                cost: 3,
                additionalNotes: [
                    "Slam the weapon into the ground, emitting a circular shockwave.",
                    new StringGenerator(["Characters within 20-ft must save, or be knocked down & take ", mkGen((_rng, weapon) => {
                        // it deals damage equal to 3 * the weapon's 
                        const { as, d6, ...rest } = weapon.damage;
                        const slamDamage = _.mapValues(
                            {
                                d6: 1 + (d6 ?? 0),
                                ...rest
                            },
                            x => x === undefined ? undefined : x * 3
                        );

                        return textForDamage(slamDamage)
                    }), " damage"])

                ]
            }, {
                themes: {
                    any: ['earth']
                },
                UUIDs: {
                    none: ['linear-slam']
                }
            }),
            new ProviderElement<ActivePower, WeaponPowerCond>('linear-slam', {
                desc: 'Slam',
                cost: 3,
                additionalNotes: [
                    "Slam the weapon into the ground, emitting a shockwave that travels straight ahead for 60-ft.",
                    new StringGenerator(["Characters hit by the wave must save, or be knocked down & take ", mkGen((_rng, weapon) => {
                        // it deals damage equal to 3 * the weapon's 
                        const { as, d6, ...rest } = weapon.damage;
                        const slamDamage = _.mapValues(
                            {
                                d6: 1 + (d6 ?? 0),
                                ...rest
                            },
                            x => x === undefined ? undefined : x * 3
                        );
                        return textForDamage(slamDamage)
                    }), " damage"])
                ]
            }, {
                themes: {
                    any: ['earth']
                },
                UUIDs: {
                    none: ['radial-slam']
                }
            }),
            new ProviderElement<ActivePower, WeaponPowerCond>('metaphysical-edit', {
                desc: 'Edit',
                cost: 3,
                additionalNotes: [
                    "Strike at the platonic form of an object, removing a letter from its name.",
                    "It physically transforms into the new object."
                ]
            }, {
                themes: {
                    any: ['wizard']
                },
                shapeFamily: {
                    any: edgedWeaponShapeFamilies
                },
            }),
            new ProviderElement<ActivePower, WeaponPowerCond>('gravity-gun', {
                desc: 'Kinesis',
                cost: 1,
                additionalNotes: [
                    mkGen((rng, weapon) => {
                        const effects = {
                            light: 'The weapon emits a tether of luminous energy.',
                            fire: 'The weapon emit a fiery whip.',
                            nature: "A sturdy vine grows from the weapon's tip.",
                            cloud: "The weapon emits a vortex of air."
                        } satisfies Partial<Record<Theme, string>>;

                        const supportedThemesOfWeapon = weapon.themes.filter(theme => theme in effects) as (keyof typeof effects)[];

                        const tetherTheme = effects[supportedThemesOfWeapon.choice(rng)];
                        //const tetherTheme = typeof chosen === "string" ? chosen : chosen(rng)

                        return `${tetherTheme} It can lift and throw object an weighing up to 500 lbs.`;
                    })
                ]
            }, {
                themes: {
                    any: ['light', 'fire', 'nature', 'cloud']
                },
            }),
            new ProviderElement<ActivePower, WeaponPowerCond>('frostbound', {
                desc: 'Bind',
                cost: 1,
                additionalNotes: [
                    'Lock a mechanism in place with magical ice as strong as steel.',
                    'It stays frozen for 2d6 × 10 minutes.'
                ]
            }, {
                themes: {
                    any: ['ice']
                }
            }),
            new ProviderElement<ActivePower, WeaponPowerCond>('rally-person', {
                desc: 'Rally',
                cost: 1,
                additionalNotes: [
                    'Targets one non-hostile character.',
                    'For the rest of the day, their morale cannot break.'
                ]
            }, {
                themes: {
                    any: ['light', 'steampunk']
                }
            }),
            new ProviderElement<ActivePower, WeaponPowerCond>('homing-shot', {
                desc: 'Homing Shot',
                cost: 1,
                additionalNotes: [
                    'Fire an enchanted shot, which always hits.'
                ]
            }, {
                shapeFamily: {
                    any: ['sword (or bow)', 'dagger (or pistol)', 'sword (or musket)', 'greataxe (or musket)']
                }
            }),
            new ProviderElement<ActivePower, WeaponPowerCond>('binding-shot', {
                desc: 'Binding Shot',
                cost: 2,
                additionalNotes: [
                    'Fire an enchanted shot, which anchors the target to a nearby surface.',
                    'They are stuck in place until they use their turn to successfully save and escape.'
                ]
            }, {
                themes: { any: ['nature', 'ice'] },
                shapeFamily: {
                    any: ['sword (or bow)', 'dagger (or pistol)', 'sword (or musket)', 'greataxe (or musket)']
                }
            }),
            new ProviderElement<ActivePower, WeaponPowerCond>('black-flame-blast', {
                desc: 'Black Flame Blast',
                cost: 3,
                additionalNotes: [
                    'Summon a 20-ft cone of black flame, which deals 4d6 damage.',
                    'Damage inflicted by black flames can only be healed by magic.'
                ]
            }, {
                themes: { all: ['dark', 'fire'] }
            })
        ]
    },
    passives: {
        add: [
            new ProviderElement("detect-unholy",
                mkGen((rng) => {
                    return {
                        miscPower: true,
                        desc: new StringGenerator([
                            mkGen("Glows like a torch when "),
                            pluralUnholyFoe,
                            mkGen(" are near")
                        ]).generate(rng)
                    }
                }),
                {

                    themes: {
                        any: ["light"],
                    },
                }
            ),
            new ProviderElement<PassivePower, WeaponPowerCond>("command-critters",
                {
                    miscPower: true,
                    desc: "Cute animals follow the wielder's polite requests i.e. cats and forest birds."
                },
                {

                    themes: {
                        any: ["nature", "sweet"]
                    }
                }
            ),
            new ProviderElement<PassivePower, WeaponPowerCond>("detect-unholy",
                {
                    miscPower: true,
                    desc: "The weapon can telepathically control bees within 100-ft. They can only understand simple commands."
                },
                {

                    themes: {
                        any: ["nature", "sweet"]
                    }
                }
            ),
            new ProviderElement("focus-light-beam",
                mkGen((rng) => ({
                    miscPower: true,
                    desc: new StringGenerator(["Can reflect and focus ", mkGen((rng) => ["sun", "moon"].choice(rng)), "light as a damaging beam (2d6 damage)."]).generate(rng)
                })),
                {

                    themes: { any: ["light"] }
                }
            ),
            new ProviderElement<PassivePower, WeaponPowerCond>("move-silently",
                {
                    miscPower: true,
                    desc: "Wielder is able to move completely silently.",
                },
                {

                    shapeFamily: {
                        any: [
                            "dagger",
                            "club"
                        ]
                    },
                    rarity: {
                        gte: "epic"
                    }
                }
            ),
            new ProviderElement<PassivePower, WeaponPowerCond>("magically-hovers",
                {
                    miscPower: true,
                    desc: "Can hover in the air to attack for you hands free. Commanding a floating weapon uses the same rules as followers / retainers.",
                },
                {

                    rarity: {
                        gte: "rare"
                    },
                    themes: {
                        any: [
                            "cloud",
                            "wizard"
                        ]
                    }
                }
            ),
            new ProviderElement<PassivePower, WeaponPowerCond>("resistance-fire",
                {
                    miscPower: true,
                    desc: "Wielder takes half damage from fire."
                },
                {

                    themes: { any: ["fire"] },
                    rarity: {
                        lte: "uncommon"
                    }
                }
            ),
            new ProviderElement<PassivePower, WeaponPowerCond>("immunity-fire",
                {

                    miscPower: true,
                    desc: "Wielder cannot be harmed by fire.",
                },
                {

                    themes: { any: ["fire"] },
                    rarity: {
                        gte: "rare"
                    }
                }
            ),
            new ProviderElement<PassivePower, WeaponPowerCond>("damage-bonus-fire",
                {
                    miscPower: true,
                    desc: "Wreathed in flames, glows like a torch",
                    bonus: {
                        addDamageDie: {
                            d6: 1
                        }
                    }
                },
                {

                    themes: { any: ["fire"] }
                }
            ),
            new ProviderElement<PassivePower, WeaponPowerCond>("expertise-blacksmithing",
                {

                    miscPower: true,
                    desc: "Weapon is an expert blacksmith.",
                },
                {

                    themes: { any: ["fire"] },
                    isSentient: true
                }
            ),
            new ProviderElement<PassivePower, WeaponPowerCond>("resistance-cold",
                {

                    miscPower: true,
                    desc: "Wielder takes half damage from ice & cold."
                },
                {

                    themes: { any: ["ice"] },
                    rarity: {
                        lte: "uncommon"
                    }
                }
            ),
            new ProviderElement<PassivePower, WeaponPowerCond>("immunity-cold",
                {
                    miscPower: true,
                    desc: "Wielder cannot be harmed by ice & cold."
                },
                {

                    themes: { any: ["ice"] }
                }
            ),
            new ProviderElement<PassivePower, WeaponPowerCond>("damage-bonus-ice-blunt",
                {
                    miscPower: true,
                    desc: "Wreathed in frigid mist.",
                    bonus: {
                        addDamageDie: {
                            d6: 1
                        }
                    },
                },
                {

                    themes: { any: ["ice"] },
                    shapeFamily: {
                        none: [
                            "dagger",
                            "sword",
                            "greatsword"
                        ]
                    }
                }
            ),
            new ProviderElement<PassivePower, WeaponPowerCond>("damage-bonus-ice-sharp",
                {
                    miscPower: true,
                    desc: "Wreathed in ice, always frozen into its sheath. Requires a strength save to draw.",
                    bonus: {
                        addDamageDie: {
                            d10: 1
                        }
                    },
                },
                {

                    themes: { any: ["ice"] },
                    shapeFamily: {
                        any: [
                            "dagger",
                            "sword",
                            "greatsword"
                        ]
                    }
                }
            ),
            new ProviderElement<PassivePower, WeaponPowerCond>("sense-cold-weather",
                {
                    miscPower: true,
                    desc: "1-in-2 chance to sense icy weather before it hits, giving just enough time to escape."
                },
                {

                    themes: { any: ["ice"] }
                }
            ),
            new ProviderElement<PassivePower, WeaponPowerCond>("walk-on-ice",
                {

                    miscPower: true,
                    desc: "Wielder can walk on any kind of ice without breaking it."
                },
                {

                    themes: { any: ["ice"] }
                }
            ),
            new ProviderElement<PassivePower, WeaponPowerCond>("vibe-menacing",
                {

                    miscPower: true,
                    desc: "Menacing aura. Bonus to saves to frighten & intimidate."
                },
                {
                    themes: { any: ["dark"] }
                }
            ),
            new ProviderElement<PassivePower, WeaponPowerCond>("trap-souls",
                {

                    miscPower: true,
                    desc: "Traps the souls of its victims.",
                    additionalNotes: [
                        "Their ghosts are bound to the weapon, and obey the wielder's commands.",
                        "Can store up to 4 ghosts, and starts with 1d4 already inside."
                    ]
                },
                {
                    themes: { any: ["dark"] }
                }
            ),
            new ProviderElement<PassivePower, WeaponPowerCond>("damage-bonus-dark-flame",
                {
                    miscPower: true,
                    desc: "Wreathed in lightless black flames.",
                    bonus: {
                        addDamageDie: {
                            d6: 1
                        }
                    }
                },
                {
                    themes: { any: ["dark"] }
                }
            ),
            new ProviderElement<PassivePower, WeaponPowerCond>("resistance-radiant",
                {
                    miscPower: true,
                    desc: "Wielder takes half damage from rays & beams."

                },
                {
                    themes: { any: ["light"] },
                    rarity: {
                        lte: "uncommon"
                    }
                }
            ),
            new ProviderElement<PassivePower, WeaponPowerCond>("immunity-radiant",
                {

                    miscPower: true,
                    desc: "Wielder is immune to the harmful effects of rays & beams."
                },
                {
                    themes: { any: ["light"] }
                }
            ),
            new ProviderElement<PassivePower, WeaponPowerCond>("stats-as-mirror",
                {
                    miscPower: true,
                    desc: "Extremely shiny, functions as a mirror."
                },
                {
                    themes: { any: ["light"] }
                }
            ),
            new ProviderElement<PassivePower, WeaponPowerCond>("vibe-wholesome",
                {
                    miscPower: true,
                    desc: "Wielder has a wholesome aura. Bonus to saves to spread cheer and/or appear nonthreatening."
                },
                {
                    themes: { any: ["light", "sweet"] }
                }
            ),
            new ProviderElement<PassivePower, WeaponPowerCond>("TODO",
                {
                    miscPower: true,
                    desc: "Weapon is an expert chef.",
                },
                {
                    themes: { any: ["sweet"] },
                    isSentient: true
                }
            ),
            new ProviderElement<PassivePower, WeaponPowerCond>("magically-learn-dessert-recipes",
                {
                    miscPower: true,
                    desc: "The wielder magically knows the recipe of any dessert they taste."
                },
                {
                    themes: { any: ["sweet"] }
                }
            ),
            new ProviderElement<PassivePower, WeaponPowerCond>("eat-to-heal",
                {

                    miscPower: true,
                    desc: "Eat business end to heal HP equal to damage roll. Renders weapon unusable until it reforms, 24 hours later.",
                    descriptorPartGenerator: 'eat-to-heal-forced'
                },
                {
                    themes: { any: ["sweet"] }
                }
            ),
            new ProviderElement<PassivePower, WeaponPowerCond>("expertise-alchemy",
                {

                    miscPower: true,
                    desc: "Weapon is an expert alchemist.",
                },
                {
                    themes: { any: ["sour"] },
                    isSentient: true
                }
            ),
            new ProviderElement<PassivePower, WeaponPowerCond>("resistance-acid",
                {
                    miscPower: true,
                    desc: "Wielder takes half damage from corrosive chemicals."

                },
                {
                    themes: { any: ["sour"] },
                    rarity: {
                        lte: "uncommon"
                    }
                }
            ),
            new ProviderElement<PassivePower, WeaponPowerCond>("immunity-acid",
                {
                    miscPower: true,
                    desc: "Wielder is immune to the harmful effects of corrosive chemicals."
                },
                {
                    themes: { any: ["sour"] }
                }
            ),
            new ProviderElement<PassivePower, WeaponPowerCond>("tastes-sour",
                {
                    miscPower: true,
                    desc: "Licking the weapon cures scurvy. It tastes sour."
                },
                {
                    themes: { any: ["sour"] }
                }
            ),
            new ProviderElement<PassivePower, WeaponPowerCond>("expertise-astrology",
                {
                    miscPower: true,
                    desc: "Weapon is an expert astrologer.",
                },
                {
                    themes: { any: ["wizard"] },
                    isSentient: true
                }
            ),
            new ProviderElement<PassivePower, WeaponPowerCond>("fire-magic-projectile",
                {
                    miscPower: true,
                    desc: "If you are not wounded, the weapon can also fire a spectral copy of itself as a projectile attack. Damage as weapon, range as bow.",
                },
                {
                    themes: { any: ["wizard"], },
                    rarity: {
                        gte: "rare"
                    }
                }
            ),
            new ProviderElement<PassivePower, WeaponPowerCond>("attack-wisps",
                {
                    miscPower: true,
                    desc: "Each hit you land with the weapon generates a wisp. On your turn, you can launch any number of wisps at no cost. d4 damage, range as bow.",
                },
                {
                    themes: { any: ["wizard"] },
                    rarity: {
                        gte: "epic"
                    }
                }
            ),
            new ProviderElement<PassivePower, WeaponPowerCond>("expertise-tinker",
                {
                    miscPower: true,
                    desc: "Weapon is an expert tinkerer.",
                },
                {
                    isSentient: true,
                    themes: { any: ["steampunk"] },
                }
            ),
            new ProviderElement<PassivePower, WeaponPowerCond>("integrated-compass",
                {

                    miscPower: true,
                    desc: "Wielder always knows which way is north."
                },
                {
                    themes: { any: ["steampunk"] },
                }
            ),
            new ProviderElement<PassivePower, WeaponPowerCond>("integrated-clock",
                {
                    miscPower: true,
                    desc: "A widget on the weapon displays the time."
                },
                {
                    themes: { any: ["steampunk"] },
                }
            ),
            new ProviderElement<PassivePower, WeaponPowerCond>("transform-bouquet",
                {
                    miscPower: true,
                    desc: "Can transform into a bouquet of flowers."
                },
                {
                    themes: { any: ["nature"] },
                }
            ),
            new ProviderElement<PassivePower, WeaponPowerCond>("shoot-water",
                {
                    miscPower: true,
                    desc: "Can shoot an endless stream of water from its tip, pressure as garden hose."
                },
                {
                    themes: { any: ["cloud"] },
                }
            ),
            new ProviderElement<PassivePower, WeaponPowerCond>("transform-umbrella",
                {
                    miscPower: true,
                    desc: "Can transform into an umbrella."
                },
                {
                    themes: { any: ["cloud"] },
                }
            ),
            new ProviderElement<PassivePower, WeaponPowerCond>("stealth-in-rough-weather",
                {
                    miscPower: true,
                    desc: "Wielder gains a stealth bonus during rain & snow, as if invisible.",
                },
                {
                    themes: { any: ["cloud"] },
                    shapeFamily: {
                        any: [
                            "dagger",
                            "club"
                        ]
                    }
                }
            ),
            new ProviderElement("can-fly",
                mkGen((rng, weapon) => {
                    const reasonsToFly = {
                        fire: new StringGenerator([
                            "While using the weapon, you can ",
                            mkGen((rng) => [
                                "use the weapon to wreathe yourself in flames. This allows you to fly for some reason",
                                "summon a pair of fiery wings. They allows you to fly",
                            ].choice(rng)),
                            ", as fast as you can walk."
                        ]),
                        cloud: "The weapon can magically summon a small cloud. You can use it to fly, as fast as you can walk.",
                        earth: "The weapon contains a lodestone. You can its magnetism to fly, as fast as you can walk.",
                        dark: new StringGenerator([
                            "While using the weapon, you can summon ",
                            mkGen((rng) => [
                                "wings of black-light",
                                "a pair of skeletal wings",
                                "a pair of demonic wings",
                                "a pair of dark & blood-stained angel wings",
                                "wings made from pure darkness"
                            ].choice(rng)),
                            ". They allow you to fly, as fast as you can walk."
                        ]),
                        light: new StringGenerator([
                            "While using the weapon, you can summon ",
                            mkGen((rng) => [
                                "wings of light",
                                "a pair of angel wings",
                            ].choice(rng)),
                            ". They allow you to fly, as fast as you can walk."
                        ]),
                        wizard: "You can magically levitate, as fast as you can walk.",
                        steampunk: "The weapon can detach a series of jet-powered widgets. You can use them to fly, as fast as you can walk.",
                        nature: new StringGenerator([
                            "While using the weapon, you can summon a pair of ",
                            mkGen((rng) => [
                                "bird",
                                "bat",
                                "butterfly",
                                "fairy",
                                "moth",
                                "bee",
                                "dragonfly",
                                "pterodactyl"
                            ].choice(rng)),
                            " wings. They allow you to fly, as fast as you can walk."
                        ])
                    } as const;
                    const supportedThemesOfWeapon = weapon.themes.filter(theme => theme in reasonsToFly) as (keyof typeof reasonsToFly)[];

                    const desc = genMaybeGen(reasonsToFly[supportedThemesOfWeapon.choice(rng)], rng);

                    return {
                        miscPower: true,
                        desc,
                    }
                }
                ),
                {
                    themes: { any: ["cloud", "wizard"] },
                    rarity: {
                        gte: "legendary"
                    }
                }
            ),
            new ProviderElement<PassivePower, WeaponPowerCond>("immunity-petrify",
                {

                    miscPower: true,
                    desc: "Wielder cannot be petrified."
                },
                {
                    themes: { any: ["earth"] },
                }
            ),
            new ProviderElement<PassivePower, WeaponPowerCond>("transform-pickaxe",
                {
                    miscPower: true,
                    desc: "Can transform into a pickaxe."
                },
                {
                    themes: { any: ["earth"] },
                }
            ),
            new ProviderElement<PassivePower, WeaponPowerCond>("expertise-jeweller",
                {
                    miscPower: true,
                    desc: "Weapon is an expert jeweller. It can identify any gemstone.",
                },
                {
                    themes: { any: ["earth"] },
                }
            ),
            new ProviderElement<PassivePower, WeaponPowerCond>("stats-as-shield",
                {
                    miscPower: true,
                    desc: "Stats as (function as) a shield."
                },
                {
                    themes: { any: ["earth"] },
                }
            ),
            new ProviderElement<PassivePower, WeaponPowerCond>('weapon-permanently-invisible',
                {
                    miscPower: true,
                    desc: 'The weapon is completely invisible, except to its wielder.'
                },
                {
                    themes: {
                        any: ['light']
                    },
                    rarity: {
                        gte: 'epic'
                    },
                    isSentient: true // If it can't call out to you, how will you know it's there?
                }
            ),
            new ProviderElement<PassivePower, WeaponPowerCond>('instant-recall',
                {
                    miscPower: true,
                    desc: "The wielder can summon the weapon into their hand at will, so long as it's on the same plane."
                },
                {
                    rarity: {
                        gte: 'uncommon'
                    },
                    UUIDs: {
                        none: ['magic-pocket']
                    }
                }
            ),
            new ProviderElement<PassivePower, WeaponPowerCond>("petrify-on-hit",
                {

                    miscPower: true,
                    desc: "Unaware targets that are hit by the weapon must save or be petrified.",
                },
                {
                    themes: { any: ["earth"] },
                    rarity: {
                        gte: "rare"
                    },
                    shapeFamily: {
                        any: [
                            "dagger"
                        ]
                    }
                }
            ),
            new ProviderElement<PassivePower, WeaponPowerCond>('antimagic-aura',
                {
                    miscPower: true,
                    desc: "Magical effects will not function within 10-ft of the weapon, except those generated by it. The aura is inactive while the weapon is sheathed."
                },
                {
                    rarity: {
                        gte: 'legendary'
                    },
                    themes: { none: ['wizard'] },
                    UUIDs: {
                        none: ['silence-aura', 'fire-aura', 'mist-aura', 'ice-aura']
                    }
                }
            ),
            new ProviderElement<PassivePower, WeaponPowerCond>('silence-aura',
                {
                    miscPower: true,
                    desc: "All sound is erased within 10-ft of the weapon. The aura is inactive while the weapon is sheathed."
                },
                {
                    rarity: {
                        gte: 'epic'
                    },
                    themes: { none: ['wizard', 'fire'] },
                    UUIDs: {
                        none: ['antimagic-aura', 'fire-aura', 'mist-aura', 'ice-aura']
                    }
                }
            ),
            new ProviderElement<PassivePower, WeaponPowerCond>('fire-aura',
                {
                    miscPower: true,
                    desc: "The weapon emits a 10-ft aura of flames, which sets foes and objects alight. The aura is inactive while the weapon is sheathed."
                },
                {
                    rarity: {
                        gte: 'legendary'
                    },
                    themes: { any: ['fire'] },
                    UUIDs: {
                        none: ['silence-aura', 'antimagic-aura', 'mist-aura', 'ice-aura']
                    }
                }
            ),
            new ProviderElement<PassivePower, WeaponPowerCond>('mist-aura',
                {
                    miscPower: true,
                    desc: "The weapon emits a 30-ft cloud of magical mist, which the wielder can see through clearly. When the weapon is sheathed, the mist is sucked inside."
                },
                {
                    rarity: {
                        gte: 'legendary'
                    },
                    themes: { any: ['cloud'] },
                    UUIDs: {
                        none: ['silence-aura', 'antimagic-aura', 'fire-aura', 'ice-aura']
                    }
                }
            ),
            new ProviderElement<PassivePower, WeaponPowerCond>('ice-aura',
                {
                    miscPower: true,
                    desc: "The weapon emits a 30-ft aura of frost. It freezes objects, and foes move half as fast within it. The aura is inactive while the weapon is sheathed."
                },
                {
                    rarity: {
                        gte: 'legendary'
                    },
                    themes: { any: ['ice'] },
                    UUIDs: {
                        none: ['silence-aura', 'antimagic-aura', 'fire-aura', 'mist-aura']
                    }
                }
            ),
            new ProviderElement<TGenerator<PassivePower, [Weapon]>, WeaponPowerCond>(
                "death-blast",
                mkGen<PassivePower, [Weapon]>((rng, weapon) => {
                    type WeaponEnergyEffect = {
                        /**
                         * Text for the effect.
                         */
                        desc: string,
                        /**
                         * UUID of the feature that should be added to the weapon, if any.
                         */
                        featureUUID?: string,
                    };
                    const weaponEnergyEffect = mkGen((rng, weapon: Weapon): WeaponEnergyEffect => {
                        const fallBack = {
                            desc: 'void energy',
                            featureUUID: 'energy-core-void'
                        } satisfies WeaponEnergyEffect;

                        const effects = {
                            fire: {
                                desc: 'fire',
                                featureUUID: 'energy-core-fire'
                            },
                            ice: {
                                desc: 'icy wind',
                                featureUUID: 'energy-core-ice'
                            },
                            light: mkGen<WeaponEnergyEffect>((rng) => (([
                                {
                                    desc: 'ultraviolet energy',
                                    featureUUID: 'energy-core-ultraviolet'
                                },
                                {
                                    desc: 'azure energy',
                                    featureUUID: 'energy-core-azure'
                                },
                                {
                                    desc: 'crimson energy',
                                    featureUUID: 'energy-core-crimson'
                                },
                                {
                                    desc: 'verdant energy',
                                    featureUUID: 'energy-core-verdant'
                                },
                                {
                                    desc: 'atomic energy',
                                    featureUUID: 'energy-core-atomic'
                                },
                                {
                                    desc: 'golden energy',
                                    featureUUID: 'energy-core-gold'
                                },
                            ] satisfies WeaponEnergyEffect[])).choice(rng)),
                            dark: {
                                desc: 'dark energy',
                                featureUUID: 'energy-core-dark'
                            },
                            cloud: {
                                desc: 'lightning',
                                featureUUID: 'energy-core-aether'
                            },
                            steampunk: {
                                desc: 'lightning',
                                featureUUID: 'energy-core-steampunk'
                            },
                        } satisfies Partial<Record<Theme, WeaponEnergyEffect | TGenerator<WeaponEnergyEffect, [Weapon]>>>;

                        const supportedThemesOfWeapon = weapon.themes.filter(theme => theme in effects) as (keyof typeof effects)[];
                        return genMaybeGen(effects[supportedThemesOfWeapon.choice(rng)], rng) ?? fallBack;
                    });

                    const { desc, featureUUID } = weaponEnergyEffect.generate(rng, weapon);

                    const damageByRarity: Record<WeaponRarity, `${number}${keyof Omit<DamageDice, 'const'>}`> = {
                        common: "1d6",
                        uncommon: "1d6",
                        rare: "1d6",
                        epic: "1d6",
                        legendary: "2d6"
                    }

                    return {
                        miscPower: true,

                        desc: `Anything killed by the weapon explodes in a blast of ${desc}. The blast deals ${damageByRarity[weapon.rarity]} damage, with a range of 10-ft. It does not harm the wielder.`,
                        descriptorPartGenerator: featureUUID
                    }
                }),
                {
                    themes: { any: ['fire', 'ice', 'light', 'dark', 'cloud', 'steampunk'] },
                    rarity: { gte: 'epic' }
                }
            ),
            new ProviderElement<PassivePower, WeaponPowerCond>('warm-to-touch',
                {
                    miscPower: true,
                    desc: "The weapon is always warm to the touch."
                },
                {
                    rarity: {
                        eq: 'common'
                    },
                    themes: { any: ['fire'] }
                }
            ),
            new ProviderElement<PassivePower, WeaponPowerCond>('cold-to-touch',
                {
                    miscPower: true,
                    desc: "The weapon is always cold to the touch."
                },
                {
                    rarity: {
                        eq: 'common'
                    },
                    themes: { any: ['ice'] }
                }
            ),
            new ProviderElement<PassivePower, WeaponPowerCond>('transform-pipe',
                {
                    miscPower: true,
                    desc: "Can transform into a smoking pipe."
                },
                {
                    rarity: {
                        eq: 'common'
                    },
                    themes: { any: ['nature'] }
                }
            ),
            new ProviderElement<PassivePower, WeaponPowerCond>('shrink-or-grow',
                {
                    miscPower: true,
                    desc: "Can transform into a 10-ft pole, or shrink to the size of a toothpick."
                },
                {
                    shapeFamily: {
                        any: ['club', 'staff']
                    }
                }
            ),
            new ProviderElement<PassivePower, WeaponPowerCond>('magic-pocket',
                {
                    miscPower: true,
                    desc: "The wielder can banish the weapon to a pocket plane, then withdraw it at will."
                },
                {
                    rarity: {
                        gte: 'epic'
                    },
                    shapeFamily: {
                        none: ['staff', 'spear', 'polearm', 'greataxe', 'greatsword', 'sword (or musket)', 'greataxe (or musket)']
                    },
                    UUIDs: {
                        none: ['instant-recall']
                    }
                }
            ),
            new ProviderElement<PassivePower, WeaponPowerCond>('the-axe',
                {
                    miscPower: true,
                    desc: "The weapon is also a guitar. Your musical skill is doubled when you play it."
                },
                {
                    rarity: {
                        gte: 'epic'
                    },
                    shapeFamily: {
                        any: ['axe', 'greataxe']
                    },
                }
            ),
            new ProviderElement<PassivePower, WeaponPowerCond>('the-horn',
                {
                    miscPower: true,
                    desc: "The weapon is also a horn. Your musical skill is doubled when you play it."
                },
                {
                    rarity: {
                        gte: 'epic'
                    },
                    shapeFamily: {
                        any: ['club']
                    },
                }
            )
            // new ProviderElement<MiscPower, WeaponPowerCond>("TODO",
            //     {

            //     },
            //     {
            //         themes: { any: ["TODO"] },
            //     }
            // ),
        ]
    },
    languages: {
        add: [
            ...(["The language of ice & snow."].map(x => toLang("ice", x))),
            ...(["The language of fire."].map(x => toLang("fire", x))),
            ...(["Angelic."].map(x => toLang("light", x))),
            ...(["Demonic."].map(x => toLang("dark", x)))
        ]
    },
    shapes: {
        add: [
            ...toProviderSource<string, (Pick<WeaponShape, "particular"> & WeaponPowerCond) | string, WeaponShape>(
                {
                    "club": [
                        {
                            particular: "Club",
                            rarity: {
                                lte: "uncommon"
                            }
                        },
                        {
                            particular: "Cudgel",
                            rarity: {
                                lte: "uncommon"
                            }
                        },
                        {
                            particular: "Rod",
                            rarity: {
                                lte: "uncommon"
                            }
                        }
                    ],
                    "staff": [
                        "Staff",
                        "Quarterstaff",
                        "Bo-Stick"
                    ],

                    "dagger": [
                        "Dagger",
                        "Knife",
                        "Dirk",
                        "Stiletto",
                        "Tanto",
                        "Khanjar",
                        "Kukri",
                        "Shortsword"
                    ],

                    "sword": [
                        "Longsword",
                        "Saber",
                        "Rapier",
                        "Foil",
                        "Epee",
                        "Machete",
                        "Scimitar",
                        "Gladius",
                        "Katana",
                        {
                            particular: "Flamberge",
                            rarity: {
                                gte: "rare"
                            }
                        },
                        {
                            particular: "Macuahuitl",
                            rarity: {
                                gte: "rare"
                            }
                        },
                        {
                            particular: "Khopesh",
                            rarity: {
                                gte: "rare"
                            }
                        },
                        {
                            particular: "Shotel",
                            rarity: {
                                gte: "rare"
                            }
                        },
                        {
                            particular: "Keyblade",
                            rarity: {
                                gte: "legendary"
                            }
                        }
                    ],
                    "axe": [
                        "Tomahawk",
                        "Hand-Axe",
                        "Axe",
                        "War-Axe",
                        "Battle-Axe"
                    ],
                    "mace": [
                        "Mace",
                        "Flail",
                        "Morning-Star",
                        "Shishpar",
                        "Nunchuks",
                        {
                            particular: "Meteor Hammer",
                            rarity: {
                                gte: "rare"
                            }
                        },
                        {
                            particular: "Double Flail",
                            rarity: {
                                gte: "rare"
                            }
                        },
                        {
                            particular: "Triple Flail",
                            rarity: {
                                gte: "epic"
                            }
                        },
                        {
                            particular: "Quadruple Flail",
                            rarity: {
                                gte: "legendary"
                            }
                        },
                        {
                            particular: "Quintuple Flail",
                            rarity: {
                                gte: "legendary"
                            },

                        }
                    ],

                    "greataxe": [
                        "Great-Axe",
                        {
                            particular: "Great-Scythe",
                            rarity: {
                                gte: "rare"
                            }
                        }
                    ],
                    "greatsword": [
                        "Greatsword",
                        "Zweihander",
                        "Nodachi",
                        {
                            particular: "Ultra-Greatsword",
                            rarity: {
                                gte: "rare"
                            }
                        }
                    ],

                    "spear": [
                        "Spear",
                        "Trident",
                        {
                            particular: "Bident",
                            rarity: {
                                gte: "epic"
                            }
                        }
                    ],
                    "polearm": [
                        "Polearm",
                        "Halberd",
                        "Glaive",
                        "Naginata",
                        "Bardiche",
                        "Raven's Beak",
                        "Pike",
                        {
                            particular: "Crescent Blade",
                            rarity: {
                                gte: "legendary"
                            }
                        }
                    ],
                    "lance": [
                        "Lance"
                    ],

                    "sword (or bow)": [
                        {
                            particular: "Bladed Bow",
                            rarity: {
                                gte: "legendary"
                            }
                        }
                    ],
                    "dagger (or pistol)": [
                        {
                            particular: "Pistol Sword",
                            rarity: {
                                gte: "legendary"
                            }
                        }
                    ],
                    "sword (or musket)": [
                        {
                            particular: "Gunblade",
                            rarity: {
                                gte: "legendary"
                            }
                        }
                    ],
                    "greataxe (or musket)": [
                        {
                            particular: "Transforming Sniper Scythle",
                            rarity: {
                                gte: "legendary"
                            }
                        }
                    ]
                }, (k, shapeOrShapename) => {
                    switch (typeof shapeOrShapename) {
                        case "string":
                            return new ProviderElement<WeaponShape, WeaponPowerCond>(`${k}-${shapeOrShapename.toLocaleLowerCase()}`,
                                {
                                    particular: shapeOrShapename,
                                    group: k as WeaponShape["group"]
                                },
                                {

                                }
                            );
                        case "object":
                            {
                                const shape = shapeOrShapename as WeaponShape & WeaponPowerCond;
                                if (shape !== null) {
                                    return new ProviderElement<WeaponShape, WeaponPowerCond>(`${k.replaceAll(/\s/g, "-")}-${shape.particular.toLocaleLowerCase()}`,
                                        {
                                            particular: shape.particular,
                                            group: k as WeaponShape["group"]
                                        },
                                        {
                                            themes: shape?.themes,
                                            activePowers: shape?.activePowers,
                                            rarity: shape?.rarity,
                                            shapeFamily: shape?.shapeFamily,

                                        }
                                    )
                                }
                            }
                    }
                    throw new Error("invalid shape config");
                }
            )
        ]
    }
} satisfies DeltaCollection<WeaponFeaturesTypes>;
