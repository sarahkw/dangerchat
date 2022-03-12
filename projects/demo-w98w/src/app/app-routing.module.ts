import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ButtonDemoComponent } from './button-demo/button-demo.component';
import { DprComponent } from './dpr/dpr.component';
import { ExperimentsComponent } from './experiments/experiments.component';
import { GenImgSizeDemoComponent } from './gen-img-size-demo/gen-img-size-demo.component';
import { PixelAlignmentComponent } from './pixel-alignment/pixel-alignment.component';

const routes: Routes = [
  { path: 'pixel-alignment', component: PixelAlignmentComponent },
  { path: 'dpr', component: DprComponent },
  { path: 'button', component: ButtonDemoComponent },
  { path: 'gen-img-size', component: GenImgSizeDemoComponent },
  { path: 'experiments', component: ExperimentsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
