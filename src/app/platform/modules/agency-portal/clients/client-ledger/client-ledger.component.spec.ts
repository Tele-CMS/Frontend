import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientLedgerComponent } from './client-ledger.component';

describe('ClientLedgerComponent', () => {
  let component: ClientLedgerComponent;
  let fixture: ComponentFixture<ClientLedgerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientLedgerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
