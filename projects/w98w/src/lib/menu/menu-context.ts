import { Observable } from "rxjs";
import { MenuContinuation } from "./menu-continuation";
import { OnSubMenuClose } from "./menu-host/menu-host.component";
import { MlsoMenuContext } from "./menu-layout-size-observer.directive";
import { MenuTemplateDirective } from "./menu-template.directive";

export interface MenuContext {
    get menuContinuation$(): Observable<MenuContinuation>;
    get mlsoContext(): MlsoMenuContext;

    appendMenu(
        template: MenuTemplateDirective,
        nextContinuation$: Observable<MenuContinuation>,
        mlsoContext: MlsoMenuContext,
        onSubMenuClose?: OnSubMenuClose): void;
    closeChildren(): void;
    endMenu(): void;

}
