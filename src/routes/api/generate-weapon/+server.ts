import { StatusCodes } from "http-status-codes";
import { weaponFeatureVersionController } from "../../../lib/generators/weaponGenerator/weaponFeatureVersionController";
import { defaultWeaponRarityConfigFactory } from "../../../lib/generators/weaponGenerator/weaponGeneratorConfigLoader";
import { mkWeapon } from "../../../lib/generators/weaponGenerator/weaponGeneratorLogic";
import { applyOddsToConfig } from "../../../lib/util/configUtils";
import { isValidOdds } from "../../../lib/util/getFromURL";
import { DEFAULT_RARITY_ODDS, FEATURE_PROVIDERS_BY_VERSION } from "./state.svelte";

export interface GenerateWeaponRequest {
    id: string;
    version: number;
    odds: [number, number, number, number];
}

function isGenerateWeaponRequest(maybeReq: unknown): maybeReq is GenerateWeaponRequest {
    const asReq = maybeReq as GenerateWeaponRequest;

    return (
        typeof (asReq.id) === 'string' && asReq.id !== '' &&

        typeof asReq.version === 'number' &&
        !Number.isNaN(asReq.version) && Number.isFinite(asReq.version) &&
        asReq.version >= 0 && asReq.version <= weaponFeatureVersionController.getLatestVersionNum() &&

        typeof asReq.odds === 'object' &&
        isValidOdds(asReq.odds)
    );
}

export async function GET({ request }: { request: Request, }) {
    // if we pass the url straight to URLSearchParams, it'll include the URL with the first parameter, for some reason?
    const iStartOfQuery = request.url.indexOf('?');
    const location = request.url.slice(iStartOfQuery);
    const params = new URLSearchParams(location);

    const oddsFromParams = params.getAll('o').map(x => Number.parseFloat(x));
    const v = params.get('v');

    const weaponRequest = {
        id: params.get('id'),
        version: v === null ? NaN : Number.parseInt(v),
        odds: oddsFromParams.length === 0 ? DEFAULT_RARITY_ODDS : oddsFromParams
    }

    if (isGenerateWeaponRequest(weaponRequest)) {

        const config = applyOddsToConfig(defaultWeaponRarityConfigFactory(), weaponRequest.odds);

        const { weaponViewModel } = mkWeapon(FEATURE_PROVIDERS_BY_VERSION[weaponRequest.version], weaponRequest.id, config);

        return new Response(
            JSON.stringify(weaponViewModel),
            {
                status: StatusCodes.OK
            }
        );
    }
    else {
        return new Response(null, { status: StatusCodes.BAD_REQUEST });
    }
}