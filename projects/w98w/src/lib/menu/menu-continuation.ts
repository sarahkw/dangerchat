import { ResizeUpdates } from "./menu-layout-size-observer.directive";

export type MenuCalculationState = {
    ready: boolean;

    // keep these precursors to calculation so we can know when we need rerender, and to wait until ready
    prevExpandSlotVertical: number;
    prevExpandSlotHorizontal: number | null;
    precursorRoot: DOMRectReadOnly | undefined;
    precursorCalculationInputs: Map<Element, DOMRectReadOnly | undefined>;

    // batch things up here until we're ready
    batchedUpdates: ResizeUpdates | null;
}

export type MenuRender = {
    myOffsetVertical: number;
    myOffsetHorizontal: number | null;
};

export type MenuContinuation = {
    prevExpandSlotVertical: number;
    prevExpandSlotHorizontal: number | null;

    updates: ResizeUpdates | null;
};