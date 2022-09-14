import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollRateComponent } from './payroll-rate.component';

describe('PayrollRateComponent', () => {
  let component: PayrollRateComponent;
  let fixture: ComponentFixture<PayrollRateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayrollRateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrollRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
