import { Component, ComponentRef, EmbeddedViewRef, NgModuleRef, OnInit, TemplateRef, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { MenuTemplateDirective } from 'projects/w98w/src/lib/menu/menu-template.directive';
import { WindowCloserContext, WindowCloserRequestor } from 'projects/w98w/src/lib/window/window.component';
import { Observable, Unsubscribable } from 'rxjs';
import { NotepadComponent } from '../notepad/main/notepad.component';

class LaunchedWindowCloser<T> implements WindowCloserContext {
  launchGenericSubscription<T extends WindowCloserRequestor>(c: Type<T>): Observable<null> {
    throw new Error('Method not implemented.');
  }
  launch<T>(): void {
    throw new Error('Method not implemented.');
  }
  viewRef?: EmbeddedViewRef<unknown>;
  componentRef?: ComponentRef<T>;

  destroy(): void {
    this.viewRef?.destroy();
    this.componentRef?.destroy();
  }

  _destroy(): void {
    // no-op: this is deprecated
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

  launchNotepad() {
    this.launchGeneric(NotepadComponent);
  }

  launchGeneric<T extends WindowCloserRequestor>(c: Type<T>) {
    const thiz = this;
    const cref = this.viewContainerRef.createComponent<T>(c, {ngModuleRef: this.ngModuleRef});
    cref.instance.windowCloser = new class implements WindowCloserContext {
      destroy(): void {
        cref.destroy();
      }
      launch<T>(c: Type<T>): void {
        thiz.launchGeneric(c);
      }
      launchGenericSubscription<T extends WindowCloserRequestor>(c: Type<T>): Observable<null> {
        return thiz.launchGenericSubscription(c);
      }
      _destroy() {
        // no-op: source isn't listening
      }
    };
  }

  launchGenericSubscription<T extends WindowCloserRequestor>(c: Type<T>): Observable<null> {
    const thiz = this;

    return new Observable(subscriber => {
      const cref = thiz.viewContainerRef.createComponent<T>(c, {ngModuleRef: thiz.ngModuleRef});

      cref.instance.windowCloser = new class implements WindowCloserContext {
        destroy(): void {
          cref.destroy();
        }
        launch<T>(c: Type<T>): void {
          thiz.launchGeneric(c);
        }
        launchGenericSubscription<T extends WindowCloserRequestor>(c: Type<T>): Observable<null> {
          return thiz.launchGenericSubscription(c);
        }
        _destroy() {
          subscriber.complete();
        }
      };

      return new class implements Unsubscribable {
        unsubscribe(): void {
          cref.destroy();
        }
      };
    });
  }
}
