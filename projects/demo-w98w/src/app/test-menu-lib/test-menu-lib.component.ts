import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MenuTemplateDirective } from 'projects/w98w/src/lib/menu/menu-template.directive';
import { asapScheduler, Observable, observeOn, ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-test-menu-lib',
  templateUrl: './test-menu-lib.component.html',
  styleUrls: ['./test-menu-lib.component.css']
})
export class TestMenuLibComponent implements OnInit, AfterViewInit {

  @ViewChild('menuTemp') menuTemp!: MenuTemplateDirective;

  // workaround to be able to use the value as an input param, as views are resolved after inputs are
  menuTempDeferred = (function (this: TestMenuLibComponent) {
    return this.menuTemp;
  }).bind(this);

  // TODO this is a lot of boilerplate maybe we need to factor it
  @ViewChild('overflowWndTemp') overflowWndTemp!: TemplateRef<any>;
  private overflowWndTemp$: ReplaySubject<typeof this.overflowWndTemp> = new ReplaySubject(1);
  overflowWndTempDeferred$ = this.overflowWndTemp$.pipe(observeOn(asapScheduler));

  constructor() { }

  ngAfterViewInit(): void {
    this.overflowWndTemp$.next(this.overflowWndTemp);
  }

  ngOnInit(): void {
  }

}
