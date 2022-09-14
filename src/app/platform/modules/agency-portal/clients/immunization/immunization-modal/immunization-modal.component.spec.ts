import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImmunizationModalComponent } from './immunization-modal.component';

describe('ImmunizationModalComponent', () => {
  let component: ImmunizationModalComponent;
  let fixture: ComponentFixture<ImmunizationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImmunizationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImmunizationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
