import v1 from "$lib/generators/weaponGenerator/config/v1";
import type { ProviderElement } from "$lib/generators/weaponGenerator/provider";
import { WeaponFeatureProvider } from "$lib/generators/weaponGenerator/weaponGeneratorLogic";
import { type DescriptorGenerator, type FeatureProviderCollection, type Theme, type WeaponFeaturesTypes } from "$lib/generators/weaponGenerator/weaponGeneratorTypes";
import { PrimitiveContainer, VersionController, type DeltaCollection, type ToPatchableArray } from "$lib/util/versionController";



export const getWeaponFeatureVersionController = () => new VersionController<WeaponFeaturesTypes, DeltaCollection<WeaponFeaturesTypes>, ToPatchableArray<WeaponFeaturesTypes>, FeatureProviderCollection>([
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
    console.log(
        "Loaded\n",
        (x.themes as Array<unknown>).length, 'Themes\n',
        (x.descriptors as Array<unknown>).length + (x.nonRollableDescriptors as Array<unknown>).length, 'Descriptors\n',
        (x.personalities as Array<unknown>).length, 'Personalities\n',
        (x.shapes as Array<unknown>).length, 'Shapes\n',
        (x.rechargeMethods as Array<unknown>).length, 'Recharge Methods\n',
        (x.actives as Array<unknown>).length, 'Active Powers\n',
        (x.passives as Array<unknown>).length, 'Passive powers\n',
        (x.languages as Array<unknown>).length, 'Languages\n',
    )
    return {
        themeProvider: (x.themes as PrimitiveContainer<Theme>[]).map(x => x.value),
        descriptors: new WeaponFeatureProvider(x.descriptors),
        descriptorIndex: ([...(x.descriptors as ProviderElement<DescriptorGenerator>[]), ...x.nonRollableDescriptors as ProviderElement<DescriptorGenerator>[]]).reduce<Record<string, DescriptorGenerator & { UUID: string }>>((acc, gen) => {
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
        passivePowerProvider: new WeaponFeatureProvider(x.passives),
        languageProvider: new WeaponFeatureProvider(x.languages)
    } satisfies FeatureProviderCollection
});