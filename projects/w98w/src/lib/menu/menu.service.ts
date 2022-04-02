import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RootMenuDescriptor } from './menu-host/menu-host.component';
import { MenuTemplateDirective } from './menu-template.directive';

@Injectable()
export class MenuService {

  currentMenu$: BehaviorSubject<RootMenuDescriptor | undefined> = new BehaviorSubject(undefined as any);

  constructor() { }

  beginMenu(template: MenuTemplateDirective, anchor: HTMLElement) {
    this.currentMenu$.next({template, anchor});
  }

  endMenu() {
    this.currentMenu$.next(undefined);
  }
}
