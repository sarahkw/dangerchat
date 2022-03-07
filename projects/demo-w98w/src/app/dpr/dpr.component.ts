import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { range, toArray } from 'rxjs';

import { DprService } from 'projects/w98w/src/lib/dpr.service';
import { PixelDrawConfig } from 'projects/w98w/src/lib/pixel-image.service';

import Fraction from 'fraction.js';

@Component({
  selector: 'app-dpr',
  templateUrl: './dpr.component.html',
  styleUrls: ['./dpr.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DprComponent implements OnInit {

  range$ = range(1, 100).pipe(toArray());

  constructor(public dprService: DprService) { }

  ngOnInit(): void {
  }

  fraction = DprComponent.fraction;
  static fraction(dpr: number, simplify?: number) {
    const f = new Fraction(dpr);
    const finv = f.inverse();
    let result = finv;
    if (simplify !== undefined) {
      result = result.simplify(simplify);
    }
    return result;
  }

  fractionStr = DprComponent.fractionStr;
  static fractionStr(dpr: number, simplify?: number) {
    const result = DprComponent.fraction(dpr, simplify);
    return `${result.n} / ${result.d}`;
  }

  toPixelDrawConfig = DprComponent.toPixelDrawConfig;
  static toPixelDrawConfig(dpr: number) {
    return new PixelDrawConfig(dpr);
  }
}
