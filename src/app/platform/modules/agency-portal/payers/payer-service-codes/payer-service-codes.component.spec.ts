import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayerServiceCodesComponent } from './payer-service-codes.component';

describe('PayerServiceCodesComponent', () => {
  let component: PayerServiceCodesComponent;
  let fixture: ComponentFixture<PayerServiceCodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayerServiceCodesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayerServiceCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
