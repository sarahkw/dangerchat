import { PixelImageService } from "./pixel-image.service";

type ImgParcel = any;

export interface PixelImageDrawer {

    pidGenerateImages(svc: PixelImageService, dpi: number): ImgParcel;
    pidApplyImages(imgs: ImgParcel): void;
    pidDestroy(): void;

}
