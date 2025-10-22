import v1 from "$lib/generators/weaponGenerator/config/v1";
import type { ProviderElement } from "$lib/generators/weaponGenerator/provider";
import { WeaponFeatureProvider } from "$lib/generators/weaponGenerator/weaponGeneratorLogic";
import { type DescriptorGenerator, type FeatureProviderCollection, type Theme, type WeaponFeaturesTypes } from "$lib/generators/weaponGenerator/weaponGeneratorTypes";
import { PrimitiveContainer, VersionController, type DeltaCollection, type ToPatchableArray } from "$lib/util/versionController";



export const weaponFeatureVersionController = new VersionController<WeaponFeaturesTypes, DeltaCollection<WeaponFeaturesTypes>, ToPatchableArray<WeaponFeaturesTypes>, FeatureProviderCollection>([
    v1,
    // ,{
    //     themes: {},
    //     descriptors: {},
    //     personalities: {},
    //     rechargeMethods: {},
    //     actives: {},
    //     passives: {},
    //     languages: {},
    //     shapes: {}
    // }
], (x) => {
    return {
        themeProvider: (x.themes as PrimitiveContainer<Theme>[]).map(x => x.value),
        descriptors: new WeaponFeatureProvider(x.descriptors, true),
        descriptorIndex: (x.descriptors as ProviderElement<DescriptorGenerator>[]).reduce<Record<string, DescriptorGenerator & { UUID: string }>>((acc, gen) => {
            acc[gen.UUID] = {
                ...gen.thing,
                UUID: gen.UUID,
            };
            return acc;
        }, {}),
        personalityProvider: new WeaponFeatureProvider(x.personalities),
        shapeProvider: new WeaponFeatureProvider(x.shapes),
        rechargeMethodProvider: new WeaponFeatureProvider(x.rechargeMethods),
        activePowerProvider: new WeaponFeatureProvider(x.actives),
        passivePowerOrLanguageProvider: new WeaponFeatureProvider(x.passives),
        languageProvider: new WeaponFeatureProvider(x.languages)
    } satisfies FeatureProviderCollection
});