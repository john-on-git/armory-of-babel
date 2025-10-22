import { ProviderElement } from "$lib/generators/weaponGenerator/provider";
import type { WeaponFeaturesTypes } from "$lib/generators/weaponGenerator/weaponGeneratorTypes";
import type { DeltaCollection } from "$lib/util/versionController";

export default {
    themes: {},
    descriptors: {},
    personalities: {},
    rechargeMethods: {},
    actives: {
        add: [


        ]
    },
    passives: {
        add: [
            new ProviderElement('slenderblade',
                {
                    miscPower: true,
                    desc: "A mass of shadowy tentacles form around the wielder's shoulders. They function as an additional pair of arms."
                },
                {
                    themes: {
                        any: ['dark']
                    }
                }
            )
        ]
    },
    languages: {},
    shapes: {}
} satisfies DeltaCollection<WeaponFeaturesTypes>;