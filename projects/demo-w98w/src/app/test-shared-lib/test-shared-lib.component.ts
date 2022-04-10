import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MenuTemplateDirective } from 'projects/w98w/src/lib/menu/menu-template.directive';
import { interval, map } from 'rxjs';

@Component({
  selector: 'app-test-shared-lib',
  templateUrl: './test-shared-lib.component.html',
  styleUrls: ['./test-shared-lib.component.scss']
})
export class TestSharedLibComponent {

  @ViewChild('menuTemp', { static: true }) readonly menuTemp!: MenuTemplateDirective;

  @ViewChild('overflowWndTemp', { static: true }) readonly overflowWndTemp!: TemplateRef<any>;

  readonly dancing$ = interval(500).pipe(map(value => [...Array(value % 5).keys()]));

  @ViewChild('menuDancingChildren', { static: true }) readonly menuDancingChildren!: MenuTemplateDirective;

}
