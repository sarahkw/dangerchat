import { Component } from '@angular/core';

import { MoveResizeMode } from 'projects/w98w/src/lib/window/window.component';

@Component({
  selector: 'app-interactjs-test',
  templateUrl: './interactjs-test.component.html',
  styleUrls: ['./interactjs-test.component.scss']
})
export class InteractjsTestComponent {
  readonly MOVERESIZEMODE = MoveResizeMode;
}
