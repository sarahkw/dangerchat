import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ScreenComponent } from 'projects/w98w/src/lib/screen/screen.component';
import { HelloAppComponent } from '../hello-app/hello-app.component';

@Component({
  selector: 'app-app-launcher',
  templateUrl: './app-launcher.component.html',
  styleUrls: ['./app-launcher.component.scss']
})
export class AppLauncherComponent implements OnInit {

  @Input() screen!: ScreenComponent;

  @ViewChild('overflowWndTemp', {static: true}) wnd!: TemplateRef<unknown>;

  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      this.screen.contentParent.viewContainer.createEmbeddedView(this.wnd);
    }, 500);
  }

  launchHello() {
    const helloComponent = this.screen.contentParent.viewContainer.createComponent(HelloAppComponent);
    helloComponent.instance.screen = this.screen;
    this.screen.contentParent.viewContainer.createEmbeddedView(helloComponent.instance.wnd);
  }

}
