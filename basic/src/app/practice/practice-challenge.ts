import { LearningLevel } from '../core/learning-level';

export type PracticeTestDefinition =
  | {
      id: string;
      description: string;
      type: 'containsAll';
      tokens: string[];
      successMessage: string;
      failureMessage: string;
      hints: string[];
    }
  | {
      id: string;
      description: string;
      type: 'regex';
      pattern: string;
      flags?: string;
      successMessage: string;
      failureMessage: string;
      hints: string[];
    };

export interface PracticeScenario {
  id: string;
  title: string;
  contextDescription: string;
  expectedPreview: string;
}

export interface PracticeChallenge {
  id: string;
  level: LearningLevel;
  lessonSlug: string;
  title: string;
  instructions: string;
  starterCode: string;
  expectedConcepts: string[];
  scenarios: PracticeScenario[];
  tests: PracticeTestDefinition[];
}

export interface PracticeTestResult {
  testId: string;
  passed: boolean;
  message: string;
  hintLevel: number;
  hint: string | null;
}

export interface PracticeRunResult {
  preview: string;
  results: PracticeTestResult[];
  approved: boolean;
  score: number;
}

export interface PracticeProgress {
  attempts: number;
  approved: boolean;
}
