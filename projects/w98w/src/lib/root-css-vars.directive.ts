import { Directive, ElementRef, Renderer2, RendererStyleFlags2 } from '@angular/core';
import { Colors } from './colors';
import { W98wStyles } from './w98w-styles';

//#region From Angular

const CAMEL_CASE_REGEXP = /([A-Z])/g;

function camelCaseToDashCase(input: string): string {
  return input.replace(CAMEL_CASE_REGEXP, (...m: string[]) => '-' + m[1].toLowerCase());
}

//#endregion

type Descriptor = {
  _getter: () => void,
  var: string
};

function WRAP(fn: () => void): Descriptor {
  return {
    _getter: fn,
    var: undefined as any
  }
}

@Directive({
  selector: '[w98w-root-css-vars]'
})
export class RootCssVarsDirective {

  static readonly ROOTVARS = {
      colorDesktop: WRAP(() => Colors.DESKTOP),

      colorText: WRAP(() => Colors.WIDGET_TEXT),
      colorTextDisabled: WRAP(() => Colors.WIDGET_TEXT_DISABLED),

      labelFontSize: WRAP(() => `${W98wStyles.labelFontSize}px`),
      labelFontFamily: WRAP(() => W98wStyles.defaultFont),
      widgetBackgroundColor: WRAP(() => Colors.WIDGET_BG),

      titleBarActiveColor: WRAP(() => Colors.TITLEBAR_ACTIVE),
      titleBarTextColor: WRAP(() => Colors.TITLEBAR_TEXT)
  };

  // Design: keep these updated and don't use these besides in styles.scss

  /*
--w98w-root-color-desktop
--w98w-root-color-text
--w98w-root-color-text-disabled
--w98w-root-label-font-size
--w98w-root-label-font-family
--w98w-root-widget-background-color
--w98w-root-title-bar-active-color
--w98w-root-title-bar-text-color
  */

  private refresh() {
    let DEV: string[] | undefined;
    Object.entries(RootCssVarsDirective.ROOTVARS).forEach(([k, v]) => {
      const styleName = `--w98w-root-${camelCaseToDashCase(k)}`;
      this.renderer.setStyle(this.elementRef.nativeElement, styleName, v._getter(), RendererStyleFlags2.DashCase);
      v.var = `var(${styleName})`;
      DEV?.push(styleName);
    });

    DEV && console.debug(DEV.join("\n"));
  }

  constructor(private elementRef: ElementRef<HTMLElement>, private renderer: Renderer2) {
    this.refresh();
  }
}
