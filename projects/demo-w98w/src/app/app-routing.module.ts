import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PixelAlignmentComponent } from './pixel-alignment/pixel-alignment.component';

const routes: Routes = [
  { path: 'pixel-alignment', component: PixelAlignmentComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
