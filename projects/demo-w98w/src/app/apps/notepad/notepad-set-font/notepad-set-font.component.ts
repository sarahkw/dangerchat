import { Component, Input, OnInit } from '@angular/core';
import { WindowCloserContext } from 'projects/w98w/src/lib/window/window.component';

@Component({
  selector: 'app-notepad-set-font',
  templateUrl: './notepad-set-font.component.html',
  styleUrls: ['./notepad-set-font.component.scss']
})
export class NotepadSetFontComponent implements OnInit {

  @Input() windowCloser?: WindowCloserContext;

  constructor() { }

  ngOnInit(): void {
  }

}
