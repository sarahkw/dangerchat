import { Component, Input, ViewChild } from '@angular/core';
import { MenuService } from '../menu/menu.service';
import { SlidingScreenMainContentDirective } from '../ss/sliding-screen-main-content.directive';

type Style = {[key: string]: string} | string | null;

@Component({
  selector: 'w98w-screen',
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.scss'],
  providers: [MenuService]
})
export class ScreenComponent {

  // pass to sliding screen
  @Input() unfixedHeight = false;

  @Input() slidingScreenStyle: Style = null;
  @Input() slidingScreenMainContentStyle: Style = null;

  @ViewChild(SlidingScreenMainContentDirective, {static: true}) contentParent!: SlidingScreenMainContentDirective;

  constructor(public menuService: MenuService) { }

}
