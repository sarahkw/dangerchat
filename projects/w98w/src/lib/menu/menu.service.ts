import { Injectable, TemplateRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class MenuService {

  currentMenu$: BehaviorSubject<TemplateRef<any>[]> = new BehaviorSubject([] as TemplateRef<any>[]);

  constructor() { }
}
