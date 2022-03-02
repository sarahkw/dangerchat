import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'w98w-bevel-8split',
  templateUrl: './bevel-8split.component.html',
  styleUrls: ['./bevel-8split.component.css']
})
export class Bevel8SplitComponent implements OnInit {

  @Input() bevelSize: string = "0";

  constructor() { }

  ngOnInit(): void {
  }

}
