import { Color, Colors } from "./colors";
import { VOrigin, DisplayImage, PixelImageBuilderFactory, HOrigin, ElbowOrigin, SlantOrigin } from "./pixel-image-builder";

import { PixelImageService } from "./pixel-image.service";

export interface Bevel {
}

export class HLineBevel implements Bevel {
    constructor(public topToBottom: Color[]) {}
}

export class VLineBevel implements Bevel {
    constructor(public leftToRight: Color[]) {}
}

export class OutToInLineBevel implements Bevel {
    // out-to-in for consistency with rect. think of the panel as a window with only 1 border shown.

    private reversedOutToIn: Color[];
    constructor(private outToIn: Color[]) {
        this.reversedOutToIn = outToIn.slice().reverse();
    }

    ltrPanelIsLeft() {
        return this.reversedOutToIn;
    }

    ltrPanelIsRight() {
        return this.outToIn;
    }

    ttbPanelIsTop() {
        return this.reversedOutToIn;
    }

    ttbPanelIsBottom() {
        return this.outToIn;
    }
}

export enum RectImage {
    Left,
    Right,
    Top,
    Bottom,
    TL,
    TR,
    BL,
    BR
}

export class RectBevel implements Bevel {
    constructor(public outIn: Color[]) {}
}

abstract class dh {

    private static pixel(canvas: CanvasRenderingContext2D, fillStyle: string, x: number, y: number) {
        canvas.fillStyle = fillStyle;
        canvas.fillRect(x, y, 1, 1);
    }

    static simple(service: PixelImageService, width: number, pixels: Color[]) {
        let uniqueKey = `w98w-bevel-simple-${width}`;
        for (let pixel of pixels) {
            uniqueKey += "-";
            uniqueKey += pixel.toString();
        }

        return service.ensureImage(uniqueKey, width, pixels.length / width, (canvas) => {
            for (let i = 0; i < pixels.length; ++i) {
                dh.pixel(canvas, pixels[i], i % width, Math.floor(i / width));
            }
        });
    }

    /*
       0 0 0
       0 1 1
       0 1 2
    */
    private static layeredGeneric(service: PixelImageService, filtKey: string,
                                  filt: (size: number, coord: {x: number, y: number}) => {x: number, y: number},
                                  pixels: Color[]) {
        let uniqueKey = `w98w-bevel-layered-${filtKey}`;
        for (let pixel of pixels) {
            uniqueKey += "-";
            uniqueKey += pixel.toString();
        }

        return service.ensureImage(uniqueKey, pixels.length, pixels.length, (canvas) => {
            for (let i = 0; i < pixels.length; ++i) {

                // from (i, i), fill right-wards

                for (let j = i; j < pixels.length; ++j) {
                    const coord = filt(pixels.length, {
                        x: j,
                        y: i
                    });
                    dh.pixel(canvas, pixels[i], coord.x, coord.y);
                }

                // from (i, i), fill down-wards  (essentially, not exactly)

                for (let j = i + 1; j < pixels.length; ++j) {
                    const coord = filt(pixels.length, {
                        x: i,
                        y: j
                    });
                    dh.pixel(canvas, pixels[i], coord.x, coord.y);
                }
            }
        });
    }

    static layeredTL(service: PixelImageService, pixels: Color[]) {
        return dh.layeredGeneric(service, 'TL', (_, coord) => coord, pixels);
    }

    static layeredBR(service: PixelImageService, pixels: Color[]) {
        return dh.layeredGeneric(service, 'BR', (size, coord) => ({x: size - 1 - coord.x, y: size - 1 - coord.y}), pixels);
    }

    static layeredTR(service: PixelImageService, pixels: Color[]) {
        return dh.layeredGeneric(service, 'TR', (size, coord) => ({x: size - 1 - coord.x, y: coord.y}), pixels);
    }

    static layeredBL(service: PixelImageService, pixels: Color[]) {
        return dh.layeredGeneric(service, 'BL', (size, coord) => ({x: coord.x, y: size - 1 - coord.y}), pixels);
    }
}

export class SlantRectBevel implements Bevel {
    // topLeft and bottomRight go from outside towards inside
    constructor(
        public topLeft: Color[],
        public bottomRight: Color[],
        public antiSlant: boolean = false) {

        console.assert(topLeft.length == bottomRight.length);
    }

