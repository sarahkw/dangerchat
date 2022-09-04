import { Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { Bevels } from '../bevel';
import { GenCssInput, genGenCssInput, Bevel8SplitComponent } from '../bevel-8split/bevel-8split.component';
import { PixelImageBuilderFactory } from '../pixel-image-builder';
import { PixelImageDrawer } from '../pixel-image-drawer';
import { PixelImageService } from '../pixel-image.service';
import { StyleInjector } from '../style-injector';

@Component({
  selector: 'w98w-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss']
})
export class TextareaComponent implements OnInit, OnDestroy {

  @HostBinding('style.--w98w-padding') get hbsp() {
    return `${Bevels.INPUTBOX.getPadding()}px`;
  }

  @Input() textareaStyle?: string;

  constructor(private imgService: PixelImageService) {}

  ngOnInit(): void {
    this.imgService.pidRegister(TextareaComponent.PID_NORMAL);
  }

  ngOnDestroy(): void {
    this.imgService.pidUnregister(TextareaComponent.PID_NORMAL);
  }

  static readonly PID_NORMAL = new class implements PixelImageDrawer<GenCssInput> {
    private styleInjector = new StyleInjector();

    pidGenerateImages(pibf: PixelImageBuilderFactory): GenCssInput {
      return genGenCssInput(ri => Bevels.INPUTBOX.genImage(ri, pibf));
    }

    pidApplyImages(imgs: GenCssInput): void {
      this.styleInjector.replaceStyle(Bevel8SplitComponent.genCss("w98w-textarea", imgs));
    }

    pidDestroy(): void {
      this.styleInjector.destroy();
    }
  };  // PID_NORMAL

}
