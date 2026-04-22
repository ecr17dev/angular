import { Injectable } from '@angular/core';
import {
  PracticeChallenge,
  PracticeRunResult,
  PracticeScenario,
  PracticeTestDefinition,
  PracticeTestResult
} from './practice-challenge';

@Injectable({ providedIn: 'root' })
export class PracticeEngineService {
  run(challenge: PracticeChallenge, code: string, scenarioId: string): PracticeRunResult {
    const results = this.evaluateTests(challenge.tests, code, 0);
    const approved = results.length > 0 && results.every((result) => result.passed);
    const preview = this.buildPreview(challenge, code, scenarioId, approved);

    return {
      preview,
      results,
      approved,
      score: this.buildScore(results)
    };
  }

  verify(challenge: PracticeChallenge, code: string, attempts: number): PracticeRunResult {
    const results = this.evaluateTests(challenge.tests, code, attempts);
    const approved = results.length > 0 && results.every((result) => result.passed);

    return {
      preview: this.buildPreview(challenge, code, challenge.scenarios[0]?.id ?? '', approved),
      results,
      approved,
      score: this.buildScore(results)
    };
  }

  private evaluateTests(tests: PracticeTestDefinition[], code: string, attempts: number): PracticeTestResult[] {
    return tests.map((test) => this.evaluateTest(test, code, attempts));
  }

  private evaluateTest(test: PracticeTestDefinition, code: string, attempts: number): PracticeTestResult {
    const passed = this.runTest(test, code);

    if (passed) {
      return {
        testId: test.id,
        passed: true,
        message: test.successMessage,
        hintLevel: 0,
        hint: null
      };
    }

    const maxHintLevel = Math.max(1, test.hints.length);
    const hintLevel = Math.min(maxHintLevel, Math.max(1, attempts));

    return {
      testId: test.id,
      passed: false,
      message: test.failureMessage,
      hintLevel,
      hint: test.hints[hintLevel - 1] ?? test.hints[test.hints.length - 1] ?? null
    };
  }

  private runTest(test: PracticeTestDefinition, code: string): boolean {
    if (test.type === 'containsAll') {
      return test.tokens.every((token) => code.includes(token));
    }

    return new RegExp(test.pattern, test.flags).test(code);
  }

  private buildPreview(
    challenge: PracticeChallenge,
    code: string,
    scenarioId: string,
    approved: boolean
  ): string {
    const scenario = this.getScenario(challenge.scenarios, scenarioId);

    if (!scenario) {
      return 'Selecciona un escenario para ejecutar la vista previa.';
    }

    const base = [
      `Escenario: ${scenario.title}`,
      `Contexto: ${scenario.contextDescription}`,
      ''
    ];

    const matchesMainConcepts = challenge.expectedConcepts.every((concept) => this.matchesConcept(code, concept));

    if (approved || matchesMainConcepts) {
      return [...base, `Preview esperado: ${scenario.expectedPreview}`].join('\n');
    }

    return [
      ...base,
      'No se detecta aun la estructura minima para simular la salida.',
      'Ejecuta Verificar para recibir pistas concretas.'
    ].join('\n');
  }

  private getScenario(scenarios: PracticeScenario[], scenarioId: string): PracticeScenario | undefined {
    return scenarios.find((scenario) => scenario.id === scenarioId) ?? scenarios[0];
  }

  private buildScore(results: PracticeTestResult[]): number {
    if (results.length === 0) {
      return 0;
    }

    const passed = results.filter((result) => result.passed).length;
    return Math.round((passed / results.length) * 100);
  }

  private matchesConcept(code: string, concept: string): boolean {
    const normalizedCode = code.toLowerCase();
    const normalizedConcept = concept.toLowerCase();

    if (normalizedConcept.includes('@if')) {
      return normalizedCode.includes('@if') && normalizedCode.includes('@else');
    }

    if (normalizedConcept.includes('@for')) {
      return normalizedCode.includes('@for') && normalizedCode.includes('track');
    }

    if (normalizedConcept.includes('@switch')) {
      return normalizedCode.includes('@switch') && normalizedCode.includes('@default');
    }

    if (normalizedConcept.includes('[class')) {
      return normalizedCode.includes('[class.');
    }

    if (normalizedConcept.includes('[style')) {
      return normalizedCode.includes('[style.');
    }

    return true;
  }
}
