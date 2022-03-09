import { DisplayImage, PixelImageBuilderFactory } from "./pixel-image-builder";

export type GenImgDescriptor = {

    // the descriptor hints what size they should be in CSS pixels. can be undefined if
    // the image will just draw for any provided size.
    desiredCssWidth: number,
    desiredCssHeight: number,

    // the width and height will be the desired ones if those are available. otherwise,
    // it'll be what's requested.
    draw: (drawCssWidth: number, drawCssHeight: number, pibf: PixelImageBuilderFactory) => DisplayImage;
};

export abstract class GenImg {

    static readonly TBAR_X = undefined as unknown as GenImgDescriptor;

}
