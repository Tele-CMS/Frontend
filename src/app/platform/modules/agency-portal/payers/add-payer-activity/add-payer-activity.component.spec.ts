import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPayerActivityComponent } from './add-payer-activity.component';

describe('AddPayerActivityComponent', () => {
  let component: AddPayerActivityComponent;
  let fixture: ComponentFixture<AddPayerActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPayerActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPayerActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
