import { weaponFeatureVersionController } from "../../../lib/generators/weaponGenerator/weaponFeatureVersionController";

export const FEATURE_PROVIDERS_BY_VERSION = $state(new Array(weaponFeatureVersionController.getLatestVersionNum() + 1).fill(null).map((_, i) => weaponFeatureVersionController.getVersion(i)));
