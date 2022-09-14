import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDocumentsComponent } from './user-documents.component';

describe('UserDocumentsComponent', () => {
  let component: UserDocumentsComponent;
  let fixture: ComponentFixture<UserDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
