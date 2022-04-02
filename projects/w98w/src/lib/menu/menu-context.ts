import { Observable } from "rxjs";
import { MenuContinuation } from "./menu-continuation";
import { OnSubMenuClose } from "./menu-host/menu-host.component";
import { MenuTemplateDirective } from "./menu-template.directive";
import { MenuComponent } from "./menu.component";

export interface MenuContext {
    get menuContinuation$(): Observable<MenuContinuation>;
    menuHostChildStyles(): boolean;
    parent(): MenuComponent | undefined;

    appendMenu(template: MenuTemplateDirective, onSubMenuClose?: OnSubMenuClose): void;
    closeChildren(): void;
    endMenu(): void;

}
