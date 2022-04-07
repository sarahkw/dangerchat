import { Directive, ElementRef, HostListener, Input, Optional } from '@angular/core';
import { Pressable } from '../pressable';
import { WButtonComponent } from '../wbutton/wbutton.component';
import { MenuTemplateDirective } from './menu-template.directive';
import { MenuService } from './menu.service';

// also take a fn so that we can take ViewChild params as input, as ViewChild is resolved after inputs are
export type AutoMenuType = MenuTemplateDirective | (() => MenuTemplateDirective) | undefined;

@Directive({
  selector: '[w98w-menu-anchor]',
  exportAs: 'menuAnchor'
})
export class MenuAnchorDirective {

  @Input() autoMenu: AutoMenuType;

  @Input() pressable?: Pressable;

  @HostListener('click') onClick() {
    if (this.menuService) {
      if (this.autoMenu) {
        if (this.autoMenu instanceof MenuTemplateDirective) {
          this.menuService.beginMenu(this.autoMenu, this.element.nativeElement);
        } else {
          this.menuService.beginMenu(this.autoMenu(), this.element.nativeElement);
        }

        if (this.pressable) {
          this.pressable.pressed = true;
        }
      }
    }
  }

  constructor(
    private element: ElementRef<HTMLElement>,
    @Optional() private menuService: MenuService, // might be unavailable when on demo app

    @Optional() possiblyWButton: WButtonComponent
  ) {
    this.pressable = possiblyWButton;
  }

}
