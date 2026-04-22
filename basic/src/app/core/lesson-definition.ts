import { LearningLevel } from './learning-level';

export type LessonIconKey =
  | 'signals'
  | 'templates'
  | 'inputOutput'
  | 'services'
  | 'router'
  | 'forms'
  | 'http'
  | 'testing';

export interface LessonDefinition {
  level: LearningLevel;
  slug: string;
  title: string;
  goal: string;
  vueEquivalent: string;
  checkpoints: string[];
  quickWins: string[];
  foundation: string;
  guidedExample: string;
  vueBridge: string;
  funPrompt: string;
  iconKey: LessonIconKey;
  order: number;
  angularSnippet: string;
  vueSnippet: string;
  keyDifferences: string[];
}
