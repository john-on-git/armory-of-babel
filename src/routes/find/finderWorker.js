import { getWeaponFeatureVersionController } from "$lib/generators/weaponGenerator/weaponFeatureVersionController.ts";
import { mkWeaponsForAllRarities } from "$lib/generators/weaponGenerator/weaponGeneratorLogic.ts";
import _ from "lodash";

/** Number of threads to create. Each thread will check every Nth weapon.
 * Must be kept synced with the matching variable in +page.svelte.
 */
export const N_THREADS = 32;

/** Weapon ID to start searching at.
 */
const START = 169473;

/** Number of weapons to check before giving up.
 */
const ATTEMPTS = 10_000_000;

/**
 * Condition to find weapons for
 * @param {import("../../lib/generators/weaponGenerator/weaponGeneratorTypes").WeaponViewModel} weapon
 */
function cond(weapon) {
    return weapon.rarity === "epic" && weapon.sentient === false && weapon.damage.as === "axe" && weapon.themes.includes('ice') && /obsidian/gi.test(weapon.description);
}

onmessage = (onMessageEvent) => {

    if (typeof onMessageEvent.data === "number") {

        const WEAPON_FEATURES = (() => {
            const weaponFeatureVersionController = getWeaponFeatureVersionController();
            return weaponFeatureVersionController.getVersion(weaponFeatureVersionController.getLatestVersionNum())
        })();
        const end = (START + ATTEMPTS) + ((START + ATTEMPTS) % N_THREADS); // round up to N_THREADS (it will do this anyway but this should clarify what's going on)
        let i = onMessageEvent.data;
        let weaponsWithCondResult;
        let validWeaponFound = false;

        do {
            weaponsWithCondResult = _.toArray(mkWeaponsForAllRarities((i).toString(), WEAPON_FEATURES, undefined, undefined, true).weapons).map(weapon => [weapon, cond(weapon)]);
            validWeaponFound = weaponsWithCondResult.some(([, b]) => b);

            i += N_THREADS;
        } while (i <= end && !validWeaponFound);

        if (validWeaponFound) {
            self.postMessage(weaponsWithCondResult.filter(([, b]) => b).map(([w,]) => w));
        }
        else {
            throw new Error('Failed to find weapon.')
        }
    }
    else {
        throw new Error(`expected data must be a number but got ${JSON.stringify(onMessageEvent.data)} :: ${typeof onMessageEvent.data}`);
    }
}