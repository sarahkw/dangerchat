import { Component, OnInit } from '@angular/core';
import { GenImg } from 'projects/w98w/src/lib/genimg';

@Component({
  selector: 'app-gen-img-demo',
  templateUrl: './gen-img-demo.component.html',
  styleUrls: ['./gen-img-demo.component.css']
})
export class GenImgDemoComponent implements OnInit {

  readonly genImg1 = GenImg.TBAR_X;

  constructor() { }

  ngOnInit(): void {
  }

}
