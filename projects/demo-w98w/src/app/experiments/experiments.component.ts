import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-experiments',
  templateUrl: './experiments.component.html',
  styleUrls: ['./experiments.component.css']
})
export class ExperimentsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  keys: Map<string, string> = new Map();

  putKey(k: string, v: string) {
    this.keys.set(k, v);
  }

  getKey(k: string) {
    return this.keys.get(k) || "";
  }

}
