import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pixel-alignment',
  templateUrl: './pixel-alignment.component.html',
  styleUrls: ['./pixel-alignment.component.css']
})
export class PixelAlignmentComponent implements OnInit {

  directions = ["top", "bottom", "left", "right"];

  direction = this.directions[0];
  csswidth = 90;
  cssheight = 90;
  canvaswidth = 90;
  canvasheight = 90;
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
    let pos = 0;

    switch (this.direction) {
      case "top":
      case "left":
        pos = 0;
        break;
      case "bottom":
        pos = this.canvasheight;
        break;
      case "right":
        pos = this.canvaswidth;
        break;
    }

    for (let i = 0; i < this.altcount; ++i) {
      oCtx.fillStyle = colors[i % colors.length];

      switch (this.direction) {
        case "top":
          oCtx.fillRect(0, pos, oCanvas.width, this.pixelsize);
          pos += this.pixelsize;
          break;
        case "left":
          oCtx.fillRect(pos, 0, this.pixelsize, oCanvas.height);
          pos += this.pixelsize;
          break;
        case "bottom":
          pos -= this.pixelsize;
          oCtx.fillRect(0, pos, oCanvas.width, this.pixelsize);
          break;
        case "right":
          pos -= this.pixelsize;
          oCtx.fillRect(pos, 0, this.pixelsize, oCanvas.height);
          break;
      }
    }

    this.drawTargetStyle = {
      'background-image': `url(${oCanvas.toDataURL()})`,
      'background-size': `${this.csswidth}px ${this.cssheight}px`,
      'background-position': `${this.direction} center`
    };

  }

  onAutoAssignCssWidth() {
    this.csswidth = Math.round(this.canvaswidth / window.devicePixelRatio);
  }

  onAutoAssignCssHeight() {
    this.cssheight = Math.round(this.canvasheight / window.devicePixelRatio);
  }

  rawAutoCssWidthPreview() {
    // xxx: depend on someone else to subscribe to changes
    return this.canvaswidth / window.devicePixelRatio;
  }

  rawAutoCssHeightPreview() {
    // xxx: depend on someone else to subscribe to changes
    return this.canvasheight / window.devicePixelRatio;
  }

  onAutoAssignCanvasWidth() {
    this.canvaswidth = this.pixelsize * this.altcount;
  }

  onAutoAssignCanvasHeight() {
    this.canvasheight = this.pixelsize * this.altcount;
  }


}
