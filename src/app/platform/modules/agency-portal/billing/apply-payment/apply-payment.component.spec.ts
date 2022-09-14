import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyPaymentComponent } from './apply-payment.component';

describe('ApplyPaymentComponent', () => {
  let component: ApplyPaymentComponent;
  let fixture: ComponentFixture<ApplyPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplyPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
