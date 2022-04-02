export type MenuContinuation = {
    originVerticalOffset: number;
    originHorizontalOffset: number | undefined;
    root: DOMRectReadOnly | undefined;

    updates: Map<Element, DOMRectReadOnly>;
}
