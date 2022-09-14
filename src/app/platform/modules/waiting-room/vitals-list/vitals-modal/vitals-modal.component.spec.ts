import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VitalsModalComponent } from './vitals-modal.component';

describe('VitalsModalComponent', () => {
  let component: VitalsModalComponent;
  let fixture: ComponentFixture<VitalsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VitalsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VitalsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
