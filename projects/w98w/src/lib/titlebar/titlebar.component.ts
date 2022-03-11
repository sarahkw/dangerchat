import { Component, Input, OnInit } from '@angular/core';
import { Colors } from '../colors';
import { W98wStyles } from '../w98w-styles';

@Component({
  selector: 'w98w-titlebar',
  templateUrl: './titlebar.component.html',
  styleUrls: ['./titlebar.component.css']
})
export class TitlebarComponent implements OnInit {

  readonly COLORS = Colors;
  readonly STYLES = W98wStyles;

  @Input() debugMode = false;

  constructor() { }

  ngOnInit(): void {
  }

}
