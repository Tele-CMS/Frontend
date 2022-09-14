import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NonBillableSoapComponent } from './non-billable-soap.component';

describe('NonBillableSoapComponent', () => {
  let component: NonBillableSoapComponent;
  let fixture: ComponentFixture<NonBillableSoapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NonBillableSoapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NonBillableSoapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
