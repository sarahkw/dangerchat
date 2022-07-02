import { Component, Input, OnInit } from '@angular/core';

type Style = {[key: string]: string} | string | null;

@Component({
  selector: 'w98w-desktop',
  templateUrl: './desktop.component.html',
  styleUrls: ['./desktop.component.scss']
})
export class DesktopComponent implements OnInit {

  @Input() slidingScreenStyle: Style = null;
  @Input() slidingScreenMainContentStyle: Style = null;

  constructor() { }

  ngOnInit(): void {
  }

}
