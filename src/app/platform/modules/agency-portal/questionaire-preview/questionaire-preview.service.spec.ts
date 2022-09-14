import { TestBed } from '@angular/core/testing';

import { QuestionairePreviewService } from './questionaire-preview.service';

describe('QuestionairePreviewService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QuestionairePreviewService = TestBed.get(QuestionairePreviewService);
    expect(service).toBeTruthy();
  });
});
