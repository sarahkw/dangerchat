import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'w98w-window',
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.css']
})
export class WindowComponent implements OnInit {

  @Input() windowTitle!: string;

  constructor() { }

  ngOnInit(): void {
  }

}
