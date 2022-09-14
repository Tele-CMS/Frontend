import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAwardComponent } from './user-award.component';

describe('UserAwardComponent', () => {
  let component: UserAwardComponent;
  let fixture: ComponentFixture<UserAwardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserAwardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
