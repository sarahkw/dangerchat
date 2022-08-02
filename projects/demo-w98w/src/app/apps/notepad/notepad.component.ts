import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { WindowCloserContext } from 'projects/w98w/src/lib/window/window.component';

@Component({
  selector: 'app-notepad',
  templateUrl: './notepad.component.html',
  styleUrls: ['./notepad.component.scss']
})
export class NotepadComponent implements OnInit {

  @ViewChild('textArea', { static: true }) childTextArea!: ElementRef<HTMLTextAreaElement>;

  @Input() windowCloser?: WindowCloserContext;

  constructor() { }

  ngOnInit(): void {
  }

  new_() {
    this.childTextArea.nativeElement.value = '';
  }

}
