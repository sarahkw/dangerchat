import { Component, OnInit } from '@angular/core';
import { Colors } from 'projects/w98w/src/lib/colors';
import { MenuService } from 'projects/w98w/src/lib/menu/menu.service';
import { PopupService } from 'projects/w98w/src/lib/popup/popup.service';
import { W98wStyles } from 'projects/w98w/src/lib/w98w-styles';

@Component({
  selector: 'app-popup-test',
  templateUrl: './popup-test.component.html',
  styleUrls: ['./popup-test.component.css'],
  providers: [PopupService, MenuService]
})
export class PopupTestComponent implements OnInit {

  readonly titleBarColor = Colors.TITLEBAR_ACTIVE;
  readonly titleBarHeight = W98wStyles.titleBarHeight;
  readonly desktopColor = Colors.DESKTOP;

  constructor(
    public popupService: PopupService,
    public menuService: MenuService) { }

  ngOnInit(): void {
  }

}
