import { Component, OnDestroy, OnInit } from '@angular/core';
import { StyleInjector } from 'projects/w98w/src/lib/style-injector';

@Component({
  selector: 'app-desktop-test',
  templateUrl: './desktop-test.component.html',
  styleUrls: ['./desktop-test.component.scss']
})
export class DesktopTestComponent implements OnInit, OnDestroy {

  private styleInjector = new StyleInjector();

  constructor() { }

  ngOnInit(): void {
    // Mobile browsers to not have 100vh include various bars.
    // As a side effect, can't fling the contents around even if no overflow.
    this.styleInjector.replaceStyle("body { overflow: hidden; }");
  }

  ngOnDestroy(): void {
    this.styleInjector.destroy();
  }
}
