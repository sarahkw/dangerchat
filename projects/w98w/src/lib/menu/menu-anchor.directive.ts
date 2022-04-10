import { Directive, ElementRef, HostListener, Input, OnDestroy, Optional } from '@angular/core';
import { finalize, Subscription } from 'rxjs';
import { MenuBarComponent } from '../menu-bar/menu-bar.component';
import { Pressable } from '../pressable';
import { WButtonComponent } from '../wbutton/wbutton.component';
import { MenuTemplateDirective } from './menu-template.directive';
import { MenuService } from './menu.service';

export type AutoMenuType = MenuTemplateDirective | undefined;

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
          if (this.pressable) {
            this.pressable.pressed = true;
          }

          this.menuSubscription =
            this.menuService.beginMenu$(this.autoMenu, this.element.nativeElement)
              .pipe(finalize(() => {
                if (this.pressable) {
                  this.pressable.pressed = false;
                }
                this.menuSubscription = undefined;
              }))
              .subscribe();

          if (this.possiblyMenuBar) {
            this.menuSubscription.add(this.possiblyMenuBar.childCannotHoverToken$.subscribe());
          }
        }
      }
    }
  }

  constructor(
    private element: ElementRef<HTMLElement>,
    @Optional() private menuService: MenuService, // might be unavailable when on demo app

    @Optional() possiblyWButton: WButtonComponent,

    @Optional() private possiblyMenuBar: MenuBarComponent
  ) {
    this.pressable = possiblyWButton;
  }

  ngOnDestroy(): void {
    this.menuSubscription?.unsubscribe();
  }
}
