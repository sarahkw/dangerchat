import { Component, Directive, Input, OnDestroy, OnInit, Renderer2, TemplateRef, ViewContainerRef } from '@angular/core';
import { Bevels } from '../bevel';
import { GenCssInput, genGenCssInput, Bevel8SplitComponent } from '../bevel-8split/bevel-8split.component';
import { Colors } from '../colors';
import { PixelImageBuilderFactory } from '../pixel-image-builder';
import { PixelImageDrawer } from '../pixel-image-drawer';
import { PixelImageService } from '../pixel-image.service';
import { StyleInjector } from '../style-injector';
import { W98wStyles } from '../w98w-styles';

@Directive({
  selector: '[wbuttonContent]'
})
export class WButtonContentDirective implements OnInit {

  // Ignored, but we must put something here because of the microsyntax.
  // Is a hack, but maybe Angular will support doing this in a non-hacky way someday.
  @Input() wbuttonContent!: any;

  @Input() wbuttonContentStretchImg: boolean = false;

  constructor(
      private templateRef: TemplateRef<any>,
      private viewContainer: ViewContainerRef,
      private renderer: Renderer2) {
  }

  ngOnInit(): void {
    let [elem] = this.viewContainer.createEmbeddedView(this.templateRef).rootNodes;

    // keep this for horizontal centering, do it this way because we
    // easily cancel it by adding a sibling. if we use justify-content
    // instead, then we have to disable them when we add a sibling.
    this.renderer.setStyle(elem, 'margin', 'auto');
    // needed for divs to not get squashed in order to show the second child. imgs do this themselves.
    this.renderer.setStyle(elem, 'flexShrink', '0');

    if (this.wbuttonContentStretchImg) {
      // can't expand horizontally using `align-self: stretch` so this is our only option to stretch the image.
      this.renderer.setStyle(elem, 'height', '100%');
    }
  }
}

@Directive({
  selector: '[wbuttonLabel]'
})
export class WButtonLabelDirective {
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private renderer: Renderer2) {
  }

  ngOnInit(): void {
    let [elem] = this.viewContainer.createEmbeddedView(this.templateRef).rootNodes;

    this.renderer.setStyle(elem, 'flex', 1);
    this.renderer.setStyle(elem, 'whiteSpace', 'nowrap');
    this.renderer.setStyle(elem, 'textOverflow', 'ellipsis');
    this.renderer.setStyle(elem, 'overflow', 'hidden');
  }
}

@Component({
  selector: 'w98w-wbutton',
  templateUrl: './wbutton.component.html',
  styleUrls: ['./wbutton.component.css']
})
export class WButtonComponent implements OnInit, OnDestroy {

  @Input() width: number | undefined;
  @Input() height: number | undefined;

  // Exports to template
  readonly STYLES = W98wStyles;
  readonly COLORS = Colors;

  readonly focusAntsOffset =
    Math.max(Bevels.BUTTON.getPadding(), Bevels.BUTTON_PRESSED.getPadding()) +
    1 /* not flush against the bevels */;

  readonly contentOffset =
    this.focusAntsOffset +
    1 /* the focus ants */ +
    1 /* not flush against the ants */;

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
