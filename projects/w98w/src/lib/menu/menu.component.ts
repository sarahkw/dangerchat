import { Component, ContentChildren, HostBinding, Input, OnDestroy, OnInit, QueryList } from '@angular/core';
import { Bevels } from '../bevel';
import { Bevel8SplitComponent, GenCssInput, genGenCssInput } from '../bevel-8split/bevel-8split.component';
import { Colors } from '../colors';
import { MenuItemComponent } from '../menu-item/menu-item.component';
import { PixelImageBuilderFactory } from '../pixel-image-builder';
import { PixelImageDrawer } from '../pixel-image-drawer';
import { PixelImageService } from '../pixel-image.service';
import { SlidingScreenMainContentDirective } from '../ss/sliding-screen-main-content.directive';
import { StyleInjector } from '../style-injector';
import { W98wStyles } from '../w98w-styles';
import { MenuContext } from './menu-context';
import { MenuTemplateDirective } from './menu-template.directive';
import { MenuService, OnSubMenuClose } from './menu.service';

@Component({
  selector: 'menu[w98w-menu]',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, OnDestroy {

  @HostBinding('style.--menu-parent-grid-index') get hbMPGI() {
    return this.inlineSubMenuChildIndex;
  }

  @Input() menuContext: MenuContext | undefined;

  @HostBinding('class') get hbClass() {
    let classes = ['w98w-menu'];
    if (this.menuContext?.menuHostChildStyles()) {
      classes.push('menu-host-child');
    }

    if (this.menuContext?.anchor()) {
      classes.push('menu-ip');
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

  @HostBinding('style.--menu-ip-offset-h') get hbMIOH() {
    const anchor = this.menuContext?.anchor();
    if (anchor) {
      return `${anchor.getBoundingClientRect().x - this.screen.element.nativeElement.getBoundingClientRect().x}px`;
    }
    return undefined;
  }
  @HostBinding('style.--menu-ip-offset-v') get hbMIOV() {
    const anchor = this.menuContext?.anchor();
    if (anchor) {
      return `${anchor.getBoundingClientRect().bottom - this.screen.element.nativeElement.getBoundingClientRect().y}px`;
    }
    return undefined;
  }

  openedChild?: MenuItemComponent;

  @ContentChildren(MenuItemComponent) childItems!: QueryList<MenuItemComponent>;

  constructor(private imgService: PixelImageService, private screen: SlidingScreenMainContentDirective) { }

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

  //#region Inline Sub Menu

  inlineSubMenu: MenuTemplateDirective | undefined;
  inlineSubMenuChildIndex: number | undefined;
  inlineSubMenuContext: MenuContext | undefined;

  inlineSubMenuOpen(instance: MenuItemComponent, template: MenuTemplateDirective) {
    const idx = this.getChildGridIndex(instance);
    this.inlineSubMenu = template;
    this.inlineSubMenuChildIndex = idx;
    this.inlineSubMenuContext = new class implements MenuContext {
      menuHostChildStyles(): boolean {
        return false;
      }
      inlineSubMenuParentGridItemIndex(): number | undefined {
        return idx;   // TODO remove me
      }
      anchor(): HTMLElement | undefined {
        // submenus have no anchors, it's for the initial menu only
        return undefined;
      }
      appendMenu(template: MenuTemplateDirective, onSubMenuClose?: OnSubMenuClose): void {
        // TODO
      }
      closeChildren(): void {
        // TODO
      }
      endMenu(): void {
        // TODO
      }
    };
  }

  inlineSubMenuClose() {
    this.inlineSubMenu = undefined;
  }

  //#endregion

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
