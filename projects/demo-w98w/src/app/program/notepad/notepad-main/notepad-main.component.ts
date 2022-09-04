import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { WindowCloserContext } from 'projects/w98w/src/lib/window/window.component';

@Component({
  selector: 'app-program-notepad-main',
  templateUrl: './notepad-main.component.html',
  styleUrls: ['./notepad-main.component.scss']
})
export class ProgramNotepadMainComponent implements OnInit {

  @ViewChild('textArea', { static: true }) childTextArea!: ElementRef<HTMLTextAreaElement>;

  @Input() windowCloser?: WindowCloserContext;

  constructor() { }


  ngOnInit(): void {
  }

  new_() {
    this.childTextArea.nativeElement.value = '';
  }
}
