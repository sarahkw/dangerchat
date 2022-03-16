import { DisplayImage, PixelImageBuilderBasic, PixelImageBuilderFactory, VOrigin } from "./pixel-image-builder";

export type GenImgDescriptor = {

    /*
    // the descriptor hints what size they should be in CSS pixels. can be undefined if
    // the image will just draw for any provided size.
    desiredCssWidth?: number,
    desiredCssHeight?: number,
    */

    // the width and height will be the desired ones if those are available. otherwise,
    // it'll be what's requested.
    draw: (drawCssWidth: number, drawCssHeight: number, pibf: PixelImageBuilderFactory) => DisplayImage;
};

function incXincY(until: number, fn: (x: number, y: number) => void) {
    for (let i = 0; i < until; ++i) {
        fn(i, i);
    }
}

function decXincY(until: number, fn: (x: number, y: number) => void) {
    for (let i = 0; i < until; ++i) {
        fn(until - i - 1, i);
    }
}

/*
function debug_overdraw(drawCssWidth: number, drawCssHeight: number, builder: PixelImageBuilderBasic) {
    builder.drawRect('red', drawCssWidth, 0, 1, drawCssHeight); // overdraw right
    builder.drawRect('red', 0, drawCssHeight, drawCssWidth, 1); // overdraw bottom
}
*/

function debug_overdraw(..._: any[]) {}

export abstract class GenImg {

    static readonly DEBUG_X: GenImgDescriptor = {
        draw(drawCssWidth, drawCssHeight, pibf): DisplayImage {
            console.assert(drawCssWidth == drawCssHeight);
            let cssSize = Math.min(drawCssWidth, drawCssHeight);

            let builder = pibf.basic(cssSize, cssSize);

            const SQUARE_SZ = 1;
            incXincY(cssSize, (x, y) => {
                builder.drawRect('black', x, y, SQUARE_SZ, SQUARE_SZ);
            });
            decXincY(cssSize, (x, y) => {
                builder.drawRect('black', x, y, SQUARE_SZ, SQUARE_SZ);
            });

            return builder.build();
        }
    }

    static readonly DEBUG_BORDER: GenImgDescriptor = {
        draw: function (drawCssWidth: number, drawCssHeight: number, pibf: PixelImageBuilderFactory): DisplayImage {
            let { artPixelWidth, artPixelHeight } = pibf.howManyArtPixelsCanIDraw(drawCssWidth, drawCssHeight);

            const builder = pibf.basic(artPixelWidth, artPixelHeight);

            builder.drawRect('black', 0, 0, 1, artPixelHeight); // left
            builder.drawRect('black', 0, 0, artPixelWidth, 1); // top
            builder.drawRect('black', artPixelWidth - 1, 0, 1, artPixelHeight); // right
            builder.drawRect('black', 0, artPixelHeight - 1, artPixelWidth, 1); // bottom

            debug_overdraw(artPixelWidth, artPixelHeight, builder);
            return builder.build();
        }
    };

    static readonly TBAR_X: GenImgDescriptor = {
        draw(drawCssWidth, drawCssHeight, pibf): DisplayImage {
            console.assert(drawCssWidth == drawCssHeight);
            let cssSize = Math.min(drawCssWidth, drawCssHeight);

            let builder = pibf.basic(cssSize, cssSize);

            const SQUARE_SZ = 2;
            const SQUARE_PAD = 1;
            incXincY(cssSize - SQUARE_PAD, (x, y) => {
                builder.drawRect('black', x, y, SQUARE_SZ, SQUARE_SZ);
            });
            decXincY(cssSize - SQUARE_PAD, (x, y) => {
                builder.drawRect('black', x, y, SQUARE_SZ, SQUARE_SZ);
            });

            debug_overdraw(drawCssWidth, drawCssHeight, builder);
            return builder.build();
        }
    }

}
