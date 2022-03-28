import { Component, Directive, ElementRef, Input, OnChanges, OnDestroy, OnInit, Renderer2, RendererStyleFlags2, SimpleChanges } from '@angular/core';
import { GenImgDescriptor } from '../genimg';
import { DisplayImage, PixelImageBuilderFactory } from '../pixel-image-builder';
import { PixelImageDrawer } from '../pixel-image-drawer';
import { PixelImageService } from '../pixel-image.service';

export type PixelImageCssVarConfig = {
  genImg: GenImgDescriptor,
  varPrefix: string,
  cssWidth: number,
  cssHeight: number
}[];

@Directive({selector: '[w98w-pixel-image-css-var]'})
export class PixelImageCssVarDirective implements OnInit, OnDestroy {
  @Input('w98w-pixel-image-css-var') config!: PixelImageCssVarConfig;

  private pids: PixelImageDrawer[] = [];

  constructor(private pixelImageService: PixelImageService,
    private eref: ElementRef,
    private renderer: Renderer2) {}

  ngOnInit(): void {
    for (let x of this.config) {
      const thiz = this;

      const pid = new class implements PixelImageDrawer {

        pidGenerateImages(pibf: PixelImageBuilderFactory) {
          return x.genImg.draw(x.cssWidth, x.cssHeight, pibf);
        }
        pidApplyImages(imgs: any): void {
          thiz.renderer.setStyle(thiz.eref.nativeElement, `--pi-${x.varPrefix}-width`, `${imgs.cssRequestedWidth}px`, RendererStyleFlags2.DashCase);
          thiz.renderer.setStyle(thiz.eref.nativeElement, `--pi-${x.varPrefix}-height`, `${imgs.cssRequestedHeight}px`, RendererStyleFlags2.DashCase);
          thiz.renderer.setStyle(thiz.eref.nativeElement, `--pi-${x.varPrefix}-background-image`, `url('${imgs.url}')`, RendererStyleFlags2.DashCase);
          thiz.renderer.setStyle(thiz.eref.nativeElement, `--pi-${x.varPrefix}-background-size`, `${imgs.cssNextStepWidth}px ${imgs.cssNextStepHeight}px`, RendererStyleFlags2.DashCase);

          const helper = false;
          if (helper) {
            console.info([
              `/* auto-generated by PixelImageCssVarDirective */`,
              `width: var(--pi-${x.varPrefix}-width);`,
              `height: var(--pi-${x.varPrefix}-height);`,
              `background-image: var(--pi-${x.varPrefix}-background-image);`,
              `background-size: var(--pi-${x.varPrefix}-background-size);`,
              `background-repeat: no-repeat;`
            ].join(" "));
          }
        }
        pidDestroy(): void {
          // no-op: not ref counting and applying some global style
        }

      };

      this.pids.push(pid);

      this.pixelImageService.pidRegister(pid);
    }
  }

  ngOnDestroy(): void {
    for (let x of this.config) {
      this.renderer.removeStyle(this.eref.nativeElement, `--pi-${x.varPrefix}-width`, RendererStyleFlags2.DashCase);
      this.renderer.removeStyle(this.eref.nativeElement, `--pi-${x.varPrefix}-height`, RendererStyleFlags2.DashCase);
      this.renderer.removeStyle(this.eref.nativeElement, `--pi-${x.varPrefix}-background-image`, RendererStyleFlags2.DashCase);
      this.renderer.removeStyle(this.eref.nativeElement, `--pi-${x.varPrefix}-background-size`, RendererStyleFlags2.DashCase);
    }

    for (let pid of this.pids) {
      this.pixelImageService.pidUnregister(pid);
    }
  }
}

@Component({
  selector: 'w98w-pixel-image',
  templateUrl: './pixel-image.component.html',
  styleUrls: ['./pixel-image.component.css']
})
export class PixelImageComponent implements OnInit, OnDestroy, OnChanges, PixelImageDrawer {

  @Input() genImg!: GenImgDescriptor;
  @Input() cssWidth!: number;
  @Input() cssHeight!: number;

  @Input() debugDrawnSize: [number, number] | undefined;
  debugRequestedSize: number[] | undefined;

  style: { [klass: string]: any } = {};

  constructor(private pixelImageService: PixelImageService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['genImg'].isFirstChange()) {
      this.pixelImageService.pidUnregister(this);
      this.pixelImageService.pidRegister(this);
    }
  }

  // TODO: Cache these images

  pidGenerateImages(pibf: PixelImageBuilderFactory): DisplayImage {
    return this.genImg.draw(this.cssWidth, this.cssHeight, pibf);
  }

  pidApplyImages(imgs: DisplayImage): void {
    this.style = {
      "width.px": imgs.cssRequestedWidth,
      "height.px": imgs.cssRequestedHeight,
      "background-image": `url('${imgs.url}')`,
      "background-size": `${imgs.cssNextStepWidth}px ${imgs.cssNextStepHeight}px`,
      "background-repeat": "no-repeat"
    };

    if (this.debugDrawnSize !== undefined) {
      this.debugRequestedSize = [
        imgs.cssRequestedWidth, imgs.cssRequestedHeight,
        imgs.cssRequestedWidthCautious, imgs.cssRequestedHeightCautious
      ];

      let [w, h] = this.debugDrawnSize;
      this.style["width.px"] = w;
      this.style["height.px"] = h;
    }
  }

  pidDestroy(): void {
    // no-op: we're not reusing this PID
  }

  ngOnInit(): void {

    /*
    if (this.genImg.desiredCssWidth !== undefined) {
      this.style["width.px"] = this.genImg.desiredCssWidth;
    }

    if (this.genImg.desiredCssHeight !== undefined) {
      this.style["height.px"] = this.genImg.desiredCssHeight;
    }
    */

    this.pixelImageService.pidRegister(this);
  }

  ngOnDestroy(): void {
    this.pixelImageService.pidUnregister(this);
  }
}
