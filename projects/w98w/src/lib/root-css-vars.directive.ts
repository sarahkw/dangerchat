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

    /*
      // SHAMEFUL. I TRIED BUT IT'S GOING TO TAKE TOO LONG.

      (let* ((get-region
              (lambda ()
                (save-excursion
                  (let ((tmp-begin nil))
                    (search-forward "{")
                    (setq tmp-begin (point))
                    (backward-char)
                    (forward-sexp)
                    (backward-char)
                    (buffer-substring-no-properties tmp-begin (point))
                    ))))
             (source-str (funcall get-region))
             (new-str
              (with-temp-buffer
                (insert source-str)
                (beginning-of-buffer)
                (keep-lines ":" nil nil t)
                (buffer-string))))

        (insert new-str))
    */

  static readonly ROOTVARS = {
      colorDesktop: WRAP(() => Colors.DESKTOP),

      colorText: WRAP(() => Colors.WIDGET_TEXT),
      colorTextDisabled: WRAP(() => Colors.WIDGET_TEXT_DISABLED)
  };

  /*
  --w98w-root-color-desktop
  --w98w-root-color-text
  --w98w-root-color-text-disabled
  */

  private refresh() {
    let DEV: string[] | undefined;
    Object.entries(RootCssVarsDirective.ROOTVARS).forEach(([k, v]) => {
      const styleName = `--w98w-root-${camelCaseToDashCase(k)}`;
      this.renderer.setStyle(this.elementRef.nativeElement, styleName, v._getter(), RendererStyleFlags2.DashCase);
      v.var = `var(${styleName})`;
      if (DEV) {
        DEV.push(styleName);
      }
    });

    if (DEV) {
      console.debug(DEV.join("\n"));
    }
  }

  constructor(private elementRef: ElementRef<HTMLElement>, private renderer: Renderer2) {
    this.refresh();
  }
}
