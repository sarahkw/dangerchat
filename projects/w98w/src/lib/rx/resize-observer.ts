import { map, Observable, Unsubscribable } from "rxjs";
import { reduceUntilThenPassthrough } from "./reduce-until-then-passthrough";

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
        const ro = new ResizeObserver((entries, _observer) => {
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

type ROWFA = Map<Element, DOMRectReadOnly>;

export function resizeObserverWaitForAll(targets: Element[]) {
    return resizeObserver(targets).pipe(
        map((rof: ResizeObserverFrame) => {
            const ret: ROWFA = new Map();
            rof.entries.forEach(value => {
                ret.set(value.target, rof.resolveContentRect(value));
            });
            return ret;
        }),
        reduceUntilThenPassthrough<ROWFA>(
            (prev, curr) => {
                if (!prev) {
                    throw Error('assertion failure, missing prev');
                }
                curr.forEach((value, key) => {
                    prev.set(key, value);
                })
                return prev;
            },
            new Map<Element, DOMRectReadOnly>(),
            candidate => {
                // 'probably' ok to take size equality to mean we got all the data we need
                return !!candidate && candidate.size === targets.length;
            }
        )
    );
}
