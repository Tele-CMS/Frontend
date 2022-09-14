import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserDocumentComponent } from './add-user-document.component';

describe('AddUserDocumentComponent', () => {
  let component: AddUserDocumentComponent;
  let fixture: ComponentFixture<AddUserDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUserDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUserDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
