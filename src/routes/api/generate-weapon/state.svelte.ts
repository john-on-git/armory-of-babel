import { weaponFeatureVersionController } from "$lib/generators/weaponGenerator/weaponFeatureVersionController";
import { defaultWeaponRarityConfigFactory } from "$lib/generators/weaponGenerator/weaponGeneratorConfigLoader";
import { calcOdds } from "$lib/util/configUtils";

export const FEATURE_PROVIDERS_BY_VERSION = $state(new Array(weaponFeatureVersionController.getLatestVersionNum() + 1).fill(null).map((_, i) => weaponFeatureVersionController.getVersion(i)));
export const DEFAULT_RARITY_ODDS = $state(calcOdds(defaultWeaponRarityConfigFactory()))