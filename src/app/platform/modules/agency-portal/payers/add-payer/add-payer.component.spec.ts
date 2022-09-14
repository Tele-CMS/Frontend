import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPayerComponent } from './add-payer.component';

describe('AddPayerComponent', () => {
  let component: AddPayerComponent;
  let fixture: ComponentFixture<AddPayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
