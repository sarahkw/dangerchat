import { Component, OnInit } from '@angular/core';
import { MenuService } from 'projects/w98w/src/lib/menu/menu.service';
import { PopupService } from 'projects/w98w/src/lib/popup/popup.service';

@Component({
  selector: 'app-popup-test',
  templateUrl: './popup-test.component.html',
  styleUrls: ['./popup-test.component.css'],
  providers: [PopupService, MenuService]
})
export class PopupTestComponent implements OnInit {

  constructor(
    public popupService: PopupService,
    public menuService: MenuService) { }

  ngOnInit(): void {
  }

}
