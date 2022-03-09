import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ButtonDemoComponent } from './button-demo/button-demo.component';
import { DprComponent } from './dpr/dpr.component';
import { GenImgDemoComponent } from './gen-img-demo/gen-img-demo.component';
import { PixelAlignmentComponent } from './pixel-alignment/pixel-alignment.component';

const routes: Routes = [
  { path: 'pixel-alignment', component: PixelAlignmentComponent },
  { path: 'dpr', component: DprComponent },
  { path: 'button', component: ButtonDemoComponent },
  { path: 'gen-img', component: GenImgDemoComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
