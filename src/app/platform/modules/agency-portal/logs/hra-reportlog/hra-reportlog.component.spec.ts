import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HRAReportLogComponent } from './hra-reportlog.component';

describe('AuditLogComponent', () => {
  let component: HRAReportLogComponent;
  let fixture: ComponentFixture<HRAReportLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HRAReportLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HRAReportLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
