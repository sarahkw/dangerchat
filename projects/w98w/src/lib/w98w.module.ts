import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { W98wComponent } from './w98w.component';
import { Bevel8SplitComponent } from './bevel-8split/bevel-8split.component';
import { PixelImageComponent } from './pixel-image/pixel-image.component';
import { TitlebarComponent } from './titlebar/titlebar.component';
import { WButtonBodyDirective, WButtonComponent } from './wbutton/wbutton.component';
import { ScreenComponent } from './screen/screen.component';
import { MenuComponent } from './menu/menu.component';
import { MenuItemComponent } from './menu-item/menu-item.component';
import { MenuBarComponent } from './menu-bar/menu-bar.component';
import { MenuBarItemComponent } from './menu-bar-item/menu-bar-item.component';
import { PopupHostComponent } from './popup/popup-host/popup-host.component';
import { MsgboxComponent } from './msgbox/msgbox.component';



@NgModule({
  declarations: [
    W98wComponent,
    Bevel8SplitComponent,
    PixelImageComponent,
    TitlebarComponent,
    WButtonComponent,
    WButtonBodyDirective,
    ScreenComponent,
    MenuComponent,
    MenuItemComponent,
    MenuBarComponent,
    MenuBarItemComponent,
    PopupHostComponent,
    MsgboxComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    W98wComponent,
    PixelImageComponent,
    TitlebarComponent,
    WButtonComponent,
    WButtonBodyDirective,
    ScreenComponent,
    MenuComponent,
    MenuItemComponent,
    MenuBarComponent,
    MenuBarItemComponent,
    PopupHostComponent,
    MsgboxComponent
  ]
})
export class W98wModule { }
