import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VitalModelComponent } from './vital-model.component';

describe('VitalModelComponent', () => {
  let component: VitalModelComponent;
  let fixture: ComponentFixture<VitalModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VitalModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VitalModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
