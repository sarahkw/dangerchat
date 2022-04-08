import { Observable } from "rxjs";

export function syncGet<T>(source: Observable<T>): T[] {
    let values: T[] = [];
    source.subscribe(next => values.push(next)).unsubscribe();
    return values;
}

export function syncGetOne<T>(source: Observable<T>): T | undefined {
    let value: T | undefined;
    let warned: null | boolean = null;
    source.subscribe(next => {
        if (warned === null) {
            warned = false;
        } else if (warned === false) {
            console.warn('syncGetOne dropped value(s)');
            warned = true;
        }
        value = next;
    }).unsubscribe();
    return value;
}