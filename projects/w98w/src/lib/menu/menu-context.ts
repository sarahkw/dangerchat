import { OnSubMenuClose } from "./menu-host/menu-host.component";
import { MenuTemplateDirective } from "./menu-template.directive";
import { MenuComponent } from "./menu.component";

export interface MenuContext {

    menuHostChildStyles(): boolean;
    parent(): MenuComponent | undefined;
    anchor(): HTMLElement | undefined;

    appendMenu(template: MenuTemplateDirective, onSubMenuClose?: OnSubMenuClose): void;
    closeChildren(): void;
    endMenu(): void;

}
