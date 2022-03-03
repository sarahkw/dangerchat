import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pixel-alignment',
  templateUrl: './pixel-alignment.component.html',
  styleUrls: ['./pixel-alignment.component.css']
})
export class PixelAlignmentComponent implements OnInit {

  csswidth = 90;
  cssheight = 100;
  canvaswidth = 90;
  canvasheight = 100;
  pixelsize = 1;
  altcount = 50;

  drawTargetStyle = {};

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit(): void {

    let oCanvas = document.createElement('canvas');
    oCanvas.width = this.canvaswidth;
    oCanvas.height = this.canvasheight;
    let oCtx = oCanvas.getContext('2d')!;

    const colors = ['black', '#808080'];
    let pos = this.canvasheight;
    for (let i = 0; i < this.altcount; ++i) {
      pos -= this.pixelsize;
      oCtx.fillStyle = colors[i % colors.length];
      oCtx.fillRect(0, pos, oCanvas.width, this.pixelsize);
    }

    this.drawTargetStyle = {
      'background-image': `url(${oCanvas.toDataURL()})`,
      'background-size': `${this.csswidth}px ${this.cssheight}px`
    };

  }

}
