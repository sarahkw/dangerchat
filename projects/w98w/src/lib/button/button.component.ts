import { Component, OnDestroy, OnInit } from '@angular/core';

import { Bevels } from '../bevel';
import { PixelImageService } from '../pixel-image.service';
import { Colors } from '../colors';
import { StyleInjector } from '../style-injector';
import { PixelImageDrawer } from '../pixel-image-drawer';
import { PixelImageBuilderFactory } from '../pixel-image-builder';
import { Bevel8SplitComponent, GenCssInput, genGenCssInput } from '../bevel-8split/bevel-8split.component';

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

  static readonly PID_NORMAL = new class implements PixelImageDrawer {
    private styleInjector = new StyleInjector();

    pidGenerateImages(pibf: PixelImageBuilderFactory): GenCssInput {
      return genGenCssInput(ri => Bevels.BUTTON.genImage(ri, pibf));
    }

    pidApplyImages(imgs: GenCssInput): void {
      this.styleInjector.replaceStyle(Bevel8SplitComponent.genCss(".w98w-button", imgs));
    }

    pidDestroy(): void {
      this.styleInjector.destroy();
    }
  };  // PID

  ngOnInit(): void {
    this.imgService.pidRegister(ButtonComponent.PID_NORMAL);
  }

  ngOnDestroy(): void {
    this.imgService.pidUnregister(ButtonComponent.PID_NORMAL);
  }

}
