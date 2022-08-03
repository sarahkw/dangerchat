import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { WindowCloserContext } from 'projects/w98w/src/lib/window/window.component';
import { Subscription } from 'rxjs';
import { NotepadSetFontComponent } from './notepad-set-font/notepad-set-font.component';

@Component({
  selector: 'app-notepad',
  templateUrl: './notepad.component.html',
  styleUrls: ['./notepad.component.scss']
})
export class NotepadComponent implements OnInit, OnDestroy {

  @ViewChild('textArea', { static: true }) childTextArea!: ElementRef<HTMLTextAreaElement>;

  @Input() windowCloser?: WindowCloserContext;

  constructor() { }


  ngOnInit(): void {
  }

  new_() {
    this.childTextArea.nativeElement.value = '';
  }

  private fontDialogSubscription?: Subscription;

  setFont() {
    if (this.windowCloser) {
      this.fontDialogSubscription = this.windowCloser.launchGenericSubscription(NotepadSetFontComponent).subscribe();
    }
  }

  ngOnDestroy(): void {
    this.fontDialogSubscription?.unsubscribe();
  }
}
