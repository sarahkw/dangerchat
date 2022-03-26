import { Component, ContentChild, ElementRef, HostBinding, OnInit } from '@angular/core';
import { SlidingScreenOverlayDirective } from '../sliding-screen-overlay.directive';

@Component({
  selector: 'div[w98w-sliding-screen]',
  templateUrl: './sliding-screen.component.html',
  styleUrls: ['./sliding-screen.component.css']
})
export class SlidingScreenComponent implements OnInit {

  @ContentChild(SlidingScreenOverlayDirective) overlay: any;

  @HostBinding('style.--ss-screen-width') get hbSSW() {
    return `${this.rootDiv.nativeElement.clientWidth}px`
  }

  constructor(public rootDiv: ElementRef) { }

  ngOnInit(): void {
  }

}
