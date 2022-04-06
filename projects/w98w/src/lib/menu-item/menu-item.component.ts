import { Component, ContentChild, HostBinding, HostListener, Input, OnInit, Optional } from '@angular/core';
import { Colors } from '../colors';
import { GenImg } from '../genimg';
import { OnSubMenuClose } from '../menu/menu-host/menu-host.component';
import { MenuTemplateDirective } from '../menu/menu-template.directive';
import { MenuComponent } from '../menu/menu.component';
import { W98wStyles } from '../w98w-styles';

@Component({
  selector: 'li[w98w-menu-item]',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css']
})
export class MenuItemComponent implements OnInit, OnSubMenuClose {

  @Input('w98w-menu-item') label!: string;

  @Input() explicitSubMenu: MenuTemplateDirective | undefined;

  @HostBinding('style.--menu-text-size') hbTS = `${W98wStyles.menuFontSize}px`;
  @HostBinding('style.--menu-text-font') hbTF = W98wStyles.defaultFont;
  @HostBinding('style.--menu-text-color') hbMTC = Colors.MENU_TEXT;
  @HostBinding('style.--menu-bg-color') hbMBC = Colors.MENU_BG;

  @HostBinding('style.--menu-sel-text-color') hbSTC = Colors.MENU_SELECTED_TEXT;
  @HostBinding('style.--menu-sel-bg-color') hbSBC = Colors.MENU_SELECTED_BG;

  @HostBinding('style.color') get hbSC() {
    /*
    if (this.disabled) {
      return Colors.WIDGET_TEXT_DISABLED;
    } else {*/
      return Colors.WIDGET_TEXT;
    /*}*/
  }

  @HostBinding('style.--menu-item-index') get hbMII() {
    return this.menu?.getChildGridIndex(this);
  }

  @ContentChild(MenuTemplateDirective) implicitSubMenu: MenuTemplateDirective | undefined;

  get buttonClass() {
    if (this.menu?.openedChild === this) {
      return 'sub-opened';
    } else if (!(this.menu?.openedChild)) {  // i dunno if ? does something weird with precedence
      return 'can-hover';
    } else {
      return 'cannot-hover'
    }
  }

  arrowSize = (function () {
    const desiredSize = W98wStyles.menuFontSize - 4;
    if (desiredSize % 2 == 0) {
      return desiredSize + 1;
    } else {
      return desiredSize;
    }
  })();

  arrowImg = GenImg.ARROW_RIGHT(Colors.MENU_TEXT);
  arrowImgSelected = GenImg.ARROW_RIGHT(Colors.MENU_SELECTED_TEXT);

  constructor(@Optional() private menu: MenuComponent | null) { }

  ngOnInit(): void {
  }

  get subMenu() {
    return this.explicitSubMenu || this.implicitSubMenu;
  }

  // visually prepare to close sibling opened menu.
  @HostListener('mousedown') onMouseDown() {
    if (this.menu) {
      if (this.menu.openedChild !== this) {
        this.menu.openedChild = undefined;
      }
    }
  }

  @HostListener('click') onClick() {
    if (!this.menu || !this.menu.menuContext) return;

    if (this.subMenu) {
      if (this.menu.openedChild === this) {
        this.menu.menuContext.closeChildren();
      } else {
        this.menu.appendMenuHelper(this.menu.menuContext, this, this.subMenu, this /* OnSubMenuClose */);
        this.menu.openedChild = this;
      }
    } else {
      this.menu.menuContext?.endMenu();
    }
  }

  onSubMenuClose(): void {
    if (this.menu) {
      this.menu.openedChild = undefined;
    }
  }

  get hasSubMenu() {
    return this.subMenu !== undefined;
  }

}
