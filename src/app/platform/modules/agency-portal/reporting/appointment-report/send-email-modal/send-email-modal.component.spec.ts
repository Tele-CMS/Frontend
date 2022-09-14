import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendEmailModalComponent } from './send-email-modal.component';

describe('SendEmailModalComponent', () => {
  let component: SendEmailModalComponent;
  let fixture: ComponentFixture<SendEmailModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendEmailModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendEmailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
