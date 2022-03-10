
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

const titleBarFont = 12;

export abstract class W98wStyles {

    // also used for: taskbar button size, ...
    static readonly titleBar = {
        font: titleBarFont,
        barHeight: fontSzToTitleBarSz(titleBarFont)
    };

};
