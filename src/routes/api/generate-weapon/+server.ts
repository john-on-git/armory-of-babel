import { weaponFeatureVersionController } from "$lib/generators/weaponGenerator/weaponFeatureVersionController";
import { mkWeaponsForAllRarities } from "$lib/generators/weaponGenerator/weaponGeneratorLogic";
import type { WeaponRarity, WeaponViewModel } from "$lib/generators/weaponGenerator/weaponGeneratorTypes";
import { StatusCodes } from "http-status-codes";
import { FEATURE_PROVIDERS_BY_VERSION } from "./state.svelte";

export interface GenerateWeaponRequest {
    id: string;
    v: number;
}
export interface GenerateWeaponResponse {
    /**
     * The viewmodel of all weapons with this ID & version, keyed by rarity.
     */
    weapons: Record<WeaponRarity, WeaponViewModel>;
    /**
     * A number between 0 & 1, representing the weapons' position on the rarity line.
     * 
     * Given a set of rarity odds, the active weapon can be recovered
     * by taking the weapon in this.weapons of the highest rarity that has odds >= n
     */
    n: number;
}

function isGenerateWeaponRequest(maybeReq: unknown): maybeReq is GenerateWeaponRequest {
    const asReq = maybeReq as GenerateWeaponRequest;

    return (
        typeof (asReq.id) === 'string' && asReq.id !== '' &&

        typeof asReq.v === 'number' &&
        !Number.isNaN(asReq.v) && Number.isFinite(asReq.v) &&
        asReq.v >= 0 && asReq.v <= weaponFeatureVersionController.getLatestVersionNum()
    );
}

export async function GET({ request }: { request: Request, }) {
    // if we pass the url straight to URLSearchParams, it'll include the URL with the first parameter, for some reason?
    const iStartOfQuery = request.url.indexOf('?');
    const location = request.url.slice(iStartOfQuery);
    const params = new URLSearchParams(location);

    const v = params.get('v');
    const weaponRequest = {
        id: params.get('id'),
        v: v === null ? NaN : Number.parseInt(v),
    }

    if (isGenerateWeaponRequest(weaponRequest)) {

        const weaponViewModels = mkWeaponsForAllRarities(weaponRequest.id, FEATURE_PROVIDERS_BY_VERSION[weaponRequest.v]);

        return new Response(
            JSON.stringify(weaponViewModels),
            {
                status: StatusCodes.OK
            }
        );
    }
    else {
        return new Response(null, { status: StatusCodes.BAD_REQUEST });
    }
}