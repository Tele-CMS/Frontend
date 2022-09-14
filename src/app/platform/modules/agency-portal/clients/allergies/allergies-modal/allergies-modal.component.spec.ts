import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllergiesModalComponent } from './allergies-modal.component';

describe('AllergiesModalComponent', () => {
  let component: AllergiesModalComponent;
  let fixture: ComponentFixture<AllergiesModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllergiesModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllergiesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
