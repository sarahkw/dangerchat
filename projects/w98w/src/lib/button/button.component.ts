import { Component, OnDestroy, OnInit } from '@angular/core';

import { Bevels, RectImage } from '../bevel';
import { PixelImageService } from '../pixel-image.service';
import { Colors } from '../colors';
import { StyleInjector } from '../style-injector';
import { PixelImageDrawer } from '../pixel-image-drawer';

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

    pidGenerateImages(svc: PixelImageService, dpi: number) {
      return new Map([
        [RectImage.Left, Bevels.BUTTON.genImage(RectImage.Left, svc)],
        [RectImage.Right, Bevels.BUTTON.genImage(RectImage.Right, svc)],
        [RectImage.Top, Bevels.BUTTON.genImage(RectImage.Top, svc)],
        [RectImage.Bottom, Bevels.BUTTON.genImage(RectImage.Bottom, svc)],

        [RectImage.TL, Bevels.BUTTON.genImage(RectImage.TL, svc)],
        [RectImage.TR, Bevels.BUTTON.genImage(RectImage.TR, svc)],
        [RectImage.BL, Bevels.BUTTON.genImage(RectImage.BL, svc)],
        [RectImage.BR, Bevels.BUTTON.genImage(RectImage.BR, svc)],
      ]);
    }

    pidApplyImages(imgs: any): void {
      this.styleInjector.replaceStyle(`
      .w98w-button .w98w-bevel-8split-left { background-image: url('${imgs.get(RectImage.Left)}'); }
      .w98w-button .w98w-bevel-8split-right { background-image: url('${imgs.get(RectImage.Right)}'); }
      .w98w-button .w98w-bevel-8split-top { background-image: url('${imgs.get(RectImage.Top)}'); }
      .w98w-button .w98w-bevel-8split-bottom { background-image: url('${imgs.get(RectImage.Bottom)}'); }

      .w98w-button .w98w-bevel-8split-tl { background-image: url('${imgs.get(RectImage.TL)}'); }
      .w98w-button .w98w-bevel-8split-tr { background-image: url('${imgs.get(RectImage.TR)}'); }
      .w98w-button .w98w-bevel-8split-bl { background-image: url('${imgs.get(RectImage.BL)}'); }
      .w98w-button .w98w-bevel-8split-br { background-image: url('${imgs.get(RectImage.BR)}'); }
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
