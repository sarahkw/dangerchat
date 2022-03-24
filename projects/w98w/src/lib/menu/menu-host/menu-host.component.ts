import { Component, OnInit } from '@angular/core';
import { MenuService } from '../menu.service';

@Component({
  selector: 'w98w-menu-host',
  templateUrl: './menu-host.component.html',
  styleUrls: ['./menu-host.component.css']
})
export class MenuHostComponent implements OnInit {

  constructor(public menuService: MenuService) { }

  ngOnInit(): void {
  }

}
