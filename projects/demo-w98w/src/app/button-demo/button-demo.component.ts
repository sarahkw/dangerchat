import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-button-demo',
  templateUrl: './button-demo.component.html',
  styleUrls: ['./button-demo.component.css']
})
export class ButtonDemoComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  readonly colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
  colorIdx = 0;
  colorCurrent() {
    return this.colors[this.colorIdx];
  }
  colorClick() {
    this.colorIdx = (this.colorIdx + 1) % this.colors.length;
  }

}
