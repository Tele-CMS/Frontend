import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramsListingComponent } from './programs-listing.component';

describe('ProgramsListingComponent', () => {
  let component: ProgramsListingComponent;
  let fixture: ComponentFixture<ProgramsListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgramsListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramsListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
