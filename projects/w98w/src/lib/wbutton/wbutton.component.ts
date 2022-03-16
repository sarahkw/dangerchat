import { Component, ContentChild, Directive, ElementRef, Host, HostBinding, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Bevels } from '../bevel';
import { GenCssInput, genGenCssInput, Bevel8SplitComponent } from '../bevel-8split/bevel-8split.component';
import { Colors } from '../colors';
import { PixelImageBuilderFactory } from '../pixel-image-builder';
import { PixelImageDrawer } from '../pixel-image-drawer';
import { PixelImageService } from '../pixel-image.service';
import { StyleInjector } from '../style-injector';
import { W98wStyles } from '../w98w-styles';

@Directive({
  selector: '[wbuttonBody]'
})
export class WButtonBodyDirective implements OnInit {

  @Input() stretchImg: boolean = false;
  @Input() allowShrinking: boolean = false;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2) {}

  ngOnInit(): void {
    // keep this for horizontal centering, do it this way because we
    // easily cancel it by adding a sibling. if we use justify-content
    // instead, then we have to disable them when we add a sibling.
    this.renderer.setStyle(this.elementRef.nativeElement, 'margin', 'auto');

    if (!this.allowShrinking) {
      // needed for divs to not get squashed in order to show the second child. imgs do this themselves.

      // but don't do this for text because those can overflow block-wards.
      this.renderer.setStyle(this.elementRef.nativeElement, 'flexShrink', '0');
    }

    if (this.stretchImg) {
      // can't expand horizontally using `align-self: stretch` so this is our only option to stretch the image.
      this.renderer.setStyle(this.elementRef.nativeElement, 'height', '100%');
    }
  }
}

@Component({
  selector: 'a[w98w-wbutton]',
  templateUrl: './wbutton.component.html',
  styleUrls: ['./wbutton.component.css']
})
export class WButtonComponent implements OnInit, OnDestroy {

  @Input() extraLabel: string | undefined;

  readonly focusAntsOffset =
    Math.max(Bevels.BUTTON.getPadding(), Bevels.BUTTON_PRESSED.getPadding()) +
    1 /* not flush against the bevels */;

  readonly contentOffset =
    this.focusAntsOffset +
    1 /* the focus ants */ +
    1 /* not flush against the ants */;

  @HostBinding('class') hbC = 'w98w-wbutton';
  @HostBinding('tabindex') hbTabindex = 0;
  @HostBinding('role') hbRole = 'button';  // TODO this doesn't work!
  @HostBinding('style.fontFamily') hbSFF = W98wStyles.defaultFont;
  @HostBinding('style.fontSize') hbSFS = `${W98wStyles.labelFontSize}px`;
  @HostBinding('style.backgroundColor') hbSBC = Colors.WIDGET_BG;
  @HostBinding('style.color') hbSC = Colors.WIDGET_TEXT;
  @HostBinding('style.padding') hbSP = `${this.contentOffset}px`;

  @ContentChild(WButtonBodyDirective) buttonBody: WButtonBodyDirective | undefined;

  constructor(private imgService: PixelImageService) {}

  ngOnInit(): void {
    this.imgService.pidRegister(WButtonComponent.PID_NORMAL);
    this.imgService.pidRegister(WButtonComponent.PID_PRESSED);
  }

  ngOnDestroy(): void {
    this.imgService.pidUnregister(WButtonComponent.PID_PRESSED);
    this.imgService.pidUnregister(WButtonComponent.PID_NORMAL);
  }

  //#region PIDs

  static readonly PID_NORMAL = new class implements PixelImageDrawer {
    private styleInjector = new StyleInjector();

    pidGenerateImages(pibf: PixelImageBuilderFactory): GenCssInput {
      return genGenCssInput(ri => Bevels.BUTTON.genImage(ri, pibf));
    }

    pidApplyImages(imgs: GenCssInput): void {
      this.styleInjector.replaceStyle(Bevel8SplitComponent.genCss(".w98w-wbutton", imgs));
    }

    pidDestroy(): void {
      this.styleInjector.destroy();
    }
  };  // PID_NORMAL

  static readonly PID_PRESSED = new class implements PixelImageDrawer {
    private styleInjector = new StyleInjector();

    pidGenerateImages(pibf: PixelImageBuilderFactory): GenCssInput {
      return genGenCssInput(ri => Bevels.BUTTON_PRESSED.genImage(ri, pibf));
    }

    pidApplyImages(imgs: GenCssInput): void {
      this.styleInjector.replaceStyle(Bevel8SplitComponent.genCss(".w98w-wbutton:active", imgs));
    }

    pidDestroy(): void {
      this.styleInjector.destroy();
    }
  };  // PID_PRESSED

  //#endregion

}
