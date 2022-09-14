import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AssignAssessmentModalComponent } from './assign-assessment-modal.component';



describe('AssignAssessmentModalComponent', () => {
  let component: AssignAssessmentModalComponent;
  let fixture: ComponentFixture<AssignAssessmentModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignAssessmentModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignAssessmentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
