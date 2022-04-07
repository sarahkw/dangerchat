import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Observable, share, Unsubscribable } from 'rxjs';

@Component({
  selector: 'menu[w98w-menu-bar]',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent implements OnInit, OnDestroy {

  @HostBinding('class.menu-item-can-hover') hbcMICH = true;

  // abuse rxjs for reference counting. i'm actually not sure if it's needed, like if there's
  // a race condition otherwise. but since it's so simple and canonical to do that i'm doing it this
  // way so i can save my brainpower for a different feature.
  //
  // maybe that's the beauty of rxjs. if this was just a boolean flag that other people toggle on
  // and off, i'd have to think about race conditions, like an upcoming menu toggling it on first,
  // and then the old menu toggling it off on its way out.
  private goodbye?: () => void;
  childCannotHoverToken$ = (new Observable<null>(_subscriber => {
    this.hbcMICH = false;
    this.goodbye = () => _subscriber.complete();

    const thiz = this;
    return new class implements Unsubscribable {
      unsubscribe(): void {
        thiz.hbcMICH = true;
        thiz.goodbye = undefined;
      }
    };
  })).pipe(share());

  constructor() { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.goodbye && this.goodbye();
  }
}
