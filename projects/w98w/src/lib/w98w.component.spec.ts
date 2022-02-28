import { ComponentFixture, TestBed } from '@angular/core/testing';

import { W98wComponent } from './w98w.component';

describe('W98wComponent', () => {
  let component: W98wComponent;
  let fixture: ComponentFixture<W98wComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ W98wComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(W98wComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
