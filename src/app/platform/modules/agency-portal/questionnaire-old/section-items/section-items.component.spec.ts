import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionItemsComponent } from './section-items.component';

describe('SectionItemsComponent', () => {
  let component: SectionItemsComponent;
  let fixture: ComponentFixture<SectionItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SectionItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
