import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[w98w-menu-anchor]',
  exportAs: 'menuAnchor'
})
export class MenuAnchorDirective {

  constructor(public element: ElementRef<HTMLElement>) { }

}
