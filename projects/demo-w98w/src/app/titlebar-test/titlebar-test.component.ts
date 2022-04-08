import { Component, OnInit } from '@angular/core';
import { GenImg } from 'projects/w98w/src/lib/genimg';

@Component({
  selector: 'app-titlebar-test',
  templateUrl: './titlebar-test.component.html',
  styleUrls: ['./titlebar-test.component.css']
})
export class TitlebarTestComponent implements OnInit {

  readonly GENIMG = GenImg;

  btnExternalFocus = true;
  btnImgHeight = 14;

  constructor() { }

  ngOnInit(): void {
  }
}
