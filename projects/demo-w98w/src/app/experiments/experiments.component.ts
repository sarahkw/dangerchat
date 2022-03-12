import { Component, OnInit } from '@angular/core';
import { GenImg } from 'projects/w98w/src/lib/genimg';

@Component({
  selector: 'app-experiments',
  templateUrl: './experiments.component.html',
  styleUrls: ['./experiments.component.css']
})
export class ExperimentsComponent implements OnInit {

  readonly genImgOnButton = GenImg.TBAR_X;

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
