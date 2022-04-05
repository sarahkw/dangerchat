import { Observable, Observer } from "rxjs";

export function reduceUntilThenPassthrough<T>(
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