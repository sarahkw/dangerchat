import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DprComponent } from './dpr/dpr.component';
import { PixelAlignmentComponent } from './pixel-alignment/pixel-alignment.component';

const routes: Routes = [
  { path: 'pixel-alignment', component: PixelAlignmentComponent },
  { path: 'dpr', component: DprComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
