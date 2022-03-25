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
import { MenuHostComponent } from './menu/menu-host/menu-host.component';
import { MenuTemplateDirective } from './menu/menu-template.directive';
import { SlidingScreenComponent } from './ss/sliding-screen/sliding-screen.component';
import { SlidingScreenMainContentDirective } from './ss/sliding-screen-main-content.directive';



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
    MsgboxComponent,
    MenuHostComponent,
    MenuTemplateDirective,
    SlidingScreenComponent,
    SlidingScreenMainContentDirective
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
    MsgboxComponent,
    MenuHostComponent,
    MenuTemplateDirective,
    SlidingScreenComponent,
    SlidingScreenMainContentDirective
  ]
})
export class W98wModule { }
