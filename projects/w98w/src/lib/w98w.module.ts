import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { W98wComponent } from './w98w.component';
import { Bevel8SplitComponent } from './bevel-8split/bevel-8split.component';
import { PixelImageComponent } from './pixel-image/pixel-image.component';
import { TitlebarComponent } from './titlebar/titlebar.component';
import { WButtonBodyDirective, WButtonComponent } from './wbutton/wbutton.component';



@NgModule({
  declarations: [
    W98wComponent,
    Bevel8SplitComponent,
    PixelImageComponent,
    TitlebarComponent,
    WButtonComponent,
    WButtonBodyDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    W98wComponent,
    PixelImageComponent,
    TitlebarComponent,
    WButtonComponent,
    WButtonBodyDirective
  ]
})
export class W98wModule { }
