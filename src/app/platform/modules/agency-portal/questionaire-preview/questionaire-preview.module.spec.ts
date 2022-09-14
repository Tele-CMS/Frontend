import { QuestionairePreviewModule } from './questionaire-preview.module';

describe('QuestionairePreviewModule', () => {
  let questionairePreviewModule: QuestionairePreviewModule;

  beforeEach(() => {
    questionairePreviewModule = new QuestionairePreviewModule();
  });

  it('should create an instance', () => {
    expect(questionairePreviewModule).toBeTruthy();
  });
});
