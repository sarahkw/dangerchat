import { Component, OnInit } from '@angular/core';
import { MenuContext } from '../menu-context';
import { MenuTemplateDirective } from '../menu-template.directive';
import { MenuInstance, MenuService } from '../menu.service';

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
      appendMenu(template: MenuTemplateDirective): void {
        thiz.menuService.appendMenu(instance, template);
      }
      endMenu(): void {
        thiz.menuService.endMenu();
      }
    };
  }

}
