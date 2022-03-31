import { Component, OnInit } from '@angular/core';
import { MenuContext } from '../menu-context';
import { MenuTemplateDirective } from '../menu-template.directive';
import { MenuInstance, MenuService, OnSubMenuClose } from '../menu.service';

@Component({
  selector: 'w98w-menu-host',
  templateUrl: './menu-host.component.html',
  styleUrls: ['./menu-host.component.css']
})
export class MenuHostComponent implements OnInit {

  constructor(public menuService: MenuService) { }

  ngOnInit(): void {
  }

  makeContextFor(instance: MenuInstance): MenuContext {
    const thiz = this;
    return new class implements MenuContext {
      menuHostChildStyles(): boolean {
        return true;
      }
      inlineSubMenuParentGridItemIndex(): number | undefined {
        return undefined;
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
