import { Component, OnInit } from '@angular/core';
import { GenImg } from 'projects/w98w/src/lib/genimg';
import { W98wStyles } from 'projects/w98w/src/lib/w98w-styles';
import { WButtonComponent } from 'projects/w98w/src/lib/wbutton/wbutton.component';

@Component({
  selector: 'app-titlebar-test',
  templateUrl: './titlebar-test.component.html',
  styleUrls: ['./titlebar-test.component.css']
})
export class TitlebarTestComponent implements OnInit {

  readonly GENIMG = GenImg;

  /* these are copied and pasted, good for now i guess */
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
  }
}
