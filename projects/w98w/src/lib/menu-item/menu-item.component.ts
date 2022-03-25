import { Component, ContentChild, HostBinding, HostListener, Input, OnInit } from '@angular/core';
import { Colors } from '../colors';
import { MenuTemplateDirective } from '../menu/menu-template.directive';
import { MenuComponent } from '../menu/menu.component';
import { OnSubMenuClose } from '../menu/menu.service';

@Component({
  selector: 'li[w98w-menu-item]',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css']
})
export class MenuItemComponent implements OnInit, OnSubMenuClose {

  @Input('w98w-menu-item') label!: string;

  @HostBinding('style.--menu-sel-text-color') hbSTC = Colors.MENU_SELECTED_TEXT;
  @HostBinding('style.--menu-sel-bg-color') hbSBC = Colors.MENU_SELECTED_BG;

  @ContentChild(MenuTemplateDirective) subMenu: MenuTemplateDirective | undefined;

  @HostBinding('class') get hbClass() {
    if (this.menu.openedChild === this) {
      return 'sub-opened';
    } else if (this.menu.openedChild === undefined) {
      return 'can-hover';
    } else {
      return 'cannot-hover'
    }
  }

  constructor(private menu: MenuComponent) { }

  ngOnInit(): void {
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
        this.menu.menuContext.closeChildren();
      } else {
        this.menu.menuContext.appendMenu(this.subMenu, this /* OnSubMenuClose */);
        this.menu.openedChild = this;
      }
    } else {
      this.menu.menuContext.endMenu();
    }
  }

  onSubMenuClose(): void {
    this.menu.openedChild = undefined;
  }

  get hasSubMenu() {
    return this.subMenu !== undefined;
  }

}
