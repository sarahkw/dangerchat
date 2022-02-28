import { TestBed } from '@angular/core/testing';

import { W98wService } from './w98w.service';

describe('W98wService', () => {
  let service: W98wService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(W98wService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
