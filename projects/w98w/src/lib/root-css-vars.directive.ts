import { Directive, ElementRef, HostBinding, Renderer2, RendererStyleFlags2 } from '@angular/core';
import { Colors } from './colors';

//#region From Angular

const CAMEL_CASE_REGEXP = /([A-Z])/g;
const DASH_CASE_REGEXP = /-([a-z])/g;

function camelCaseToDashCase(input: string): string {
  return input.replace(CAMEL_CASE_REGEXP, (...m: string[]) => '-' + m[1].toLowerCase());
}

function dashCaseToCamelCase(input: string): string {
  return input.replace(DASH_CASE_REGEXP, (...m: string[]) => m[1].toUpperCase());
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
  };

  private refresh() {
    Object.entries(RootCssVarsDirective.ROOTVARS).forEach(([k, v]) => {
      const styleName = `--w98w-root-${camelCaseToDashCase(k)}`;
      this.renderer.setStyle(this.elementRef.nativeElement, styleName, v._getter(), RendererStyleFlags2.DashCase);
      v.var = `var(${styleName})`;
    });
  }

  constructor(private elementRef: ElementRef<HTMLElement>, private renderer: Renderer2) {
    this.refresh();
  }
}
