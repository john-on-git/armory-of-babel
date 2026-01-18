import { mkGen } from "$lib/generators/recursiveGenerator";
import { businessEndParts, ephBlack, ephBlue, ephGold, ephGreen, ephPurple, ephRed, ephWhite, rangedWeaponShapeFamilies } from "$lib/generators/weaponGenerator/config/configConstantsAndUtils";
import { ProviderElement } from "$lib/generators/weaponGenerator/provider";
import { getBusinessEndDesc } from "$lib/generators/weaponGenerator/weaponDescriptionLogic";
import { WeaponFeatureProvider } from "$lib/generators/weaponGenerator/weaponGeneratorLogic";
import type { Ephitet, WeaponFeaturesTypes } from "$lib/generators/weaponGenerator/weaponGeneratorTypes";
import { choice } from "$lib/util/choice";
import type { DeltaCollection } from "$lib/util/versionController";

/**
 * Provider for slime types for slime-themed powers
 */
export const slimeProvider = new WeaponFeatureProvider<{ color: string; ephGen: Ephitet[]; }>([
    new ProviderElement('slime-green', { color: 'green', ephGen: ephGreen }, {}),
    new ProviderElement('slime-yellow', { color: 'yellow', ephGen: ephGold }, { rarity: { gte: 'legendary' } }),
    new ProviderElement('slime-orange', { color: 'orange', ephGen: ephGold }, { themes: { any: ['fire', 'earth'] } }),
    new ProviderElement('slime-red', { color: 'yellow', ephGen: ephRed }, { themes: { any: ['fire', 'earth'] } }),
    new ProviderElement('slime-pink', { color: 'green', ephGen: [{ pre: 'Pink' }] }, { themes: { any: ['sweet'] } }),
    new ProviderElement('slime-purple', { color: 'purple', ephGen: ephPurple }, { themes: { any: ['sweet', 'wizard'] } }),
    new ProviderElement('slime-blue', { color: 'blue', ephGen: ephBlue }, { themes: { any: ['sweet', 'wizard'] } }),
    new ProviderElement('slime-black', { color: 'black', ephGen: ephBlack }, { themes: { any: ['dark', 'earth'] } }),
    new ProviderElement('slime-white', { color: 'white', ephGen: ephWhite }, { themes: { any: ['light', 'ice'] } }),
    new ProviderElement('slime-rainbow', { color: 'rainbow', ephGen: ephWhite }, { rarity: { gte: 'epic' } }),
]);

const v2 = {
    themes: {},
    descriptors: {},
    nonRollableDescriptors: {
        add: [
            new ProviderElement('slime-body-descriptor',
                {
                    yields: 'material',
                    generate: (rng, weapon) => {
                        const slime = slimeProvider.draw(rng, weapon) ?? { color: 'clear', ephGen: [{ pre: 'Slimy' }] };
                        return {
                            material: `${slime.color} slime`,
                            ephitet: mkGen((rng) => choice(slime.ephGen, rng)),
                        }
                    },
                    applicableTo: { any: businessEndParts }
                },
                /**
                 * Can only be added by the passive power "slime-body"
                 */
                { never: true }
            ),
        ]
    },
    personalities: {},
    rechargeMethods: {},
    actives: {},
    passives: {
        add: [
            new ProviderElement("slime-body",
                mkGen((_, weapon) => {
                    const businessEnd = getBusinessEndDesc(weapon.shape)
                    return {
                        desc: `The ${businessEnd == 'weapon' ? `${businessEnd} is` : `${businessEnd} & core are`} made of slime. The wielder can manipulate the weapon like clay, but it's otherwise as strong as steel. It also bounces strongly.`,
                        descriptorPartGenerator: 'slime'
                    }
                }),
                {
                    themes: { any: ["wizard", "nature", "sour"] },
                    shapeFamily: { none: rangedWeaponShapeFamilies }
                }
            ),
        ]
    },
    languages: {},
    shapes: {},
} satisfies DeltaCollection<WeaponFeaturesTypes>;

export default v2;