import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Edi837historyComponent } from './edi837history.component';

describe('Edi837historyComponent', () => {
  let component: Edi837historyComponent;
  let fixture: ComponentFixture<Edi837historyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Edi837historyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Edi837historyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
