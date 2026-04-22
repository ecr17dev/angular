import { TestBed } from '@angular/core/testing';
import { PracticeStorageService } from './practice-storage.service';

describe('PracticeStorageService', () => {
  let service: PracticeStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PracticeStorageService);
    window.localStorage.clear();
  });

  it('saves and restores draft/progress by level, lesson and challenge', () => {
    service.saveDraft('basic', '02-templates', 'templates-if-else', 'code-1');
    service.saveProgress('basic', '02-templates', 'templates-if-else', { attempts: 2, approved: false });

    expect(service.loadDraft('basic', '02-templates', 'templates-if-else')).toBe('code-1');
    expect(service.loadProgress('basic', '02-templates', 'templates-if-else')).toEqual({
      attempts: 2,
      approved: false
    });
  });

  it('reset clears only target challenge in target level', () => {
    service.saveDraft('basic', '02-templates', 'templates-if-else', 'target');
    service.saveProgress('basic', '02-templates', 'templates-if-else', { attempts: 1, approved: false });

    service.saveDraft('medium', '01-feature-architecture', 'medium-feature-architecture', 'other');
    service.saveProgress('medium', '01-feature-architecture', 'medium-feature-architecture', {
      attempts: 3,
      approved: true
    });

    service.resetChallenge('basic', '02-templates', 'templates-if-else');

    expect(service.loadDraft('basic', '02-templates', 'templates-if-else')).toBeNull();
    expect(service.loadProgress('basic', '02-templates', 'templates-if-else')).toEqual({
      attempts: 0,
      approved: false
    });

    expect(service.loadDraft('medium', '01-feature-architecture', 'medium-feature-architecture')).toBe('other');
    expect(service.loadProgress('medium', '01-feature-architecture', 'medium-feature-architecture')).toEqual({
      attempts: 3,
      approved: true
    });
  });
});
