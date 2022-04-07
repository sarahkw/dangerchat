import { Color, Colors } from "./colors";
import { VOrigin, DisplayImage, PixelImageBuilderFactory, HOrigin, ElbowOrigin, SlantOrigin } from "./pixel-image-builder";

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

export class SlantRectBevel implements Bevel {
    // topLeft and bottomRight go from outside towards inside
    constructor(
        public topLeft: Color[],
        public bottomRight: Color[],
        public antiSlant: boolean = false) {

        console.assert(topLeft.length == bottomRight.length);
    }

    genImage(which: RectImage, pibf: PixelImageBuilderFactory): DisplayImage {
        console.assert(this.antiSlant == false); // true is not supported yet

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

    getPadding() {
        console.assert(this.topLeft.length == this.bottomRight.length);
        return this.topLeft.length;
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

    static readonly MENUBAR_ITEM_HOVER = Bevels.GRAB_HANDLE_H;

    // systray.  just like FRAME but with 1 pixel instead of 2
    static readonly LIGHTFRAME = new SlantRectBevel([Colors.BEV_DARKGRAY], [Colors.BEV_WHITE]);
}
