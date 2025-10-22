import { replaceState } from "$app/navigation";
import { tick } from "svelte";

export function pushURLSearchParamsToLocation(searchParams: URLSearchParams) {
    const queryNoQuestion = searchParams.toString();
    const newQuery =
        queryNoQuestion.length > 0 ? `?${queryNoQuestion}` : "";
    if (window.location.search !== newQuery) {
        // and update the URL params to point to its ID
        tick().then(() => replaceState(newQuery, {}));
    }
}