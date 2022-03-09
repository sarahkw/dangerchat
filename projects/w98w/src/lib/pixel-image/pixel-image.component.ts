import { Component, Input, OnInit } from '@angular/core';
import { GenImgDescriptor } from '../genimg';

@Component({
  selector: 'w98w-pixel-image',
  templateUrl: './pixel-image.component.html',
  styleUrls: ['./pixel-image.component.css']
})
export class PixelImageComponent implements OnInit {

  @Input() genImg!: GenImgDescriptor;

  constructor() { }

  ngOnInit(): void {
  }

}
