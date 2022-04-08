import { Component, OnInit } from '@angular/core';
import { MenuService } from 'projects/w98w/src/lib/menu/menu.service';
import { ROOTVARS } from 'projects/w98w/src/lib/root-css-vars.directive';

@Component({
  selector: 'app-menu-test',
  templateUrl: './menu-test.component.html',
  styleUrls: ['./menu-test.component.css'],
  providers: [MenuService]
})
export class MenuTestComponent implements OnInit {

  readonly ROOTVARS = ROOTVARS;

  constructor(public menuService: MenuService) { }

  ngOnInit(): void {
  }

}
