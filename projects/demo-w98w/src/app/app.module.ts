import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';

import { W98wModule } from 'projects/w98w/src/public-api';
import { PixelAlignmentComponent } from './pixel-alignment/pixel-alignment.component';
import { DprComponent } from './dpr/dpr.component';
import { ButtonDemoComponent } from './button-demo/button-demo.component';
import { GenImgSizeDemoComponent } from './gen-img-size-demo/gen-img-size-demo.component';
import { WButtonTestComponent } from './wbutton-test/wbutton-test.component';
import { TitlebarTestComponent } from './titlebar-test/titlebar-test.component';
import { DemoHomeComponent } from './demo-home/demo-home.component';
import { ScreenTestComponent } from './screen-test/screen-test.component';
import { MenuTestComponent } from './menu-test/menu-test.component';
import { PopupTestComponent } from './popup-test/popup-test.component';
import { TestSharedLibComponent } from './test-shared-lib/test-shared-lib.component';
import { WindowTestComponent } from './window-test/window-test.component';
import { InteractjsTestComponent } from './interactjs-test/interactjs-test.component';
import { DesktopTestComponent } from './desktop-test/desktop-test.component';
import { AppLauncherComponent } from './program/app-launcher/app-launcher.component';
import { ProgramNotepadMainComponent } from './program/notepad/notepad-main/notepad-main.component';

@NgModule({
  declarations: [
    AppComponent,
    PixelAlignmentComponent,
    DprComponent,
    ButtonDemoComponent,
    GenImgSizeDemoComponent,
    WButtonTestComponent,
    TitlebarTestComponent,
    DemoHomeComponent,
    ScreenTestComponent,
    MenuTestComponent,
    PopupTestComponent,
    TestSharedLibComponent,
    WindowTestComponent,
    InteractjsTestComponent,
    DesktopTestComponent,
    AppLauncherComponent,
    ProgramNotepadMainComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    W98wModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
