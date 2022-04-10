import { Component, OnInit } from '@angular/core';
import { GenImg } from 'projects/w98w/src/lib/genimg';

@Component({
  selector: 'app-wbutton-test',
  templateUrl: './wbutton-test.component.html',
  styleUrls: ['./wbutton-test.component.scss']
})
export class WButtonTestComponent implements OnInit {

  readonly longText =
`oh when the saints go marching in oh when the saints go marching in
oh lord i want to be in that number
when the saints go marching in

oh when the drums begin to bang oh when the drums begin to bang
oh lord i want to be in that number
when the saints go marching in
`;

  readonly GENIMG = GenImg;

  whichDisabled = 0;

  constructor() { }

  ngOnInit(): void {
  }

}
