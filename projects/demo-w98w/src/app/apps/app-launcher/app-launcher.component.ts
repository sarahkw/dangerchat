import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ScreenComponent } from 'projects/w98w/src/lib/screen/screen.component';

@Component({
  selector: 'app-app-launcher',
  templateUrl: './app-launcher.component.html',
  styleUrls: ['./app-launcher.component.scss']
})
export class AppLauncherComponent implements OnInit {

  @Input() screen!: ScreenComponent;

  @ViewChild('appLauncherMain', {static: true}) wndAppLauncherMain!: TemplateRef<unknown>;

  @ViewChild('appHelloMain', {static: true}) wndAppHelloMain!: TemplateRef<unknown>;

  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      this.screen.contentParent.viewContainer.createEmbeddedView(this.wndAppLauncherMain);
    }, 500);
  }

  launchHello() {
    this.screen.contentParent.viewContainer.createEmbeddedView(this.wndAppHelloMain);
  }

}
