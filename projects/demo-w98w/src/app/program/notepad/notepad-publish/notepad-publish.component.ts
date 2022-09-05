import { Component, Input, OnInit } from '@angular/core';
import { WindowCloserContext } from 'projects/w98w/src/lib/window/window.component';

@Component({
  selector: 'app-program-notepad-publish',
  templateUrl: './notepad-publish.component.html',
  styleUrls: ['./notepad-publish.component.scss']
})
export class ProgramNotepadPublishComponent implements OnInit {

  @Input() windowCloser?: WindowCloserContext;

  constructor() { }

  ngOnInit(): void {
  }

}
