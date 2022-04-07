import { PixelImageBuilderFactory } from "./pixel-image-builder";

export interface PixelImageDrawer<T> {

    pidGenerateImages(pibf: PixelImageBuilderFactory): T;
    pidApplyImages(imgs: T): void;
    pidDestroy(): void;

}
