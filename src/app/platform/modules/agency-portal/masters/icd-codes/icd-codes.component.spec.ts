import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IcdCodesComponent } from './icd-codes.component';

describe('IcdCodesComponent', () => {
  let component: IcdCodesComponent;
  let fixture: ComponentFixture<IcdCodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IcdCodesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IcdCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
