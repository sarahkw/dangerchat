import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import interact from 'interactjs';
import { Bevels } from 'projects/w98w/src/lib/bevel';

@Component({
  selector: 'app-interactjs-test',
  templateUrl: './interactjs-test.component.html',
  styleUrls: ['./interactjs-test.component.scss']
})
export class InteractjsTestComponent implements OnInit {

  readonly BEVELS = Bevels;

  @ViewChild('normal', { static: true }) normalElement!: ElementRef<HTMLElement>;
  @ViewChild('resizable', { static: true }) resizableElement!: ElementRef<HTMLElement>;
  @ViewChild('draggable', { static: true }) draggableElement!: ElementRef<HTMLElement>;

  constructor() { }

  ngOnInit(): void {
    interact(this.normalElement.nativeElement)
      .resizable({
        edges: { top: true, right: true, bottom: true, left: true },
        listeners: {
          move(event) {
            console.log(event);
          }
        }
      });

    interact(this.resizableElement.nativeElement)
      .resizable({
        edges: { top: true, right: true, bottom: true, left: true },
        listeners: {
          move(event) {
            console.log(event);
          }
        }
      });

    interact(this.draggableElement.nativeElement)
      .draggable({
        listeners: {
          start(event) {
            console.log('start', event);
          },
          move(event) {
            console.log('move', event);
          }
        }
      });
  }

}
