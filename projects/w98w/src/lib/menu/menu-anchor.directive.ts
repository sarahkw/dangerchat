import { Directive, ElementRef, HostListener, Input, Optional } from '@angular/core';
import { MenuTemplateDirective } from './menu-template.directive';
import { MenuService } from './menu.service';

@Directive({
  selector: '[w98w-menu-anchor]',
  exportAs: 'menuAnchor'
})
export class MenuAnchorDirective {

  // also take a fn so that we can take ViewChild params as input, as ViewChild is resolved after inputs are
  @Input() autoMenu: MenuTemplateDirective | (() => MenuTemplateDirective) | undefined;

  @HostListener('click') onClick() {
    if (this.menuService) {
      if (this.autoMenu) {
        if (this.autoMenu instanceof MenuTemplateDirective) {
          this.menuService.beginMenu(this.autoMenu, this.element.nativeElement);
        } else {
          this.menuService.beginMenu(this.autoMenu(), this.element.nativeElement);
        }
      }
    }
  }

  constructor(
    public element: ElementRef<HTMLElement>,
    @Optional() private menuService: MenuService // might be unavailable when on demo app
  ) { }

}
