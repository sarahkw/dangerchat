import { Component, OnInit } from '@angular/core';
import { ROOTVARS } from 'projects/w98w/src/lib/root-css-vars.directive';

@Component({
  selector: 'app-window-test',
  templateUrl: './window-test.component.html',
  styleUrls: ['./window-test.component.scss']
})
export class WindowTestComponent {

  readonly ROOTVARS = ROOTVARS;

}
