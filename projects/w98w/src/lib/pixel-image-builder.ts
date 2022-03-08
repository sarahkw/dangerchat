import { PixelDrawConfig } from "./pixel-image.service";

const reverse = Symbol('reverse');

export type DisplayImage = {
    cssWidth: number,
    cssHeight: number,
    url: string
};

export enum RowOrigin {
    L, R
}

export enum ColOrigin {
    T, B
}

class PixelImageBuilderBasic {
    private canvas = document.createElement('canvas');
    private context: CanvasRenderingContext2D;

    private pixelSize: number;

    private beginX: number;
    private beginY: number;

    constructor(private pdc: PixelDrawConfig, artPixelWidth: number, artPixelHeight: number, private hAlign: RowOrigin, private vAlign: ColOrigin) {
        this.pixelSize = pdc.pixelCanvasSize;

        this.canvas.width = Math.max(pdc.snapSize(artPixelWidth * this.pixelSize), 1);
        this.canvas.height = Math.max(pdc.snapSize(artPixelHeight * this.pixelSize), 1);

        if (hAlign == RowOrigin.R) {
            this.beginX = this.canvas.width - artPixelWidth * this.pixelSize;
        } else {
            this.beginX = 0;
        }

        if (vAlign == ColOrigin.B) {
            this.beginY = this.canvas.height - artPixelHeight * this.pixelSize;
        } else {
            this.beginY = 0;
        }

        this.context = this.canvas.getContext('2d')!;
    }

    drawPixel(fillStyle: string, x: number, y: number) {
        this.context.fillStyle = fillStyle;
        this.context.fillRect(this.beginX + x * this.pixelSize, this.beginY + y * this.pixelSize, this.pixelSize, this.pixelSize);
    }

    build(): DisplayImage {
        return {
            cssWidth: this.pdc.canvasSizeToCssSize(this.canvas.width),
            cssHeight: this.pdc.canvasSizeToCssSize(this.canvas.height),
            url: this.canvas.toDataURL()
        };
    }
}

class PixelImageBuilderCol extends PixelImageBuilderBasic {

    private pos: number = 0;
    private reverse: boolean = false;

    constructor(pdc: PixelDrawConfig, private artPixelHeight: number, origin: ColOrigin) {
        super(pdc, 0, artPixelHeight, RowOrigin.L, origin);
        if (origin == ColOrigin.B) {
            this.pos = this.artPixelHeight;
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

class PixelImageBuilderRow {
    private canvas = document.createElement('canvas');
    private context: CanvasRenderingContext2D;

    private pos: number = 0;
    private reverse: boolean = false;

    private pixelSize: number;

    constructor(private pdc: PixelDrawConfig, artPixelWidth: number) {
        this.pixelSize = pdc.pixelCanvasSize;

        this.canvas.width = pdc.snapSize(artPixelWidth * this.pixelSize);
        this.canvas.height = 1;

        this.context = this.canvas.getContext('2d')!;
    }

    [reverse]() {
        this.pos = this.canvas.width;
        this.reverse = true;
    }

    pushPixel(fillStyle: string) {
        this.context.fillStyle = fillStyle;

        if (this.reverse) {
            this.pos -= this.pixelSize;
            this.context.fillRect(this.pos, 0, this.pixelSize, 1);
        } else {
            this.context.fillRect(this.pos, 0, this.pixelSize, 1);
            this.pos += this.pixelSize;
        }
        return this;
    }

    pushPixels(fillStyles: string[]) {
        for (const fillStyle of fillStyles) {
            this.pushPixel(fillStyle);
        }
        return this;
    }

    build(): DisplayImage {
        return {
            cssWidth: this.pdc.canvasSizeToCssSize(this.canvas.width),
            cssHeight: this.pdc.canvasSizeToCssSize(this.canvas.height),
            url: this.canvas.toDataURL()
        };
    }
}

export enum GridOrigin {
    TL, TR, BL, BR
}

export class PixelImageBuilderFactory {
    constructor(private pdc: PixelDrawConfig) {}

    col(origin: ColOrigin, artPixelHeight: number) {
        return new PixelImageBuilderCol(this.pdc, artPixelHeight, origin);
    }

    row(origin: RowOrigin, artPixelWidth: number) {
        const ret = new PixelImageBuilderRow(this.pdc, artPixelWidth);
        if (origin === RowOrigin.R) {
            ret[reverse]();
        }
        return ret;          
    }
}
