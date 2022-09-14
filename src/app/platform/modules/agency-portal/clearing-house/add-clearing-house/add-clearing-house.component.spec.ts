import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddClearingHouseComponent } from './add-clearing-house.component';

describe('AddClearingHouseComponent', () => {
  let component: AddClearingHouseComponent;
  let fixture: ComponentFixture<AddClearingHouseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddClearingHouseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddClearingHouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
