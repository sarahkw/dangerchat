import { Component, Directive, ElementRef, forwardRef, HostBinding, InjectionToken, Input, OnDestroy, ViewChild } from '@angular/core';
import { Bevels } from '../bevel';
import { MenuTemplateDirective } from '../menu/menu-template.directive';
import { Subscription } from 'rxjs';
import { rxInteract } from '../rx/rx-interact';
import { elementRefIsSame } from '../util/element-ref-is-same';

@Directive({ selector: '[w98w-window-title-bar]'})
export class WindowTitleBarDirective {
  @HostBinding('class') readonly hbClass = 'w98w-window-title-bar';

  @HostBinding('style') readonly hbs = {
    gridArea: 'titlebar',
    minWidth: 0
  };
}

@Directive({ selector: '[w98w-window-menu-bar]'})
export class WindowMenuBarDirective {
  @HostBinding('class') readonly hbClass = 'w98w-window-menu-bar';

  @HostBinding('style') readonly hbs = {
    gridArea: 'menubar',
    minWidth: 0
  };
}

export enum MoveResizeMode {
  None = 0,
  Move,
  Resize
}

export interface Floatable {
  set left(value: number | undefined);
  set top(value: number | undefined);
  set width(value: number | undefined);
  set height(value: number | undefined);

  elementRef: ElementRef<HTMLElement>;
};

export const floatableToken = new InjectionToken<Floatable>("Floatable");

@Component({
  selector: 'w98w-window',
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.scss'],
  providers: [{ provide: floatableToken, useExisting: forwardRef(() => WindowComponent) }]
})
export class WindowComponent implements OnDestroy, Floatable {

  @Input() drawFrame = true;  // if maximized this will be false
  @Input() innerGridStyle: unknown = undefined; // TODO slated for removal

  @HostBinding('style.left.px') left: number | undefined;
  @HostBinding('style.top.px') top: number | undefined;
  @HostBinding('style.width.px') width: number | undefined;
  @HostBinding('style.height.px') height: number | undefined;

  @HostBinding('style.--window-padding.px') get hbsPadding() {
    // 2 extra pixels spacing, as seen in screenshot
    return this.drawFrame ? (Bevels.WINDOW.getPadding() + 2) : 0;
  }

  @ViewChild('menuWindow') menuWindow!: MenuTemplateDirective;

  readonly enumMoveResizeMode = MoveResizeMode;
  @Input() moveResizeMode = MoveResizeMode.None; // is an input for testing purposes only

  readonly WINDOW_BEVEL = Bevels.WINDOW;

  private moveDivSubscription?: Subscription;
  private moveDivElement?: ElementRef<HTMLElement>;
  @ViewChild('moveDiv') set moveDiv(v: ElementRef<HTMLElement> | undefined) {

    if (elementRefIsSame(v, this.moveDivElement)) {
      return;
    }
    this.moveDivElement = v;

    this.moveDivSubscription && this.moveDivSubscription.unsubscribe();

    const thiz = this;

    if (v) {
      this.moveDivSubscription = rxInteract(v.nativeElement, i => {
        i.draggable({
          listeners: {
            move(event) {
              thiz.left += event.dx;
              thiz.top += event.dy;
            },
            end(_event) {
              thiz.moveResizeMode = MoveResizeMode.None;
            }
          }
        });

        i.preventDefault('always'); // firefox esr would select text without this
      }).subscribe();
    }
  }

  constructor(public elementRef: ElementRef<HTMLElement>) {}

  ngOnDestroy(): void {
    this.moveDivSubscription?.unsubscribe();
  }

  doneText() {
    switch (this.moveResizeMode) {
      case MoveResizeMode.Move: return "Done moving";
      case MoveResizeMode.Resize: return "Done resizing";
      default: {
        console.assert(false);
        return "";
      }
    }
  }
}
