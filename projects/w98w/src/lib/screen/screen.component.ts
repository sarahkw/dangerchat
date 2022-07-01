import { Component, Input } from '@angular/core';
import { MenuService } from '../menu/menu.service';

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

  @Input() slidingScreenMainContentStyle: Style = null;

  constructor(public menuService: MenuService) { }

}
