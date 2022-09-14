import { TasksDialogModule } from './tasks-dialog.module';

describe('TasksDialogModule', () => {
  let tasksDialogModule: TasksDialogModule;

  beforeEach(() => {
    tasksDialogModule = new TasksDialogModule();
  });

  it('should create an instance', () => {
    expect(tasksDialogModule).toBeTruthy();
  });
});
