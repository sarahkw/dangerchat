import { Injectable } from '@angular/core';
import { map, Observable, shareReplay, Subscription } from 'rxjs';

import { DprService } from './dpr.service';
import { PixelImageDrawer } from './pixel-image-drawer';

import Fraction from 'fraction.js';

export class PixelDrawConfig {
  readonly dpr: number;
  readonly pixelCanvasSize: number;

  private readonly denoms: number[] = [];

  constructor(dpr: number) {
    this.dpr = dpr;
    this.pixelCanvasSize = Math.ceil(dpr);

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
}

@Injectable({
  providedIn: 'root'
})
export class PixelImageService {

  pixelDrawConfig$: Observable<PixelDrawConfig>;

  pids: Map<PixelImageDrawer, {refcount: number, subscription: Subscription}> = new Map();

  cache: Map<string, string> = new Map();

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
        pid.pidApplyImages(pid.pidGenerateImages(this, pdc.dpr));
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

  ensureImage(uniqueKey: string, width: number, height: number,
    draw: (canvas: CanvasRenderingContext2D) => void): string
  {
    if (this.cache.has(uniqueKey)) {
      return this.cache.get(uniqueKey)!;
    }

    let oCanvas = document.createElement('canvas');
    oCanvas.width = width;
    oCanvas.height = height;
    let oCtx = oCanvas.getContext('2d');
    draw(oCtx!); // todo: what if this is actually null
    let result = oCanvas.toDataURL();
    this.cache.set(uniqueKey, result);
    return result;
  }

}
