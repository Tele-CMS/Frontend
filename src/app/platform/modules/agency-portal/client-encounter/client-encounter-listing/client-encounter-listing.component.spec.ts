import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientEncounterListingComponent } from './client-encounter-listing.component';

describe('ClientEncounterListingComponent', () => {
  let component: ClientEncounterListingComponent;
  let fixture: ComponentFixture<ClientEncounterListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientEncounterListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientEncounterListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
