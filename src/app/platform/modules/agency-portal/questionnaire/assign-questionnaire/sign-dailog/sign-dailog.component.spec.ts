import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignDailogComponent } from './sign-dailog.component';

describe('SignDailogComponent', () => {
  let component: SignDailogComponent;
  let fixture: ComponentFixture<SignDailogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignDailogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
