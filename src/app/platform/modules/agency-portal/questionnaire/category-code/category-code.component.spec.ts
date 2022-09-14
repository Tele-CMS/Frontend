import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryCodeComponent } from './category-code.component';

describe('CategoryCodeComponent', () => {
  let component: CategoryCodeComponent;
  let fixture: ComponentFixture<CategoryCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
