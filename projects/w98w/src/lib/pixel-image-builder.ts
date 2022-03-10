import { PixelDrawConfig } from "./pixel-image.service";

export type DisplayImage = {
    // css width that may be incremented in order to get a good ratio
    cssNextStepWidth: number,
    cssNextStepHeight: number,

    // the actual container to show the img should be this size
    cssRequestedWidth: number,
    cssRequestedHeight: number,

    // a little bigger to make sure it's good. use this in cases where it's OK to take up extra space.
    // maybe a good strategy would be to actually show this much, but do layout like we're not.
    // so anything that would accidentally be clipped would still actually be shown.
    cssRequestedWidthCautious: number,
    cssRequestedHeightCautious: number,

    url: string
};

export enum HOrigin {
    Left, Right
}

export enum VOrigin {
    Top, Bottom
}

class PixelImageBuilderBasic {
    private canvas = document.createElement('canvas');
    private context: CanvasRenderingContext2D;

    private pixelSize: number;

    private beginX: number;
    private beginY: number;

    constructor(private pdc: PixelDrawConfig, private artPixelWidth: number, private artPixelHeight: number, hAlign: HOrigin, vAlign: VOrigin) {
        this.pixelSize = pdc.pixelCanvasSize;

        // the max lets caller specify 0 size, in order to bypass pixel size. for example, bevel repeats just need 1 canvas pixel.
        this.canvas.width = Math.max(pdc.snapSize(artPixelWidth * this.pixelSize), 1);
        this.canvas.height = Math.max(pdc.snapSize(artPixelHeight * this.pixelSize), 1);

        if (hAlign == HOrigin.Right) {
            this.beginX = this.canvas.width - artPixelWidth * this.pixelSize;
        } else {
            this.beginX = 0;
        }

        if (vAlign == VOrigin.Bottom) {
            this.beginY = this.canvas.height - artPixelHeight * this.pixelSize;
        } else {
            this.beginY = 0;
        }

        this.context = this.canvas.getContext('2d')!;
    }

    drawPixel(fillStyle: string, x: number, y: number) {
        return this.drawRect(fillStyle, x, y, 1, 1);
    }

    drawRect(fillStyle: string, x: number, y: number, w: number, h: number) {
        this.context.fillStyle = fillStyle;
        this.context.fillRect(
            this.beginX + x * this.pixelSize,
            this.beginY + y * this.pixelSize,
            w * this.pixelSize,
            h * this.pixelSize);
        return this;
    }

    drawRectXY(fillStyle: string, x1: number, y1: number, x2: number, y2: number) {
        return this.drawRect(fillStyle, x1, y1, x2 - x1, y2 - y1);
    }

    drawLineLeft(fillStyle: string, x: number, y: number, len: number) {
        return this.drawRect(fillStyle, x - len + 1, y, len, 1);
    }

    drawLineUp(fillStyle: string, x: number, y: number, len: number) {
        return this.drawRect(fillStyle, x, y - len + 1, 1, len);
    }

    build(): DisplayImage {
        const cssRequestedWidth = Math.ceil(this.artPixelWidth / this.pdc.dpr) * this.pixelSize;
        const cssRequestedHeight = Math.ceil(this.artPixelHeight / this.pdc.dpr) * this.pixelSize;

        return {
            cssNextStepWidth: this.pdc.canvasSizeToCssSize(this.canvas.width),
            cssNextStepHeight: this.pdc.canvasSizeToCssSize(this.canvas.height),

            cssRequestedWidth: cssRequestedWidth,
            cssRequestedHeight: cssRequestedHeight,

            // i experimented to get this, it looks pretty good, no clipping
            cssRequestedWidthCautious: cssRequestedWidth + 3,
            cssRequestedHeightCautious: cssRequestedHeight + 3,

            url: this.canvas.toDataURL()
        };
    }
}

class PixelImageBuilderCol extends PixelImageBuilderBasic {

    private pos: number = 0;
    private reverse: boolean = false;

    constructor(pdc: PixelDrawConfig, artPixelHeight: number, origin: VOrigin) {
        super(pdc, 0, artPixelHeight, HOrigin.Left, origin);
        if (origin == VOrigin.Bottom) {
            this.pos = artPixelHeight;
            this.reverse = true;
        }
    }

    pushPixel(fillStyle: string) {
        if (this.reverse) {
            this.pos--;
            this.drawPixel(fillStyle, 0, this.pos);
        } else {
            this.drawPixel(fillStyle, 0, this.pos);
            this.pos++;
        }
        return this;
    }

    pushPixels(fillStyles: string[]) {
        for (const fillStyle of fillStyles) {
            this.pushPixel(fillStyle);
        }
        return this;
    }
}

class PixelImageBuilderRow extends PixelImageBuilderBasic {

    private pos: number = 0;
    private reverse: boolean = false;

    constructor(pdc: PixelDrawConfig, artPixelWidth: number, origin: HOrigin) {
        super(pdc, artPixelWidth, 0, origin, VOrigin.Top);
        if (origin == HOrigin.Right) {
            this.pos = artPixelWidth;
            this.reverse = true;
        }
    }

    pushPixel(fillStyle: string) {
        if (this.reverse) {
            this.pos--;
            this.drawPixel(fillStyle, this.pos, 0);
        } else {
            this.drawPixel(fillStyle, this.pos, 0);
            this.pos++;
        }
        return this;
    }

