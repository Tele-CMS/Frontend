import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MemberProgramsEnrollComponent } from './programsenroll-log.component';


describe('AuditLogComponent', () => {
  let component: MemberProgramsEnrollComponent;
  let fixture: ComponentFixture<MemberProgramsEnrollComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberProgramsEnrollComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberProgramsEnrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
