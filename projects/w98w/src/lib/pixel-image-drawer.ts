import { PixelImageBuilderFactory } from "./pixel-image-builder";
import { PixelImageService } from "./pixel-image.service";

type ImgParcel = any;

export interface PixelImageDrawer {

    pidGenerateImages(svc: PixelImageService, dpi: number, pibf: PixelImageBuilderFactory): ImgParcel;
    pidApplyImages(imgs: ImgParcel): void;
    pidDestroy(): void;

}
