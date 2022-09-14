import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayerServiceCodeModalComponent } from './payer-service-code-modal.component';

describe('PayerServiceCodeModalComponent', () => {
  let component: PayerServiceCodeModalComponent;
  let fixture: ComponentFixture<PayerServiceCodeModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayerServiceCodeModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayerServiceCodeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
