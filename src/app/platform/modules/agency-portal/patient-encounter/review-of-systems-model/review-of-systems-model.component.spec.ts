import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewOfSystemsModelComponent } from './review-of-systems-model.component';

describe('ReviewOfSystemsModelComponent', () => {
  let component: ReviewOfSystemsModelComponent;
  let fixture: ComponentFixture<ReviewOfSystemsModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewOfSystemsModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewOfSystemsModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
