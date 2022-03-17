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
const TBarColors = {
    default: 'black',
    disabled: '#808080',
    disabled_shadow: 'white'
};

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

    private static readonly _tbar_min_draw =
        function (drawCssWidth: number, drawCssHeight: number, pibf: PixelImageBuilderFactory, disabled: boolean = false): DisplayImage {
            let { artPixelWidth, artPixelHeight } = pibf.howManyArtPixelsCanIDraw(drawCssWidth, drawCssHeight);

            const builder = pibf.basic(artPixelWidth, artPixelHeight);

            const P_L = 3;
            const P_R = 6;
            const P_B = 1;

            const L_H = 2; // line

            function ln(color: string, offset: number) {
                const x1 = P_L;
                const y1 = artPixelHeight - P_B - L_H;
                const x2 = artPixelWidth - P_R;
                const y2 = artPixelHeight - P_B - L_H + L_H;
                builder.drawRectXY(color, x1 + offset, y1 + offset, x2 + offset, y2 + offset);
            }

            if (disabled) {
                ln(TBarColors.disabled_shadow, 1);
            }

            ln(disabled ? TBarColors.disabled : TBarColors.default, 0);

            debug_overdraw(artPixelWidth, artPixelHeight, builder);
            return builder.build();
        }

    static readonly TBAR_MIN: GenImgDescriptor = {
        draw: GenImg._tbar_min_draw
    };

    static readonly TBAR_MIN_DISABLED: GenImgDescriptor = {
        draw: function (drawCssWidth: number, drawCssHeight: number, pibf: PixelImageBuilderFactory): DisplayImage {
            return GenImg._tbar_min_draw(drawCssWidth, drawCssHeight, pibf, true);
        }
    };

    static readonly TBAR_MAX: GenImgDescriptor = {
        draw: function (drawCssWidth: number, drawCssHeight: number, pibf: PixelImageBuilderFactory): DisplayImage {
            let { artPixelWidth, artPixelHeight } = pibf.howManyArtPixelsCanIDraw(drawCssWidth, drawCssHeight);

            const builder = pibf.basic(artPixelWidth, artPixelHeight);

            const P_L = 1;
            const P_B = 1;
            const P_R = 2;

            const FRAME_T = 2; // should be "2" but i tink 3 looks better
            const FRAME_O = 1; // other

            // top
            {
                const x1 = P_L;
                const y1 = 0;
                const x2 = artPixelWidth - P_R;
                const y2 = y1 + FRAME_T;
                builder.drawRectXY('black', x1, y1, x2, y2);
            }
            // bottom
            {
                const x1 = P_L;
                const y1 = artPixelHeight - P_B - FRAME_O;
                const x2 = artPixelWidth - P_R;
                const y2 = y1 + FRAME_O;
                builder.drawRectXY('black', x1, y1, x2, y2);
            }
            // left
            {
                const x1 = P_L;
                const y1 = 0;
                const x2 = x1 + FRAME_O;
                const y2 = artPixelHeight - P_B;
                builder.drawRectXY('black', x1, y1, x2, y2);
            }
            // right
            {
                const x1 = artPixelWidth - P_R - FRAME_O;
                const y1 = 0;
                const x2 = x1 + FRAME_O;
                const y2 = artPixelHeight - P_B;
                builder.drawRectXY('black', x1, y1, x2, y2);
            }

            debug_overdraw(artPixelWidth, artPixelHeight, builder);
            return builder.build();
        }
    };

    static readonly TBAR_X: GenImgDescriptor = {
        draw(drawCssWidth, drawCssHeight, pibf): DisplayImage {
            let { artPixelWidth, artPixelHeight } = pibf.howManyArtPixelsCanIDraw(drawCssWidth, drawCssHeight);

            const builder = pibf.basic(artPixelWidth, artPixelHeight);

            // padding
            const P_L = 2;
            const P_R = 2;
            const P_T = 1;
            const P_B = 1;

            const X_W = 2;
            const X_H = 1;
            const X_HRUN = 1;

            let rows;
            let cols;
            {
                let x_w = artPixelWidth - P_L - P_R;
                let x_h = x_w - X_HRUN;
                if (x_h > (artPixelHeight - P_T - P_B)) {
                    x_h = artPixelHeight - P_T - P_B;
                    x_w = x_h + 1;
                }

                rows = x_h;
                cols = x_w;
            }

            for (let r = 0; r < rows; ++r) {
                builder.drawRect('black', P_L + r, P_T + r, X_W, X_H);

                // i dunno, i tinkered with this until it worked
                builder.drawRect('black', P_L + (cols - r - X_W), P_T + r, X_W, X_H);
            }

            debug_overdraw(artPixelWidth, artPixelHeight, builder);
            return builder.build();
        }
    }

}
