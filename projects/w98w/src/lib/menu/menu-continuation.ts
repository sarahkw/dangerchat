import { finalize, map, Observable, Observer, pipe, Subject, Subscription } from "rxjs";
import { ResizeUpdates, MlsoMenuContext } from "./menu-layout-size-observer.directive";

export function menuNext(
    rulerElement: Element,
    mlsoMenuContext: MlsoMenuContext) {

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

                    const mc: MenuContinuation = {
                        bodyOffsetHorizontal: null,  // original menu can have horizontal offset, but subsequent menus are just side by side
                        bodyOffsetVertical: value.bodyOffsetVertical + rulerDim!.height,
                        updates: value.updates
                    };

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

export function menuCalculate(
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

                        const mc: MenuContinuation = {
                            bodyOffsetHorizontal: value.bodyOffsetHorizontal,
                            bodyOffsetVertical: value.bodyOffsetVertical,
                            updates: value.updates
                        };

                        if (mc.bodyOffsetVertical + bodyDim!.height > rootDim!.height) {
                            mc.bodyOffsetVertical = rootDim!.height - bodyDim!.height;
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

export function menuEngine(
    continuation$: Observable<MenuContinuation> /*,
    expandSlotElement$: Subject<Element | null>,
    bodyElement: Element,
    mlsoMenuContext: MlsoMenuContext
    */
    )
{
    // TODO: wait for our body size and the root size to come. that's how we know where
    //       we should draw ourselves.

    // TODO: upon receiving an expandSlotElement$, wait for its size, and then when we get it,
    //       we can start passing along continuation.
    //
    //       also, think about passing the continuation to the next menu as an observable.

    // TODO: small step: next menu just draws where the current menu ends, so kinda like stacking.

    /*
    return continuation$.pipe(map((value: MenuContinuation): MenuCalculationFrame => ({
        render: {
            myOffsetHorizontal: value.bodyOffsetHorizontal,
            myOffsetVertical: value.bodyOffsetVertical
        },
        continuation: undefined
    })));
    */

    /*
    const state_ = new MenuCalculationState(bodyElement);

    return new Observable<MenuCalculationFrame>(subscriber => {

        let sub_continuation = continuation$.subscribe({
            next(value: MenuContinuation): void {

            },
            error(err: any): void {

            },
            complete(): void {

            }
        });

        let sub_expandSlotElement = expandSlotElement$.subscribe({
            next(value: Element | null): void {

            }

            // error and complete unsupported
        });

        return sub_continuation.add(sub_expandSlotElement);
    });
    */
}

class MenuCalculationState {
    ready: boolean = false;

    bodyElement: Element;
    expandSlotElement: Element | null = null;

    // keep these precursors to calculation so we can know when we need rerender, and to wait until ready
    prevExpandSlotVertical: number | undefined;
    prevExpandSlotHorizontal: number | null | undefined;
    precursorRoot: DOMRectReadOnly | undefined;
    precursorBody: DOMRectReadOnly | undefined;
    precursorExpandSlot: DOMRectReadOnly | null | undefined;

    // batch things up here until we're ready
    batchedUpdates: ResizeUpdates | null = new ResizeUpdates();

    constructor(bodyElement: Element) {
        this.bodyElement = bodyElement;
    }
}

export type MenuContinuation = {
    // these will always have data, we'll wait if we have to
    bodyOffsetVertical: number;
    bodyOffsetHorizontal: number | null;  // null means no horizontal offset

    updates: ResizeUpdates | undefined;  // undefined means there's no data to update
};

function accumulateMenuContinuationTakeNewerData(prev: MenuContinuation | undefined, curr: MenuContinuation): MenuContinuation {
    if (!prev) {  // from seed value?
        return curr;
    }

    return {
        bodyOffsetVertical: curr.bodyOffsetVertical,
        bodyOffsetHorizontal: curr.bodyOffsetHorizontal,
        updates: (!!prev.updates && !!curr.updates) ? ResizeUpdates.accumulateNewerData(prev.updates, curr.updates) : (curr.updates || prev.updates)
    };
}

function initialize<T>(callback: () => void) {
    return function (source: Observable<T>) {
        return new Observable<T>(subscriber => {
            const subscription = source.subscribe(subscriber);

            callback();

            return subscription;
        });
    };
}

function reduceUntilThenPassthrough<T>(
    // reduce
    accumulator: (acc: T, value: T) => T,
    seed: any | undefined,

    // until - runs on the output of the accumulator
    predicate: (value: T | undefined) => boolean
) {
    return function (source: Observable<T>) {
        return new Observable<T>(subscriber => {
            let state: any = seed;
            let passthrough = predicate(state);

            return source.subscribe(new class implements Observer<T> {
                next(value: T): void {
                    if (!passthrough) {
                        state = accumulator(state, value);
                        if (predicate(state)) {
                            passthrough = true;
                            value = state;
                            state = undefined;
                        }
                    }

                    if (passthrough) {
                        subscriber.next(value);
                    }
                }
                error(err: any): void {
                    subscriber.error(err);
                }
                complete(): void {
                    subscriber.complete();
                }
            });
        });
    }
}

function completeWhenNull<T>() {
    return function (source: Observable<T | null>) {
        return new Observable<T>(subscriber => {
            const box: {
                subscription: Subscription | undefined;
                needToUnsubscribeSynchronously: boolean;
            } = {
                subscription: undefined,
                needToUnsubscribeSynchronously: false,
            };
            box.subscription = source.subscribe({
                next(value: T | null): void {
                    if (box.needToUnsubscribeSynchronously) {
                        // dropping values because not unsubscribed in time

                        // ok to flip the flag off in case of error or complete because rxjs
                        // would stop sending values if those happen.
                    } else if (value === null) {
                        subscriber.complete();
                        if (box.subscription) {
                            box.subscription.unsubscribe();
                        } else {
                            box.needToUnsubscribeSynchronously = true;
                        }
                    } else {
                        subscriber.next(value);
                    }
                },
                error(err: any): void {
                    subscriber.error(err);
                    box.needToUnsubscribeSynchronously = false;
                },
                complete(): void {
                    subscriber.complete();
                    box.needToUnsubscribeSynchronously = false;
                }
            });
            if (box.needToUnsubscribeSynchronously) {
                box.subscription.unsubscribe();
                return;
            } else {
                return box.subscription;
            }
        });
    }
}