    // returns an URL
    genImage(which: RectImage, service: PixelImageService): string {
        console.assert(this.antiSlant == false); // true is not supported yet

        switch (which) {
        case RectImage.Left:
            return dh.simple(service, this.topLeft.length, this.topLeft);
        case RectImage.Right:
            return dh.simple(service, this.bottomRight.length, this.bottomRight.slice().reverse());
        case RectImage.Top:
            return dh.simple(service, 1, this.topLeft);
        case RectImage.Bottom:
            return dh.simple(service, 1, this.bottomRight.slice().reverse());
        case RectImage.TL:
            return dh.layeredTL(service, this.topLeft);
        case RectImage.TR:
            // TODO: is placeholder, implement me!
            return dh.layeredTR(service, this.bottomRight);
        case RectImage.BL:
            // TODO: is placeholder, implement me!
            return dh.layeredBL(service, this.bottomRight);
        case RectImage.BR:
            return dh.layeredBR(service, this.bottomRight);
        }
    }

    genImage2(which: RectImage, pibf: PixelImageBuilderFactory): DisplayImage {
        switch (which) {
        case RectImage.Left:
            return pibf.row(HOrigin.Left, this.topLeft.length).pushPixels(this.topLeft).build();
        case RectImage.Right:
            return pibf.row(HOrigin.Right, this.bottomRight.length).pushPixels(this.bottomRight).build();
        case RectImage.Top:
            return pibf.col(VOrigin.Top, this.topLeft.length).pushPixels(this.topLeft).build();
        case RectImage.Bottom:
            return pibf.col(VOrigin.Bottom, this.bottomRight.length).pushPixels(this.bottomRight).build();
        case RectImage.TL:
            return pibf.elbow(ElbowOrigin.TopLeft, this.topLeft.length).pushPixels(this.topLeft).build();
        case RectImage.TR:
            return pibf.slant(SlantOrigin.TopRight, this.bottomRight.length)
                .applyBottomRightPixels(this.bottomRight)
                .applyTopLeftPixels(this.topLeft)
                .build();
        case RectImage.BR:
            return pibf.elbow(ElbowOrigin.BottomRight, this.bottomRight.length).pushPixels(this.bottomRight).build();
        case RectImage.BL:
            return pibf.slant(SlantOrigin.BottomLeft, this.bottomRight.length)
                .applyBottomRightPixels(this.bottomRight)
                .applyTopLeftPixels(this.topLeft)
                .build();
        }
    }
}

export abstract class Bevels {

    // Don't forget to draw ants on focus!

    static readonly BUTTON = new SlantRectBevel([Colors.BEV_WHITE, Colors.BEV_LIGHTGRAY], [Colors.BEV_BLACK, Colors.BEV_DARKGRAY]);
    static readonly BUTTON_PRESSED = new SlantRectBevel([Colors.BEV_BLACK, Colors.BEV_DARKGRAY], [Colors.BEV_WHITE, Colors.BEV_LIGHTGRAY]);
    static readonly BUTTON_DEFAULT = new SlantRectBevel([Colors.BEV_BLACK, Colors.BEV_WHITE, Colors.BEV_LIGHTGRAY], [Colors.BEV_BLACK, Colors.BEV_BLACK, Colors.BEV_DARKGRAY]);
    static readonly BUTTON_DEFAULT_PRESSED = new RectBevel([Colors.BEV_BLACK, Colors.BEV_DARKGRAY]);

    static readonly INPUTBOX = new SlantRectBevel([Colors.BEV_DARKGRAY, Colors.BEV_BLACK], [Colors.BEV_WHITE, Colors.BEV_LIGHTGRAY]);
    static readonly CHECKBOX = Bevels.INPUTBOX;

    static readonly WINDOW = new SlantRectBevel([Colors.BEV_LIGHTGRAY, Colors.BEV_WHITE], [Colors.BEV_BLACK, Colors.BEV_DARKGRAY]);
    static readonly MENU = Bevels.WINDOW;
    static readonly SCROLLBAR = Bevels.WINDOW;

    static readonly FRAME = new SlantRectBevel([Colors.BEV_DARKGRAY, Colors.BEV_WHITE], [Colors.BEV_WHITE, Colors.BEV_DARKGRAY], true /*antiSlant*/);

    // taskbar
    static readonly DOCKED_PANEL = new OutToInLineBevel([Colors.BEV_BLACK, Colors.BEV_DARKGRAY]);

    // taskbar, menu
    static readonly MENU_DIVIDER_H = new HLineBevel([Colors.BEV_DARKGRAY, Colors.BEV_WHITE]);

    // note: fixed height, can optimize and use fewer slices
    static readonly GRAB_HANDLE_H = new SlantRectBevel([Colors.BEV_WHITE], [Colors.BEV_DARKGRAY]);

    // systray.  just like FRAME but with 1 pixel instead of 2
    static readonly LIGHTFRAME = new SlantRectBevel([Colors.BEV_DARKGRAY], [Colors.BEV_WHITE]);
}
