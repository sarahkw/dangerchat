import { AfterContentChecked, ApplicationRef, Component, ContentChild, ElementRef, EventEmitter, HostBinding, Input, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { SlidingScreenOverlayDirective } from '../sliding-screen-overlay.directive';

enum State {
  Hidden,
  Measuring,
  Visible
};

type InitialObservationMap = Map<Element, ResizeObserverEntry>;

@Component({
  selector: 'div[w98w-sliding-screen]',
  templateUrl: './sliding-screen.component.html',
  styleUrls: ['./sliding-screen.component.css']
})
export class SlidingScreenComponent implements OnInit, OnDestroy, AfterContentChecked {

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

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.actionDestroy();
  }

  //#region State Machine

  shouldShowOverlay = false;  // for the template

  private currentState = State.Hidden;
  private resizeObserver?: ResizeObserver;
  mainContentFixedWidth?: string;

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
        console.assert(this.resizeObserver === undefined);

        const toObserve = [this.innerDiv.nativeElement, this.rootDiv.nativeElement];
        let observeMap: InitialObservationMap | undefined = new Map();

        this.resizeObserver = new ResizeObserver((entries, _observer) => {

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
        this.mainContentFixedWidth = undefined;
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

  private resolveContentRect(entry: ResizeObserverEntry): DOMRectReadOnly {
    // support firefox ESR, which doesn't give array
    if (Array.isArray(entry.contentRect)) {
      return entry.contentRect[0];
    } else {
      return entry.contentRect;
    }
  }

  private actionResizeInitialObservation(initObservation: InitialObservationMap) {
    switch (this.currentState) {
      case State.Hidden:
        break;
      case State.Measuring:
        if (this.unfixedHeight) {
          const crRootDiv = this.resolveContentRect(initObservation.get(this.rootDiv.nativeElement)!);
          this.renderer.setStyle(this.rootDiv.nativeElement, 'height', `${crRootDiv.height}px`);
        }

        // yeah ... this was tested to work so we don't read from the entry and we just fetch it again
        this.mainContentFixedWidth = `${this.rootDiv.nativeElement.getBoundingClientRect().width}px`;

        this.stateChange(State.Visible);

        this.appRef.tick();  // change detection doesn't happen automatically on resize observer callback
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
        const cr = this.resolveContentRect(entry);
        if (entry.target === this.innerDiv.nativeElement) {
          if (this.unfixedHeight) {
            this.renderer.setStyle(this.rootDiv.nativeElement, 'height', `${cr.height}px`);
          }
        } else if (entry.target === this.rootDiv.nativeElement) {
          // yeah ... this was tested to work so we don't read from the entry and we just fetch it again
          this.mainContentFixedWidth = `${this.rootDiv.nativeElement.getBoundingClientRect().width}px`;

          this.appRef.tick();  // change detection doesn't happen automatically on resize observer callback
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
