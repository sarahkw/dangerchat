import { Observable, Observer } from "rxjs";

export function filterOutNullAndUndefined<T>() {
    return function (source: Observable<T>) {
        return new Observable<NonNullable<T>>(subscriber => {
            return source.subscribe(new class implements Observer<T> {
                next(value: T): void {
                    if (value !== undefined && value !== null) {
                        subscriber.next(value as NonNullable<T>);
                    }
                }
                error(err: unknown): void {
                    subscriber.error(err);
                }
                complete(): void {
                    subscriber.complete();
                }
            });
        });
    }
}