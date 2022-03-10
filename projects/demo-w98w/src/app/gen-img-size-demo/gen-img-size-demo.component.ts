import { Component, OnInit } from '@angular/core';
import { GenImg } from 'projects/w98w/src/lib/genimg';
import { BehaviorSubject, combineLatest, map, mergeMap, range, toArray } from 'rxjs';

@Component({
  selector: 'app-gen-img-size-demo',
  templateUrl: './gen-img-size-demo.component.html',
  styleUrls: ['./gen-img-size-demo.component.css']
})
export class GenImgSizeDemoComponent implements OnInit {

  readonly requestedRange$: BehaviorSubject<number> = new BehaviorSubject(5);

  readonly requestedSz$: BehaviorSubject<number> = new BehaviorSubject(9);
  readonly requestedSzArray$ = this.requestedSz$.pipe(map(v => [v]));

  readonly range$ = combineLatest([this.requestedSz$, this.requestedRange$]).pipe(mergeMap(([sz, rg]) => range(sz - rg, rg * 2 + 1).pipe(toArray())));

  readonly genImg1 = GenImg.DEBUG_X;

  animationClass: string[] = []

  constructor() { }

  ngOnInit(): void {
  }

  triggerAniX(value: boolean) {
    this.animationClass = value ? ["animateX"] : [];
  }

  triggerAniY(value: boolean) {
    this.animationClass = value ? ["animateY"] : [];
  }
}