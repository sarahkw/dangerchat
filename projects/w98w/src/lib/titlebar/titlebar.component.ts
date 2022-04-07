import { Component, Input, OnInit } from '@angular/core';
import { Colors } from '../colors';
import { GenImg } from '../genimg';
import { W98wStyles } from '../w98w-styles';
import { WButtonComponent } from '../wbutton/wbutton.component';

@Component({
  selector: 'w98w-titlebar',
  templateUrl: './titlebar.component.html',
  styleUrls: ['./titlebar.component.css']
})
export class TitlebarComponent implements OnInit {

  readonly COLORS = Colors;
  readonly STYLES = W98wStyles;
  readonly GENIMG = GenImg;

  @Input() iconSrc!: string;

  btnExternalFocus = true;
  btnWidth: number = W98wStyles.titleBarBtnWidth;
  btnHeight: number = W98wStyles.titleBarBtnHeight;
  btnImgWidth!: number;
  btnImgHeight: number = (() => {
    const wh = WButtonComponent.calculateAvailableBodySize(this.btnWidth, this.btnHeight, this.btnExternalFocus);
    this.btnImgWidth = wh.width;
    return wh.height;
  })();

  constructor() { }

  ngOnInit(): void {
    if (!this.iconSrc) {
      throw new Error('no icon not supported');
    }
  }

}
