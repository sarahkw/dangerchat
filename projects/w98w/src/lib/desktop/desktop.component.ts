import { Component, ElementRef, HostBinding, Input, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable, Unsubscribable } from 'rxjs';
import { Bevels, RectImage } from '../bevel';
import { GenCssInput, genGenCssInput, Bevel8SplitComponent } from '../bevel-8split/bevel-8split.component';
import { PixelImageBuilderFactory } from '../pixel-image-builder';
import { PixelImageDrawer } from '../pixel-image-drawer';
import { PixelImageService } from '../pixel-image.service';
import { StyleInjector } from '../style-injector';
import { WindowComponent } from '../window/window.component';

type Style = {[key: string]: string} | string | null;

class WindowManager {

  windows$ = new BehaviorSubject([] as WindowComponent[]);

  registerFor(window: WindowComponent) {
    return new Observable(_subscriber => {

      // Add the window
      this.windows$.next(this.windows$.value.concat([window]));

      const thiz = this;
      return new class implements Unsubscribable {
        unsubscribe(): void {
          // Remove the window
          thiz.windows$.next(thiz.windows$.value.filter(value => value !== window));
        }
      };
    });
  }

}

@Component({
  selector: 'w98w-desktop',
  templateUrl: './desktop.component.html',
  styleUrls: ['./desktop.component.scss']
})
export class DesktopComponent {

  @Input() slidingScreenStyle: Style = null;
  @Input() slidingScreenMainContentStyle: Style = null;

  readonly RECTIMAGE = RectImage;

  @ViewChild('desktopArea', {static: true}) desktopArea!: ElementRef<HTMLDivElement>;

  windowManager = new WindowManager();

  private currentTopZ = 0;

  windowToTop(currentZIndex: number) {

    if (currentZIndex == 0) {  // unassigned yet
      ++this.currentTopZ;
      return this.currentTopZ;

    } else if (currentZIndex == this.currentTopZ) {
      return currentZIndex;

    } else {
      ++this.currentTopZ;
      return this.currentTopZ;

    }
  }

  windowIsBottom(currentZIndex: number) {
    return currentZIndex !== 0 && this.currentTopZ !== currentZIndex;
  }

  @HostBinding('style.--w98w-dock-padding') get hbsp() {
    return `${Bevels.WINDOW.getPadding()}px`;
  }

  constructor(private imgService: PixelImageService) { }

  ngOnInit(): void {
    this.imgService.pidRegister(DesktopComponent.PID_NORMAL);
  }

  ngOnDestroy(): void {
    this.imgService.pidUnregister(DesktopComponent.PID_NORMAL);
  }

  static readonly PID_NORMAL = new class implements PixelImageDrawer<GenCssInput> {
    private styleInjector = new StyleInjector();

    pidGenerateImages(pibf: PixelImageBuilderFactory): GenCssInput {
      return genGenCssInput(ri => Bevels.WINDOW.genImage(ri, pibf));
    }

    pidApplyImages(imgs: GenCssInput): void {
      this.styleInjector.replaceStyle(Bevel8SplitComponent.genCss(".w98w-desktop-dock", imgs));
    }

    pidDestroy(): void {
      this.styleInjector.destroy();
    }
  };  // PID_NORMAL


}
