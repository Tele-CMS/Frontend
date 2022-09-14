import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAlertsListingComponent } from './client-alerts-listing.component';

describe('ClientAlertsListingComponent', () => {
  let component: ClientAlertsListingComponent;
  let fixture: ComponentFixture<ClientAlertsListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientAlertsListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientAlertsListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
