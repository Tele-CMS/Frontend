import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeanVideoComponent } from './mean-video.component';

describe('MeanVideoComponent', () => {
  let component: MeanVideoComponent;
  let fixture: ComponentFixture<MeanVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeanVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeanVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
