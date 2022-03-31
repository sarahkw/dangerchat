import { MenuTemplateDirective } from "./menu-template.directive";
import { MenuComponent } from "./menu.component";
import { OnSubMenuClose } from "./menu.service";

export interface MenuContext {

    menuHostChildStyles(): boolean;
    parent(): MenuComponent | undefined;
    anchor(): HTMLElement | undefined;

    appendMenu(template: MenuTemplateDirective, onSubMenuClose?: OnSubMenuClose): void;
    closeChildren(): void;
    endMenu(): void;

}
