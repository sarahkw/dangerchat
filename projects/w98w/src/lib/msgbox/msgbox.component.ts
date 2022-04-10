import { Component } from '@angular/core';
import { PopupService } from '../popup/popup.service';

@Component({
  selector: 'w98w-msgbox',
  templateUrl: './msgbox.component.html',
  styleUrls: ['./msgbox.component.scss']
})
export class MsgboxComponent {

  constructor(public popupService: PopupService) { }

}
