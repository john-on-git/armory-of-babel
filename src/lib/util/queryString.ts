import { pushState, replaceState } from "$app/navigation";
import { page } from "$app/state";
import { tick } from "svelte";

export async function syncLocationWithURLSearchParams(searchParams: URLSearchParams, mode: 'push' | 'replace') {
    // only update the URL if it has actually changed, this should stop us from timing out as much when spamming location calls
    const queryNoQuestion = searchParams.toString();
    const newQuery =
        queryNoQuestion.length > 0 ? `?${queryNoQuestion}` : "";

    console.log(page.url.search, newQuery, page.url.search !== newQuery)

    if (page.url.search !== newQuery) {
        // and update the URL params to point to its ID
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
        dispatchEvent(new PopStateEvent("popstate"));
    }
    else {
        tick().then(() => dispatchEvent(new PopStateEvent("popstate")));
    }
}