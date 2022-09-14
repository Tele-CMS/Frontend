import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptionAddprescriptionComponent } from './prescription-addprescription.component';

describe('PrescriptionAddprescriptionComponent', () => {
  let component: PrescriptionAddprescriptionComponent;
  let fixture: ComponentFixture<PrescriptionAddprescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrescriptionAddprescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrescriptionAddprescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
