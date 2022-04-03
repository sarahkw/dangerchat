import { Observable, Subscription } from "rxjs";
import { ResizeUpdates } from "./menu-layout-size-observer.directive";

export type MenuCalculationInput = {
    continuation: MenuContinuation | undefined;
    expandSlotElement: Element | null | undefined;
};

export type MenuCalculationState = {
    ready: boolean;

    bodyElement: Element;
    expandSlotElement: Element | null;

    // keep these precursors to calculation so we can know when we need rerender, and to wait until ready
    prevExpandSlotVertical: number;
    prevExpandSlotHorizontal: number | null;
    precursorRoot: DOMRectReadOnly | undefined;
    precursorBody: DOMRectReadOnly | undefined;
    precursorExpandSlot: DOMRectReadOnly | null | undefined;

    // batch things up here until we're ready
    batchedUpdates: ResizeUpdates | null;
}

export type MenuRender = {
    myOffsetVertical: number;
    myOffsetHorizontal: number | null;
};

export type MenuContinuation = {
    bodyOffsetVertical: number;
    bodyOffsetHorizontal: number | null;

    updates: ResizeUpdates | null;
};

export type MenuCalculationFrame = {
    render: MenuRender | undefined;
    continuation: MenuContinuation | null | undefined;  // can we use null and map that to 'complete' ?
};

function complete_when_null<T>() {
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
