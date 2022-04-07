import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Bevels } from '../bevel';
import { GenCssInput, genGenCssInput, Bevel8SplitComponent } from '../bevel-8split/bevel-8split.component';
import { MenuAnchorDirective } from '../menu/menu-anchor.directive';
import { PixelImageBuilderFactory } from '../pixel-image-builder';
import { PixelImageDrawer } from '../pixel-image-drawer';
import { PixelImageService } from '../pixel-image.service';
import { StyleInjector } from '../style-injector';

@Component({
  selector: 'li[w98w-menu-bar-item]',
  templateUrl: './menu-bar-item.component.html',
  styleUrls: ['./menu-bar-item.component.scss']
})
export class MenuBarItemComponent implements OnInit, OnDestroy {

  @ViewChild(MenuAnchorDirective) anchor!: MenuAnchorDirective;

  constructor(private imgService: PixelImageService) { }

  ngOnInit(): void {
    this.imgService.pidRegister(MenuBarItemComponent.PID_HOVER);
  }

  ngOnDestroy(): void {
    this.imgService.pidUnregister(MenuBarItemComponent.PID_HOVER);
  }

  //#region PIDs

  static readonly PID_HOVER = new class implements PixelImageDrawer {
    private styleInjector = new StyleInjector();

    pidGenerateImages(pibf: PixelImageBuilderFactory): GenCssInput {
      return genGenCssInput(ri => Bevels.MENUBAR_ITEM_HOVER.genImage(ri, pibf));
    }

    pidApplyImages(imgs: GenCssInput): void {
      this.styleInjector.replaceStyle(Bevel8SplitComponent.genCss(".w98w-menu-bar-item:hover", imgs));
    }

    pidDestroy(): void {
      this.styleInjector.destroy();
    }
  };  // PID_NORMAL

    //#endregion

}
