import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VitalModalComponent } from './vital-modal.component';

describe('VitalModalComponent', () => {
  let component: VitalModalComponent;
  let fixture: ComponentFixture<VitalModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VitalModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VitalModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
