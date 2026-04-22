import { TestBed } from '@angular/core/testing';
import { PracticeEngineService } from './practice-engine.service';
import { PracticeRegistryService } from './practice-registry.service';

describe('PracticeEngineService', () => {
  let engine: PracticeEngineService;
  let registry: PracticeRegistryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    engine = TestBed.inject(PracticeEngineService);
    registry = TestBed.inject(PracticeRegistryService);
  });

  it('approves when all tests pass', () => {
    const challenge = registry.getChallenge('basic', '02-templates', 'templates-for-track');
    expect(challenge).toBeTruthy();

    const validCode = `@for (item of items; track item.id) {
  <li>{{ item.name }}</li>
}`;

    const result = engine.verify(challenge!, validCode, 1);

    expect(result.approved).toBe(true);
    expect(result.score).toBe(100);
    expect(result.results.every((item) => item.passed)).toBe(true);
  });

  it('returns progressive hints when code fails', () => {
    const challenge = registry.getChallenge('basic', '02-templates', 'templates-if-else');
    expect(challenge).toBeTruthy();

    const badCode = `@if (isLoggedIn) {
  <p>Bienvenido de nuevo</p>
}`;

    const firstAttempt = engine.verify(challenge!, badCode, 1);
    const thirdAttempt = engine.verify(challenge!, badCode, 3);

    const firstFailed = firstAttempt.results.find((item) => !item.passed);
    const thirdFailed = thirdAttempt.results.find((item) => !item.passed);

    expect(firstFailed?.hintLevel).toBe(1);
    expect(thirdFailed?.hintLevel).toBeGreaterThanOrEqual(2);
    expect(thirdFailed?.hint).not.toBe(firstFailed?.hint);
  });
});
