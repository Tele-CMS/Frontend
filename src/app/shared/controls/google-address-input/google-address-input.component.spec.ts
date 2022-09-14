import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleAddressInputComponent } from './google-address-input.component';

describe('GoogleAddressInputComponent', () => {
  let component: GoogleAddressInputComponent;
  let fixture: ComponentFixture<GoogleAddressInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoogleAddressInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleAddressInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
