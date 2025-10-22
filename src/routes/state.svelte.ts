import { getWeaponFeatureVersionController } from "$lib/generators/weaponGenerator/weaponFeatureVersionController";
import { defaultWeaponRarityConfigFactory } from "$lib/generators/weaponGenerator/weaponGeneratorConfigLoader";
import { calcOdds } from "$lib/util/configUtils";

export const WEAPON_FEATURE_VERSION_CONTROLLER = $state(getWeaponFeatureVersionController());
export const LATEST_VERSION_NUM = $state(WEAPON_FEATURE_VERSION_CONTROLLER.getLatestVersionNum());

const WEAPON_FEATURES_BY_VERSION = $derived(new Array(WEAPON_FEATURE_VERSION_CONTROLLER.getLatestVersionNum() + 1).fill(null).map((_, i) => WEAPON_FEATURE_VERSION_CONTROLLER.getVersion(i)));
export const getFeatureProviderForVersion = (v: number) => WEAPON_FEATURES_BY_VERSION[v];

export const DEFAULT_RARITY_ODDS = $state(calcOdds(defaultWeaponRarityConfigFactory()));