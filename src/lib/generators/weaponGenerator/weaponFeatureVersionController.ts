import v1 from "$lib/generators/weaponGenerator/config/v1";
import v2 from "$lib/generators/weaponGenerator/config/v2";
import v3 from "$lib/generators/weaponGenerator/config/v3";
import { WeaponFeatureProvider } from "$lib/generators/weaponGenerator/weaponGeneratorLogic";
import { type FeatureProviderCollection, type Theme, type WeaponFeaturesTypes } from "$lib/generators/weaponGenerator/weaponGeneratorTypes";
import { PrimitiveContainer, VersionController, type DeltaCollection, type ToPatchableArray } from "$lib/util/versionController";



export const weaponFeatureVersionController = new VersionController<WeaponFeaturesTypes, DeltaCollection<WeaponFeaturesTypes>, ToPatchableArray<DeltaCollection<WeaponFeaturesTypes>>, FeatureProviderCollection>([
    v1,
    v2,
    v3

    // ,{
    //     themes: {},
    //     adjectives: {},
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
        adjectiveProvider: new WeaponFeatureProvider(x.adjectives),
        personalityProvider: new WeaponFeatureProvider(x.personalities),
        shapeProvider: new WeaponFeatureProvider(x.shapes),
        rechargeMethodProvider: new WeaponFeatureProvider(x.rechargeMethods),
        activePowerProvider: new WeaponFeatureProvider(x.actives),
        passivePowerOrLanguageProvider: new WeaponFeatureProvider(x.passives),
        languageProvider: new WeaponFeatureProvider(x.languages)
    } satisfies FeatureProviderCollection
});