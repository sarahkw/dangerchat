import { Directive, HostBinding } from '@angular/core';
import { SlidingScreenComponent } from './sliding-screen/sliding-screen.component';

@Directive({
  selector: '[w98w-sliding-screen-main-content]'
})
export class SlidingScreenMainContentDirective {

  @HostBinding('style.height') hbSH = "100%";
  @HostBinding('style.width') get hbSW() {
    if (this.ss.overlay) {
      return `${this.ss.rootDiv.nativeElement.clientWidth}px`;
    } else {
      return "100%";
    }
  }

  constructor(private ss: SlidingScreenComponent) { }

}
