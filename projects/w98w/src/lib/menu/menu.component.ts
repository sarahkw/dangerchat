import { AfterContentInit, AfterViewInit, Component, ContentChildren, ElementRef, HostBinding, Input, OnDestroy, OnInit, QueryList, Renderer2, RendererStyleFlags2, ViewChild } from '@angular/core';
import { map, Observable, ReplaySubject, share, Subscription } from 'rxjs';
import { Bevels } from '../bevel';
import { Bevel8SplitComponent, GenCssInput, genGenCssInput } from '../bevel-8split/bevel-8split.component';
import { MenuItemComponent } from '../menu-item/menu-item.component';
import { PixelImageBuilderFactory } from '../pixel-image-builder';
import { PixelImageDrawer } from '../pixel-image-drawer';
import { PixelImageService } from '../pixel-image.service';
import { ROOTVARS } from '../root-css-vars.directive';
import { syncGetOne } from '../rx/sync-get';
import { StyleInjector } from '../style-injector';
import { coalesce2 } from '../util/coalesce';
import { MenuContext } from './menu-context';
import { menuCalculateSelf, MenuContinuation, menuCalculateNext } from './menu-calculation';
import { OnSubMenuClose } from './menu-host/menu-host.component';
import { MenuTemplateDirective } from './menu-template.directive';

@Component({
  selector: 'menu[w98w-menu]',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, OnDestroy, AfterViewInit, AfterContentInit {

  readonly ROOTVARS = ROOTVARS;

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

  @HostBinding('class') readonly hbClass = 'w98w-menu';

  static readonly borderPadding = Bevels.MENU.getPadding();
  @HostBinding('style.--menu-border-padding.px') readonly hbMBP = MenuComponent.borderPadding;
  @HostBinding('style.--menu-n') get hbMN() {
    return this.childItems?.length;
  }

  childWhoHasOpenedSubMenu?: MenuItemComponent;

  @ContentChildren(MenuItemComponent) private childItems?: QueryList<MenuItemComponent>; // maybe not yet set so can be undefined
  private childItemsSubscription?: Subscription;
  childCssIndexes$: ReplaySubject<Map<MenuItemComponent, number>> = new ReplaySubject(1);

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

  ngAfterContentInit(): void {
    function mapper(value: QueryList<MenuItemComponent>) {
      const ret: Map<MenuItemComponent, number> = new Map();
      value.forEach((item, index) => ret.set(item, index + 1)); // CSS counts from 1
      return ret;
    }

    console.assert(!!this.childItems);
    if (this.childItems) {
      this.childCssIndexes$.next(mapper(this.childItems));
      console.assert(!this.childItemsSubscription);
      this.childItemsSubscription = this.childItems.changes.pipe(map(mapper)).subscribe(this.childCssIndexes$);
    }
  }

  ngOnDestroy(): void {
    this.childItemsSubscription?.unsubscribe();
    this.menuRenderSubscription?.unsubscribe();
    this.nextMenuSubscription?.unsubscribe();

    this.imgService.pidUnregister(MenuComponent.PID);
  }

  @HostBinding('style.--menu-ruler-grid-index') hbRulerGridIndex: number | 'initial' = 'initial';

  childMenuItemWantsAppendMenu(menuContext: MenuContext, fromItem: MenuItemComponent, toOpenTemplate: MenuTemplateDirective, onSubMenuClose?: OnSubMenuClose) {
    // asking caller for menuContext for consistency at call site

    const myCalculationsShared$ = this.myCalculationsShared$;

    if (!myCalculationsShared$) {
      console.debug('cannot open, missing inputs');
      return;
    }

    const indexMap = syncGetOne(this.childCssIndexes$);
    console.assert(!!indexMap);
    if (indexMap) {
      this.hbRulerGridIndex = coalesce2<number | 'initial'>(indexMap.get(fromItem), 'initial');
    }

    menuContext.appendMenu(
      toOpenTemplate,
      myCalculationsShared$.pipe(menuCalculateNext(this.elemRuler.nativeElement, menuContext.mlsoContext, MenuComponent.borderPadding)),
      menuContext.mlsoContext,
      onSubMenuClose);
  }

  static readonly PID = new class implements PixelImageDrawer<GenCssInput> {
    private styleInjector = new StyleInjector();

    pidGenerateImages(pibf: PixelImageBuilderFactory): GenCssInput {
      return genGenCssInput(ri => Bevels.MENU.genImage(ri, pibf));
    }

    pidApplyImages(imgs: GenCssInput): void {
      this.styleInjector.replaceStyle(Bevel8SplitComponent.genCss(".w98w-menu > .container > .bevel", imgs));
    }

    pidDestroy(): void {
      this.styleInjector.destroy();
    }
  };  // PID
}
