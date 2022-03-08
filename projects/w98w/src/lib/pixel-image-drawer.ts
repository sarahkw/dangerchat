import { PixelImageBuilderFactory } from "./pixel-image-builder";

type ImgParcel = any;

export interface PixelImageDrawer {

    pidGenerateImages(pibf: PixelImageBuilderFactory): ImgParcel;
    pidApplyImages(imgs: ImgParcel): void;
    pidDestroy(): void;

}
