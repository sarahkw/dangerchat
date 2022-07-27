import { Component, Input, OnInit, Optional } from '@angular/core';
import { DesktopComponent } from '../desktop/desktop.component';
import { MenuTemplateDirective } from '../menu/menu-template.directive';

@Component({
  selector: 'w98w-taskbar',
  templateUrl: './taskbar.component.html',
  styleUrls: ['./taskbar.component.scss']
})
export class TaskbarComponent implements OnInit {

  @Input() menuStart!: MenuTemplateDirective;

  constructor(@Optional() public desktop: DesktopComponent) { }

  ngOnInit(): void {
  }

}
