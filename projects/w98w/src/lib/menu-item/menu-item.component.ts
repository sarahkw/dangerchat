import { Component, ContentChild, ElementRef, HostBinding, HostListener, Input, OnDestroy, Optional, Renderer2, RendererStyleFlags2 } from '@angular/core';
import { Subscription } from 'rxjs';
import { Colors } from '../colors';
import { GenImg } from '../genimg';
import { OnSubMenuClose } from '../menu/menu-host/menu-host.component';
import { MenuTemplateDirective } from '../menu/menu-template.directive';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'li[w98w-menu-item]',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss']
})
export class MenuItemComponent implements OnDestroy, OnSubMenuClose {

  @Input('w98w-menu-item') label!: string;

  @Input() explicitSubMenu: MenuTemplateDirective | undefined;
  @Input() iconImgSrc: string | undefined;

  @Input() debugShowSubMenuIndicator = false;

  // TODO using class is workaround for angular bug, where *ngFor drops the attribute
  @HostBinding('class') readonly hbc = 'w98w-menu-item';

  @HostBinding('style.--menu-sel-text-color') readonly hbSTC = Colors.MENU_SELECTED_TEXT;
  @HostBinding('style.--menu-sel-bg-color') readonly hbSBC = Colors.MENU_SELECTED_BG;

  @ContentChild(MenuTemplateDirective) implicitSubMenu: MenuTemplateDirective | undefined;

  get buttonClass() {
    if (this.parentMenu?.childWhoHasOpenedSubMenu === this) {
      return 'sub-opened';
    } else if (!(this.parentMenu?.childWhoHasOpenedSubMenu)) {  // i dunno if ? does something weird with precedence
      return 'can-hover';
    } else {
      return 'cannot-hover'
    }
  }

  arrowSize = (function () {
    const desiredSize = Colors.labelFontSize - 4;
    if (desiredSize % 2 == 0) {
      return desiredSize + 1;
    } else {
      return desiredSize;
    }
  })();

  arrowImg = GenImg.ARROW_RIGHT(Colors.WIDGET_TEXT);
  arrowImgSelected = GenImg.ARROW_RIGHT(Colors.MENU_SELECTED_TEXT);

  childItemsSubscription?: Subscription;

  constructor(@Optional() private parentMenu: MenuComponent | null,
    elementRef: ElementRef<HTMLElement>,
    renderer: Renderer2) {

    if (parentMenu) {
      this.childItemsSubscription = parentMenu.childCssIndexes$.subscribe(value => {
        renderer.setStyle(elementRef.nativeElement, '--menu-item-index', value.get(this), RendererStyleFlags2.DashCase);
      });
    }

  }

  ngOnDestroy(): void {
    this.childItemsSubscription?.unsubscribe();
  }

  get subMenu() {
    return this.explicitSubMenu || this.implicitSubMenu;
  }

  // visually prepare to close sibling opened menu.
  @HostListener('mousedown') onMouseDown() {
    if (this.parentMenu) {
      if (this.parentMenu.childWhoHasOpenedSubMenu !== this) {
        this.parentMenu.childWhoHasOpenedSubMenu = undefined;
      }
    }
  }

  @HostListener('click') onClick() {
    if (!this.parentMenu || !this.parentMenu.menuContext) return;

    if (this.subMenu) {
      if (this.parentMenu.childWhoHasOpenedSubMenu === this) {
        this.parentMenu.menuContext.closeChildren();
      } else {
        this.parentMenu.childMenuItemWantsAppendMenu(this.parentMenu.menuContext, this, this.subMenu, this /* OnSubMenuClose */);
        this.parentMenu.childWhoHasOpenedSubMenu = this;
      }
    } else {
      this.parentMenu.menuContext?.endMenu();
    }
  }

  onSubMenuClose(): void {
    if (this.parentMenu) {
      this.parentMenu.childWhoHasOpenedSubMenu = undefined;
    }
  }

  get hasSubMenu() {
    return this.subMenu !== undefined;
  }

}
