
function fontSzToTitleBarSz(fontSz: number) {
    // by observation on Display Properties -> Appearance -> Active Title Bar
    const LOOKUP = [
        [1 , 18 ],
        [12, 22 ],
        [14, 26 ],
        [17, 28 ],
        [18, 31 ],
        [20, 34 ],
        [23, 39 ],
        [27, 50 ],
        [33, 54 ],
        [36, 60 ],
        [39, 66 ],
        [41, 67 ],
        [47, 76 ],
        [48, 82 ],
        [53, 89 ],
        [59, 100],
    ];

    let val!: number;

    for (let [k, v] of LOOKUP) {
        if (fontSz >= k) {
            val = v;
        } else {
            break;
        }
    }

    console.assert(val !== undefined);

    return val;
}

export abstract class W98wStyles {

    static readonly labelFontSize = 12;
    static readonly defaultFont = "W98w MS Sans Serif";

    static readonly titleBarFont = 12;
    static readonly titleBarHeight = fontSzToTitleBarSz(W98wStyles.titleBarFont);

    // because width is fixed at (height + 2), don't let CSS stretch height to fill the titlebar body.
    // because we have to set the width anyway.   unless there's a way in CSS to keep this "proportion" ?
    static readonly titleBarBtnWidth = W98wStyles.titleBarHeight - 2;
    static readonly titleBarBtnHeight = W98wStyles.titleBarHeight - 4;

    static readonly titleBarFlexGap = 2;

    // [ _ ][ o ] [ x ]
    //           ^-        2
    static readonly titleBarXButtonLeftMargin = 2;

    // basically how much of the title bar bg wraps around the content.
    static readonly titleBarPadding = 2;
    static readonly titleBarPaddingForIcon = 1;  // icons display differently

    // i guess this keeps the button body (button without the bezels) at the same size as the title
    // bar height. definitely hardcode this instead of auto-sizing based on button contents. the icon can
    // be stretched in CSS to fit.
    static readonly taskBarBtnHeight = W98wStyles.titleBarHeight + 4;
};
