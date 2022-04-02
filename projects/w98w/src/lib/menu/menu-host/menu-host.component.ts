import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { MenuContext } from '../menu-context';
import { MenuLayoutSizeObserverDirective, MlsoMenuContext, ResizeUpdates } from '../menu-layout-size-observer.directive';
import { MenuTemplateDirective } from '../menu-template.directive';
import { MenuComponent } from '../menu.component';
import { MenuService } from '../menu.service';

//#region Migrate from MenuService

export interface OnSubMenuClose {
  onSubMenuClose(): void;
}

export type MenuInstance = {
  template: MenuTemplateDirective,
  onSubMenuClose?: OnSubMenuClose,
  anchor?: HTMLElement
};
type MaybeMenu = MenuInstance[] | undefined;

export type RootMenuDescriptor = {
  template: MenuTemplateDirective;
  anchor: HTMLElement;
};

//#endregion

@Component({
  selector: 'w98w-menu-host',
  templateUrl: './menu-host.component.html',
  styleUrls: ['./menu-host.component.css']
})
export class MenuHostComponent implements OnInit, OnDestroy {

  currentMenu$: BehaviorSubject<MaybeMenu> = new BehaviorSubject(undefined as MaybeMenu);
  private rootMenuSubscription?: Subscription;

  private mlsoContext: MlsoMenuContext;
  private mlsoObserver$: Observable<ResizeUpdates>;

  constructor(
    public menuService: MenuService,
    menuLayoutSizeObserver: MenuLayoutSizeObserverDirective) {

      const foo = menuLayoutSizeObserver.generate();
      this.mlsoContext = foo.context;
      this.mlsoObserver$ = new Observable(foo.subscribe);
    }

  ngOnInit(): void {
    this.rootMenuSubscription = this.menuService.activeRootMenu$.subscribe(newMenu => {
      if (newMenu) {
        this.currentMenu$.next([newMenu]);
      } else {
        this.currentMenu$.next(undefined);
      }
    });
  }

  ngOnDestroy(): void {
    this.rootMenuSubscription?.unsubscribe();
  }

  makeContextFor(instance: MenuInstance): MenuContext {
    const thiz = this;
    return new class implements MenuContext {
      menuHostChildStyles(): boolean {
        return true;
      }
      parent(): MenuComponent | undefined {
        return undefined;  // no parent for root menu
      }
      anchor(): HTMLElement | undefined {
        return instance.anchor;
      }
      appendMenu(template: MenuTemplateDirective, onSubMenuClose?: OnSubMenuClose): void {
        thiz.appendMenu(instance, template, onSubMenuClose);
      }
      closeChildren(): void {
        thiz.closeChildren(instance);
      }
      endMenu(): void {
        thiz.menuService.endMenu();
      }
    };
  }

  //#region Migrate from MenuService

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

  //#endregion
}
