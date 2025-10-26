import type { WeaponFeaturesTypes } from "$lib/generators/weaponGenerator/weaponGeneratorTypes";
import type { DeltaCollection } from "$lib/util/versionController";

export default {
    themes: {},
    descriptors: {},
    personalities: {},
    rechargeMethods: {},
    actives: {},
    passives: {},
    languages: {},
    shapes: {},
    nonRollableDescriptors: {}
} satisfies DeltaCollection<WeaponFeaturesTypes>;