import { Injectable, effect, signal } from '@angular/core';
import { LearningLevel } from './learning-level';

type CompletedByLevel = Record<LearningLevel, string[]>;
type MinutesByLevel = Record<LearningLevel, number>;

@Injectable({ providedIn: 'root' })
export class StudySessionService {
  private readonly completedKey = 'angular21-lab:progress:completed';
  private readonly minutesKey = 'angular21-lab:progress:minutes';

  private readonly completedByLevel = signal<CompletedByLevel>(this.loadCompleted());
  private readonly minutesByLevel = signal<MinutesByLevel>(this.loadMinutes());

  private readonly syncEffect = effect(() => {
    this.storage?.setItem(this.completedKey, JSON.stringify(this.completedByLevel()));
    this.storage?.setItem(this.minutesKey, JSON.stringify(this.minutesByLevel()));
  });

  markCompleted(level: LearningLevel, slug: string): void {
    if (this.isCompleted(level, slug)) {
      return;
    }

    this.completedByLevel.update((current) => ({
      ...current,
      [level]: [...current[level], slug]
    }));
  }

  isCompleted(level: LearningLevel, slug: string): boolean {
    return this.completedByLevel()[level].includes(slug);
  }

  completedCount(level: LearningLevel): number {
    return this.completedByLevel()[level].length;
  }

  minutes(level: LearningLevel): number {
    return this.minutesByLevel()[level];
  }

  addMinutes(level: LearningLevel, minutes: number): void {
    const safeMinutes = Number.isFinite(minutes) ? Math.max(0, Math.floor(minutes)) : 0;
    if (safeMinutes === 0) {
      return;
    }

    this.minutesByLevel.update((current) => ({
      ...current,
      [level]: current[level] + safeMinutes
    }));
  }

  progressPercent(level: LearningLevel, totalLessons: number): number {
    if (totalLessons <= 0) {
      return 0;
    }

    return Math.round((this.completedCount(level) / totalLessons) * 100);
  }

  private loadCompleted(): CompletedByLevel {
    const fallback: CompletedByLevel = { basic: [], medium: [] };
    const raw = this.storage?.getItem(this.completedKey);

    if (!raw) {
      return fallback;
    }

    try {
      const parsed = JSON.parse(raw) as Partial<CompletedByLevel>;
      return {
        basic: Array.isArray(parsed.basic) ? parsed.basic.filter((item): item is string => typeof item === 'string') : [],
        medium: Array.isArray(parsed.medium) ? parsed.medium.filter((item): item is string => typeof item === 'string') : []
      };
    } catch {
      return fallback;
    }
  }

  private loadMinutes(): MinutesByLevel {
    const fallback: MinutesByLevel = { basic: 0, medium: 0 };
    const raw = this.storage?.getItem(this.minutesKey);

    if (!raw) {
      return fallback;
    }

    try {
      const parsed = JSON.parse(raw) as Partial<MinutesByLevel>;
      return {
        basic: Number.isFinite(parsed.basic) ? Math.max(0, Number(parsed.basic)) : 0,
        medium: Number.isFinite(parsed.medium) ? Math.max(0, Number(parsed.medium)) : 0
      };
    } catch {
      return fallback;
    }
  }

  private get storage(): Storage | null {
    if (typeof window === 'undefined') {
      return null;
    }

    return window.localStorage;
  }
}
