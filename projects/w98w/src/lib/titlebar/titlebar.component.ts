import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'w98w-titlebar',
  templateUrl: './titlebar.component.html',
  styleUrls: ['./titlebar.component.scss']
})
export class TitlebarComponent implements OnInit {

  @Input() iconSrc!: string;
  @Input() label = "";

  @HostBinding('class') hbClass = "w98w-titlebar";

  constructor() { }

  ngOnInit(): void {
    if (!this.iconSrc) {
      throw new Error('no icon not supported');
    }
  }

}
