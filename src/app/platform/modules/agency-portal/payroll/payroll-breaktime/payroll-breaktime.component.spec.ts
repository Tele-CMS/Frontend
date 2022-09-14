import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollBreaktimeComponent } from './payroll-breaktime.component';

describe('PayrollBreaktimeComponent', () => {
  let component: PayrollBreaktimeComponent;
  let fixture: ComponentFixture<PayrollBreaktimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayrollBreaktimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrollBreaktimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
