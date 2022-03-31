import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuTemplateDirective } from 'projects/w98w/src/lib/menu/menu-template.directive';

@Component({
  selector: 'app-test-menu-lib',
  templateUrl: './test-menu-lib.component.html',
  styleUrls: ['./test-menu-lib.component.css']
})
export class TestMenuLibComponent implements OnInit {

  @ViewChild('menuTemp') menuTemp!: MenuTemplateDirective;

  constructor() { }

  ngOnInit(): void {
  }

}
