import { Component, Input, OnInit } from '@angular/core';
import { RectImage } from '../bevel';
import { DisplayImage } from '../pixel-image-builder';

export type GenCssInput = {
  [RectImage.Left]: DisplayImage,
  [RectImage.Right]: DisplayImage,
  [RectImage.Top]: DisplayImage,
  [RectImage.Bottom]: DisplayImage,
  [RectImage.TL]: DisplayImage,
  [RectImage.TR]: DisplayImage,
  [RectImage.BL]: DisplayImage,
  [RectImage.BR]: DisplayImage,
};

const SELECTORS = [
  RectImage.Left,
  RectImage.Right,
  RectImage.Top,
  RectImage.Bottom,
  RectImage.TL,
  RectImage.TR,
  RectImage.BL,
  RectImage.BR,
];

const CLASSES = [
  ".w98w-bevel-8split-left",
  ".w98w-bevel-8split-right",
  ".w98w-bevel-8split-top",
  ".w98w-bevel-8split-bottom",
  ".w98w-bevel-8split-tl",
  ".w98w-bevel-8split-tr",
  ".w98w-bevel-8split-bl",
  ".w98w-bevel-8split-br",
];

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

  static genCss(prefix: string, input: GenCssInput) {
    return SELECTORS.map((s, i) => {
      return `${prefix} ${CLASSES[i]} { background-image: url('${input[s].url}'); background-size: ${input[s].cssWidth}px ${input[s].cssHeight}px; }`;
    }).join("\n");
  }

}
