import { Component, OnInit } from '@angular/core';
import { Colors } from 'projects/w98w/src/lib/colors';
import { MenuService } from 'projects/w98w/src/lib/menu/menu.service';

@Component({
  selector: 'app-menu-test',
  templateUrl: './menu-test.component.html',
  styleUrls: ['./menu-test.component.css'],
  providers: [MenuService]
})
export class MenuTestComponent implements OnInit {

  readonly desktopColor = Colors.DESKTOP;

  constructor(public menuService: MenuService) { }

  ngOnInit(): void {
  }

}
