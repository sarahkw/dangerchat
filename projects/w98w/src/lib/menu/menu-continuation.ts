import { ResizeUpdates } from "./menu-layout-size-observer.directive";

export type MenuContinuation = {
    yourVerticalOffset: number;
    yourHorizontalOffset: number | undefined;
    resizeUpdates: ResizeUpdates;
}