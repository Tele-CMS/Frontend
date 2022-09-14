import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CurrentMedicationModalComponent } from './current-medication-modal.component';


describe('CurrentMedicationModalComponent', () => {
  let component: CurrentMedicationModalComponent;
  let fixture: ComponentFixture<CurrentMedicationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentMedicationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentMedicationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
