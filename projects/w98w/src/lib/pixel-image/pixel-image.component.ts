import { AfterViewInit, Component, Directive, ElementRef, Input, OnChanges, OnDestroy, OnInit, Renderer2, RendererStyleFlags2, SimpleChanges, ViewChild } from '@angular/core';
import { asapScheduler, BehaviorSubject, distinctUntilChanged, map, Observable, observeOn, of, ReplaySubject, Subject, Subscription, switchMap } from 'rxjs';
import { GenImgDescriptor } from '../genimg';
import { DisplayImage, PixelImageBuilderFactory } from '../pixel-image-builder';
import { PixelImageDrawer } from '../pixel-image-drawer';
import { PixelImageService } from '../pixel-image.service';
import { filterOutNullAndUndefined } from '../rx/filter-out-null-and-undefined';
import { resizeObserver } from '../rx/resize-observer';

export type PixelImageCssVarConfig = {
  genImg: GenImgDescriptor,
  varPrefix: string,
  cssWidth: number,
  cssHeight: number
};

interface Cleanupable {
  cleanup(): void;
}

@Directive({selector: '[w98w-pixel-image-css-var]'})
export class PixelImageCssVarDirective implements OnChanges, OnDestroy {
  @Input() pixelImageConfig: PixelImageCssVarConfig[] = [];

  private currentConfig$ = new Subject<PixelImageCssVarConfig[]>();

  public debugImg$ = new BehaviorSubject(undefined as {
    config: PixelImageCssVarConfig,
    imgs: DisplayImage
  } | undefined);

  private pids: (PixelImageDrawer<DisplayImage> & Cleanupable)[] = [];

  constructor(private pixelImageService: PixelImageService,
    private eref: ElementRef,
    private renderer: Renderer2) {

    // quite sure it's ok not to unsubscribe to a subject we own
    this.currentConfig$.subscribe(this.onNewConfig.bind(this));
  }

  public giveConfig(nextConfig: PixelImageCssVarConfig[]) {
    // in addition to taking the config by the input var, also allow a parent to give us new config by JS
    this.currentConfig$.next(nextConfig);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const configChanges = changes['pixelImageConfig'];
    if (configChanges) {
      this.currentConfig$.next(configChanges.currentValue);
    }
  }

  ngOnDestroy(): void {
    this.resetPids();
  }

  private resetPids() {
    for (const pid of this.pids) {
      pid.cleanup();
      this.pixelImageService.pidUnregister(pid);
    }
    this.pids = [];
  }

  private onNewConfig(nextConfig: PixelImageCssVarConfig[]) {
    this.resetPids();

    for (const config of nextConfig) {
      const thiz = this;

      const pid = new class implements PixelImageDrawer<DisplayImage>, Cleanupable {
        pidGenerateImages(pibf: PixelImageBuilderFactory) {
          return config.genImg.draw(config.cssWidth, config.cssHeight, pibf);
        }
        pidApplyImages(imgs: DisplayImage): void {
          // these styles are for the "inside" div, which may be different size from what cssWidth/cssHeight you requested.
          // so you should still have the outside cssWidth/cssHeight to keep the right size in the layout.

          thiz.renderer.setStyle(thiz.eref.nativeElement, `--pi-${config.varPrefix}-width`, `${imgs.cssRequestedWidth}px`, RendererStyleFlags2.DashCase);
          thiz.renderer.setStyle(thiz.eref.nativeElement, `--pi-${config.varPrefix}-height`, `${imgs.cssRequestedHeight}px`, RendererStyleFlags2.DashCase);
          thiz.renderer.setStyle(thiz.eref.nativeElement, `--pi-${config.varPrefix}-background-image`, `url('${imgs.url}')`, RendererStyleFlags2.DashCase);
          thiz.renderer.setStyle(thiz.eref.nativeElement, `--pi-${config.varPrefix}-background-size`, `${imgs.cssNextStepWidth}px ${imgs.cssNextStepHeight}px`, RendererStyleFlags2.DashCase);

          thiz.debugImg$.next({config, imgs});

          const DEV = false;
          if (DEV) {
            console.info([
              `/* auto-generated by PixelImageCssVarDirective */`,
              `width: var(--pi-${config.varPrefix}-width);`,
              `height: var(--pi-${config.varPrefix}-height);`,
              `background-image: var(--pi-${config.varPrefix}-background-image);`,
              `background-size: var(--pi-${config.varPrefix}-background-size);`,
              `background-repeat: no-repeat;`
            ].join("\n"));
          }
        }
        pidDestroy(): void {
          // no-op: not ref counting and applying some global style
        }

        cleanup(): void {
          thiz.renderer.removeStyle(thiz.eref.nativeElement, `--pi-${config.varPrefix}-width`, RendererStyleFlags2.DashCase);
          thiz.renderer.removeStyle(thiz.eref.nativeElement, `--pi-${config.varPrefix}-height`, RendererStyleFlags2.DashCase);
          thiz.renderer.removeStyle(thiz.eref.nativeElement, `--pi-${config.varPrefix}-background-image`, RendererStyleFlags2.DashCase);
          thiz.renderer.removeStyle(thiz.eref.nativeElement, `--pi-${config.varPrefix}-background-size`, RendererStyleFlags2.DashCase);
        }
      };

      this.pids.push(pid);

      this.pixelImageService.pidRegister(pid);
    }
  }
}

