import { Component, ContentChildren, HostBinding, Input, OnDestroy, OnInit, QueryList } from '@angular/core';
import { Bevels } from '../bevel';
import { Bevel8SplitComponent, GenCssInput, genGenCssInput } from '../bevel-8split/bevel-8split.component';
import { Colors } from '../colors';
import { MenuItemComponent } from '../menu-item/menu-item.component';
import { PixelImageBuilderFactory } from '../pixel-image-builder';
import { PixelImageDrawer } from '../pixel-image-drawer';
import { PixelImageService } from '../pixel-image.service';
import { StyleInjector } from '../style-injector';
import { W98wStyles } from '../w98w-styles';
import { MenuContext } from './menu-context';

@Component({
  selector: 'menu[w98w-menu]',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, OnDestroy {

  @Input() menuContext: MenuContext | undefined;

  @HostBinding('class') get hbClass() {
    let classes = ['w98w-menu'];
    if (this.menuContext?.menuHostChildStyles()) {
      classes.push('menu-host-child');
    }
    return classes.join(' ');
  }

  @HostBinding('style.--menu-text-size') hbTS = `${W98wStyles.menuFontSize}px`;
  @HostBinding('style.--menu-text-font') hbTF = W98wStyles.defaultFont;
  @HostBinding('style.--menu-text-color') hbMTC = Colors.MENU_TEXT;
  @HostBinding('style.--menu-bg-color') hbMBC = Colors.MENU_BG;

  // These are the new ones for the grid "cartridge"
  @HostBinding('style.--menu-border-padding') hbMBP = `${Bevels.MENU.getPadding()}px`;
  @HostBinding('style.--menu-n') get hbMN() {
    return this.childItems.length;
  }

  openedChild?: MenuItemComponent;

  @ContentChildren(MenuItemComponent) childItems!: QueryList<MenuItemComponent>;

  constructor(private imgService: PixelImageService) { }

  ngOnInit(): void {
    this.imgService.pidRegister(MenuComponent.PID);
  }

  ngOnDestroy(): void {
    this.imgService.pidUnregister(MenuComponent.PID);
  }

  // TODO maybe cache this so that it's not linear searching each time
  getChildGridIndex(instance: MenuItemComponent) {
    for (let i = 0; i < this.childItems.length; ++i) {
      if (this.childItems.get(i) === instance) {
        return i + 1;
      }
    }

    console.error('getChildGridIndex cannot find instance');
    return 0;
  }

  static readonly PID = new class implements PixelImageDrawer {
    private styleInjector = new StyleInjector();

    pidGenerateImages(pibf: PixelImageBuilderFactory): GenCssInput {
      return genGenCssInput(ri => Bevels.MENU.genImage(ri, pibf));
    }

    pidApplyImages(imgs: GenCssInput): void {
      this.styleInjector.replaceStyle(Bevel8SplitComponent.genCss(".w98w-menu", imgs));
    }

    pidDestroy(): void {
      this.styleInjector.destroy();
    }
  };  // PID
}
