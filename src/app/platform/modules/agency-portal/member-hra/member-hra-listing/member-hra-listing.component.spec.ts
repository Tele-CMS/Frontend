import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberHraListingComponent } from './member-hra-listing.component';

describe('MemberHraListingComponent', () => {
  let component: MemberHraListingComponent;
  let fixture: ComponentFixture<MemberHraListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberHraListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberHraListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
