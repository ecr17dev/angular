export type LearningLevel = 'basic' | 'medium';

export const LEARNING_LEVELS: LearningLevel[] = ['basic', 'medium'];

export function normalizeLearningLevel(value: string | null | undefined): LearningLevel {
  return value === 'medium' ? 'medium' : 'basic';
}

export function learningLevelFromUrl(url: string): LearningLevel {
  const path = url.split('?')[0];
  const firstSegment = path.split('/').filter(Boolean)[0] ?? '';
  return normalizeLearningLevel(firstSegment);
}