    pushPixels(fillStyles: string[]) {
        for (const fillStyle of fillStyles) {
            this.pushPixel(fillStyle);
        }
        return this;
    }
}

export enum ElbowOrigin {
    TopLeft,
    BottomRight
}

class PixelImageBuilderElbow extends PixelImageBuilderBasic {

    static readonly H_ELBOW_MAP = {
        [ElbowOrigin.TopLeft]: HOrigin.Left,
        [ElbowOrigin.BottomRight]: HOrigin.Right
    };

    static readonly V_ELBOW_MAP = {
        [ElbowOrigin.TopLeft]: VOrigin.Top,
        [ElbowOrigin.BottomRight]: VOrigin.Bottom
    };

    private pos: number = 0;
    private reverse: boolean = false;

    constructor(pdc: PixelDrawConfig, private artPixelSize: number, origin: ElbowOrigin) {
        super(pdc, artPixelSize, artPixelSize, PixelImageBuilderElbow.H_ELBOW_MAP[origin], PixelImageBuilderElbow.V_ELBOW_MAP[origin]);
        if (origin == ElbowOrigin.BottomRight) {
            this.reverse = true;
        }
    }

    pushPixel(fillStyle: string) {
        if (this.reverse) {
            // across
            this.drawLineLeft(fillStyle, this.pos, this.pos, this.pos + 1);
            // up
            this.drawLineUp(fillStyle, this.pos, this.pos, this.pos + 1);
        } else {
            // across
            this.drawRect(fillStyle, this.pos, this.pos, this.artPixelSize - this.pos, 1);
            // down
            this.drawRect(fillStyle, this.pos, this.pos, 1, this.artPixelSize - this.pos);
        }

        this.pos++;
        return this;
    }

    pushPixels(fillStyles: string[]) {
        if (this.reverse) {
            for (const fillStyle of fillStyles.slice().reverse()) {
                this.pushPixel(fillStyle);
            }
        } else {
            for (const fillStyle of fillStyles.slice()) {
                this.pushPixel(fillStyle);
            }
        }
        return this;
    }
}

export enum SlantOrigin {
    BottomLeft,
    TopRight
}

function RIDX<T>(input: T[], idx: number): T {
    return input[input.length - idx - 1];
}

function fromRight(fillStyles: string[], cb: (pos: number, fillStyle: string, x: number) => void) {
    const width = fillStyles.length;
    for (let i = 0; i < width; ++i) {
        cb(i, fillStyles[i], width - 1 - i);
    }
}

class PixelImageBuilderSlant extends PixelImageBuilderBasic {

    static readonly H_SLANT_MAP = {
        [SlantOrigin.BottomLeft]: HOrigin.Left,
        [SlantOrigin.TopRight]: HOrigin.Right
    };

    static readonly V_SLANT_MAP = {
        [SlantOrigin.TopRight]: VOrigin.Top,
        [SlantOrigin.BottomLeft]: VOrigin.Bottom
    };

    constructor(pdc: PixelDrawConfig, private artPixelSize: number, private origin: SlantOrigin) {
        super(pdc, artPixelSize, artPixelSize, PixelImageBuilderSlant.H_SLANT_MAP[origin], PixelImageBuilderSlant.V_SLANT_MAP[origin]);
    }

    applyBottomRightPixels(fillStyles: string[]) {
        console.assert(this.artPixelSize == fillStyles.length);

        switch (this.origin) {
            case SlantOrigin.BottomLeft:
                // horizontal
                for (let i = 0; i < this.artPixelSize; ++i) {
                    this.drawLineLeft(RIDX(fillStyles, i), this.artPixelSize, i, i + 2); // TODO: should be i + 1
                }
                break;
            case SlantOrigin.TopRight:
                // vertical
                fromRight(fillStyles, (pos, fillStyle, x) => {
                    this.drawRectXY(fillStyle, x, pos, x + 1, this.artPixelSize);
                });
                break;
        }

        return this;
    }

    applyTopLeftPixels(fillStyles: string[]) { // draw on bottom left
        console.assert(this.artPixelSize == fillStyles.length);

        switch (this.origin) {
            case SlantOrigin.BottomLeft:
                // vertical
                for (let i = 0; i < this.artPixelSize; ++i) {
                    this.drawRect(fillStyles[i], i, 0, 1, this.artPixelSize - i - 1);
                }
                break;
            case SlantOrigin.TopRight:
                // rofl it works out without this, for now!   TODO: do this though
                break;
        }


        return this;
    }
}


export class PixelImageBuilderFactory {
    constructor(private pdc: PixelDrawConfig) {}

    basic(artPixelWidth: number, artPixelHeight: number) {
        return new PixelImageBuilderBasic(this.pdc, artPixelWidth, artPixelHeight, HOrigin.Left, VOrigin.Top);
    }

    col(origin: VOrigin, artPixelHeight: number) {
        return new PixelImageBuilderCol(this.pdc, artPixelHeight, origin);
    }

    row(origin: HOrigin, artPixelWidth: number) {
        return new PixelImageBuilderRow(this.pdc, artPixelWidth, origin);
    }

    elbow(origin: ElbowOrigin, artPixelSize: number) {
        return new PixelImageBuilderElbow(this.pdc, artPixelSize, origin);
    }

    slant(origin: SlantOrigin, artPixelSize: number) {
        return new PixelImageBuilderSlant(this.pdc, artPixelSize, origin);
    }
}
