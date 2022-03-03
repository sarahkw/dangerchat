import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';

import { W98wModule } from 'projects/w98w/src/public-api';
import { PixelAlignmentComponent } from './pixel-alignment/pixel-alignment.component';

@NgModule({
  declarations: [
    AppComponent,
    PixelAlignmentComponent
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
