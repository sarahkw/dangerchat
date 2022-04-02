import { ResizeUpdates } from "./menu-layout-size-observer.directive";

export type MenuContinuation = {
    originVerticalOffset: number;
    originHorizontalOffset: number | undefined;
    resizeUpdates: ResizeUpdates;
}