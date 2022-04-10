import { Component, OnInit } from '@angular/core';
import { ROOTVARS } from 'projects/w98w/src/lib/root-css-vars.directive';

@Component({
  selector: 'app-screen-test',
  templateUrl: './screen-test.component.html',
  styleUrls: ['./screen-test.component.scss']
})
export class ScreenTestComponent {

  readonly ROOTVARS = ROOTVARS;

}
