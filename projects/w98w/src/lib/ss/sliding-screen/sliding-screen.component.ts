import { AfterContentChecked, ApplicationRef, Component, ContentChild, ElementRef, Input, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { resolveContentRect } from '../../rx/resize-observer';
import { SlidingScreenOverlayDirective } from '../sliding-screen-overlay.directive';

enum State {
  Hidden,
  Measuring,
  Visible
}

type InitialObservationMap = Map<Element, ResizeObserverEntry>;

@Component({
  selector: 'div[w98w-sliding-screen]',
  templateUrl: './sliding-screen.component.html',
  styleUrls: ['./sliding-screen.component.scss']
})
export class SlidingScreenComponent implements OnDestroy, AfterContentChecked {

  // If unfixedHeight, we will have to freeze the height to our measured value when entering overlay mode.
  // Warning: if unfixedHeight is true, then we will take control of the style height, clobbering it.
  @Input() unfixedHeight = false;

  @ContentChild(SlidingScreenOverlayDirective) private overlay: any;

  @ViewChild('innerDiv') private innerDiv!: ElementRef;

  constructor(private appRef: ApplicationRef, public rootDiv: ElementRef, private renderer: Renderer2) { }

  ngAfterContentChecked(): void {
    if (this.overlay) {
      this.actionOverlayIsSet();
    } else {
      this.actionOverlayIsUnset();
    }
  }

  ngOnDestroy(): void {
    this.actionDestroy();
  }

  //#region State Machine

  shouldShowOverlay = false;  // for the template

  private currentState = State.Hidden;
  private resizeObserver?: ResizeObserver;

  mainContentFixedSize$ = new BehaviorSubject({
    width: null as string | null,
    height: null as string | null  // if the overlay does stretch the height (which it probably shouldn't anyway), we don't want the main content affected
  });

  private stateChange(newState: State) {
    if (newState == this.currentState) {
      console.warn('tried to reenter same state');  // probably a bug? but won't assert since that's not catastrophic
      return;
    }

    this.stateExit(this.currentState);
    this.currentState = newState;
    this.stateEnter(newState);
  }

  private stateEnter(newState: State) {
    switch (newState) {
      case State.Hidden:
        if (this.resizeObserver) {
          this.resizeObserver.disconnect();
          this.resizeObserver = undefined;
        }
        break;
      case State.Measuring:
        break;
      case State.Visible:
        this.renderer.addClass(this.rootDiv.nativeElement, "overlay");
        if (this.unfixedHeight) {
          this.renderer.addClass(this.rootDiv.nativeElement, "unfixed");
        }
        this.shouldShowOverlay = true;
        break;
    }
  }

  private stateExit(oldState: State) {
    switch (oldState) {
      case State.Hidden:
        {
          console.assert(this.resizeObserver === undefined);

          const toObserve = [this.innerDiv.nativeElement, this.rootDiv.nativeElement];
          let observeMap: InitialObservationMap | undefined = new Map();

          this.resizeObserver = new ResizeObserver(entries => {

            for (const entry of entries) {
              if (observeMap === undefined) {
                this.actionResizeContinuedObservation(entry);
              } else {
                observeMap.set(entry.target, entry);
                if (observeMap.size == toObserve.length) {
                  this.actionResizeInitialObservation(observeMap);
                  observeMap = undefined;
                }
              }
            }

          });
          setTimeout(() => {
            // i don't know if running later is necessary, but it's here just so we're safe I guess.
            // just don't want a weird state where we want to leave the measuring state
            // before we even got settled, if the browser ends up calling the callback synchronously.

            for (const target of toObserve) {
              this.resizeObserver?.observe(target);
            }
          }, 0);
        }
        break;
      case State.Measuring:
        break;
      case State.Visible:
        this.shouldShowOverlay = false;
        if (this.unfixedHeight) {
          this.renderer.removeStyle(this.rootDiv.nativeElement, 'height');
          this.renderer.removeClass(this.rootDiv.nativeElement, 'unfixed');
        }
        this.renderer.removeClass(this.rootDiv.nativeElement, "overlay");
        this.mainContentFixedSize$.next({
          width: null,
          height: null
        })
        break;
    }
  }

  private actionOverlayIsSet() {
    switch (this.currentState) {
      case State.Hidden:
        this.stateChange(State.Measuring);
        break;
      case State.Measuring:
        // no-op: already on the process of showing
        break;
      case State.Visible:
        // no-op: already showing
        break;
    }
  }

  private actionOverlayIsUnset() {
    switch (this.currentState) {
      case State.Hidden:
        // no-op: already hidden
        break;
      case State.Measuring:
        this.stateChange(State.Hidden);  // go back to Hidden so we don't enter Visible when the measure comes back
        break;
      case State.Visible:
        this.stateChange(State.Hidden);
        break;
    }
  }

  private actionResizeInitialObservation(initObservation: InitialObservationMap) {
    switch (this.currentState) {
      case State.Hidden:
        break;
      case State.Measuring:
        {
          if (this.unfixedHeight) {
            // TODO: lint error. need to rewrite this using rxjs to fix this. if ResizeObserver
            //       doesn't give us rootDiv in the initial observation we're in trouble.
            //       state machines turn out to be a lot more difficult to understand than
            //       rxjs.

            const crRootDiv = resolveContentRect(initObservation.get(this.rootDiv.nativeElement)!);
            this.renderer.setStyle(this.rootDiv.nativeElement, 'height', `${crRootDiv.height}px`);
          }

          // yeah ... this was tested to work so we don't read from the entry and we just fetch it again
          const bcr = this.rootDiv.nativeElement.getBoundingClientRect();
          this.mainContentFixedSize$.next({
            width: `${bcr.width}px`,
            height: (!this.unfixedHeight) ? `${bcr.height}px` : null
          });

          this.stateChange(State.Visible);

          this.appRef.tick();  // change detection doesn't happen automatically on resize observer callback
        }
        break;
      case State.Visible:
        break;
    }
  }

  private actionResizeContinuedObservation(entry: ResizeObserverEntry) {
    switch (this.currentState) {
      case State.Hidden:
        break;
      case State.Measuring:
        break;
      case State.Visible:
        {
          const cr = resolveContentRect(entry);
          if (entry.target === this.innerDiv.nativeElement) {
            if (this.unfixedHeight) {
              this.renderer.setStyle(this.rootDiv.nativeElement, 'height', `${cr.height}px`);
            }
          } else if (entry.target === this.rootDiv.nativeElement) {
            // yeah ... this was tested to work so we don't read from the entry and we just fetch it again
            const bcr = this.rootDiv.nativeElement.getBoundingClientRect();
            this.mainContentFixedSize$.next({
              width: `${bcr.width}px`,
              // old comment: this actually shouldn't change, we probably don't really need this here but it is here for consistency
              height: (!this.unfixedHeight) ? `${bcr.height}px` : null
            });

            // no change detection! w00t!  i hope it was worth it. ideally we should also throttle how often we respond to resize observer
          }
        }
        break;
    }
  }

  private actionDestroy() {
    switch (this.currentState) {
      case State.Hidden:
      case State.Measuring:
      case State.Visible:

        // not going to bother with any cleanup besides ensuring the resize observer is disconnected
        if (this.resizeObserver) {
          this.resizeObserver.disconnect();
          this.resizeObserver = undefined;
        }
        break;
    }
  }

  //#endregion
}
