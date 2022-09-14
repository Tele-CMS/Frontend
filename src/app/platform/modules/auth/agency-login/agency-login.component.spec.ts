import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyLoginComponent } from './agency-login.component';

describe('AgencyLoginComponent', () => {
  let component: AgencyLoginComponent;
  let fixture: ComponentFixture<AgencyLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgencyLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgencyLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
