import { Component, Input, OnDestroy, OnInit } from '@angular/core';

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

  button .button-contents {
    position: relative;
  }

  button:active .button-contents {
    top: 1px;
    left: 1px;
  }
  `]
})
export class ButtonComponent implements OnInit, OnDestroy {

  @Input() width?: number;
  @Input() height?: number;

  style: { [klass: string]: any } = {};

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
  };  // PID_NORMAL

  static readonly PID_PRESSED = new class implements PixelImageDrawer {
    private styleInjector = new StyleInjector();

    pidGenerateImages(pibf: PixelImageBuilderFactory): GenCssInput {
      return genGenCssInput(ri => Bevels.BUTTON_PRESSED.genImage(ri, pibf));
    }

    pidApplyImages(imgs: GenCssInput): void {
      this.styleInjector.replaceStyle(Bevel8SplitComponent.genCss(".w98w-button:active", imgs));
    }

    pidDestroy(): void {
      this.styleInjector.destroy();
    }
  };  // PID_PRESSED

  constructor(private imgService: PixelImageService) {}

  ngOnInit(): void {
    this.imgService.pidRegister(ButtonComponent.PID_NORMAL);
    this.imgService.pidRegister(ButtonComponent.PID_PRESSED);

    if (this.width !== undefined) {
      this.style["width.px"] = this.width;
    }

    if (this.height !== undefined) {
      this.style["height.px"] = this.height;
    }
  }

  ngOnDestroy(): void {
    this.imgService.pidUnregister(ButtonComponent.PID_PRESSED);
    this.imgService.pidUnregister(ButtonComponent.PID_NORMAL);
  }

}
