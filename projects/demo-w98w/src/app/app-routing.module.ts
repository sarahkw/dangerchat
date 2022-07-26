import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ButtonDemoComponent } from './button-demo/button-demo.component';
import { DemoHomeComponent } from './demo-home/demo-home.component';
import { DprComponent } from './dpr/dpr.component';
import { GenImgSizeDemoComponent } from './gen-img-size-demo/gen-img-size-demo.component';
import { InteractjsTestComponent } from './interactjs-test/interactjs-test.component';
import { DesktopTestComponent } from './desktop-test/desktop-test.component';
import { MenuTestComponent } from './menu-test/menu-test.component';
import { PixelAlignmentComponent } from './pixel-alignment/pixel-alignment.component';
import { PopupTestComponent } from './popup-test/popup-test.component';
import { ScreenTestComponent } from './screen-test/screen-test.component';
import { TitlebarTestComponent } from './titlebar-test/titlebar-test.component';
import { WButtonTestComponent } from './wbutton-test/wbutton-test.component';
import { WindowTestComponent } from './window-test/window-test.component';

const routes: Routes = [
  { path: '', component: DesktopTestComponent },
  {
    path: 'tests',
    component: DemoHomeComponent,
    children: [
      { path: 'pixel-alignment', component: PixelAlignmentComponent },
      { path: 'dpr', component: DprComponent },
      { path: 'button', component: ButtonDemoComponent },
      { path: 'gen-img-size', component: GenImgSizeDemoComponent },
      { path: 'wbutton-test', component: WButtonTestComponent },
      { path: 'titlebar-test', component: TitlebarTestComponent },
      { path: 'screen-test', component: ScreenTestComponent },
      { path: 'menu-test', component: MenuTestComponent },
      { path: 'popup-test', component: PopupTestComponent },
      { path: 'window-test', component: WindowTestComponent },
      { path: 'interactjs-test', component: InteractjsTestComponent },
      { path: 'desktop-test', component: DesktopTestComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
