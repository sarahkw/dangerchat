import { MenuTemplateDirective } from "./menu-template.directive";

export interface MenuContext {

    appendMenu(template: MenuTemplateDirective): void;
    endMenu(): void;

}
