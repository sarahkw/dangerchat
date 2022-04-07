import { Component, Input, OnInit } from '@angular/core';
import { Colors } from '../colors';
import { GenImg } from '../genimg';
import { W98wStyles } from '../w98w-styles';
import { WButtonComponent } from '../wbutton/wbutton.component';

@Component({
  selector: 'w98w-titlebar',
  templateUrl: './titlebar.component.html',
  styleUrls: ['./titlebar.component.scss']
})
export class TitlebarComponent implements OnInit {

  readonly COLORS = Colors;
  readonly STYLES = W98wStyles;
  readonly GENIMG = GenImg;

  @Input() iconSrc!: string;

  btnExternalFocus = true;
  btnHeight: number = W98wStyles.titleBarBtnHeight;
  btnImgHeight: number = WButtonComponent.calculateAvailableBodySize(null, this.btnHeight, this.btnExternalFocus).height;

  constructor() { }

  ngOnInit(): void {
    if (!this.iconSrc) {
      throw new Error('no icon not supported');
    }
  }

}
