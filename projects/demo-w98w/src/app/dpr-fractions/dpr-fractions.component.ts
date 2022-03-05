import { Component, OnInit } from '@angular/core';
import { range, toArray } from 'rxjs';

import Fraction from 'fraction.js';

@Component({
  selector: 'app-dpr-fractions',
  templateUrl: './dpr-fractions.component.html',
  styleUrls: ['./dpr-fractions.component.css']
})
export class DprFractionsComponent implements OnInit {

  range$ = range(1, 100).pipe(toArray());

  dpr() {
    return window.devicePixelRatio;
  }

  constructor() { }

  ngOnInit(): void {
  }

  fraction(simplify?: number) {
    const f = new Fraction(window.devicePixelRatio);
    const finv = f.inverse();
    let result = finv;
    if (simplify !== undefined) {
      result = result.simplify(simplify);
    }
    return result;
  }

  fractionStr(simplify?: number) {
    const result = this.fraction(simplify);
    return `${result.n} / ${result.d}`;
  }
}
