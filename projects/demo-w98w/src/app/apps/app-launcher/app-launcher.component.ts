import { Component, EmbeddedViewRef, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { MenuTemplateDirective } from 'projects/w98w/src/lib/menu/menu-template.directive';
import { WindowCloserContext } from 'projects/w98w/src/lib/window/window.component';

class LaunchedWindowCloser implements WindowCloserContext {
  viewRef?: EmbeddedViewRef<unknown>;

  destroy(): void {
    this.viewRef?.destroy();
  }
}

@Component({
  selector: 'app-app-launcher',
  templateUrl: './app-launcher.component.html',
  styleUrls: ['./app-launcher.component.scss']
})
export class AppLauncherComponent {

  @ViewChild('menuStart', {static: true}) menuStart!: MenuTemplateDirective;

  @ViewChild('appWhatIsThis', {static: true}) wndAppWhatIsThis!: TemplateRef<unknown>;

  @ViewChild('appLauncherMain', {static: true}) wndAppLauncherMain!: TemplateRef<unknown>;

  @ViewChild('appHelloMain', {static: true}) wndAppHelloMain!: TemplateRef<unknown>;

  readonly demo_text = "!";
  count = 1;

  constructor(private viewContainerRef: ViewContainerRef, public router: Router) { }

  launchWhatIsThis() {
    const lwc = new LaunchedWindowCloser();
    lwc.viewRef = this.viewContainerRef.createEmbeddedView(this.wndAppWhatIsThis, {windowCloser: lwc});
  }

  launchLauncher() {
    const lwc = new LaunchedWindowCloser();
    lwc.viewRef = this.viewContainerRef.createEmbeddedView(this.wndAppLauncherMain, {windowCloser: lwc});
  }

  launchHello() {
    const lwc = new LaunchedWindowCloser();

    // https://stackoverflow.com/a/42421087
    lwc.viewRef = this.viewContainerRef.createEmbeddedView(
      this.wndAppHelloMain,
      {
        data: this.count++,
        windowCloser: lwc
      });
  }

}
