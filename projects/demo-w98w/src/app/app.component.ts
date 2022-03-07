import { Component, OnInit } from '@angular/core';

import { DprService } from 'projects/w98w/src/lib/dpr.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'demo-w98w';

  constructor(public dprService: DprService) {}

  ngOnInit(): void {
  }
}
