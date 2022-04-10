import { AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MenuTemplateDirective } from 'projects/w98w/src/lib/menu/menu-template.directive';
import { templateViewChildAsap } from 'projects/w98w/src/lib/rx/template-view-child-asap';

@Component({
  selector: 'app-test-shared-lib',
  templateUrl: './test-shared-lib.component.html',
  styleUrls: ['./test-shared-lib.component.scss']
})
export class TestSharedLibComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('menuTemp') menuTemp!: MenuTemplateDirective;

  // workaround to be able to use the value as an input param, as views are resolved after inputs are
  readonly menuTempDeferred = () => this.menuTemp;

  @ViewChild('overflowWndTemp') private overflowWndTemp!: TemplateRef<any>;
  readonly overflowWndTempAsap = templateViewChildAsap(() => this.overflowWndTemp);

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
