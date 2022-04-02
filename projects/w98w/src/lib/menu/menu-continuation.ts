import { ResizeUpdates } from "./menu-layout-size-observer.directive";

export type MenuCalculationState = {
    ready: boolean;
    changed: boolean; // i need to change my position

    prevExpandSlotVertical: number;
    prevExpandSlotHorizontal: number | null;

    precursorRoot: DOMRectReadOnly | undefined;
    precursorCalculationInputs: Map<Element, DOMRectReadOnly | undefined>;

    myOffsetVertical: number | undefined,

    nextExpandSlotVertical: number | undefined;
    nextExpandSlotHorizontal: number | null | undefined;

    // batch things up here until we're ready
    batchedUpdates: ResizeUpdates | null;
}

export type MenuContinuation = {
    prevExpandSlotVertical: number;
    prevExpandSlotHorizontal: number | null;

    updates: ResizeUpdates | null;
};