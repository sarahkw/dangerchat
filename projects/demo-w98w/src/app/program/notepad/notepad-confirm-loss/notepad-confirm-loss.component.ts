import { Component, Input, OnInit } from '@angular/core';
import { WindowCloserContext } from 'projects/w98w/src/lib/window/window.component';

@Component({
  selector: 'app-program-notepad-confirm-loss',
  templateUrl: './notepad-confirm-loss.component.html',
  styleUrls: ['./notepad-confirm-loss.component.scss']
})
export class ProgramNotepadConfirmLossComponent implements OnInit {

  @Input() windowCloser?: WindowCloserContext;

  constructor() { }

  ngOnInit(): void {
  }

}
