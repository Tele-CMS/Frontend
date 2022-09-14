import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayerListingComponent } from './payer-listing.component';

describe('PayerListingComponent', () => {
  let component: PayerListingComponent;
  let fixture: ComponentFixture<PayerListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayerListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayerListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
