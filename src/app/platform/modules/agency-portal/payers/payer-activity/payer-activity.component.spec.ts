import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayerActivityComponent } from './payer-activity.component';

describe('PayerActivityComponent', () => {
  let component: PayerActivityComponent;
  let fixture: ComponentFixture<PayerActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayerActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayerActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
