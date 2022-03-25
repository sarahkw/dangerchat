import { Injectable, TemplateRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MenuTemplateDirective } from './menu-template.directive';

export type MenuInstance = {
  template: MenuTemplateDirective
};
type MaybeMenu = MenuInstance[] | undefined;

@Injectable()
export class MenuService {

  currentMenu$: BehaviorSubject<MaybeMenu> = new BehaviorSubject(undefined as MaybeMenu);

  constructor() { }

  beginMenu(template: MenuTemplateDirective) {
    this.currentMenu$.next([{template}]);
  }

  appendMenu(afterInstance: MenuInstance, template: MenuTemplateDirective) {
    console.assert(this.currentMenu$.value !== undefined);

    if (this.currentMenu$.value !== undefined) {
      const idx = this.currentMenu$.value.indexOf(afterInstance);
      let newval: MaybeMenu;
      if (idx == -1) {
        newval = this.currentMenu$.value.concat([{template}]);
      } else {
        const KEEP_CURRENT = 1;
        newval = this.currentMenu$.value.slice(0, idx + KEEP_CURRENT).concat([{template}]);
      }
      this.currentMenu$.next(newval);
    }
  }

  endMenu() {
    this.currentMenu$.next(undefined);
  }
}
