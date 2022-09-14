import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientLedgerDetailComponent } from './client-ledger-detail.component';

describe('ClientLedgerDetailComponent', () => {
  let component: ClientLedgerDetailComponent;
  let fixture: ComponentFixture<ClientLedgerDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientLedgerDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientLedgerDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
