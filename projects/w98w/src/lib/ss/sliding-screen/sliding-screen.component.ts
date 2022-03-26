import { AfterContentChecked, ApplicationRef, Component, ContentChild, ElementRef, EventEmitter, HostBinding, OnDestroy, OnInit, Output } from '@angular/core';
import { SlidingScreenOverlayDirective } from '../sliding-screen-overlay.directive';

@Component({
  selector: 'div[w98w-sliding-screen]',
  templateUrl: './sliding-screen.component.html',
  styleUrls: ['./sliding-screen.component.css']
})
export class SlidingScreenComponent implements OnInit, OnDestroy, AfterContentChecked {

  // we're not in the business of updating the main content element with our new size.
  // that's CSS's job ideally. luckily we could just ask the overlay to close.
  @Output() needKillOverlay = new EventEmitter<any>();

  @ContentChild(SlidingScreenOverlayDirective) overlay: any;

  private resizeObserver?: ResizeObserver;

  constructor(private appRef: ApplicationRef, public rootDiv: ElementRef) { }

  ngAfterContentChecked(): void {
    if (this.overlay && !this.resizeObserver) {
      let skipFirst = true;  // will likely fire on first observe in our use case

      this.resizeObserver = new ResizeObserver((entries, _observer) => {
        if (skipFirst) {
          skipFirst = false;
          return;
        }

        this.needKillOverlay.emit(null);
        this.appRef.tick();  // i guess resizeobserver doesn't trigger change detection
      });
      this.resizeObserver.observe(this.rootDiv.nativeElement);
    } else if (!this.overlay && this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = undefined;
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = undefined;
    }
  }
}
