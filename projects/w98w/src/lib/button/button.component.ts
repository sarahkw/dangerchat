import { Component, OnInit } from '@angular/core';

import { Bevels, RectImage } from '../bevel';
import { BevelImageService } from '../bevel-image.service';
import { Colors } from '../colors';

@Component({
  selector: 'w98w-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
  styles: [`
  button {
    background-color: ${Colors.WIDGET_BG};
    color: ${Colors.WIDGET_TEXT}; /* ipad safari */
  }
  `]
})
export class ButtonComponent implements OnInit {

  constructor(private imgService: BevelImageService) { }

  ngOnInit(): void {

    let style = document.createElement('style');
    style.innerHTML = `
      .w98w-button .w98w-bevel-8split-left { background-image: url('${Bevels.BUTTON.genImage(RectImage.Left, this.imgService)}'); }
      .w98w-button .w98w-bevel-8split-right { background-image: url('${Bevels.BUTTON.genImage(RectImage.Right, this.imgService)}'); }
      .w98w-button .w98w-bevel-8split-top { background-image: url('${Bevels.BUTTON.genImage(RectImage.Top, this.imgService)}'); }
      .w98w-button .w98w-bevel-8split-bottom { background-image: url('${Bevels.BUTTON.genImage(RectImage.Bottom, this.imgService)}'); }

      .w98w-button .w98w-bevel-8split-tl { background-image: url('${Bevels.BUTTON.genImage(RectImage.TL, this.imgService)}'); }
      .w98w-button .w98w-bevel-8split-tr { background-image: url('${Bevels.BUTTON.genImage(RectImage.TR, this.imgService)}'); }
      .w98w-button .w98w-bevel-8split-bl { background-image: url('${Bevels.BUTTON.genImage(RectImage.BL, this.imgService)}'); }
      .w98w-button .w98w-bevel-8split-br { background-image: url('${Bevels.BUTTON.genImage(RectImage.BR, this.imgService)}'); }
    `;
    document.head.appendChild(style);

  }

}
