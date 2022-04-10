import { Component, OnInit } from '@angular/core';
import { PopupService } from '../popup/popup.service';

@Component({
  selector: 'w98w-msgbox',
  templateUrl: './msgbox.component.html',
  styleUrls: ['./msgbox.component.scss']
})
export class MsgboxComponent implements OnInit {

  constructor(public popupService: PopupService) { }

  ngOnInit(): void {
  }

}
