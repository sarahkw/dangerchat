import { Component, HostBinding, OnInit } from '@angular/core';
import { Colors } from '../colors';
import { W98wStyles } from '../w98w-styles';

@Component({
  selector: 'menu[w98w-menu-bar]',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent implements OnInit {

  @HostBinding('style.--menu-text-font') hbTF = W98wStyles.defaultFont;
  @HostBinding('style.--menu-bg-color') hbMBC = Colors.MENU_BG;

  constructor() { }

  ngOnInit(): void {
  }

}
