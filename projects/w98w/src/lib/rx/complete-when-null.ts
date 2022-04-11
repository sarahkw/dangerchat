import { Observable, Subscription } from "rxjs";

export function completeWhenNull<T>() {
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
                error(err: unknown): void {
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
