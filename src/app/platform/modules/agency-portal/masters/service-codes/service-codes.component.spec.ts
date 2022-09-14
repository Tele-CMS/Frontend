import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceCodesComponent } from './service-codes.component';

describe('ServiceCodesComponent', () => {
  let component: ServiceCodesComponent;
  let fixture: ComponentFixture<ServiceCodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceCodesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
