import { DisplayImage, PixelImageBuilderFactory } from "./pixel-image-builder";

export type GenImgDescriptor = {
    w: number,
    h: number,
    draw: (w: number, h: number, pibf: PixelImageBuilderFactory) => DisplayImage;
};

export abstract class GenImg {

    static readonly TBAR_X = undefined as unknown as GenImgDescriptor;

}
