import { Directive, ElementRef, HostBinding, OnDestroy, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';
import { SlidingScreenComponent } from './sliding-screen/sliding-screen.component';

@Directive({
  selector: '[w98w-sliding-screen-main-content]',
  exportAs: 'ssMainContent'
})
export class SlidingScreenMainContentDirective implements OnDestroy {
  @HostBinding('style.gridRow') hbGR = 1;
  @HostBinding('style.gridColumn') hbGC = 1;

  // Thanks, Grid. If I don't do this then things that go off screen force the width.
  @HostBinding('style.minWidth.px') hbsMW = 0;

  private setWidthHeight(width: string | null, height: string | null) {
    this.renderer.setStyle(this.element.nativeElement, 'width', width || '100%');
    this.renderer.setStyle(this.element.nativeElement, 'height', height || '100%');
  }

  private subscription: Subscription;

  constructor(private ss: SlidingScreenComponent, public element: ElementRef<HTMLElement>, private renderer: Renderer2) {

    // screen should have its own stacking context because we don't want anything on the screen to draw
    // above any overlays
    renderer.setStyle(element.nativeElement, 'position', 'relative');
    renderer.setStyle(element.nativeElement, 'zIndex', 0);

    this.setWidthHeight(null, null);

    this.subscription = ss.mainContentFixedSize$.subscribe(next => this.setWidthHeight(next.width, next.height));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