type RawConfig = {
  genImg: GenImgDescriptor,
  cssWidth: number | 'auto',
  cssHeight: number | 'auto'
};

@Component({
  selector: 'w98w-pixel-image',
  templateUrl: './pixel-image.component.html',
  styleUrls: ['./pixel-image.component.scss']
})
export class PixelImageComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {

  @Input() genImg?: GenImgDescriptor;
  @Input() cssWidth?: number | 'auto';  // if auto, ask the image what width it should be based on height
  @Input() cssHeight?: number | 'auto';  // if auto, use resizeobserver on our template

  private currentRawConfig$: ReplaySubject<RawConfig> = new ReplaySubject(1);

  @ViewChild(PixelImageCssVarDirective) private imgCssVarGen!: PixelImageCssVarDirective;

  // these things are for the size debug test page
  @Input() debugDrawnSize: [number, number] | undefined;
  debugGenImgSize$: Observable<number[]> | undefined;
  get debugForceWidth() { return this.debugDrawnSize && this.debugDrawnSize[0] }
  get debugForceHeight() { return this.debugDrawnSize && this.debugDrawnSize[1] }

  private actualConfigSubscription: Subscription | undefined;

  constructor(private elementRef: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    console.assert(!!(this.genImg && this.cssWidth && this.cssHeight));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['genImg'] || changes['cssWidth'] || changes['cssHeight']) {
      if (this.genImg && this.cssWidth && this.cssHeight) {
        this.currentRawConfig$.next({
          genImg: this.genImg,
          cssWidth: this.cssWidth,
          cssHeight: this.cssHeight
        });
      }
    }
  }

  ngAfterViewInit(): void {
    this.actualConfigSubscription = this.currentActualConfig$.subscribe(this.imgCssVarGen.giveConfig.bind(this.imgCssVarGen));

    this.debugGenImgSize$ = this.imgCssVarGen.debugImg$.pipe(
      filterOutNullAndUndefined(),
      map(({ imgs }) => {
        return [
          imgs.cssRequestedWidth, imgs.cssRequestedHeight,
          imgs.cssRequestedWidthCautious, imgs.cssRequestedHeightCautious
        ];
      }),
      observeOn(asapScheduler)  // prevent a change detection race condition, due to having to wait for view init
    );
  }

  ngOnDestroy(): void {
    this.actualConfigSubscription?.unsubscribe();
  }

  private currentActualConfig$ = this.currentRawConfig$.pipe(
    switchMap(rawConfig => {
      if (rawConfig.cssHeight == 'auto') {

        // TODO would resub on config change even if we don't need to (can use the same resizeobserver)
        return resizeObserver([this.elementRef.nativeElement]).pipe(
          map(entriesValue => entriesValue.resolveContentRect(entriesValue.entries[0]).height),
          distinctUntilChanged(), // we'll get a resize update when the width changes, ignore that
          map(height => ({ ...rawConfig, cssHeight: height }))
        );
      } else {
        return of(rawConfig);
      }
    }),
    map((rawConfig): PixelImageCssVarConfig[] => {
      if (rawConfig.cssHeight != 'auto') {
        return [{
          genImg: rawConfig.genImg,
          varPrefix: 'only',
          cssWidth: rawConfig.cssWidth == 'auto' ? rawConfig.genImg.heightToWidthFn(rawConfig.cssHeight) : rawConfig.cssWidth,
          cssHeight: rawConfig.cssHeight
        }]
      } else {
        throw Error();
      }
    })
  );
}
