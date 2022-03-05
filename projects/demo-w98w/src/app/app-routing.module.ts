import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DprFractionsComponent } from './dpr-fractions/dpr-fractions.component';
import { PixelAlignmentComponent } from './pixel-alignment/pixel-alignment.component';

const routes: Routes = [
  { path: 'pixel-alignment', component: PixelAlignmentComponent },
  { path: 'dpr-fractions', component: DprFractionsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
