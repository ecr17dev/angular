import { Injectable } from '@angular/core';
import { LearningLevel } from '../core/learning-level';
import { PracticeProgress } from './practice-challenge';

@Injectable({ providedIn: 'root' })
export class PracticeStorageService {
  private readonly prefix = 'angular21-lab-practice';

  loadDraft(level: LearningLevel, lessonSlug: string, challengeId: string): string | null {
    return this.storage?.getItem(this.getDraftKey(level, lessonSlug, challengeId)) ?? null;
  }

  saveDraft(level: LearningLevel, lessonSlug: string, challengeId: string, code: string): void {
    this.storage?.setItem(this.getDraftKey(level, lessonSlug, challengeId), code);
  }

  loadProgress(level: LearningLevel, lessonSlug: string, challengeId: string): PracticeProgress {
    const raw = this.storage?.getItem(this.getProgressKey(level, lessonSlug, challengeId));

    if (!raw) {
      return { attempts: 0, approved: false };
    }

    try {
      const parsed = JSON.parse(raw) as Partial<PracticeProgress>;
      return {
        attempts: Number.isFinite(parsed.attempts) ? Math.max(0, Number(parsed.attempts)) : 0,
        approved: parsed.approved === true
      };
    } catch {
      return { attempts: 0, approved: false };
    }
  }

  saveProgress(level: LearningLevel, lessonSlug: string, challengeId: string, progress: PracticeProgress): void {
    this.storage?.setItem(this.getProgressKey(level, lessonSlug, challengeId), JSON.stringify(progress));
  }

  resetChallenge(level: LearningLevel, lessonSlug: string, challengeId: string): void {
    this.storage?.removeItem(this.getDraftKey(level, lessonSlug, challengeId));
    this.storage?.removeItem(this.getProgressKey(level, lessonSlug, challengeId));
  }

  private get storage(): Storage | null {
    if (typeof window === 'undefined') {
      return null;
    }

    return window.localStorage;
  }

  private getDraftKey(level: LearningLevel, lessonSlug: string, challengeId: string): string {
    return `${this.prefix}:draft:${level}:${lessonSlug}:${challengeId}`;
  }

  private getProgressKey(level: LearningLevel, lessonSlug: string, challengeId: string): string {
    return `${this.prefix}:progress:${level}:${lessonSlug}:${challengeId}`;
  }
}
