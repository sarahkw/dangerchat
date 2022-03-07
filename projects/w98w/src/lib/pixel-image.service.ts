import { Injectable } from '@angular/core';
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

    return Math.ceil(scalar / LIM) * LIM;
  }
}

@Injectable({
  providedIn: 'root'
})
export class PixelImageService {

  pids: Map<PixelImageDrawer, number> = new Map();

  cache: Map<string, string> = new Map();

  constructor(private dprService: DprService) {
  }

  pidRegister(pid: PixelImageDrawer) {
    if (this.pids.has(pid)) {
      this.pids.set(pid, this.pids.get(pid)! + 1);
      return;
    }

    this.pids.set(pid, 1);
    pid.pidApplyImages(pid.pidGenerateImages(this, this.dprService.value$.value));
  }

  pidUnregister(pid: PixelImageDrawer) {
    if (!this.pids.has(pid)) {
      console.error('tried to unregister unknown pid');
      return;
    }

    let newCount = this.pids.get(pid)! - 1;
    if (newCount <= 0) {
      pid.pidDestroy();
      this.pids.delete(pid);
    } else {
      this.pids.set(pid, newCount);
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
