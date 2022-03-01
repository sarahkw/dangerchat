import { Color, Colors } from "./colors";

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

export class RectBevel implements Bevel {
    constructor(public outIn: Color[]) {}
}

export class SlantRectBevel implements Bevel {
    // topLeft and bottomRight go from outside towards inside
    constructor(
        public topLeft: Color[],
        public bottomRight: Color[],
        public antiSlant: boolean = false) {}
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
