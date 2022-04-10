import { Component, OnInit } from '@angular/core';
import { ROOTVARS } from 'projects/w98w/src/lib/root-css-vars.directive';

@Component({
  selector: 'app-menu-test',
  templateUrl: './menu-test.component.html',
  styleUrls: ['./menu-test.component.scss']
})
export class MenuTestComponent implements OnInit {

  readonly ROOTVARS = ROOTVARS;

  constructor() { }

  ngOnInit(): void {
  }

}
