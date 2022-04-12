import { Component, Directive, HostBinding, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Bevels } from '../bevel';
import { GenCssInput, genGenCssInput, Bevel8SplitComponent } from '../bevel-8split/bevel-8split.component';
import { MenuTemplateDirective } from '../menu/menu-template.directive';
import { PixelImageBuilderFactory } from '../pixel-image-builder';
import { PixelImageDrawer } from '../pixel-image-drawer';
import { PixelImageService } from '../pixel-image.service';
import { StyleInjector } from '../style-injector';

@Directive({ selector: '[w98w-window-title-bar]'})
export class WindowTitleBarDirective {
  @HostBinding('class') readonly hbClass = 'w98w-window-title-bar';

  @HostBinding('style') readonly hbs = {
    gridArea: 'titlebar',
    minWidth: 0
  };
}

@Directive({ selector: '[w98w-window-menu-bar]'})
export class WindowMenuBarDirective {
  @HostBinding('class') readonly hbClass = 'w98w-window-menu-bar';

  @HostBinding('style') readonly hbs = {
    gridArea: 'menubar',
    minWidth: 0
  };
}

enum MoveResizeMode {
  None = 0,
  Move,
  Resize
}

@Component({
  selector: 'w98w-window',
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.scss']
})
export class WindowComponent implements OnInit, OnDestroy {

  @Input() drawFrame = true;  // if maximized this will be false
  @Input() innerGridStyle: unknown = undefined; // TODO slated for removal

  @HostBinding('style.--window-padding.px') get hbsPadding() {
    // 2 extra pixels spacing, as seen in screenshot
    return this.drawFrame ? (Bevels.WINDOW.getPadding() + 2) : 0;
  }

  @ViewChild('menuWindow') menuWindow!: MenuTemplateDirective;

  readonly enumMoveResizeMode = MoveResizeMode;
  moveResizeMode = MoveResizeMode.None;

  constructor(private imgService: PixelImageService) { }

  ngOnInit(): void {
    this.imgService.pidRegister(WindowComponent.PID_FRAME);
  }

  ngOnDestroy(): void {
    this.imgService.pidUnregister(WindowComponent.PID_FRAME);
  }

  doneText() {
    switch (this.moveResizeMode) {
      case MoveResizeMode.Move: return "Done moving";
      case MoveResizeMode.Resize: return "Done resizing";
      default: {
        console.assert(false);
        return "";
      }
    }
  }

  static readonly PID_FRAME = new class implements PixelImageDrawer<GenCssInput> {
    private styleInjector = new StyleInjector();

    pidGenerateImages(pibf: PixelImageBuilderFactory): GenCssInput {
      return genGenCssInput(ri => Bevels.WINDOW.genImage(ri, pibf));
    }

    pidApplyImages(imgs: GenCssInput): void {
      this.styleInjector.replaceStyle(Bevel8SplitComponent.genCss(".w98w-window-inner-grid", imgs));
    }

    pidDestroy(): void {
      this.styleInjector.destroy();
    }
  };  // PID_FRAME


}
