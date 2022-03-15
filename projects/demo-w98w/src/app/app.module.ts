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

@NgModule({
  declarations: [
    AppComponent,
    PixelAlignmentComponent,
    DprComponent,
    ButtonDemoComponent,
    GenImgSizeDemoComponent,
    WButtonTestComponent
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
