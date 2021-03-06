import { Component, DoCheck, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, Observable, Observer, Subscriber, Subscription } from 'rxjs';
import { MenuContext } from '../menu-context';
import { MenuContinuation } from '../menu-calculation';
import { MenuLayoutSizeObserverDirective, MlsoMenuContext, ResizeUpdates } from '../menu-layout-size-observer.directive';
import { MenuTemplateDirective } from '../menu-template.directive';
import { MenuService } from '../menu.service';

export interface OnSubMenuClose {
  onSubMenuClose(): void;
}

export type MenuInstance = {
  template: MenuTemplateDirective,
  context: MenuContext,
  onSubMenuClose?: OnSubMenuClose
};

export type RootMenuDescriptor = {
  template: MenuTemplateDirective;
  anchor: HTMLElement;
};

type Dim = {x: number, y: number, width: number};

@Component({
  selector: 'w98w-menu-host',
  templateUrl: './menu-host.component.html',
  styleUrls: ['./menu-host.component.scss']
})
export class MenuHostComponent implements OnInit, OnDestroy, DoCheck {

  renderedMenu$: BehaviorSubject<MenuInstance[] | undefined> = new BehaviorSubject(undefined as any);
  private rootMenuSubscription?: Subscription;

  private rootAnchor: Element | undefined;
  private rootAnchorDims$: BehaviorSubject<Dim | undefined> = new BehaviorSubject(undefined as any);

