import { AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MenuTemplateDirective } from 'projects/w98w/src/lib/menu/menu-template.directive';
import { templateViewChildAsap } from 'projects/w98w/src/lib/rx/template-view-child-asap';
import { interval, map } from 'rxjs';

@Component({
  selector: 'app-test-shared-lib',
  templateUrl: './test-shared-lib.component.html',
  styleUrls: ['./test-shared-lib.component.scss']
})
export class TestSharedLibComponent implements AfterViewInit, OnDestroy {

  @ViewChild('menuTemp') private menuTemp!: MenuTemplateDirective;
  readonly menuTempDeferred = () => this.menuTemp;  // view init happens after input is processed

  @ViewChild('overflowWndTemp') private overflowWndTemp!: TemplateRef<any>;
  readonly overflowWndTempAsap = templateViewChildAsap(() => this.overflowWndTemp);

  readonly dancing$ = interval(500).pipe(map(value => [...Array(value % 5).keys()]));

  @ViewChild('menuDancingChildren') private menuDancingChildren!: MenuTemplateDirective;
  menuDancingChildrenDeferred = () => this.menuDancingChildren;

  ngAfterViewInit(): void {
    this.overflowWndTempAsap.check();
  }

  ngOnDestroy(): void {
    this.overflowWndTempAsap.complete();
  }
}
