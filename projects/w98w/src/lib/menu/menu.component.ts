import { AfterViewInit, Component, ContentChildren, ElementRef, HostBinding, Input, OnDestroy, OnInit, QueryList, ViewChild } from '@angular/core';
import { Bevels } from '../bevel';
import { Bevel8SplitComponent, GenCssInput, genGenCssInput } from '../bevel-8split/bevel-8split.component';
import { Colors } from '../colors';
import { MenuItemComponent } from '../menu-item/menu-item.component';
import { PixelImageBuilderFactory } from '../pixel-image-builder';
import { PixelImageDrawer } from '../pixel-image-drawer';
import { PixelImageService } from '../pixel-image.service';
import { SlidingScreenMainContentDirective } from '../ss/sliding-screen-main-content.directive';
import { StyleInjector } from '../style-injector';
import { W98wStyles } from '../w98w-styles';
import { MenuContext } from './menu-context';
import { MenuTemplateDirective } from './menu-template.directive';
import { MenuService, OnSubMenuClose } from './menu.service';

@Component({
  selector: 'menu[w98w-menu]',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, OnDestroy, AfterViewInit {

  @HostBinding('style.--menu-parent-grid-index') get hbMPGI() {
    return this.inlineSubMenuChildIndex;
  }

  @Input() menuContext: MenuContext | undefined;

  @HostBinding('class.w98w-menu') readonly hbcMenu = true;
  @HostBinding('class.menu-host-child') get hbcMHC() {
    return this.menuContext?.menuHostChildStyles();
  }
  @HostBinding('class.menu-ip') get hbcMI() {
    return this.menuContext?.anchor();
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

  @HostBinding('style.--menu-ip-offset-h') get hbMIOH() {
    const anchor = this.menuContext?.anchor();
    if (anchor) {
      return `${anchor.getBoundingClientRect().x - this.screenRoot.element.nativeElement.getBoundingClientRect().x}px`;
    }
    return undefined;
  }
  @HostBinding('style.--menu-ip-offset-v') get hbMIOV() {
    const anchor = this.menuContext?.anchor();
    if (anchor) {
      return `${anchor.getBoundingClientRect().bottom - this.screenRoot.element.nativeElement.getBoundingClientRect().y}px`;
    }
    return undefined;
  }

  openedChild?: MenuItemComponent;

  @ViewChild('elemBevel') private elemBevel!: ElementRef<HTMLElement>;

  @ContentChildren(MenuItemComponent) childItems!: QueryList<MenuItemComponent>;

  constructor(private imgService: PixelImageService, private screenRoot: SlidingScreenMainContentDirective) { }

  ngOnInit(): void {
    this.imgService.pidRegister(MenuComponent.PID);
    this.dmoInit();
  }

  ngAfterViewInit(): void {
    this.dmoAfterViewInit();
  }

  ngOnDestroy(): void {
    this.dmoDestroy();
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

  //#region Detach Me Observer

  @HostBinding('class.dmo-child-wants-detach') hbcDmoChildWantsDetach = false;
  @HostBinding('class.dmo-waiting') hbcDmoWaiting = false;

  private dmoObserver: IntersectionObserver | undefined;

  private dmoInit() {
    /* we have to do it in init instead of in afterviewinit because of change detection */
    const parent = this.menuContext?.parent();
    if (parent) {
      this.hbcDmoWaiting = true;
    }
  }

  private dmoReset() {
    this.hbcDmoChildWantsDetach = false;
  }

  private dmoAfterViewInit() {
    const parent = this.menuContext?.parent();
    if (parent) {
      this.dmoObserver = new IntersectionObserver((entries, _observer) => {

        console.info(entries);

        this.hbcDmoWaiting = false;

        // TODO: do we need fuzzy compare?
        if (entries[0].intersectionRatio != 1) {
          parent.hbcDmoChildWantsDetach = true;

          console.info('child wants detach');

          // keep going until we detach, because a resize can always happen later
          this.dmoObserver?.disconnect();
          this.dmoObserver = undefined;
        }

      }, {
        root: this.screenRoot.viewport,
        threshold: [0, 1]
      });

      this.dmoObserver.observe(this.elemBevel.nativeElement);
    }
  }

  private dmoDestroy() {
    if (this.dmoObserver) {
      this.dmoObserver.disconnect();
      this.dmoObserver = undefined;
    }
  }

  //#endregion

  //#region Inline Sub Menu

  inlineSubMenu: MenuTemplateDirective | undefined;
  inlineSubMenuChildIndex: number | undefined;
  inlineSubMenuContext: MenuContext | undefined;

  inlineSubMenuOpen(instance: MenuItemComponent, template: MenuTemplateDirective) {
    this.dmoReset();

    const thiz = this;
    this.inlineSubMenu = template;
    this.inlineSubMenuChildIndex = this.getChildGridIndex(instance);
    this.inlineSubMenuContext = new class implements MenuContext {
      menuHostChildStyles(): boolean {
        return false;
      }
      parent(): MenuComponent | undefined {
        return thiz;
      }
      anchor(): HTMLElement | undefined {
        // submenus have no anchors, it's for the initial menu only
        return undefined;
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
