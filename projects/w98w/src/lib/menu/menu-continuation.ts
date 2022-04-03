import { ResizeUpdates } from "./menu-layout-size-observer.directive";

export type MenuCalculationInput = {
    continuation: MenuContinuation | undefined;
    expandSlotElement: Element | undefined;
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

export type MenuCalculationOutput = {
    render: MenuRender | undefined;
    continuation: MenuContinuation | null | undefined;  // can we use null and map that to 'complete' ?
};

