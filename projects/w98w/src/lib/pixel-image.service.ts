import { Injectable } from '@angular/core';
import { map, Observable, shareReplay, Subscription } from 'rxjs';

import { DprService } from './dpr.service';
import { PixelImageDrawer } from './pixel-image-drawer';

import Fraction from 'fraction.js';
import { PixelImageBuilderFactory } from './pixel-image-builder';

export class PixelDrawConfig {
  readonly dpr: number;
  readonly pixelCanvasSize: number;  // how many canvas pixels should we draw per art pixel?

  private readonly denoms: number[] = [];

  constructor(dpr: number) {
    this.dpr = dpr;
    this.pixelCanvasSize = Math.round(dpr);

    {
      const f = new Fraction(dpr);
      const finv = f.inverse();
      this.denoms.push(finv.d);
      this.denoms.push(finv.simplify(0.001).d);
      this.denoms.push(finv.simplify(0.01).d);
    }
  }

  snapSize(scalar: number): number {
    const LIM = 20;

    for (const denom of this.denoms) {
      let jumpTo = Math.ceil(scalar / denom) * denom;
      let left = jumpTo - scalar;

      if (left <= LIM) {
        return jumpTo;
      }
    }

    // TODO maybe write a warning that this happened
    return Math.ceil(scalar / LIM) * LIM;
  }

  canvasSizeToCssSize(scalar: number) {
    return Math.max(Math.round(scalar / this.dpr), 1);
  }
}

@Injectable({
  providedIn: 'root'
})
export class PixelImageService {

  pixelDrawConfig$: Observable<PixelDrawConfig>;

  pids: Map<PixelImageDrawer, {refcount: number, subscription: Subscription}> = new Map();

  constructor(dprService: DprService) {
    this.pixelDrawConfig$ = dprService.value$.pipe(
      map(dpr => new PixelDrawConfig(dpr)),
      shareReplay(1) // Avoid doing the fraction calcs multiple times
      );
  }

  pidRegister(pid: PixelImageDrawer) {
    if (this.pids.has(pid)) {
      this.pids.get(pid)!.refcount += 1;
      return;
    }

    this.pids.set(pid, {
      refcount: 1,
      subscription: this.pixelDrawConfig$.subscribe(pdc => {
        pid.pidApplyImages(pid.pidGenerateImages(new PixelImageBuilderFactory(pdc)));
      })
    });
  }

  pidUnregister(pid: PixelImageDrawer) {
    let pidState = this.pids.get(pid);
    if (pidState === undefined) {
      console.error('tried to unregister unknown pid');
      return;
    }

    pidState.refcount--;
    if (pidState.refcount <= 0) {
      pidState.subscription.unsubscribe();
      pid.pidDestroy();
      this.pids.delete(pid);
    }
  }
}
