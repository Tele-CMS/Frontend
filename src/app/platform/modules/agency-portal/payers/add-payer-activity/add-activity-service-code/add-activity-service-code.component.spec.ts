import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddActivityServiceCodeComponent } from './add-activity-service-code.component';

describe('AddActivityServiceCodeComponent', () => {
  let component: AddActivityServiceCodeComponent;
  let fixture: ComponentFixture<AddActivityServiceCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddActivityServiceCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddActivityServiceCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
