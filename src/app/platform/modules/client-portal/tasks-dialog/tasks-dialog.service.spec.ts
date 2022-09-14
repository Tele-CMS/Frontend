import { TestBed } from '@angular/core/testing';

import { TasksDialogService } from './tasks-dialog.service';

describe('TasksDialogService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TasksDialogService = TestBed.get(TasksDialogService);
    expect(service).toBeTruthy();
  });
});
