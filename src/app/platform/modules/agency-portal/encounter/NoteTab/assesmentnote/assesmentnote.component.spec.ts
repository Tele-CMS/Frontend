import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssesmentnoteComponent } from './assesmentnote.component';

describe('AssesmentnoteComponent', () => {
  let component: AssesmentnoteComponent;
  let fixture: ComponentFixture<AssesmentnoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssesmentnoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssesmentnoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
