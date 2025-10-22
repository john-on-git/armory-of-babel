import { pushState, replaceState } from "$app/navigation";
import { tick } from "svelte";

export function getIsFirstInHistory() {
    return 'isFirstInHistory' in history.state["sveltekit:states"] ? history.state["sveltekit:states"].isFirstInHistory : true;
}
export function getIsLastInHistory() {
    return 'isLastInHistory' in history.state["sveltekit:states"] ? history.state["sveltekit:states"].isLastInHistory : true;
}

export function syncLocationWithURLSearchParams(searchParams: URLSearchParams, mode: 'push' | 'replace') {
    const queryNoQuestion = searchParams.toString();
    const newQuery =
        queryNoQuestion.length > 0 ? `?${queryNoQuestion}` : "";
    if (window.location.search !== newQuery) {
        // and update the URL params to point to its ID
        tick().then(() => {
            switch (mode) {
                case 'push':
                    replaceState("", { isFirstInHistory: getIsFirstInHistory(), isLastInHistory: false });
                    pushState(newQuery, { isFirstInHistory: false, isLastInHistory: true });
                    break;
                case 'replace':
                    replaceState(newQuery, {
                        isFirstInHistory: getIsFirstInHistory(),
                        isLastInHistory: getIsLastInHistory()
                    });
                    break;
                default:
                    mode satisfies never;
            }

            tick().then(() => dispatchEvent(new PopStateEvent("popstate", {
                state: {
                    isFirstInHistory: getIsFirstInHistory(),
                    isLastInHistory: getIsLastInHistory()
                }
            })));
        });
    }
    else {
        tick().then(() => dispatchEvent(new PopStateEvent("popstate", {
            state: {
                isFirstInHistory: getIsFirstInHistory(),
                isLastInHistory: getIsLastInHistory(),
            }
        })));
    }
}