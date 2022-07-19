import { AfterContentChecked, Component, Directive, ElementRef, forwardRef, HostBinding, InjectionToken, Input, NgZone, OnDestroy, OnInit, Optional, ViewChild } from '@angular/core';
import { Bevels } from '../bevel';
import { MenuTemplateDirective } from '../menu/menu-template.directive';
import { Subscription } from 'rxjs';
import { rxInteract } from '../rx/rx-interact';
import { elementRefIsSame } from '../util/element-ref-is-same';
import { DesktopComponent } from '../desktop/desktop.component';

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

// TODO Maybe move this somewhere else
export interface WindowCloserContext {
  destroy(): void;
}

@Component({
  selector: 'w98w-window',
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.scss'],
  providers: [{ provide: floatableToken, useExisting: forwardRef(() => WindowComponent) }]
})
export class WindowComponent implements OnInit, AfterContentChecked, OnDestroy, Floatable {

  @Input() drawFrame = true;  // if maximized this will be false
  @Input() innerGridStyle: unknown = undefined; // TODO slated for removal

  // left and top need to go through us because moving/resizing is delta those
  @Input('absLeft') @HostBinding('style.left.px') left: number | undefined;
  @Input('absTop') @HostBinding('style.top.px') top: number | undefined;
  @Input('absWidth') @HostBinding('style.width.px') width: number | undefined;
  @Input('absHeight') @HostBinding('style.height.px') height: number | undefined;

  @HostBinding('style.--window-padding.px') get hbsPadding() {
    // 2 extra pixels spacing, as seen in screenshot
    return this.drawFrame ? (Bevels.WINDOW.getPadding() + 2) : 0;
  }

  @ViewChild('menuWindow') menuWindow!: MenuTemplateDirective;

  readonly enumMoveResizeMode = MoveResizeMode;
  @Input() moveResizeMode = MoveResizeMode.None; // is an input for testing purposes only

  readonly WINDOW_BEVEL = Bevels.WINDOW;

  ///////////////////////////////////////////////////

  private mrSubscription?: Subscription;
  private mrElement?: ElementRef<HTMLElement>;

  @ViewChild('moveDiv') mrMoveDiv: ElementRef<HTMLElement> | undefined;
  @ViewChild('resizeDiv') mrResizeDiv: ElementRef<HTMLElement> | undefined;

  private mrAfterContentChecked() {
    let realizedMoveResizeMode: MoveResizeMode = MoveResizeMode.None;
    let currentElement: typeof this.mrMoveDiv;

    if (this.mrMoveDiv) {
      currentElement = this.mrMoveDiv;
      realizedMoveResizeMode = MoveResizeMode.Move;
    } else if (this.mrResizeDiv) {
      currentElement = this.mrResizeDiv;
      realizedMoveResizeMode = MoveResizeMode.Resize;
    } else {
      currentElement = undefined;
      realizedMoveResizeMode = MoveResizeMode.None;
    }

    if (elementRefIsSame(currentElement, this.mrElement)) {
      return;
    }
    this.mrElement = currentElement;

    this.mrSubscription?.unsubscribe();

    const thiz = this;

    if (currentElement) {
      this.ngZone.runOutsideAngular(() => {
        this.mrSubscription = rxInteract(currentElement!.nativeElement, i => {

          switch (realizedMoveResizeMode) {
            case MoveResizeMode.None: break;
            case MoveResizeMode.Move: {
              i.draggable({
                listeners: {
                  move(event) {
                    thiz.ngZone.run(() => {
                      thiz.left += event.dx;
                      thiz.top += event.dy;
                    });
                  },
                  end(_event) {
                    thiz.ngZone.run(() => {
                      thiz.moveResizeMode = MoveResizeMode.None;
                    });
                  }
                }
              });
              break;
            }
            case MoveResizeMode.Resize: {
              i.resizable({
                edges: { bottom: true, right: true, left: true, top: true },
                listeners: {
                  move(event) {
                    thiz.ngZone.run(() => {
                      thiz.width = event.rect.width;
                      thiz.height = event.rect.height;
                      thiz.left += event.deltaRect.left;
                      thiz.top += event.deltaRect.top;
                    });
                  },
                  end(_event) {
                    thiz.ngZone.run(() => {
                      thiz.moveResizeMode = MoveResizeMode.None;
                    });
                  }
                }
              });
              break;
            }
          }
          i.preventDefault('always'); // firefox esr would select text without this
        }).subscribe();
      });
    }
  }

  ///////////////////////////////////////////////////

  wmSubscription?: Subscription;

  constructor(
    public elementRef: ElementRef<HTMLElement>,
    private ngZone: NgZone,
    @Optional() private desktop: DesktopComponent
    ) {
  }

  ngOnInit(): void {
    if (this.desktop) {
      this.wmSubscription = this.desktop.windowManager.registerFor(this).subscribe();
    }
  }

  ngAfterContentChecked(): void {
    // This is to test that using interactjs isn't causing change detection even when not interacting.
    //console.info('acc');

    this.mrAfterContentChecked();
  }

  ngOnDestroy(): void {
    this.mrSubscription?.unsubscribe();
    this.wmSubscription?.unsubscribe();
  }
}
