import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { GenImgDescriptor } from '../genimg';
import { DisplayImage, PixelImageBuilderFactory } from '../pixel-image-builder';
import { PixelImageDrawer } from '../pixel-image-drawer';
import { PixelImageService } from '../pixel-image.service';

@Component({
  selector: 'w98w-pixel-image',
  templateUrl: './pixel-image.component.html',
  styleUrls: ['./pixel-image.component.css']
})
export class PixelImageComponent implements OnInit, OnDestroy, PixelImageDrawer {

  @Input() genImg!: GenImgDescriptor;
  @Input() cssWidth!: number;
  @Input() cssHeight!: number;

  @Input() debugDrawnSize: [number, number] | undefined;
  debugRequestedSize: number[] | undefined;

  style: { [klass: string]: any } = {};

  constructor(private pixelImageService: PixelImageService) {}

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
