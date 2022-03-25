import { Component, ContentChild, HostBinding, HostListener, Input, OnInit } from '@angular/core';
import { Colors } from '../colors';
import { MenuTemplateDirective } from '../menu/menu-template.directive';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'li[w98w-menu-item]',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css']
})
export class MenuItemComponent implements OnInit {

  @Input('w98w-menu-item') label!: string;

  @HostBinding('style.--menu-sel-text-color') hbSTC = Colors.MENU_SELECTED_TEXT;
  @HostBinding('style.--menu-sel-bg-color') hbSBC = Colors.MENU_SELECTED_BG;

  @ContentChild(MenuTemplateDirective) subMenu: MenuTemplateDirective | undefined;

  constructor(private menu: MenuComponent) { }

  ngOnInit(): void {
  }

  @HostListener('click') onClick() {
    if (this.subMenu) {
      this.menu.menuContext.appendMenu(this.subMenu);
    } else {
      this.menu.menuContext.endMenu();
    }
  }

  get hasSubMenu() {
    return this.subMenu !== undefined;
  }

}
