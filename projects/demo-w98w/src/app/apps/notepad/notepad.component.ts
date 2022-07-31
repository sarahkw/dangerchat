import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-notepad',
  templateUrl: './notepad.component.html',
  styleUrls: ['./notepad.component.scss']
})
export class NotepadComponent implements OnInit {

  @ViewChild('textArea', { static: true }) childTextArea!: ElementRef<HTMLTextAreaElement>;

  constructor() { }

  ngOnInit(): void {
  }

  new_() {
    this.childTextArea.nativeElement.value = '';
  }

}
