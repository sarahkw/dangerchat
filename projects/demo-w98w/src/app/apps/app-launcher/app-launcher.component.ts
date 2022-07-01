import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ScreenComponent } from 'projects/w98w/src/lib/screen/screen.component';

@Component({
  selector: 'app-app-launcher',
  templateUrl: './app-launcher.component.html',
  styleUrls: ['./app-launcher.component.scss']
})
export class AppLauncherComponent implements OnInit {

  @Input() screen!: ScreenComponent;

  @ViewChild('overflowWndTemp', {static: true}) wnd!: TemplateRef<unknown>;

  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      this.screen.contentParent.viewContainer.createEmbeddedView(this.wnd);
    }, 1000);
  }

}
