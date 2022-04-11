import { finalize, Observable, Observer, pipe } from "rxjs";
import { initialize } from "../rx/initialize";
import { reduceUntilThenPassthrough } from "../rx/reduce-until-then-passthrough";
import { ResizeUpdates, MlsoMenuContext } from "./menu-layout-size-observer.directive";

export type MenuContinuation = {
    current: {
        offsetVertical: number;
        offsetHorizontal: number | null;  // null means no horizontal offset
        fixedHeight: number | null;  // if fixed then we might need to scroll

        // this should be a passthrough but since menus need the root dims anyway might as well put it here.
        // that's simpler than having menu host subscribe to root and waiting on that.
        rootWidth: number;
    } | undefined,

    next: {
        offsetVertical: number,
        offsetHorizontal: number | null;  // null means no horizontal offset

        canAlignRightWidth: number | null;  // if given, the menu can align its right border on the right border of this.
    } | undefined,

    // data that just flows through the menus. the menu doesn't have to propagate this data themselves, just pass it through.
    passthrough: {
        updates: ResizeUpdates | undefined;  // undefined means there's no data to update
    }
};

accumulateMenuContinuationTakeNewerData;
/* ACCUMULATION ALGORITHM:

   current and next: just take the newer one.
   passthrough: take the newer one, but updates has a special algorithm to merge updates from the older one.
*/

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
                        rootDim = value.passthrough.updates?.root?.value || rootDim;
                        bodyDim = value.passthrough.updates?.updates.get(bodyElement)?.value || bodyDim;

                        // the pipeline should have waited until these were both available in a packet, before waking us up
                        console.assert(!!rootDim && !!bodyDim);
                        if (!rootDim || !bodyDim) return;

                        const nextFromLast = value.next!;
                        console.assert(!!nextFromLast);

                        const mc: MenuContinuation = {
                            current: {
                                offsetHorizontal: nextFromLast.offsetHorizontal,
                                offsetVertical: nextFromLast.offsetVertical,
                                fixedHeight: null,
                                rootWidth: rootDim.width
                            },
                            next: undefined,
                            passthrough: value.passthrough
                        };

                        const current = mc.current!; // TODO codequality: current to have its own type, build MenuContination later

                        if (bodyDim.height > rootDim.height) {
                            current.offsetVertical = 0;
                            current.fixedHeight = rootDim.height;
                        } else if (current.offsetVertical + bodyDim.height > rootDim.height) {
                            current.offsetVertical = rootDim.height - bodyDim.height;
                        }

                        // attempt to be flush right against the provided anchor
                        if (nextFromLast.canAlignRightWidth !== null && current.offsetHorizontal) {
                            if (current.offsetHorizontal + bodyDim.width > rootDim.width) {
                                const attemptFlushRightAt = current.offsetHorizontal + nextFromLast.canAlignRightWidth;
                                const attemptOffsetHorizontal = attemptFlushRightAt - bodyDim.width;
                                if (attemptOffsetHorizontal >= 0) {
                                    current.offsetHorizontal = attemptOffsetHorizontal;
                                }
                            }
                        }

                        subscription.next(mc);
                    }
                    error(err: unknown): void {
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
                    rootDim = value.passthrough.updates?.root?.value || rootDim;
                    rulerDim = value.passthrough.updates?.updates.get(rulerElement)?.value || rulerDim;

                    console.assert(!!rootDim && !!rulerDim);
                    if (!rootDim || !rulerDim) return;

                    const current = value.current!;
                    console.assert(!!current);

                    const mc: MenuContinuation = {
                        current: undefined,
                        next: {
                            // tell next menu to scoot into me unless i have scrollbar
                            offsetHorizontal: current.fixedHeight !== null ? 0 : -3,

                            offsetVertical: current.offsetVertical + rulerDim.height - borderPadding,

                            // submenu must push rightwards
                            canAlignRightWidth: null
                        },

                        passthrough: value.passthrough
                    };

                    // if overflowed, align next one at bottom because the current one has scrollbar
                    if (current.fixedHeight !== null) {
                        mc.next!.offsetVertical = rootDim.height;
                    }

                    subscription.next(mc);
                }
                error(err: unknown): void {
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

    const passthrough = {
        ...curr.passthrough
    };

    passthrough.updates = ResizeUpdates.accumulateNewerData(prev.passthrough.updates, curr.passthrough.updates);

    return {
        current: curr.current,
        next: curr.next,
        passthrough
    };
}

// also waits for root
function observeAndBlock(identity: unknown, mlsoMenuContext: MlsoMenuContext, targets: Element[]) {
    return pipe(
        reduceUntilThenPassthrough(accumulateMenuContinuationTakeNewerData, undefined,
            mc => {
                if (mc && mc.passthrough.updates) {
                    if (!mc.passthrough.updates.root) return false;
                    for (const needle of targets) {
                        if (!mc.passthrough.updates.updates.has(needle)) return false;
                    }
                    return true;
                }
                return false;
            }),
        initialize(() => mlsoMenuContext.observe(identity, targets, true)),
        finalize(() => mlsoMenuContext.unobserveAll(identity))
    );
}
