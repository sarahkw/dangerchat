import { Observable } from "rxjs";
import { MenuContinuation } from "./menu-continuation";
import { OnSubMenuClose } from "./menu-host/menu-host.component";
import { MlsoMenuContext } from "./menu-layout-size-observer.directive";
import { MenuTemplateDirective } from "./menu-template.directive";
import { MenuComponent } from "./menu.component";

export interface MenuContext {
    get menuContinuation$(): Observable<MenuContinuation>;
    get mlsoContext(): MlsoMenuContext;
    menuHostChildStyles(): boolean;
    parent(): MenuComponent | undefined;

    appendMenu(template: MenuTemplateDirective, onSubMenuClose?: OnSubMenuClose): void;
    closeChildren(): void;
    endMenu(): void;

}
