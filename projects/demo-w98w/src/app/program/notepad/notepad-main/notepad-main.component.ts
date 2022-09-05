import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TextareaComponent } from 'projects/w98w/src/lib/textarea/textarea.component';
import { WindowCloserContext } from 'projects/w98w/src/lib/window/window.component';
import { Subscription } from 'rxjs';
import { ProgramNotepadPublishComponent } from '../notepad-publish/notepad-publish.component';

@Component({
  selector: 'app-program-notepad-main',
  templateUrl: './notepad-main.component.html',
  styleUrls: ['./notepad-main.component.scss']
})
export class ProgramNotepadMainComponent implements OnInit, OnDestroy {

  @ViewChild(TextareaComponent, { static: true }) textareaComponent!: TextareaComponent;

  @Input() windowCloser?: WindowCloserContext;

  private publishDialogSubscription?: Subscription;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.publishDialogSubscription?.unsubscribe();
    this.publishDialogSubscription = undefined;
  }

  new_() {
    this.textareaComponent.childTextArea.nativeElement.value = '';
  }

  publish() {
    this.publishDialogSubscription?.unsubscribe();
    this.publishDialogSubscription = undefined;

    if (this.windowCloser) {
      this.publishDialogSubscription = this.windowCloser.launchGenericSubscription(ProgramNotepadPublishComponent).subscribe();
    }
  }

}
