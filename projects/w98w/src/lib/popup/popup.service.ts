import { Injectable, TemplateRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class PopupService {

  currentPopup$: BehaviorSubject<TemplateRef<any>[]> = new BehaviorSubject([] as TemplateRef<any>[]);

  openPopup(childTemplate: TemplateRef<any>) {
    this.currentPopup$.next([childTemplate]);
  }

  closePopup() {
    this.currentPopup$.next([]);
  }
}
