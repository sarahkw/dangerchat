import { Component } from '@angular/core';
import { PopupService } from '../popup.service';

@Component({
  selector: 'w98w-popup-host',
  templateUrl: './popup-host.component.html',
  styleUrls: ['./popup-host.component.scss']
})
export class PopupHostComponent {

  constructor(public popupService: PopupService) { }

}