  private distinctRootAnchorDims$ = this.rootAnchorDims$.pipe(
    distinctUntilChanged((prev, curr) => {
      if (!prev || !curr) {
        return prev == curr;
      }
      return prev.x == curr.x && prev.y == curr.y;
    }));

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
        y: rootAnchorBCR.bottom - viewportBCR.y,
        width: rootAnchorBCR.width
      };

      this.rootAnchorDims$.next(dims);
    } else {
      this.rootAnchorDims$.next(undefined);
    }
  }

  ngDoCheck(): void {
    this.checkRootAnchor();
  }

  private static rootMenuContinuation$(
    distinctRootAnchorDims$: Observable<Dim | undefined>,
    resizeUpdates$: Observable<ResizeUpdates>,
    checkRootAnchor: () => void) {

    // put fn out here so it has no access to closure
    function nextContinuation(
      subscriber: Subscriber<MenuContinuation>,
      currentRootAnchorDims: Dim,
      resizeUpdates: ResizeUpdates | undefined
    ) {
      subscriber.next({
        current: undefined,
        next: {
          offsetVertical: currentRootAnchorDims.y,
          offsetHorizontal: currentRootAnchorDims.x,
          canAlignRightWidth: currentRootAnchorDims.width
        },
        passthrough: {
          updates: resizeUpdates
        }
      });
    }

    return new Observable<MenuContinuation>(subscriber => {

      let currentRootAnchorDims: Dim | undefined;
      let resizeUpdateOutBuffer: ResizeUpdates | undefined;

      const subscription = distinctRootAnchorDims$.subscribe(new class implements Observer<Dim | undefined> {
        next(value: Dim | undefined): void {
          if (value) {
            currentRootAnchorDims = value;
            nextContinuation(subscriber, currentRootAnchorDims, resizeUpdateOutBuffer);
            resizeUpdateOutBuffer = undefined;
          }
        }
        error(err: unknown): void {
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

          // it's coming from behaviorsubject so we'll always have this before we got a resize update.
          // otherwise, we have to drop this update and that's not good.
          console.assert(!!currentRootAnchorDims);

          if (value.root) {
            // checkRootAnchor because it's possible the root anchor moved due to resize of root.
            // for example, if it's aligned to the bottom of the root.

            resizeUpdateOutBuffer = value;
            checkRootAnchor();
            if (resizeUpdateOutBuffer) {  // it didn't send so we must
              nextContinuation(subscriber, currentRootAnchorDims!, resizeUpdateOutBuffer);
              resizeUpdateOutBuffer = undefined;
            }
          } else {
            nextContinuation(subscriber, currentRootAnchorDims!, value);
          }
        }
        error(err: unknown): void {
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
  }

  ngOnInit(): void {
    this.rootMenuSubscription = this.menuService.activeRootMenu$.subscribe(newMenu => {
      if (newMenu) {
        this.beginMenu(newMenu);
      } else {
        this.endMenu();
      }
    });
  }

  ngOnDestroy(): void {
    this.rootMenuSubscription?.unsubscribe();
  }

  beginMenu(newMenu: RootMenuDescriptor) {
    const thiz = this;

    this.rootAnchor = newMenu.anchor;
    this.checkRootAnchor();

    const {context: mlsoContext, resizeUpdates$} = this.menuLayoutSizeObserver.generate();

    const menuContinuation$ = MenuHostComponent.rootMenuContinuation$(this.distinctRootAnchorDims$, resizeUpdates$, () => {
      this.checkRootAnchor();
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
        appendMenu(
          template: MenuTemplateDirective,
          nextContinuation$: Observable<MenuContinuation>,
          mlsoContext: MlsoMenuContext,
          onSubMenuClose?: OnSubMenuClose): void {

          thiz.appendMenu(menuInstance, template, nextContinuation$, mlsoContext, onSubMenuClose);
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
  }

  appendMenu(
    caller: MenuInstance,
    template: MenuTemplateDirective,
    nextContinuation$: Observable<MenuContinuation>,
    mlsoContext: MlsoMenuContext,
    onSubMenuClose?: OnSubMenuClose) {

      const thiz = this;

      const menuInstance: MenuInstance = {
        template,
        context: new class implements MenuContext {
          get menuContinuation$(): Observable<MenuContinuation> {
            return nextContinuation$;
          }
          get mlsoContext(): MlsoMenuContext {
            return mlsoContext;
          }
          appendMenu(template: MenuTemplateDirective,
            nextContinuation$: Observable<MenuContinuation>,
            mlsoContext: MlsoMenuContext,
            onSubMenuClose?: OnSubMenuClose): void {

            thiz.appendMenu(menuInstance, template, nextContinuation$, mlsoContext, onSubMenuClose);
          }
          closeChildren(): void {
            thiz.closeChildren(menuInstance);
          }
          endMenu(): void {
            thiz.menuService.endMenu();
          }
        },
        onSubMenuClose
      };

      const currentRender = this.renderedMenu$.value;
      if (!currentRender) {
        console.debug('missing current menu');
        return;
      }

      const callerPosition = currentRender.indexOf(caller);
      if (callerPosition == -1) {
        console.debug('who called?');
        return;
      }

      const newRender = currentRender.slice(0, callerPosition + 1); // don't lose who's requesting the submenu open!
      newRender.push(menuInstance);

      // XXX not currently calling the 'closed' callbacks even though we should.

      this.renderedMenu$.next(newRender);
  }

  private endMenu() {
    this.renderedMenu$.next(undefined);

    this.rootAnchor = undefined;
    this.checkRootAnchor();
  }

  closeChildren(afterInstance: MenuInstance) {
    const oldval = this.renderedMenu$.value;
    console.assert(!!oldval);

    if (oldval) {
      const idx = oldval.indexOf(afterInstance);
      if (idx == -1) {
        return;  // unexpected situation, why a menu that doesn't exist want to close its children?
      } else {
        const KEEP_CURRENT = 1;
        const newval = oldval.slice(0, idx + KEEP_CURRENT);

        let hasClosed = false;
        for (let i = idx + KEEP_CURRENT; i < oldval.length; ++i) {
          hasClosed = true;
          oldval[i].onSubMenuClose?.onSubMenuClose();
        }

        if (hasClosed) {
          this.renderedMenu$.next(newval);
        }
      }
    }
  }
}
