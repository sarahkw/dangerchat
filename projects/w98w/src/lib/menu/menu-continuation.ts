import { map, Observable, Observer, Subject, Subscription } from "rxjs";
import { ResizeUpdates, MlsoMenuContext } from "./menu-layout-size-observer.directive";


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

    return continuation$.pipe(map((value: MenuContinuation): MenuCalculationFrame => ({
        render: {
            myOffsetHorizontal: value.bodyOffsetHorizontal,
            myOffsetVertical: value.bodyOffsetVertical
        },
        continuation: undefined
    })));

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

export type MenuRender = {
    myOffsetVertical: number;
    myOffsetHorizontal: number | null;
};

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

export type MenuCalculationFrame = {
    render: MenuRender | undefined;
    continuation: MenuContinuation | null | undefined;  // can we use null and map that to 'complete' ?
};

function reduceUntilThenPassthrough<T>(
    // reduce
    accumulator: (acc: T, value: T) => T,
    seed: any,

    // until - runs on the output of the accumulator
    predicate: (value: T) => boolean
) {
    return function (observable: Observable<T>) {

        let state: any = seed;
        let passthrough = predicate(state);

        return new Observable<T>(subscriber => {
            return observable.subscribe(new class implements Observer<T> {
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
    return function (observable: Observable<T | null>) {
        return new Observable<T>(subscriber => {
            const box: {
                subscription: Subscription | undefined;
                needToUnsubscribeSynchronously: boolean;
            } = {
                subscription: undefined,
                needToUnsubscribeSynchronously: false,
            };
            box.subscription = observable.subscribe({
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
