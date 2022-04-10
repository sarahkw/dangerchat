import { Directive, ElementRef, Renderer2, RendererStyleFlags2 } from '@angular/core';
import { Colors } from './colors';

//#region From Angular

const CAMEL_CASE_REGEXP = /([A-Z])/g;

function camelCaseToDashCase(input: string): string {
  return input.replace(CAMEL_CASE_REGEXP, (...m: string[]) => '-' + m[1].toLowerCase());
}

//#endregion

type Descriptor = {
  readonly _getter: () => any,
  readonly _styleName: string,
  readonly var: string
};

function WRAP<T>(value: (() => T) | T): Descriptor {
  let _getter: () => T;
  if (value instanceof Function) {
    _getter = value;
  } else {
    _getter = function () { return value };
  }

  return {
    _getter,
    _styleName: undefined as any,
    var: undefined as any
  }
}

export const ROOTVARS = {
  colorDesktop: WRAP(() => Colors.DESKTOP),
  colorDesktopDebug: WRAP('#0e8585'),  // Like desktop, but if placed onto a desktop you'd be able to slightly see the difference

  colorText: WRAP(() => Colors.WIDGET_TEXT),
  colorTextDisabled: WRAP(() => Colors.WIDGET_TEXT_DISABLED),

  labelFontSize: WRAP(() => `${Colors.labelFontSize}px`),
  labelFontFamily: WRAP(() => Colors.defaultFont),
  widgetBackgroundColor: WRAP(() => Colors.WIDGET_BG),

  titleBarActiveColor: WRAP(() => Colors.TITLEBAR_ACTIVE),
  titleBarTextColor: WRAP(() => Colors.TITLEBAR_TEXT),

  moveResizeHitAreaWidth: WRAP('3em'),
  moveResizeHitAreaHeight: WRAP('3em')
};

(function (alsoGenerateConsoleOutput: boolean) {
  const accumulate = alsoGenerateConsoleOutput ? <string[]>[] : undefined;

  Object.entries(ROOTVARS).forEach(([k, v]) => {
    const styleName = `--w98w-root-${camelCaseToDashCase(k)}`;
    (v as any)._styleName = styleName;
    (v as any).var = `var(${styleName})`;
    accumulate?.push(styleName);
  });

  accumulate && console.debug(accumulate.join("\n"));
})(false);

// ROOT CSS VARS DIRECT ACCESS
//
// Design: keep these updated and don't use these besides in styles.scss
//         read `.var` to use otherwise, so TS can verify
//
// DIRTY FLAG: Set to YES if you've edited the dict without updating below. Tsk tsk.
//
//             NO

/*
--w98w-root-color-desktop
--w98w-root-color-desktop-debug
--w98w-root-color-text
--w98w-root-color-text-disabled
--w98w-root-label-font-size
--w98w-root-label-font-family
--w98w-root-widget-background-color
--w98w-root-title-bar-active-color
--w98w-root-title-bar-text-color
--w98w-root-move-resize-hit-area-width
--w98w-root-move-resize-hit-area-height
*/

@Directive({
  selector: '[w98w-root-css-vars]'
})
export class RootCssVarsDirective {

  private refresh() {
    Object.values(ROOTVARS).forEach(v => {
      this.renderer.setStyle(this.elementRef.nativeElement, v._styleName, v._getter(), RendererStyleFlags2.DashCase);
    });
  }

  constructor(private elementRef: ElementRef<HTMLElement>, private renderer: Renderer2) {
    this.refresh();
  }
}
