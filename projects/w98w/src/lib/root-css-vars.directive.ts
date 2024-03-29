import { Directive, ElementRef, Renderer2, RendererStyleFlags2 } from '@angular/core';
import { Colors } from './colors';

//#region From Angular

const CAMEL_CASE_REGEXP = /([A-Z])/g;

function camelCaseToDashCase(input: string): string {
  return input.replace(CAMEL_CASE_REGEXP, (...m: string[]) => '-' + m[1].toLowerCase());
}

//#endregion

type Descriptor = {
  readonly _getter: () => unknown,

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

    // placeholder values, they'll be populated very soon
    _styleName: undefined as any, // eslint-disable-line
    var: undefined as any // eslint-disable-line
  }
}

export const ROOTVARS = {
  colorDesktop: WRAP(() => Colors.DESKTOP),
  // TODO make a fn called lighter(), darker()
  colorDesktopDebug: WRAP('#0e8585'),  // Like desktop, but if placed onto a desktop you'd be able to slightly see the difference

  colorText: WRAP(() => Colors.WIDGET_TEXT),
  colorTextDisabled: WRAP(() => Colors.WIDGET_TEXT_DISABLED),

  labelFontSize: WRAP(() => `${Colors.labelFontSize}px`),
  labelFontFamily: WRAP(() => Colors.defaultFont),
  widgetBackgroundColor: WRAP(() => Colors.WIDGET_BG),

  titleBarActiveColor: WRAP(() => Colors.TITLEBAR_ACTIVE),
  titleBarInactiveColor: WRAP(() => Colors.TITLEBAR_INACTIVE),
  titleBarTextColor: WRAP(() => Colors.TITLEBAR_TEXT),

  moveResizeHitAreaWidth: WRAP('50px'),
  moveResizeHitAreaHeight: WRAP('50px'),

  windowMinWidth: WRAP('200px'),
  windowMinHeight: WRAP('100px')
};

(function (generateDirectAccessOutput: boolean) {
  const accumulate = generateDirectAccessOutput ? <string[]>[] : undefined;

  Object.entries(ROOTVARS).forEach(([k, v]) => {
    const styleName = `--w98w-root-${camelCaseToDashCase(k)}`;
    (v as any)._styleName = styleName; // eslint-disable-line
    (v as any).var = `var(${styleName})`; // eslint-disable-line
    accumulate?.push(v.var);
  });

  accumulate && console.debug(accumulate.join("\n"));
})(false);

// ROOT CSS VARS DIRECT ACCESS
//
// Keep the following list updated.
//
// DIRTY FLAG: Set to YES if you've edited the dict without updating below. Tsk tsk.
//
//             NO

/*
var(--w98w-root-color-desktop)
var(--w98w-root-color-desktop-debug)
var(--w98w-root-color-text)
var(--w98w-root-color-text-disabled)
var(--w98w-root-label-font-size)
var(--w98w-root-label-font-family)
var(--w98w-root-widget-background-color)
var(--w98w-root-title-bar-active-color)
var(--w98w-root-title-bar-inactive-color)
var(--w98w-root-title-bar-text-color)
var(--w98w-root-move-resize-hit-area-width)
var(--w98w-root-move-resize-hit-area-height)
var(--w98w-root-window-min-width)
var(--w98w-root-window-min-height)
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
