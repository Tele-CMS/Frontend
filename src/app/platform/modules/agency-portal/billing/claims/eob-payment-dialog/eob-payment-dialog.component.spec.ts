import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EobPaymentDialogComponent } from './eob-payment-dialog.component';

describe('EobPaymentDialogComponent', () => {
  let component: EobPaymentDialogComponent;
  let fixture: ComponentFixture<EobPaymentDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EobPaymentDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EobPaymentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
