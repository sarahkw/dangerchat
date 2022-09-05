import { Component, Directive, HostBinding, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Bevel, RectImage, SlantRectBevel } from '../bevel';
import { DisplayImage, PixelImageBuilderFactory } from '../pixel-image-builder';
import { PixelImageDrawer } from '../pixel-image-drawer';
import { PixelImageService } from '../pixel-image.service';
import { StyleInjector } from '../style-injector';

export type GenCssInput = {
  [RectImage.Left]: DisplayImage,
  [RectImage.Right]: DisplayImage,
  [RectImage.Top]: DisplayImage,
  [RectImage.Bottom]: DisplayImage,
  [RectImage.TL]: DisplayImage,
  [RectImage.TR]: DisplayImage,
  [RectImage.BL]: DisplayImage,
  [RectImage.BR]: DisplayImage,
};

const SELECTORS = [
  RectImage.Left,
  RectImage.Right,
  RectImage.Top,
  RectImage.Bottom,
  RectImage.TL,
  RectImage.TR,
  RectImage.BL,
  RectImage.BR,
];

export function genGenCssInput(fn: (ri: RectImage) => DisplayImage): GenCssInput {
  const ret: any = {};
  SELECTORS.forEach(s => ret[s] = fn(s) );
  return ret as GenCssInput;
}

const CLASSES = [
  ".w98w-bevel-8split-left",
  ".w98w-bevel-8split-right",
  ".w98w-bevel-8split-top",
  ".w98w-bevel-8split-bottom",
  ".w98w-bevel-8split-tl",
  ".w98w-bevel-8split-tr",
  ".w98w-bevel-8split-bl",
  ".w98w-bevel-8split-br",
];

const PROVIDE_CONTAINER_W = [
    true,
    true,
    false,
    false,
    true,
    true,
    true,
    true,
];

const PROVIDE_CONTAINER_H = [
    false,
    false,
    true,
    true,
    true,
    true,
    true,
    true,
];

let CSSID_COUNTER = 0;

type CacheEntry = {
  pid: PixelImageDrawer<GenCssInput>;
  cssclass: string
};

// use if the bevel you need to draw is static. meaning like not the case where
// you have a button, and the bevel needs to be different depending on whether
// the button is pressed.
@Directive({selector: '[w98w-bevel-8split-simple-host]'})
export class Bevel8SplitSimpleHostDirective implements OnInit, OnDestroy, OnChanges {
  @Input('w98w-bevel-8split-simple-host') bevel!: SlantRectBevel;
  @Input() simpleHostNoPositionRelative = false;

  @HostBinding('class') private hbClass: string | undefined;
  @HostBinding('style.position') private hbsPosition: string | undefined;

  private static cache: Map<Bevel, CacheEntry> = new Map();

  constructor(private imgService: PixelImageService) {
  }

  ngOnInit(): void {
    if (!this.simpleHostNoPositionRelative) {
      this.hbsPosition = 'relative';
    }

    const bevel = this.bevel;
    console.assert(!!bevel);
    let cacheEntry = Bevel8SplitSimpleHostDirective.cache.get(bevel);
    if (!cacheEntry) {
      const pendingCssClass = `w98w-bevel-8split-simple-host-${CSSID_COUNTER++}`;

      cacheEntry = {
        pid: new class implements PixelImageDrawer<GenCssInput> {
          private styleInjector = new StyleInjector();

          pidGenerateImages(pibf: PixelImageBuilderFactory): GenCssInput {
            return genGenCssInput(ri => bevel.genImage(ri, pibf));
          }

          pidApplyImages(imgs: GenCssInput): void {
            this.styleInjector.replaceStyle(Bevel8SplitComponent.genCss(`.${pendingCssClass}`, imgs));
          }

          pidDestroy(): void {
            this.styleInjector.destroy();
          }
        },
        cssclass: pendingCssClass
      }

      Bevel8SplitSimpleHostDirective.cache.set(bevel, cacheEntry);
    }

    this.hbClass = cacheEntry.cssclass;
    this.imgService.pidRegister(cacheEntry.pid);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const chbevel = changes['bevel'];
    chbevel && console.assert(!!chbevel.firstChange); // change not supported
  }

  ngOnDestroy(): void {
    const cacheEntry = Bevel8SplitSimpleHostDirective.cache.get(this.bevel);
    console.assert(!!cacheEntry);
    if (cacheEntry) {
      this.imgService.pidUnregister(cacheEntry.pid);
      // TODO we may leave dead items in the cache, but not a big deal rn because they don't take much resources
      //      is ok because StyleInjector, after being destroyed, can renew itself
    }
  }
}

@Component({
  selector: 'w98w-bevel-8split',
  templateUrl: './bevel-8split.component.html',
  styleUrls: ['./bevel-8split.component.scss']
})
export class Bevel8SplitComponent {

  readonly RECTIMAGE = RectImage;

  @Input() only: RectImage | null = null;

  static genCss(prefix: string, input: GenCssInput) {
    return SELECTORS.map((s, i) => {
      const w = PROVIDE_CONTAINER_W[i] ? `width: ${input[s].cssRequestedWidthCautious}px; ` : '';
      const h = PROVIDE_CONTAINER_H[i] ? `height: ${input[s].cssRequestedHeightCautious}px; ` : '';

      return `${prefix} > w98w-bevel-8split > ${CLASSES[i]} { background-image: url('${input[s].url}'); background-size: ${input[s].cssNextStepWidth}px ${input[s].cssNextStepHeight}px; ${w}${h} }`;
    }).join("\n");
  }

}
