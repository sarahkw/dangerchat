import { Injectable, TemplateRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class PopupService {

  currentPopup$: BehaviorSubject<TemplateRef<unknown>[]> = new BehaviorSubject([] as TemplateRef<unknown>[]);

  openPopup(childTemplate: TemplateRef<unknown>) {
    this.currentPopup$.next([childTemplate]);
  }

  closePopup() {
    this.currentPopup$.next([]);
  }
}
