import { Directive, ElementRef, HostBinding, Renderer2 } from '@angular/core';
import { SlidingScreenComponent } from './sliding-screen/sliding-screen.component';

@Directive({
  selector: '[w98w-sliding-screen-main-content]'
})
export class SlidingScreenMainContentDirective {
  @HostBinding('style.gridRow') hbGR = 1;
  @HostBinding('style.gridColumn') hbGC = 1;

  @HostBinding('style.width') get hbSW() {
    return this.ss.mainContentFixedWidth || "100%";
  }
  @HostBinding('style.height') get hbSH() {
    return this.ss.mainContentFixedHeight || "100%";
  }

  constructor(private ss: SlidingScreenComponent, public element: ElementRef<HTMLElement>, renderer: Renderer2) {

    // screen should have its own stacking context because we don't want anything on the screen to draw
    // above any overlays
    renderer.setStyle(element.nativeElement, 'position', 'relative');
    renderer.setStyle(element.nativeElement, 'zIndex', 0);

  }
}
