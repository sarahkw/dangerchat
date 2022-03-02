import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { W98wComponent } from './w98w.component';
import { ButtonComponent } from './button/button.component';
import { Bevel8SplitComponent } from './bevel-8split/bevel-8split.component';



@NgModule({
  declarations: [
    W98wComponent,
    ButtonComponent,
    Bevel8SplitComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    W98wComponent,
    ButtonComponent
  ]
})
export class W98wModule { }
