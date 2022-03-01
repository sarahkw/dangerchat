export type Color = string & { __brand: "w98w-color" };

export abstract class Colors {

    static readonly WIDGET_TEXT = "black" as Color;
    static readonly WIDGET_BG = "#c0c0c0" as Color;

    // Bevel
    static readonly BEV_BLACK = "#000000" as Color;
    static readonly BEV_DARKGRAY = "#808080" as Color;
    static readonly BEV_GRAY = Colors.WIDGET_BG; // Not used, but here to show how the bevel colors work.
    static readonly BEV_LIGHTGRAY = "#dfdfdf" as Color;
    static readonly BEV_WHITE = "#ffffff" as Color;

}
