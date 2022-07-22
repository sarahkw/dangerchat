import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, Unsubscribable } from 'rxjs';
import { WindowComponent } from '../window/window.component';

type Style = {[key: string]: string} | string | null;

class WindowManager {

  windows$ = new BehaviorSubject([] as WindowComponent[]);

  registerFor(window: WindowComponent) {
    return new Observable(_subscriber => {

      // Add the window
      this.windows$.next(this.windows$.value.concat([window]));

      const thiz = this;
      return new class implements Unsubscribable {
        unsubscribe(): void {
          // Remove the window
          thiz.windows$.next(thiz.windows$.value.filter(value => value !== window));
        }
      };
    });
  }

}

@Component({
  selector: 'w98w-desktop',
  templateUrl: './desktop.component.html',
  styleUrls: ['./desktop.component.scss']
})
export class DesktopComponent implements OnInit, OnDestroy {

  @Input() slidingScreenStyle: Style = null;
  @Input() slidingScreenMainContentStyle: Style = null;

  windowManager = new WindowManager();

  constructor() { }

  wmDebugSub?: Subscription;

  ngOnInit(): void {
    this.wmDebugSub = this.windowManager.windows$.subscribe(value => {
      console.log("windows:");
      value.forEach(window => {
        console.info(`[${window.left}, ${window.top}, ${window.width}, ${window.height}]`)
      });
    });
  }
  ngOnDestroy(): void {
    this.wmDebugSub?.unsubscribe();
  }

  private currentTopZ = 0;

  windowToTop(currentZIndex: number) {

    if (currentZIndex == 0) {
      ++this.currentTopZ;
      return this.currentTopZ;

    } else if (currentZIndex == this.currentTopZ) {
      return currentZIndex;

    } else {
      ++this.currentTopZ;
      return this.currentTopZ;

    }
  }
}
