import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PixelImageService {

  cache: Map<string, string> = new Map();

  constructor() {
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
