import { MenuTemplateDirective } from "./menu-template.directive";
import { AnchorDescriptor, OnSubMenuClose } from "./menu.service";

export interface MenuContext {

    menuHostChildStyles(): boolean;
    inlineSubMenuParentGridItemIndex(): number | undefined;
    anchor(): AnchorDescriptor | undefined;

    appendMenu(template: MenuTemplateDirective, onSubMenuClose?: OnSubMenuClose): void;
    closeChildren(): void;
    endMenu(): void;

}
