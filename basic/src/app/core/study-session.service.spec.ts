import { TestBed } from '@angular/core/testing';
import { StudySessionService } from './study-session.service';

describe('StudySessionService', () => {
  let service: StudySessionService;

  beforeEach(() => {
    window.localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudySessionService);
  });

  it('tracks completed lessons by level without mixing state', () => {
    service.markCompleted('basic', '01-signals');
    service.markCompleted('medium', '01-feature-architecture');

    expect(service.completedCount('basic')).toBe(1);
    expect(service.completedCount('medium')).toBe(1);
    expect(service.isCompleted('basic', '01-feature-architecture')).toBe(false);
  });

  it('tracks minutes by level and computes progress percent', () => {
    service.addMinutes('basic', 20);
    service.addMinutes('medium', 30);

    expect(service.minutes('basic')).toBe(20);
    expect(service.minutes('medium')).toBe(30);
    expect(service.progressPercent('basic', 8)).toBe(0);

    service.markCompleted('basic', '01-signals');
    expect(service.progressPercent('basic', 8)).toBe(13);
  });
});
