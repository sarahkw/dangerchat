import { AfterViewInit, Component, ContentChildren, ElementRef, HostBinding, Input, OnDestroy, OnInit, QueryList, Renderer2, RendererStyleFlags2, ViewChild } from '@angular/core';
import { Observable, share, Subscription } from 'rxjs';
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
import { menuCalculateSelf, MenuContinuation, menuCalculateNext } from './menu-continuation';
import { OnSubMenuClose } from './menu-host/menu-host.component';
import { MenuTemplateDirective } from './menu-template.directive';

@Component({
  selector: 'menu[w98w-menu]',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, OnDestroy, AfterViewInit {

  private applyMenuCalculation(calcs: MenuContinuation | undefined) {
      let offsetV = 'initial';
      let offsetH = 'initial';
      let maxHeight = 'initial';
      let overflowY = 'initial';
      let maxWidth = 'initial';

    if (calcs) {
      console.assert(!!calcs.current);
    }

    if (calcs && calcs.current) {
      offsetV = `${calcs.current.offsetVertical}px`;

      if (calcs.current.offsetHorizontal !== null)
        offsetH = `${calcs.current.offsetHorizontal}px`;

      if (calcs.current.fixedHeight !== null) {
        maxHeight = `${calcs.current.fixedHeight}px`;
        overflowY = 'scroll';
      }

      // TODO do something more reasonable here than hardcode the value haha
      maxWidth = `${calcs.current.rootWidth - 150}px`;
    }

    this.renderer.setStyle(this.elementRef.nativeElement, '--menu-calcs-offset-v', offsetV, RendererStyleFlags2.DashCase);
    this.renderer.setStyle(this.elementRef.nativeElement, '--menu-calcs-offset-h', offsetH, RendererStyleFlags2.DashCase);
    this.renderer.setStyle(this.elementRef.nativeElement, '--menu-calcs-max-h', maxHeight, RendererStyleFlags2.DashCase);
    this.renderer.setStyle(this.elementRef.nativeElement, '--menu-calcs-overflow-y', overflowY, RendererStyleFlags2.DashCase);
    this.renderer.setStyle(this.elementRef.nativeElement, '--menu-calcs-max-w', maxWidth, RendererStyleFlags2.DashCase);
  }

  @HostBinding('class.w98w-menu') readonly hbcMenu = true;

  @HostBinding('style.--menu-text-size') hbTS = `${W98wStyles.menuFontSize}px`;
  @HostBinding('style.--menu-text-font') hbTF = W98wStyles.defaultFont;
  @HostBinding('style.--menu-text-color') hbMTC = Colors.MENU_TEXT;
  @HostBinding('style.--menu-bg-color') hbMBC = Colors.MENU_BG;

  static readonly borderPadding = Bevels.MENU.getPadding();
  @HostBinding('style.--menu-border-padding') hbMBP = `${MenuComponent.borderPadding}px`;
  @HostBinding('style.--menu-n') get hbMN() {
    return this.childItems.length;
  }

  openedChild?: MenuItemComponent;

  @ContentChildren(MenuItemComponent) childItems!: QueryList<MenuItemComponent>;

  constructor(
    private imgService: PixelImageService,
    private elementRef: ElementRef<HTMLElement>,
    private renderer: Renderer2) {

    this.applyMenuCalculation(undefined);
  }

  ngOnInit(): void {
    this.imgService.pidRegister(MenuComponent.PID);
  }

  @ViewChild('elemBevel') elemBevel!: ElementRef<HTMLDivElement>;
  @ViewChild('elemRuler') elemRuler!: ElementRef<HTMLDivElement>;

  @Input() menuContext: MenuContext | undefined;

  private myCalculationsShared$: Observable<MenuContinuation> | undefined;

  private menuRenderSubscription: Subscription | undefined;
  private nextMenuSubscription: Subscription | undefined;

  ngAfterViewInit(): void {
    console.assert(!this.menuRenderSubscription);

    if (this.menuContext) {
      this.myCalculationsShared$ =
        this.menuContext.menuContinuation$.pipe(
          menuCalculateSelf(this.elemBevel.nativeElement, this.menuContext.mlsoContext),
          share());

      this.menuRenderSubscription = this.myCalculationsShared$
        .subscribe(value => {
          value && this.applyMenuCalculation(value);
        });
    }
  }

  ngOnDestroy(): void {
    this.menuRenderSubscription?.unsubscribe();
    this.nextMenuSubscription?.unsubscribe();

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

  @HostBinding('style.--menu-ruler-grid-index') hbRulerGridIndex: number | 'initial' = 'initial';

  appendMenuHelper(menuContext: MenuContext, fromItem: MenuItemComponent, toOpenTemplate: MenuTemplateDirective, onSubMenuClose?: OnSubMenuClose) {
    // asking caller for menuContext for consistency at call site

    const myCalculationsShared$ = this.myCalculationsShared$;

    if (!myCalculationsShared$) {
      console.debug('cannot open, missing inputs');
      return;
    }

    this.hbRulerGridIndex = this.getChildGridIndex(fromItem);

    menuContext.appendMenu(
      toOpenTemplate,
      myCalculationsShared$.pipe(menuCalculateNext(this.elemRuler.nativeElement, menuContext.mlsoContext, MenuComponent.borderPadding)),
      menuContext.mlsoContext,
      onSubMenuClose);
  }

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
