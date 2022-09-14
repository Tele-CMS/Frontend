import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserQualificationComponent } from './user-qualification.component';

describe('UserQualificationComponent', () => {
  let component: UserQualificationComponent;
  let fixture: ComponentFixture<UserQualificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserQualificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserQualificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
