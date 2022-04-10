import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Unsubscribable } from 'rxjs';
import { RootMenuDescriptor } from './menu-host/menu-host.component';
import { MenuTemplateDirective } from './menu-template.directive';

@Injectable()
export class MenuService {

  // null means no menu, and is also how we cancel
  activeRootMenu$: BehaviorSubject<RootMenuDescriptor | null> = new BehaviorSubject(null as any);

  currentCancel: (() => void) | undefined;

  beginMenu$(template: MenuTemplateDirective, anchor: HTMLElement): Observable<null> {
    return new Observable<null>(subscriber => {
      if (this.currentCancel) {
        this.currentCancel();
      }
      this.currentCancel = () => subscriber.complete();

      const menuIdentity = {template, anchor};

      this.activeRootMenu$.next(menuIdentity);

      const thiz = this;
      return new class implements Unsubscribable {
        unsubscribe(): void {
          if (thiz.activeRootMenu$.value == menuIdentity) {  // probably don't need to check because if we complete we shouldn't get unsubscribe called
            thiz.activeRootMenu$.next(null);
            thiz.currentCancel = undefined;
          }
        }
      };
    });
  }

  endMenu() {
    this.activeRootMenu$.next(null);

    if (this.currentCancel) {
      this.currentCancel();
      this.currentCancel = undefined;
    }
  }
}
