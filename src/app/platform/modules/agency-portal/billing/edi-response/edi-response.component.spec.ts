import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EDIResponseComponent } from './edi-response.component';

describe('EDIResponseComponent', () => {
  let component: EDIResponseComponent;
  let fixture: ComponentFixture<EDIResponseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EDIResponseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EDIResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
