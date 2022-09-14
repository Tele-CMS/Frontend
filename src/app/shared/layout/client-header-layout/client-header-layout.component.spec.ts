import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientHeaderLayoutComponent } from './client-header-layout.component';

describe('ClientHeaderLayoutComponent', () => {
  let component: ClientHeaderLayoutComponent;
  let fixture: ComponentFixture<ClientHeaderLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientHeaderLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientHeaderLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
