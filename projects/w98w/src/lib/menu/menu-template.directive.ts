import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[w98w-menu-template]',
  exportAs: 'menuTemplate'
})
export class MenuTemplateDirective {

  constructor(public template: TemplateRef<unknown>) { }

}
