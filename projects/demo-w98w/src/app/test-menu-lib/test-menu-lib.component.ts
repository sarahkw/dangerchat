import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuTemplateDirective } from 'projects/w98w/src/lib/menu/menu-template.directive';

@Component({
  selector: 'app-test-menu-lib',
  templateUrl: './test-menu-lib.component.html',
  styleUrls: ['./test-menu-lib.component.css']
})
export class TestMenuLibComponent implements OnInit {

  @ViewChild('menuTemp') menuTemp!: MenuTemplateDirective;

  // workaround to be able to use the value as an input param, as views are resolved after inputs are
  menuTempDeferred = (function (this: TestMenuLibComponent) {
    return this.menuTemp;
  }).bind(this);

  constructor() { }

  ngOnInit(): void {
  }

}
