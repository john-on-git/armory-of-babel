import { mkGen } from "$lib/generators/recursiveGenerator";
import { businessEndParts, rangedWeaponShapeFamilies, slimeProvider } from "$lib/generators/weaponGenerator/config/configConstantsAndUtils";
import { ProviderElement } from "$lib/generators/weaponGenerator/provider";
import { getBusinessEndDesc } from "$lib/generators/weaponGenerator/weaponDescriptionLogic";
import type { WeaponFeaturesTypes } from "$lib/generators/weaponGenerator/weaponGeneratorTypes";
import { choice } from "$lib/util/choice";
import type { DeltaCollection } from "$lib/util/versionController";

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