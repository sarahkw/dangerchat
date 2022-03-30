import { MenuTemplateDirective } from "./menu-template.directive";
import { OnSubMenuClose } from "./menu.service";

export interface MenuContext {

    menuHostChildStyles(): boolean;
    inlineSubMenuParentGridItemIndex(): number | undefined;

    appendMenu(template: MenuTemplateDirective, onSubMenuClose?: OnSubMenuClose): void;
    closeChildren(): void;
    endMenu(): void;

}
