import { Component, Input, OnInit } from '@angular/core';
import { Colors } from '../colors';
import { W98wStyles } from '../w98w-styles';

@Component({
  selector: 'w98w-wbutton',
  templateUrl: './wbutton.component.html',
  styleUrls: ['./wbutton.component.css']
})
export class WButtonComponent implements OnInit {

  @Input() width: number | undefined;
  @Input() height: number | undefined;

  // Exports to template
  readonly STYLES = W98wStyles;
  readonly COLORS = Colors;

  constructor() { }

  ngOnInit(): void {
  }

}
