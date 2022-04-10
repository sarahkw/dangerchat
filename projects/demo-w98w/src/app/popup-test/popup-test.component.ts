import { Component, OnInit } from '@angular/core';
import { PopupService } from 'projects/w98w/src/lib/popup/popup.service';

@Component({
  selector: 'app-popup-test',
  templateUrl: './popup-test.component.html',
  styleUrls: ['./popup-test.component.scss'],
  providers: [PopupService]
})
export class PopupTestComponent implements OnInit {

  constructor(
    public popupService: PopupService) { }

  ngOnInit(): void {
  }

}
