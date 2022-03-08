import { Component, OnDestroy, OnInit } from '@angular/core';

import { Bevels, RectImage } from '../bevel';
import { PixelImageService } from '../pixel-image.service';
import { Colors } from '../colors';
import { StyleInjector } from '../style-injector';
import { PixelImageDrawer } from '../pixel-image-drawer';
import { PixelImageBuilderFactory } from '../pixel-image-builder';
import { Bevel8SplitComponent, GenCssInput } from '../bevel-8split/bevel-8split.component';

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

    pidGenerateImages(pibf: PixelImageBuilderFactory): GenCssInput {
      return {
        [RectImage.Left]: Bevels.BUTTON.genImage(RectImage.Left, pibf),
        [RectImage.Right]: Bevels.BUTTON.genImage(RectImage.Right, pibf),
        [RectImage.Top]: Bevels.BUTTON.genImage(RectImage.Top, pibf),
        [RectImage.Bottom]: Bevels.BUTTON.genImage(RectImage.Bottom, pibf),
        [RectImage.TL]: Bevels.BUTTON.genImage(RectImage.TL, pibf),
        [RectImage.TR]: Bevels.BUTTON.genImage(RectImage.TR, pibf),
        [RectImage.BL]: Bevels.BUTTON.genImage(RectImage.BL, pibf),
        [RectImage.BR]: Bevels.BUTTON.genImage(RectImage.BR, pibf),
      };
    }

    pidApplyImages(imgs: GenCssInput): void {
      this.styleInjector.replaceStyle(Bevel8SplitComponent.genCss(".w98w-button", imgs));
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
