import { pushState, replaceState } from "$app/navigation";
import { tick } from "svelte";

export function syncLocationWithURLSearchParams(searchParams: URLSearchParams, mode: 'push' | 'replace') {
    const queryNoQuestion = searchParams.toString();
    const newQuery =
        queryNoQuestion.length > 0 ? `?${queryNoQuestion}` : "";
    if (window.location.search !== newQuery) {
        // and update the URL params to point to its ID
        tick().then(() => {
            switch (mode) {
                case 'push':
                    pushState(newQuery, {});
                    break;
                case 'replace':
                    replaceState(newQuery, {});
                    break;
                default:
                    mode satisfies never;
            }

            tick().then(() => dispatchEvent(new PopStateEvent("popstate", { state: null })));
        });
    }
    else {
        tick().then(() => dispatchEvent(new PopStateEvent("popstate", { state: null })));
    }
}