import { Component, OnInit } from '@angular/core';
import { GenImg } from 'projects/w98w/src/lib/genimg';
import { BehaviorSubject, combineLatest, map, mergeMap, range, toArray } from 'rxjs';

@Component({
  selector: 'app-gen-img-demo',
  templateUrl: './gen-img-demo.component.html',
  styleUrls: ['./gen-img-demo.component.css']
})
export class GenImgDemoComponent implements OnInit {

  readonly requestedRange$: BehaviorSubject<number> = new BehaviorSubject(5);

  readonly requestedSz$: BehaviorSubject<number> = new BehaviorSubject(9);
  readonly requestedSzArray$ = this.requestedSz$.pipe(map(v => [v]));

  readonly range$ = combineLatest([this.requestedSz$, this.requestedRange$]).pipe(mergeMap(([sz, rg]) => range(sz - rg, rg * 2 + 1).pipe(toArray())));

  readonly genImg1 = GenImg.DEBUG_X;

  animationTrigger = false;

  constructor() { }

  ngOnInit(): void {
  }

}
