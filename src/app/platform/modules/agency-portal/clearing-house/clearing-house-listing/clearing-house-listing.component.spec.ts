import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClearingHouseListingComponent } from './clearing-house-listing.component';

describe('ClearingHouseListingComponent', () => {
  let component: ClearingHouseListingComponent;
  let fixture: ComponentFixture<ClearingHouseListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClearingHouseListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClearingHouseListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
