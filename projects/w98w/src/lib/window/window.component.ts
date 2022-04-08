import { Component, Directive, HostBinding, Input, OnInit } from '@angular/core';

@Directive({ selector: '[w98w-window-title-bar]'})
export class WindowTitleBarDirective {
  @HostBinding('class') hbClass = 'w98w-window-title-bar';
}

@Directive({ selector: '[w98w-window-menu-bar]'})
export class WindowMenuBarDirective {
  @HostBinding('class') hbClass = 'w98w-window-menu-bar';
}

@Component({
  selector: 'w98w-window',
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.scss']
})
export class WindowComponent implements OnInit {

  @Input() drawFrame = true;  // if maximized this will be false

  constructor() { }

  ngOnInit(): void {
  }

}
