import { Component, OnDestroy, OnInit } from '@angular/core';

import { Bevels, RectImage } from '../bevel';
import { PixelImageService } from '../pixel-image.service';
import { Colors } from '../colors';
import { StyleInjector } from '../style-injector';
import { PixelImageDrawer } from '../pixel-image-drawer';
import { DisplayImage, PixelImageBuilderFactory } from '../pixel-image-builder';

@Component({
  selector: 'w98w-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
  styles: [`
  button {
    background-color: ${Colors.WIDGET_BG};
    color: ${Colors.WIDGET_TEXT}; /* ipad safari */
  }
  `]
})
export class ButtonComponent implements OnInit, OnDestroy {

  constructor(private imgService: PixelImageService) { }

  static readonly PID = new class implements PixelImageDrawer {
    private styleInjector = new StyleInjector();

    pidGenerateImages(pibf: PixelImageBuilderFactory) {
      return new Map<RectImage, DisplayImage>([
        [RectImage.Left, Bevels.BUTTON.genImage2(RectImage.Left, pibf)],
        [RectImage.Right, Bevels.BUTTON.genImage2(RectImage.Right, pibf)],
        [RectImage.Top, Bevels.BUTTON.genImage2(RectImage.Top, pibf)],
        [RectImage.Bottom, Bevels.BUTTON.genImage2(RectImage.Bottom, pibf)],

        [RectImage.TL, Bevels.BUTTON.genImage2(RectImage.TL, pibf)],
        [RectImage.TR, Bevels.BUTTON.genImage2(RectImage.TR, pibf)],
        [RectImage.BL, Bevels.BUTTON.genImage2(RectImage.BL, pibf)],
        [RectImage.BR, Bevels.BUTTON.genImage2(RectImage.BR, pibf)],
      ]);
    }

    pidApplyImages(imgs: Map<RectImage, DisplayImage>): void {
      this.styleInjector.replaceStyle(`
      .w98w-button .w98w-bevel-8split-left { background-image: url('${imgs.get(RectImage.Left)!.url}'); background-size: ${imgs.get(RectImage.Left)!.cssWidth}px ${imgs.get(RectImage.Left)!.cssHeight}px; }
      .w98w-button .w98w-bevel-8split-right { background-image: url('${imgs.get(RectImage.Right)!.url}'); background-size: ${imgs.get(RectImage.Right)!.cssWidth}px ${imgs.get(RectImage.Right)!.cssHeight}px; }
      .w98w-button .w98w-bevel-8split-top { background-image: url('${imgs.get(RectImage.Top)!.url}'); background-size: ${imgs.get(RectImage.Top)!.cssWidth}px ${imgs.get(RectImage.Top)!.cssHeight}px; }
      .w98w-button .w98w-bevel-8split-bottom { background-image: url('${imgs.get(RectImage.Bottom)!.url}'); background-size: ${imgs.get(RectImage.Bottom)!.cssWidth}px ${imgs.get(RectImage.Bottom)!.cssHeight}px; }

      .w98w-button .w98w-bevel-8split-tl { background-image: url('${imgs.get(RectImage.TL)!.url}'); background-size: ${imgs.get(RectImage.TL)!.cssWidth}px ${imgs.get(RectImage.TL)!.cssHeight}px; }
      .w98w-button .w98w-bevel-8split-tr { background-image: url('${imgs.get(RectImage.TR)!.url}'); background-size: ${imgs.get(RectImage.TR)!.cssWidth}px ${imgs.get(RectImage.TR)!.cssHeight}px; }
      .w98w-button .w98w-bevel-8split-bl { background-image: url('${imgs.get(RectImage.BL)!.url}'); background-size: ${imgs.get(RectImage.BL)!.cssWidth}px ${imgs.get(RectImage.BL)!.cssHeight}px; }
      .w98w-button .w98w-bevel-8split-br { background-image: url('${imgs.get(RectImage.BR)!.url}'); background-size: ${imgs.get(RectImage.BR)!.cssWidth}px ${imgs.get(RectImage.BR)!.cssHeight}px; }
      `);
    }

    pidDestroy(): void {
      this.styleInjector.destroy();
    }
  };  // PID

  ngOnInit(): void {
    this.imgService.pidRegister(ButtonComponent.PID);
  }

  ngOnDestroy(): void {
    this.imgService.pidUnregister(ButtonComponent.PID);
  }

}
