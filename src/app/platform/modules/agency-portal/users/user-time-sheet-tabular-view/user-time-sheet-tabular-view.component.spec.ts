import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTimeSheetTabularViewComponent } from './user-time-sheet-tabular-view.component';

describe('UserTimeSheetTabularViewComponent', () => {
  let component: UserTimeSheetTabularViewComponent;
  let fixture: ComponentFixture<UserTimeSheetTabularViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserTimeSheetTabularViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserTimeSheetTabularViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
