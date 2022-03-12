import { Component, Input, OnInit } from '@angular/core';
import { Colors } from '../colors';
import { GenImg } from '../genimg';
import { W98wStyles } from '../w98w-styles';

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

  @Input() debugMode = false;

  constructor() { }

  ngOnInit(): void {
    if (!this.iconSrc) {
      throw new Error('no icon not supported');
    }
  }

}
