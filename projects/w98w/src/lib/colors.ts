export type Color = string & { __brand: "w98w-color" };

export abstract class Colors {

    // TODO: Rename this class to Theme.

    static readonly labelFontSize = 12;
    // I don't like how the Linux firefox default DejaVu Sans Serif looks.
    // Otherwise I'd just put sans-serif.
    static readonly defaultFont = "Arial, Helvetica, sans-serif";

    static readonly DESKTOP = "#008080" as Color;

    static readonly WIDGET_TEXT = "black" as Color;
    static readonly WIDGET_TEXT_DISABLED = "#808080" as Color;
    static readonly WIDGET_BG = "#c0c0c0" as Color;

    static readonly TITLEBAR_ACTIVE = "#000080" as Color;
    static readonly TITLEBAR_INACTIVE = "#808080" as Color;
    static readonly TITLEBAR_TEXT = "#ffffff" as Color;

    static readonly MENU_SELECTED_TEXT = "#ffffff" as Color;
    static readonly MENU_SELECTED_BG = "#000080" as Color;

    // Bevel
    static readonly BEV_BLACK = "#000000" as Color;
    static readonly BEV_DARKGRAY = "#808080" as Color;
    static readonly BEV_GRAY = Colors.WIDGET_BG; // Not used, but here to show how the bevel colors work.
    static readonly BEV_LIGHTGRAY = "#dfdfdf" as Color;
    static readonly BEV_WHITE = "#ffffff" as Color;

}
