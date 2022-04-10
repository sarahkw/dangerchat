import { Component } from '@angular/core';
import { GenImg } from 'projects/w98w/src/lib/genimg';

@Component({
  selector: 'app-titlebar-test',
  templateUrl: './titlebar-test.component.html',
  styleUrls: ['./titlebar-test.component.scss']
})
export class TitlebarTestComponent {

  readonly GENIMG = GenImg;

  readonly btnExternalFocus = true;
  readonly btnImgHeight = 14;

}
