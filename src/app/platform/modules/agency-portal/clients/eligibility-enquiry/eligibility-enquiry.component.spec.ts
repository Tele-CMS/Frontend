import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EligibilityEnquiryComponent } from './eligibility-enquiry.component';

describe('EligibilityEnquiryComponent', () => {
  let component: EligibilityEnquiryComponent;
  let fixture: ComponentFixture<EligibilityEnquiryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EligibilityEnquiryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EligibilityEnquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
