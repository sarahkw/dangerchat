import { AfterViewInit, Component, Directive, ElementRef, Input, OnChanges, OnDestroy, OnInit, Renderer2, RendererStyleFlags2, SimpleChanges, ViewChild } from '@angular/core';
import { asapScheduler, BehaviorSubject, filter, map, Observable, observeOn, Subject } from 'rxjs';
import { GenImgDescriptor } from '../genimg';
import { DisplayImage, PixelImageBuilderFactory } from '../pixel-image-builder';
import { PixelImageDrawer } from '../pixel-image-drawer';
import { PixelImageService } from '../pixel-image.service';

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
export class PixelImageCssVarDirective implements OnInit, OnChanges, OnDestroy {
  @Input() pixelImageConfig: PixelImageCssVarConfig[] = [];

  private currentConfig$ = new Subject<PixelImageCssVarConfig[]>();

  public debugImg$ = new BehaviorSubject<{
    config: PixelImageCssVarConfig,
    imgs: DisplayImage
  } | undefined>(undefined as any);

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

  ngOnInit(): void {
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
    for (let pid of this.pids) {
      pid.cleanup();
      this.pixelImageService.pidUnregister(pid);
    }
    this.pids = [];
  }

  private onNewConfig(nextConfig: PixelImageCssVarConfig[]) {
    this.resetPids();

    for (let config of nextConfig) {
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

@Component({
  selector: 'w98w-pixel-image',
  templateUrl: './pixel-image.component.html',
  styleUrls: ['./pixel-image.component.scss']
})
export class PixelImageComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() genImg!: GenImgDescriptor;
  @Input() cssWidth!: number | undefined;  // if undefined, ask the image what width it should be based on height
  @Input() cssHeight!: number;

  private currentConfig$: BehaviorSubject<PixelImageCssVarConfig[]> = new BehaviorSubject([] as any);
  @ViewChild(PixelImageCssVarDirective) private imgCssVarGen!: PixelImageCssVarDirective;

  // these things are for the size debug test page
  @Input() debugDrawnSize: [number, number] | undefined;
  debugGenImgSize$: Observable<number[]> | undefined;
  get debugForceWidth() { return this.debugDrawnSize && this.debugDrawnSize[0] }
  get debugForceHeight() { return this.debugDrawnSize && this.debugDrawnSize[1] }

  constructor() {}

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['genImg'] || changes['cssWidth'] || changes['cssHeight']) {
      this.currentConfig$.next([{
        genImg: this.genImg,
        varPrefix: 'only',
        cssWidth: this.cssWidth === undefined ? this.genImg.heightToWidthFn(this.cssHeight) : this.cssWidth,
        cssHeight: this.cssHeight
      }]);
    }
  }

  ngAfterViewInit(): void {
    this.currentConfig$.subscribe(this.imgCssVarGen.giveConfig.bind(this.imgCssVarGen));

    this.debugGenImgSize$ = this.imgCssVarGen.debugImg$.pipe(
      filter(value => !!value),
      map(value => {
        const { imgs } = value!;
        return [
          imgs.cssRequestedWidth, imgs.cssRequestedHeight,
          imgs.cssRequestedWidthCautious, imgs.cssRequestedHeightCautious
        ];
      }),
      observeOn(asapScheduler)  // prevent a change detection race condition, due to having to wait for view init
    );
  }
}
