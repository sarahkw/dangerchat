import { Directive, ElementRef, HostListener, Input, OnDestroy, Optional } from '@angular/core';
import { finalize, Subscription } from 'rxjs';
import { Pressable } from '../pressable';
import { WButtonComponent } from '../wbutton/wbutton.component';
import { MenuTemplateDirective } from './menu-template.directive';
import { MenuService } from './menu.service';

// also take a fn so that we can take ViewChild params as input, as ViewChild is resolved after inputs are
export type AutoMenuType = MenuTemplateDirective | (() => MenuTemplateDirective) | undefined;

@Directive({
  selector: '[w98w-menu-anchor]',
  exportAs: 'menuAnchor'
})
export class MenuAnchorDirective implements OnDestroy {

  @Input() autoMenu: AutoMenuType;

  @Input() pressable?: Pressable;

  private menuSubscription: Subscription | undefined;

  @HostListener('click') onClick() {
    if (this.menuSubscription) {
      this.menuSubscription.unsubscribe();
      this.menuSubscription = undefined;
    } else {
      if (this.menuService) {
        if (this.autoMenu) {
          let target: MenuTemplateDirective;

          if (this.autoMenu instanceof MenuTemplateDirective) {
            target = this.autoMenu;
          } else {
            target = this.autoMenu();
          }

          if (this.pressable) {
            this.pressable.pressed = true;
          }

          this.menuSubscription =
            this.menuService.beginMenu$(target, this.element.nativeElement)
              .pipe(finalize(() => {
                if (this.pressable) {
                  this.pressable.pressed = false;
                }
                this.menuSubscription = undefined;
              }))
              .subscribe();
        }
      }
    }
  }

  constructor(
    private element: ElementRef<HTMLElement>,
    @Optional() private menuService: MenuService, // might be unavailable when on demo app

    @Optional() possiblyWButton: WButtonComponent
  ) {
    this.pressable = possiblyWButton;
  }

  ngOnDestroy(): void {
    this.menuSubscription?.unsubscribe();
  }
}
