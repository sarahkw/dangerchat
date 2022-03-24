import { Injectable, TemplateRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MenuTemplateDirective } from './menu-template.directive';

type MaybeMenu = MenuTemplateDirective[] | undefined;

@Injectable()
export class MenuService {

  currentMenu$: BehaviorSubject<MaybeMenu> = new BehaviorSubject(undefined as MaybeMenu);

  constructor() { }

  beginMenu(template: MenuTemplateDirective) {
    this.currentMenu$.next([template]);
  }

  appendMenu(template: MenuTemplateDirective) {
    console.assert(this.currentMenu$.value !== undefined);

    this.currentMenu$.next(this.currentMenu$.value!.concat([template]));
  }

  endMenu() {

  }
}
