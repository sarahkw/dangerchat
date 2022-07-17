import { Component, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-app-launcher',
  templateUrl: './app-launcher.component.html',
  styleUrls: ['./app-launcher.component.scss']
})
export class AppLauncherComponent implements OnInit {

  @ViewChild('appLauncherMain', {static: true}) wndAppLauncherMain!: TemplateRef<unknown>;

  @ViewChild('appHelloMain', {static: true}) wndAppHelloMain!: TemplateRef<unknown>;

  readonly demo_text = "!";
  count = 1;

  constructor(private viewContainerRef: ViewContainerRef) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.viewContainerRef.createEmbeddedView(this.wndAppLauncherMain);
    }, 500);
  }

  launchHello() {
    // https://stackoverflow.com/a/42421087
    this.viewContainerRef.createEmbeddedView(this.wndAppHelloMain, {data: this.count++});
  }

}
