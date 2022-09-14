import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyHistoryModelComponent } from './family-history-model.component';

describe('FamilyHistoryModelComponent', () => {
  let component: FamilyHistoryModelComponent;
  let fixture: ComponentFixture<FamilyHistoryModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FamilyHistoryModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyHistoryModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
