import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MenuTemplateDirective } from 'projects/w98w/src/lib/menu/menu-template.directive';
import { asapScheduler, observeOn, ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-test-shared-lib',
  templateUrl: './test-shared-lib.component.html',
  styleUrls: ['./test-shared-lib.component.scss']
})
export class TestSharedLibComponent implements OnInit, AfterViewInit {

  @ViewChild('menuTemp') menuTemp!: MenuTemplateDirective;

  // workaround to be able to use the value as an input param, as views are resolved after inputs are
  readonly menuTempDeferred = () => this.menuTemp;

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
