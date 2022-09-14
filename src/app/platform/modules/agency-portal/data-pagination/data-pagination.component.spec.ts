import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataPaginationComponent } from './data-pagination.component';

describe('DataPaginationComponent', () => {
  let component: DataPaginationComponent;
  let fixture: ComponentFixture<DataPaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataPaginationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
