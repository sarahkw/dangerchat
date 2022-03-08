import { PixelDrawConfig } from "./pixel-image.service";

const reverse = Symbol('reverse');

export type DisplayImage = {
    cssWidth: number,
    cssHeight: number,
    url: string
};

class PixelImageBuilderCol {
    private canvas = document.createElement('canvas');
    private context: CanvasRenderingContext2D;

    private pos: number = 0;
    private reverse: boolean = false;

    private pixelSize: number;

    constructor(private pdc: PixelDrawConfig, artPixelHeight: number) {
        this.pixelSize = pdc.pixelCanvasSize;

        this.canvas.width = 1;
        this.canvas.height = pdc.snapSize(artPixelHeight * this.pixelSize);

        this.context = this.canvas.getContext('2d')!;
    }

    [reverse]() {
        this.pos = this.canvas.height;
        this.reverse = true;
    }

    pushPixel(fillStyle: string) {
        this.context.fillStyle = fillStyle;

        if (this.reverse) {
            this.pos -= this.pixelSize;
            this.context.fillRect(0, this.pos, 1, this.pixelSize);
        } else {
            this.context.fillRect(0, this.pos, 1, this.pixelSize);
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

export enum RowOrigin {
    L, R
}

export enum ColOrigin {
    T, B
}

export enum GridOrigin {
    TL, TR, BL, BR
}

export class PixelImageBuilderFactory {
    constructor(private pdc: PixelDrawConfig) {}

    col(origin: ColOrigin, artPixelHeight: number) {
        const ret = new PixelImageBuilderCol(this.pdc, artPixelHeight);
        if (origin === ColOrigin.B) {
            ret[reverse]();
        }
        return ret;        
    }

    row(origin: RowOrigin, artPixelWidth: number) {
        const ret = new PixelImageBuilderRow(this.pdc, artPixelWidth);
        if (origin === RowOrigin.R) {
            ret[reverse]();
        }
        return ret;          
    }
}
