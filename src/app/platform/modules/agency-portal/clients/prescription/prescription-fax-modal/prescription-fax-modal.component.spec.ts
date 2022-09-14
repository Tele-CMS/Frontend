import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptionFaxModalComponent } from './prescription-fax-modal.component';

describe('PrescriptionFaxModalComponent', () => {
  let component: PrescriptionFaxModalComponent;
  let fixture: ComponentFixture<PrescriptionFaxModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrescriptionFaxModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrescriptionFaxModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
