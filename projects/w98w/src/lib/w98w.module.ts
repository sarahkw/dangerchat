import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { W98wComponent } from './w98w.component';
import { ButtonComponent, ButtonIconDirective } from './button/button.component';
import { Bevel8SplitComponent } from './bevel-8split/bevel-8split.component';



@NgModule({
  declarations: [
    W98wComponent,
    ButtonComponent,
    Bevel8SplitComponent,
    ButtonIconDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    W98wComponent,
    ButtonComponent,
    ButtonIconDirective
  ]
})
export class W98wModule { }
