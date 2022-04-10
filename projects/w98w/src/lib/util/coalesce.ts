export function coalesce2<T>(a: (T | null | undefined), b: T): T {
    if (a !== undefined && a !== null) {
        return a;
    } else {
        return b;
    }
}