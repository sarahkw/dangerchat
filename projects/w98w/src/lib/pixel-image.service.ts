import { Injectable } from '@angular/core';
import { PixelImageDrawer } from './pixel-image-drawer';

@Injectable({
  providedIn: 'root'
})
export class PixelImageService {

  pids: Map<PixelImageDrawer, number> = new Map();

  cache: Map<string, string> = new Map();

  constructor() {
  }

  pidRegister(pid: PixelImageDrawer) {
    if (this.pids.has(pid)) {
      this.pids.set(pid, this.pids.get(pid)! + 1);
      return;
    }

    this.pids.set(pid, 1);
    pid.pidApplyImages(pid.pidGenerateImages(this, window.devicePixelRatio));
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
