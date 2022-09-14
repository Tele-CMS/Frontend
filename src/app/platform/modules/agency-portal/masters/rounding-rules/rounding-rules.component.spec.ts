import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundingRulesComponent } from './rounding-rules.component';

describe('RoundingRulesComponent', () => {
  let component: RoundingRulesComponent;
  let fixture: ComponentFixture<RoundingRulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoundingRulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundingRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
