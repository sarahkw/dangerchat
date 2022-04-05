import { Component, ContentChild, HostBinding, HostListener, Input, OnInit } from '@angular/core';
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

  @HostBinding('style.--menu-sel-text-color') hbSTC = Colors.MENU_SELECTED_TEXT;
  @HostBinding('style.--menu-sel-bg-color') hbSBC = Colors.MENU_SELECTED_BG;

  @HostBinding('style.--menu-item-index') get hbMII() {
    return this.menu.getChildGridIndex(this);
  }

  @ContentChild(MenuTemplateDirective) implicitSubMenu: MenuTemplateDirective | undefined;

  @HostBinding('class') get hbClass() {
    if (this.menu.openedChild === this) {
      return 'sub-opened';
    } else if (this.menu.openedChild === undefined) {
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

  constructor(private menu: MenuComponent) { }

  ngOnInit(): void {
  }

  get subMenu() {
    return this.explicitSubMenu || this.implicitSubMenu;
  }

  // visually prepare to close sibling opened menu.
  @HostListener('mousedown') onMouseDown() {
    if (this.menu.openedChild !== this) {
      this.menu.openedChild = undefined;
    }
  }

  @HostListener('click') onClick() {
    if (!this.menu.menuContext) return;

    if (this.subMenu) {
      if (this.menu.openedChild === this) {
        // this.menu.menuContext.closeChildren();
        // this.menu.inlineSubMenuClose();
      } else {
        // TODO: OnSubMenuClose

        this.menu.appendMenuHelper(this.menu.menuContext, this, this.subMenu);

        this.menu.openedChild = this;
      }
    } else {
      this.menu.menuContext?.endMenu();
    }
  }

  onSubMenuClose(): void {
    this.menu.openedChild = undefined;
  }

  get hasSubMenu() {
    return this.subMenu !== undefined;
  }

}
