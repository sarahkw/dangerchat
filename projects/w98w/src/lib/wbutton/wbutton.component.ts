import { Component, ContentChild, Directive, ElementRef, HostBinding, Input, OnDestroy, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { Bevels } from '../bevel';
import { GenCssInput, genGenCssInput, Bevel8SplitComponent } from '../bevel-8split/bevel-8split.component';
import { PixelImageBuilderFactory } from '../pixel-image-builder';
import { PixelImageDrawer } from '../pixel-image-drawer';
import { PixelImageService } from '../pixel-image.service';
import { Pressable } from '../pressable';
import { StyleInjector } from '../style-injector';

@Directive({
  selector: '[wbuttonBody]'
})
export class WButtonBodyDirective implements OnInit {

  @Input() stretchImg = false;
  @Input() emHeightImg = false;
  @Input() allowShrinking = false;
  @Input() showDisabledEffect = true;

  @HostBinding('style') get hbStyleEmHeightImg() {
    if (this.emHeightImg) {
      const val = this.buttonComponent.offsets.emHeightImgTakeBackPadding;
      return {
        height: `calc(1em + ${val}px)`,
        marginTop: `-${val}px`,
        marginBottom: `-${val}px`
      };
    } else {
      return null;
    }
  }

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private buttonComponent: WButtonComponent) {}

  ngOnInit(): void {
    console.assert(!(this.stretchImg && this.emHeightImg));

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

    // needed for ipad safari, or else an <img> would eat the click event
    this.renderer.setStyle(this.elementRef.nativeElement, 'pointer-events', 'none');
  }
}

// yeah the spec says we shouldn't put <div> in button, but google maps does it, so it's
// battle tested. and it seems to work fine. i also think it's too much work to try to
// imitate a button using <a>, if it's even possible.
@Component({
  selector: 'button[w98w-wbutton]',
  templateUrl: './wbutton.component.html',
  styleUrls: ['./wbutton.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WButtonComponent implements OnInit, OnDestroy, Pressable {

  @Input() pressed = false;
  @Input() extraLabel: string | undefined;
  @Input() externalFocus = false;
  @Input() @HostBinding('disabled') disabled = false;

  private static calculateOffsets(externalFocus: boolean) {
    let focusAnts;
    let content;
    let emHeightImgTakeBackPadding;

    if (externalFocus) {
      focusAnts = 0;
      content = Math.max(Bevels.BUTTON.getPadding(), Bevels.BUTTON_PRESSED.getPadding()) +
                   0 /* against the bevels, if you want external focus it's because you want all the space available */;
      emHeightImgTakeBackPadding = 0;
    } else {
      focusAnts = Math.max(Bevels.BUTTON.getPadding(), Bevels.BUTTON_PRESSED.getPadding()) +
                   1 /* not flush against the bevels */;
      content = focusAnts +
                 1 /* the focus ants */ +
                 1 /* not flush against the ants */;
      emHeightImgTakeBackPadding = 3;  // brush up right against the bevels
    }

    return { focusAnts, content, emHeightImgTakeBackPadding };
  }

  get offsets() {
    return WButtonComponent.calculateOffsets(this.externalFocus);
  }

  @HostBinding('class') readonly hbC = 'w98w-wbutton';
  @HostBinding('class.w98w-wbutton-pressed') get hbcPressed() { return this.pressed; }
  @HostBinding('class.w98w-wbutton-normal') get hbcNormal() { return !this.pressed; }
  @HostBinding('class.w98w-wbutton-externalFocus') get hbcExternalFocus() { return this.externalFocus; }

  @HostBinding('class.w98w-disabled') get hbcDisabled() { return this.disabled; }

  @HostBinding('style.padding.px') get hbSP() { return this.offsets.content; }

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

  /*
    |-------------------------------------+-----------------------|
    | selector                            | bevel                 |
    |-------------------------------------+-----------------------|
    | .w98w-wbutton-normal                | Bevels.BUTTON         |
    | .w98w-wbutton-normal:enabled:active | Bevels.BUTTON_PRESSED |
    | .w98w-wbutton-pressed               | Bevels.BUTTON_PRESSED |
    |-------------------------------------+-----------------------|

    don't show button presses when disabled.

   */

  static readonly PID_NORMAL = new class implements PixelImageDrawer<GenCssInput> {
    private styleInjector = new StyleInjector();

    pidGenerateImages(pibf: PixelImageBuilderFactory): GenCssInput {
      return genGenCssInput(ri => Bevels.BUTTON.genImage(ri, pibf));
    }

    pidApplyImages(imgs: GenCssInput): void {
      this.styleInjector.replaceStyle(Bevel8SplitComponent.genCss(".w98w-wbutton-normal", imgs));
    }

    pidDestroy(): void {
      this.styleInjector.destroy();
    }
  };  // PID_NORMAL

  static readonly PID_PRESSED = new class implements PixelImageDrawer<GenCssInput> {
    private styleInjector = new StyleInjector();

    pidGenerateImages(pibf: PixelImageBuilderFactory): GenCssInput {
      return genGenCssInput(ri => Bevels.BUTTON_PRESSED.genImage(ri, pibf));
    }

    pidApplyImages(imgs: GenCssInput): void {
      this.styleInjector.replaceStyle([
          Bevel8SplitComponent.genCss(".w98w-wbutton-normal:enabled:active", imgs),
          Bevel8SplitComponent.genCss(".w98w-wbutton-pressed", imgs)
      ].join("\n"));
    }

    pidDestroy(): void {
      this.styleInjector.destroy();
    }
  };  // PID_PRESSED

  //#endregion

}
