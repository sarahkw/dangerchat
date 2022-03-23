import { Component, HostBinding, OnInit } from '@angular/core';
import { Colors } from '../colors';

@Component({
  selector: 'li[w98w-menu-item]',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css']
})
export class MenuItemComponent implements OnInit {

  @HostBinding('style.--menu-sel-text-color') hbSTC = Colors.MENU_SELECTED_TEXT;
  @HostBinding('style.--menu-sel-bg-color') hbSBC = Colors.MENU_SELECTED_BG;

  constructor() { }

  ngOnInit(): void {
  }

}
