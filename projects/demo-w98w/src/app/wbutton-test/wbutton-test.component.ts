import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-wbutton-test',
  templateUrl: './wbutton-test.component.html',
  styleUrls: ['./wbutton-test.component.css']
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

  constructor() { }

  ngOnInit(): void {
  }

}
