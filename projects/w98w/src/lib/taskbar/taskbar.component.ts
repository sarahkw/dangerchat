import { Component, Input, OnInit } from '@angular/core';
import { MenuTemplateDirective } from '../menu/menu-template.directive';

@Component({
  selector: 'w98w-taskbar',
  templateUrl: './taskbar.component.html',
  styleUrls: ['./taskbar.component.scss']
})
export class TaskbarComponent implements OnInit {

  @Input() menuStart!: MenuTemplateDirective;

  constructor() { }

  ngOnInit(): void {
  }

}
