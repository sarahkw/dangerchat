import { ElementRef, Injectable, TemplateRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MenuTemplateDirective } from './menu-template.directive';

export interface OnSubMenuClose {
  onSubMenuClose(): void;
}

export type MenuInstance = {
  template: MenuTemplateDirective,
  onSubMenuClose?: OnSubMenuClose,
  anchor?: HTMLElement
};
type MaybeMenu = MenuInstance[] | undefined;

@Injectable()
export class MenuService {

  currentMenu$: BehaviorSubject<MaybeMenu> = new BehaviorSubject(undefined as MaybeMenu);

  constructor() { }

  beginMenu(template: MenuTemplateDirective, anchor: HTMLElement) {
    this.currentMenu$.next([{template, anchor}]);
  }

  appendMenu(afterInstance: MenuInstance, template: MenuTemplateDirective, onSubMenuClose?: OnSubMenuClose) {
    const oldval = this.currentMenu$.value;

    console.assert(oldval !== undefined);

    if (oldval !== undefined) {
      const idx = oldval.indexOf(afterInstance);
      let newval: MaybeMenu;
      if (idx == -1) {
        newval = oldval;
      } else {
        const KEEP_CURRENT = 1;
        newval = oldval.slice(0, idx + KEEP_CURRENT);

        for (let i = idx + KEEP_CURRENT; i < oldval.length; ++i) {
          oldval[i].onSubMenuClose?.onSubMenuClose();
        }
      }
      this.currentMenu$.next(newval.concat({template, onSubMenuClose: onSubMenuClose}));
    }
  }

  closeChildren(afterInstance: MenuInstance) {
    const oldval = this.currentMenu$.value;

    console.assert(oldval !== undefined);

    if (oldval !== undefined) {
      const idx = oldval.indexOf(afterInstance);
      let newval: MaybeMenu;
      if (idx == -1) {
        return;  // unexpected situation, why a menu that doesn't exist want to close its children?
      } else {
        const KEEP_CURRENT = 1;
        newval = oldval.slice(0, idx + KEEP_CURRENT);

        let hasClosed = false;
        for (let i = idx + KEEP_CURRENT; i < oldval.length; ++i) {
          hasClosed = true;
          oldval[i].onSubMenuClose?.onSubMenuClose();
        }

        if (!hasClosed) {
          return;
        }
      }
      this.currentMenu$.next(newval);
    }
  }

  endMenu() {
    this.currentMenu$.next(undefined);
  }
}
