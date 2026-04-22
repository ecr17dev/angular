import { TestBed } from '@angular/core/testing';
import { LessonRegistryService } from './lesson-registry.service';

describe('LessonRegistryService', () => {
  let service: LessonRegistryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LessonRegistryService);
  });

  it('returns basic lessons sorted by order', () => {
    const lessons = service.getLessons('basic');
    expect(lessons[0]?.slug).toBe('01-signals');
    expect(lessons[lessons.length - 1]?.slug).toBe('08-testing-basics');
  });

  it('returns medium lessons sorted by order', () => {
    const lessons = service.getLessons('medium');
    expect(lessons[0]?.slug).toBe('01-feature-architecture');
    expect(lessons[lessons.length - 1]?.slug).toBe('08-testing-integration');
  });

  it('returns adjacent lessons within the same level', () => {
    const adjacent = service.getAdjacent('medium', '05-reactive-forms-advanced');
    expect(adjacent.previous?.slug).toBe('04-http-interceptors');
    expect(adjacent.next?.slug).toBe('06-rxjs-orchestration');
  });

  it('includes pedagogical content fields for every level lesson', () => {
    const lessons = [...service.getLessons('basic'), ...service.getLessons('medium')];

    for (const lesson of lessons) {
      expect(lesson.foundation.length).toBeGreaterThan(10);
      expect(lesson.guidedExample.length).toBeGreaterThan(10);
      expect(lesson.vueBridge.length).toBeGreaterThan(10);
      expect(lesson.quickWins.length).toBeGreaterThanOrEqual(3);
      expect(lesson.funPrompt.length).toBeGreaterThan(8);
      expect(lesson.iconKey).toBeTruthy();
    }
  });
});
