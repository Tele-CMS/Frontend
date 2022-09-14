import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollGroupComponent } from './payroll-group.component';

describe('PayrollGroupComponent', () => {
  let component: PayrollGroupComponent;
  let fixture: ComponentFixture<PayrollGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayrollGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrollGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
