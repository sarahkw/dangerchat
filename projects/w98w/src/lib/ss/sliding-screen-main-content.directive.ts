import { Directive, HostBinding } from '@angular/core';
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

  constructor(private ss: SlidingScreenComponent) { }

}
