import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ButtonDemoComponent } from './button-demo/button-demo.component';
import { DprComponent } from './dpr/dpr.component';
import { GenImgSizeDemoComponent } from './gen-img-size-demo/gen-img-size-demo.component';
import { PixelAlignmentComponent } from './pixel-alignment/pixel-alignment.component';
import { TitlebarTestComponent } from './titlebar-test/titlebar-test.component';
import { WButtonTestComponent } from './wbutton-test/wbutton-test.component';

const routes: Routes = [
  { path: 'pixel-alignment', component: PixelAlignmentComponent },
  { path: 'dpr', component: DprComponent },
  { path: 'button', component: ButtonDemoComponent },
  { path: 'gen-img-size', component: GenImgSizeDemoComponent },
  { path: 'wbutton-test', component: WButtonTestComponent },
  { path: 'titlebar-test', component: TitlebarTestComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
