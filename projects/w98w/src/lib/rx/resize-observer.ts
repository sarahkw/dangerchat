import { Observable, Unsubscribable } from "rxjs";

export function resolveContentRect(entry: ResizeObserverEntry): DOMRectReadOnly {
    // support firefox ESR, which doesn't give array
    if (Array.isArray(entry.contentRect)) {
        return entry.contentRect[0];
    } else {
        return entry.contentRect;
    }
}

export type ResizeObserverFrame = {
    entries: ResizeObserverEntry[],

    // API experiment: provide a fn you'll definitely need
    resolveContentRect: typeof resolveContentRect
};

export function resizeObserver(targets: Element[]) {
    return new Observable<ResizeObserverFrame>(subscription => {
        let ro = new ResizeObserver((entries, _observer) => {
            subscription.next({
                entries,
                resolveContentRect
            });
        });

        for (const target of targets) {
            ro.observe(target);
        }

        return new class implements Unsubscribable {
            unsubscribe(): void {
                ro.disconnect();
            }
        };
    });
}