import { Component, OnInit } from '@angular/core';
import { GenImg } from 'projects/w98w/src/lib/genimg';
import { BehaviorSubject, flatMap, map, mergeMap, range, toArray } from 'rxjs';

@Component({
  selector: 'app-gen-img-demo',
  templateUrl: './gen-img-demo.component.html',
  styleUrls: ['./gen-img-demo.component.css']
})
export class GenImgDemoComponent implements OnInit {

  readonly requestedSz$: BehaviorSubject<number> = new BehaviorSubject(9);
  readonly requestedSzArray$ = this.requestedSz$.pipe(map(v => [v]));
  readonly range$ = this.requestedSz$.pipe(mergeMap(v => range(v - 5, 10).pipe(toArray())));

  readonly genImg1 = GenImg.TBAR_X;

  constructor() { }

  ngOnInit(): void {
  }

}
