import { Component, ComponentRef, EmbeddedViewRef, NgModuleRef, OnInit, TemplateRef, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { MenuTemplateDirective } from 'projects/w98w/src/lib/menu/menu-template.directive';
import { WindowCloserContext } from 'projects/w98w/src/lib/window/window.component';
import { NotepadComponent } from '../notepad/notepad.component';

class LaunchedWindowCloser<T> implements WindowCloserContext {
  launch<T>(): void {
    throw new Error('Method not implemented.');
  }
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

  constructor(private viewContainerRef: ViewContainerRef, public router: Router, private ngModuleRef: NgModuleRef<unknown>) {
  }

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
    this.launchGeneric(NotepadComponent);
  }

  launchGeneric<T>(c: Type<T>) {
    const thiz = this;
    const cref = this.viewContainerRef.createComponent<T>(c, {ngModuleRef: this.ngModuleRef});
    (cref.instance as any).windowCloser = new class implements WindowCloserContext {
      destroy(): void {
        cref.destroy();
      }
      launch<T>(c: Type<T>): void {
        thiz.launchGeneric(c);
      }

    };
  }

}
