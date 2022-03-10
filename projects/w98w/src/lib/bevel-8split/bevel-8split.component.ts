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

export function genGenCssInput(fn: (ri: RectImage) => DisplayImage): GenCssInput {
  const ret: any = {};
  SELECTORS.forEach(s => ret[s] = fn(s) );
  return ret as GenCssInput;
}

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

const PROVIDE_CONTAINER_W = [
    true,
    true,
    false,
    false,
    true,
    true,
    true,
    true,
];

const PROVIDE_CONTAINER_H = [
    false,
    false,
    true,
    true,
    true,
    true,
    true,
    true,
];

@Component({
  selector: 'w98w-bevel-8split',
  templateUrl: './bevel-8split.component.html',
  styleUrls: ['./bevel-8split.component.css']
})
export class Bevel8SplitComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  static genCss(prefix: string, input: GenCssInput) {
    return SELECTORS.map((s, i) => {
      const w = PROVIDE_CONTAINER_W[i] ? `width: ${input[s].cssRequestedWidthCautious}px; ` : '';
      const h = PROVIDE_CONTAINER_H[i] ? `height: ${input[s].cssRequestedHeightCautious}px; ` : '';

      return `${prefix} ${CLASSES[i]} { background-image: url('${input[s].url}'); background-size: ${input[s].cssNextStepWidth}px ${input[s].cssNextStepHeight}px; ${w}${h} }`;
    }).join("\n");
  }

}
