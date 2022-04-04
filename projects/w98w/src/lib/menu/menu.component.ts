import { AfterViewInit, Component, ContentChildren, ElementRef, HostBinding, Input, OnDestroy, OnInit, QueryList, Renderer2, RendererStyleFlags2, ViewChild } from '@angular/core';
import { map, Observable, of, share, Subscription } from 'rxjs';
import { Bevels } from '../bevel';
import { Bevel8SplitComponent, GenCssInput, genGenCssInput } from '../bevel-8split/bevel-8split.component';
import { Colors } from '../colors';
import { MenuItemComponent } from '../menu-item/menu-item.component';
import { PixelImageBuilderFactory } from '../pixel-image-builder';
import { PixelImageDrawer } from '../pixel-image-drawer';
import { PixelImageService } from '../pixel-image.service';
import { StyleInjector } from '../style-injector';
import { W98wStyles } from '../w98w-styles';
import { MenuContext } from './menu-context';
import { menuCalculate, MenuContinuation, menuEngine } from './menu-continuation';
import { OnSubMenuClose } from './menu-host/menu-host.component';
import { MlsoMenuContext } from './menu-layout-size-observer.directive';
import { MenuTemplateDirective } from './menu-template.directive';

@Component({
  selector: 'menu[w98w-menu]',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, OnDestroy, AfterViewInit {

  private setStyleMIOVAndH(miov: any, mioh: any) {
    this.renderer.setStyle(this.elementRef.nativeElement, '--menu-ip-offset-v', miov || 'initial', RendererStyleFlags2.DashCase);
    this.renderer.setStyle(this.elementRef.nativeElement, '--menu-ip-offset-h', mioh || 'initial', RendererStyleFlags2.DashCase);
  }

  @HostBinding('style.--menu-parent-grid-index') get hbMPGI() {
    return this.inlineSubMenuChildIndex;
  }

  private menuRenderSubscription: Subscription | undefined;

  @Input() menuContext: MenuContext | undefined;

  @HostBinding('class.w98w-menu') readonly hbcMenu = true;
  @HostBinding('class.menu-host-child') get hbcMHC() {
    return this.menuContext?.menuHostChildStyles();
  }

  @HostBinding('style.--menu-text-size') hbTS = `${W98wStyles.menuFontSize}px`;
  @HostBinding('style.--menu-text-font') hbTF = W98wStyles.defaultFont;
  @HostBinding('style.--menu-text-color') hbMTC = Colors.MENU_TEXT;
  @HostBinding('style.--menu-bg-color') hbMBC = Colors.MENU_BG;

  // These are the new ones for the grid "cartridge"
  @HostBinding('style.--menu-border-padding') hbMBP = `${Bevels.MENU.getPadding()}px`;
  @HostBinding('style.--menu-n') get hbMN() {
    return this.childItems.length;
  }

  openedChild?: MenuItemComponent;

  @ContentChildren(MenuItemComponent) childItems!: QueryList<MenuItemComponent>;

  constructor(
    private imgService: PixelImageService,
    private elementRef: ElementRef<HTMLElement>,
    private renderer: Renderer2) {

    this.setStyleMIOVAndH(undefined, undefined);
  }

  ngOnInit(): void {
    this.imgService.pidRegister(MenuComponent.PID);
  }

  @ViewChild('elemBevel') elemBevel!: ElementRef<HTMLDivElement>;

  ngAfterViewInit(): void {
    console.assert(!this.menuRenderSubscription);

    console.info(this.elemBevel);

    if (this.menuContext) {
      this.menuRenderSubscription = this.menuContext.menuContinuation$.pipe(menuCalculate(this.elemBevel.nativeElement, this.menuContext.mlsoContext))
        .subscribe(value => {
          if (value.render) {
              this.setStyleMIOVAndH(
                `${value.render.myOffsetVertical}px`,
                value.render.myOffsetHorizontal ? `${value.render.myOffsetHorizontal}px` : undefined);
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.menuRenderSubscription?.unsubscribe();

    this.imgService.pidUnregister(MenuComponent.PID);
  }

  // TODO maybe cache this so that it's not linear searching each time
  getChildGridIndex(instance: MenuItemComponent) {
    for (let i = 0; i < this.childItems.length; ++i) {
      if (this.childItems.get(i) === instance) {
        return i + 1;
      }
    }

    console.error('getChildGridIndex cannot find instance');
    return 0;
  }

  //#region Inline Sub Menu

  inlineSubMenu: MenuTemplateDirective | undefined;
  inlineSubMenuChildIndex: number | undefined;
  inlineSubMenuContext: MenuContext | undefined;

  inlineSubMenuOpen(instance: MenuItemComponent, template: MenuTemplateDirective) {
    const thiz = this;

    const menuContext = this.menuContext;
    if (!menuContext) {
      console.debug('missing menu context');
      return;
    }

    this.inlineSubMenu = template;
    this.inlineSubMenuChildIndex = this.getChildGridIndex(instance);
    this.inlineSubMenuContext = new class implements MenuContext {
      get menuContinuation$(): Observable<MenuContinuation> {
        const ret: MenuContinuation = {
          bodyOffsetVertical: 0,
          bodyOffsetHorizontal: null,
          updates: undefined
        }
        return of(ret);
      }
      get mlsoContext(): MlsoMenuContext {
        return menuContext.mlsoContext;
      }
      menuHostChildStyles(): boolean {
        return false;
      }
      parent(): MenuComponent | undefined {
        return thiz;
      }
      appendMenu(template: MenuTemplateDirective, onSubMenuClose?: OnSubMenuClose): void {
        // TODO
      }
      closeChildren(): void {
        // TODO
      }
      endMenu(): void {
        // TODO
      }
    };
  }

  inlineSubMenuClose() {
    this.inlineSubMenu = undefined;
  }

  //#endregion

  static readonly PID = new class implements PixelImageDrawer {
    private styleInjector = new StyleInjector();

    pidGenerateImages(pibf: PixelImageBuilderFactory): GenCssInput {
      return genGenCssInput(ri => Bevels.MENU.genImage(ri, pibf));
    }

    pidApplyImages(imgs: GenCssInput): void {
      this.styleInjector.replaceStyle(Bevel8SplitComponent.genCss(".w98w-menu", imgs));
    }

    pidDestroy(): void {
      this.styleInjector.destroy();
    }
  };  // PID
}
