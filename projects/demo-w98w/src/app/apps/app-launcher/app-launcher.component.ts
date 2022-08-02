import { Component, ComponentRef, EmbeddedViewRef, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { MenuTemplateDirective } from 'projects/w98w/src/lib/menu/menu-template.directive';
import { WindowCloserContext } from 'projects/w98w/src/lib/window/window.component';
import { NotepadComponent } from '../notepad/notepad.component';

class LaunchedWindowCloser<T> implements WindowCloserContext {
  viewRef?: EmbeddedViewRef<unknown>;
  componentRef?: ComponentRef<T>;

  destroy(): void {
    this.viewRef?.destroy();
    this.componentRef?.destroy();
  }
}

@Component({
  selector: 'app-app-launcher',
  templateUrl: './app-launcher.component.html',
  styleUrls: ['./app-launcher.component.scss']
})
export class AppLauncherComponent implements OnInit {

  @ViewChild('menuStart', {static: true}) menuStart!: MenuTemplateDirective;

  @ViewChild('appWhatIsThis', {static: true}) wndAppWhatIsThis!: TemplateRef<unknown>;

  @ViewChild('appMoveResize', {static: true}) wndAppMoveResize!: TemplateRef<unknown>;

  @ViewChild('appLauncherMain', {static: true}) wndAppLauncherMain!: TemplateRef<unknown>;

  @ViewChild('appHelloMain', {static: true}) wndAppHelloMain!: TemplateRef<unknown>;

  @ViewChild('appNotepadFontDialog', {static: true}) wndAppNotepadFontDialog!: TemplateRef<unknown>;


  readonly demo_text = "!";
  count = 1;

  constructor(private viewContainerRef: ViewContainerRef, public router: Router) { }

  ngOnInit(): void {
    // this.launchWhatIsThis();
  }

  launchWhatIsThis() {
    const lwc = new LaunchedWindowCloser();
    lwc.viewRef = this.viewContainerRef.createEmbeddedView(this.wndAppWhatIsThis, {windowCloser: lwc});
  }

  launchMoveResize() {
    const lwc = new LaunchedWindowCloser();
    lwc.viewRef = this.viewContainerRef.createEmbeddedView(this.wndAppMoveResize, {windowCloser: lwc});
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

  launchNotepadFontDialog() {
    const lwc = new LaunchedWindowCloser();
    lwc.viewRef = this.viewContainerRef.createEmbeddedView(this.wndAppNotepadFontDialog, {windowCloser: lwc});
  }

  launchNotepad() {
    const lwc = new LaunchedWindowCloser<NotepadComponent>();
    lwc.componentRef = this.viewContainerRef.createComponent(NotepadComponent);
    lwc.componentRef.instance.windowCloser = lwc;
  }

}
