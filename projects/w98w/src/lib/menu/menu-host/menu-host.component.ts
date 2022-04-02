import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MenuContext } from '../menu-context';
import { MenuLayoutSizeObserverDirective, MlsoMenuContext, ResizeUpdates } from '../menu-layout-size-observer.directive';
import { MenuTemplateDirective } from '../menu-template.directive';
import { MenuComponent } from '../menu.component';
import { MenuInstance, MenuService, OnSubMenuClose } from '../menu.service';

@Component({
  selector: 'w98w-menu-host',
  templateUrl: './menu-host.component.html',
  styleUrls: ['./menu-host.component.css']
})
export class MenuHostComponent implements OnInit {

  private mlsoContext: MlsoMenuContext;
  private mlsoObserver$: Observable<ResizeUpdates>;

  constructor(
    public menuService: MenuService,
    menuLayoutSizeObserver: MenuLayoutSizeObserverDirective) {

      const foo = menuLayoutSizeObserver.generate();
      this.mlsoContext = foo.context;
      this.mlsoObserver$ = new Observable(foo.subscribe);
    }

  ngOnInit(): void {
  }

  makeContextFor(instance: MenuInstance): MenuContext {
    const thiz = this;
    return new class implements MenuContext {
      menuHostChildStyles(): boolean {
        return true;
      }
      parent(): MenuComponent | undefined {
        return undefined;  // no parent for root menu
      }
      anchor(): HTMLElement | undefined {
        return instance.anchor;
      }
      appendMenu(template: MenuTemplateDirective, onSubMenuClose?: OnSubMenuClose): void {
        thiz.menuService.appendMenu(instance, template, onSubMenuClose);
      }
      closeChildren(): void {
        thiz.menuService.closeChildren(instance);
      }
      endMenu(): void {
        thiz.menuService.endMenu();
      }
    };
  }

}
