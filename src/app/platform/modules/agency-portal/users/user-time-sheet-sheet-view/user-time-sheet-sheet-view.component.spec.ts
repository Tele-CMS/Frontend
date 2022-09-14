import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTimeSheetSheetViewComponent } from './user-time-sheet-sheet-view.component';

describe('UserTimeSheetSheetViewComponent', () => {
  let component: UserTimeSheetSheetViewComponent;
  let fixture: ComponentFixture<UserTimeSheetSheetViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserTimeSheetSheetViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserTimeSheetSheetViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
