import { Component, DoCheck, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, distinctUntilChanged, map, Observable, Observer, Subscription } from 'rxjs';
import { MenuContext } from '../menu-context';
import { MenuContinuation } from '../menu-continuation';
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
  context: MenuContext,
  onSubMenuClose?: OnSubMenuClose
};
type MaybeMenu = MenuInstance[] | undefined;

export type RootMenuDescriptor = {
  template: MenuTemplateDirective;
  anchor: HTMLElement;
};

//#endregion

type Dim = {x: number, y: number};

@Component({
  selector: 'w98w-menu-host',
  templateUrl: './menu-host.component.html',
  styleUrls: ['./menu-host.component.css']
})
export class MenuHostComponent implements OnInit, OnDestroy, DoCheck {

  renderedMenu$: BehaviorSubject<MaybeMenu> = new BehaviorSubject(undefined as MaybeMenu);
  private rootMenuSubscription?: Subscription;

  private rootAnchor: Element | undefined;
  private rootAnchorDims$: BehaviorSubject<Dim | undefined> = new BehaviorSubject(undefined as any);

  constructor(
    public menuService: MenuService,
    private menuLayoutSizeObserver: MenuLayoutSizeObserverDirective) {
  }

  private checkRootAnchor() {
    if (this.rootAnchor) {
      const viewport = this.menuLayoutSizeObserver.rootElement;

      const rootAnchorBCR = this.rootAnchor.getBoundingClientRect();
      const viewportBCR = viewport.getBoundingClientRect();

      const dims = {
        x: rootAnchorBCR.x - viewportBCR.x,
        y: rootAnchorBCR.bottom - viewportBCR.y
      };

      this.rootAnchorDims$.next(dims);
    } else {
      this.rootAnchorDims$.next(undefined);
    }
  }

  ngDoCheck(): void {
    this.checkRootAnchor();
  }

  ngOnInit(): void {

    const distinctRootAnchorDims$ = this.rootAnchorDims$.pipe(
      distinctUntilChanged((prev, curr) => {
        if (!prev || !curr) {
          return prev == curr;
        }
        return prev.x == curr.x && prev.y == curr.y;
      }));

    this.rootMenuSubscription = this.menuService.activeRootMenu$.subscribe(newMenu => {
      if (newMenu) {
        const thiz = this;

        this.rootAnchor = newMenu.anchor;
        this.checkRootAnchor();

        const {context: mlsoContext, resizeUpdates$} = this.menuLayoutSizeObserver.generate();

        const menuContinuation$ = new Observable<MenuContinuation>(subscriber => {

          let currentRootAnchorDims: Dim | undefined;
          let currentResizeUpdates: ResizeUpdates | undefined;

          function nextIfAble() {
            if (currentRootAnchorDims) {
              subscriber.next({
                bodyOffsetVertical: currentRootAnchorDims.y,
                bodyOffsetHorizontal: currentRootAnchorDims.x,
                updates: currentResizeUpdates || null
              });
            }
          }

          let subscription = distinctRootAnchorDims$.subscribe(new class implements Observer<Dim | undefined> {
            next(value: Dim | undefined): void {
              currentRootAnchorDims = value;
              nextIfAble();
            }
            error(err: any): void {
              subscriber.error(err);
            }
            complete(): void {
              subscriber.complete();
            }
          });

          // if distinctRootAnchorDims$ completes, the other subscription we add to its subscription
          // will also get torn down.

          subscription.add(resizeUpdates$.subscribe(new class implements Observer<ResizeUpdates> {
            next(value: ResizeUpdates): void {
              currentResizeUpdates = value;

              if (value.root) {
                // checkRootAnchor because it's possible the root anchor moved due to resize of root.
                // for example, if it's aligned to the bottom of the root.
                //
                // checkRootAnchor would have next'ed itself so we shouldn't duplicate
                const old = currentRootAnchorDims;
                thiz.checkRootAnchor();
                if (old == currentRootAnchorDims) {
                  nextIfAble();
                }
              } else {
                nextIfAble();
              }
            }
            error(err: any): void {
              subscriber.error(err);
              subscription.unsubscribe(); // the other one
            }
            complete(): void {
              subscriber.complete();
              subscription.unsubscribe(); // the other one
            }
          }));

          return subscription;
        });

        const menuInstance: MenuInstance = {
          template: newMenu.template,
          context: new class implements MenuContext {
            get menuContinuation$(): Observable<MenuContinuation> {
              return menuContinuation$;
            }
            get mlsoContext(): MlsoMenuContext {
              return mlsoContext;
            }
            menuHostChildStyles(): boolean {
              return true;
            }
            parent(): MenuComponent | undefined {
              return undefined;  // no parent for root menu
            }
            appendMenu(template: MenuTemplateDirective, onSubMenuClose?: OnSubMenuClose): void {
              // thiz.appendMenu(menuInstance, template, onSubMenuClose);
            }
            closeChildren(): void {
              thiz.closeChildren(menuInstance);
            }
            endMenu(): void {
              thiz.menuService.endMenu();
            }
          }
        };

        this.renderedMenu$.next([menuInstance]);
      } else {
        this.renderedMenu$.next(undefined);

        this.rootAnchor = undefined;
        this.checkRootAnchor();
      }
    });
  }

  ngOnDestroy(): void {
    this.rootMenuSubscription?.unsubscribe();
  }

  //#region Migrate from MenuService

  // appendMenu(afterInstance: MenuInstance, template: MenuTemplateDirective, onSubMenuClose?: OnSubMenuClose) {
  //   const oldval = this.renderedMenu$.value;

  //   console.assert(oldval !== undefined);

  //   if (oldval !== undefined) {
  //     const idx = oldval.indexOf(afterInstance);
  //     let newval: MaybeMenu;
  //     if (idx == -1) {
  //       newval = oldval;
  //     } else {
  //       const KEEP_CURRENT = 1;
  //       newval = oldval.slice(0, idx + KEEP_CURRENT);

  //       for (let i = idx + KEEP_CURRENT; i < oldval.length; ++i) {
  //         oldval[i].onSubMenuClose?.onSubMenuClose();
  //       }
  //     }
  //     this.renderedMenu$.next(newval.concat({template, onSubMenuClose: onSubMenuClose}));
  //   }
  // }

  closeChildren(afterInstance: MenuInstance) {
    const oldval = this.renderedMenu$.value;

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
      this.renderedMenu$.next(newval);
    }
  }

  //#endregion
}
