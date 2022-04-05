import { Observable } from "rxjs";

export function initialize<T>(callback: () => void) {
    return function (source: Observable<T>) {
        return new Observable<T>(subscriber => {
            const subscription = source.subscribe(subscriber);

            callback();

            return subscription;
        });
    };
}
