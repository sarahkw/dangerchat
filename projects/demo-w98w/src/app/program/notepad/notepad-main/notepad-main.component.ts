import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { TextareaComponent } from 'projects/w98w/src/lib/textarea/textarea.component';
import { WindowCloserContext } from 'projects/w98w/src/lib/window/window.component';
import { ProgramNotepadConfirmLossComponent } from '../notepad-confirm-loss/notepad-confirm-loss.component';

@Component({
  selector: 'app-program-notepad-main',
  templateUrl: './notepad-main.component.html',
  styleUrls: ['./notepad-main.component.scss']
})
export class ProgramNotepadMainComponent implements OnInit {

  @ViewChild(TextareaComponent, { static: true }) textareaComponent!: TextareaComponent;

  @Input() windowCloser?: WindowCloserContext;

  constructor() { }


  ngOnInit(): void {
  }

  new_() {
    // this.textareaComponent.childTextArea.nativeElement.value = '';
    this.windowCloser?.launch(ProgramNotepadConfirmLossComponent);
  }
}
