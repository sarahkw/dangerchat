import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DprService implements OnDestroy {

  value$: BehaviorSubject<number> = new BehaviorSubject(window.devicePixelRatio);

  // use AbortController so i don't have to keep instances of MediaQueryList around
  private abortController = new AbortController();

  private boundTick: () => void;

  constructor() {
    // use less memory as suggested by MDN, even though it should be insignificant
    this.boundTick = this.tick.bind(this);

    this.listen();
  }

  private listen() {
    matchMedia(`(resolution: ${this.value$.value}dppx)`)
      .addEventListener("change", this.boundTick,
        {
          once: true,
          signal: this.abortController.signal
        });
  }

  private tick() {
    this.value$.next(window.devicePixelRatio);
    this.listen();
  }

  ngOnDestroy(): void {
    this.abortController.abort();
  }
}
