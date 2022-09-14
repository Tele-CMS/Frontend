import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientHealthComponent } from './client-health.component';

describe('ClientHealthComponent', () => {
  let component: ClientHealthComponent;
  let fixture: ComponentFixture<ClientHealthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientHealthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientHealthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
