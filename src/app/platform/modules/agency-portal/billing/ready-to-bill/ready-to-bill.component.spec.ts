import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadyToBillComponent } from './ready-to-bill.component';

describe('ReadyToBillComponent', () => {
  let component: ReadyToBillComponent;
  let fixture: ComponentFixture<ReadyToBillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadyToBillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadyToBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
