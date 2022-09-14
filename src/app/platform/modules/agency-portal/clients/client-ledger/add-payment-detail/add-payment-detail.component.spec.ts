import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPaymentDetailComponent } from './add-payment-detail.component';

describe('AddPaymentDetailComponent', () => {
  let component: AddPaymentDetailComponent;
  let fixture: ComponentFixture<AddPaymentDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPaymentDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPaymentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
