import { finalize, Observable, Observer, pipe } from "rxjs";
import { initialize } from "../rx/initialize";
import { reduceUntilThenPassthrough } from "../rx/reduce-until-then-passthrough";
import { ResizeUpdates, MlsoMenuContext } from "./menu-layout-size-observer.directive";

export type MenuContinuation = {
    offsetVertical: number;
    offsetHorizontal: number | null;  // null means no horizontal offset
    fixedHeight: number | null;  // if fixed then we might need to scroll

    updates: ResizeUpdates | undefined;  // undefined means there's no data to update
};

export function menuCalculateSelf(
    bodyElement: Element,
    mlsoMenuContext: MlsoMenuContext) {

    return function (source: Observable<MenuContinuation>) {
        return new Observable<MenuContinuation>(subscription => {
            const identity = {};

            let rootDim: DOMRectReadOnly | undefined;
            let bodyDim: DOMRectReadOnly | undefined;

            return source.pipe(observeAndBlock(identity, mlsoMenuContext, [bodyElement]))
                .subscribe(new class implements Observer<MenuContinuation> {
                    next(value: MenuContinuation): void {
                        rootDim = value.updates?.root?.value || rootDim;
                        bodyDim = value.updates?.updates.get(bodyElement)?.value || bodyDim;

                        // the pipeline should have waited until these were both available in a packet, before waking us up
                        console.assert(!!rootDim && !!bodyDim);
                        if (!rootDim || !bodyDim) return;

                        const mc: MenuContinuation = {
                            offsetHorizontal: value.offsetHorizontal,
                            offsetVertical: value.offsetVertical,
                            fixedHeight: null,
                            updates: value.updates
                        };

                        if (bodyDim.height > rootDim.height) {
                            mc.offsetVertical = 0;
                            mc.fixedHeight = rootDim.height;
                        } else if (mc.offsetVertical + bodyDim.height > rootDim.height) {
                            mc.offsetVertical = rootDim.height - bodyDim.height;
                        }

                        subscription.next(mc);
                    }
                    error(err: any): void {
                        subscription.error(err);
                    }
                    complete(): void {
                        subscription.complete();
                    }
            });
        });
    };
}

export function menuCalculateNext(
    rulerElement: Element,
    mlsoMenuContext: MlsoMenuContext,
    borderPadding: number) {

    return function (source: Observable<MenuContinuation>) {
        return new Observable<MenuContinuation>(subscription => {
            const identity = {};

            let rootDim: DOMRectReadOnly | undefined;
            let rulerDim: DOMRectReadOnly | undefined;

            return source.pipe(
                observeAndBlock(identity, mlsoMenuContext, [rulerElement])
            ).subscribe(new class implements Observer<MenuContinuation> {
                next(value: MenuContinuation): void {
                    rootDim = value.updates?.root?.value || rootDim;
                    rulerDim = value.updates?.updates.get(rulerElement)?.value || rulerDim;

                    console.assert(!!rootDim && !!rulerDim);
                    if (!rootDim || !rulerDim) return;

                    const mc: MenuContinuation = {
                        offsetHorizontal: null,  // original menu can have horizontal offset, but subsequent menus are just side by side
                        offsetVertical: value.offsetVertical + rulerDim.height - borderPadding,
                        fixedHeight: null,  // only the next menu will know whether its height should be fixed
                        updates: value.updates
                    };

                    // if overflowed, align next one at bottom because the current one has scrollbar
                    //
                    // TODO or try vertical center? that might look better.
                    if (value.fixedHeight !== null) {
                        mc.offsetVertical = rootDim.height;
                    }

                    subscription.next(mc);
                }
                error(err: any): void {
                    subscription.error(err);
                }
                complete(): void {
                    subscription.complete();
                }
            });
        });
    }
}

function accumulateMenuContinuationTakeNewerData(prev: MenuContinuation | undefined, curr: MenuContinuation): MenuContinuation {
    if (!prev) {  // from seed value?
        return curr;
    }

    return {
        offsetVertical: curr.offsetVertical,
        offsetHorizontal: curr.offsetHorizontal,
        fixedHeight: curr.fixedHeight,
        updates: (!!prev.updates && !!curr.updates) ? ResizeUpdates.accumulateNewerData(prev.updates, curr.updates) : (curr.updates || prev.updates)
    };
}

// also waits for root
function observeAndBlock(identity: any, mlsoMenuContext: MlsoMenuContext, targets: Element[]) {
    return pipe(
        reduceUntilThenPassthrough(accumulateMenuContinuationTakeNewerData, undefined,
            mc => {
                if (mc && mc.updates) {
                    if (!mc.updates.root) return false;
                    for (const needle of targets) {
                        if (!mc.updates.updates.has(needle)) return false;
                    }
                    return true;
                }
                return false;
            }),
        initialize(() => mlsoMenuContext.observe(identity, targets, true)),
        finalize(() => mlsoMenuContext.unobserveAll(identity))
    );
}
