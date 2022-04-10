import { AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MenuTemplateDirective } from 'projects/w98w/src/lib/menu/menu-template.directive';
import { templateViewChildAsap } from 'projects/w98w/src/lib/rx/template-view-child-asap';

@Component({
  selector: 'app-test-shared-lib',
  templateUrl: './test-shared-lib.component.html',
  styleUrls: ['./test-shared-lib.component.scss']
})
export class TestSharedLibComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('menuTemp') private menuTemp!: MenuTemplateDirective;
  readonly menuTempDeferred = () => this.menuTemp;  // view init happens after input is processed

  @ViewChild('overflowWndTemp') private overflowWndTemp!: TemplateRef<any>;
  readonly overflowWndTempAsap = templateViewChildAsap(() => this.overflowWndTemp);

  readonly numbers = [...Array(10).keys()];

  @ViewChild('menuDelayedChildren') private menuDelayedChildren!: MenuTemplateDirective;
  menuDelayedChildrenDeferred = () => this.menuDelayedChildren;

  constructor() { }

  ngAfterViewInit(): void {
    this.overflowWndTempAsap.check();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.overflowWndTempAsap.complete();
  }
}
