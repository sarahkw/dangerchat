import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ScreenComponent } from 'projects/w98w/src/lib/screen/screen.component';

@Component({
  selector: 'app-hello-app',
  templateUrl: './hello-app.component.html',
  styleUrls: ['./hello-app.component.scss']
})
export class HelloAppComponent implements OnInit {

  @Input() screen!: ScreenComponent;

  @ViewChild('overflowWndTemp', {static: true}) wnd!: TemplateRef<unknown>;

  constructor() { }

  ngOnInit(): void {
  }

}
