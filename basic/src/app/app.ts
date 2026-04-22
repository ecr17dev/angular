import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet, NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
import { TablerIconComponent } from './shared/tabler-icon.component';
import { LessonRegistryService } from './core/lesson-registry.service';
import { StudySessionService } from './core/study-session.service';
import { LESSON_ICON_MAP, SHELL_ICONS } from './shared/lesson-icons';
import { LessonDefinition } from './core/lesson-definition';
import { LEARNING_LEVELS, LearningLevel, learningLevelFromUrl } from './core/learning-level';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, TablerIconComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  private readonly router = inject(Router);
  private readonly registry = inject(LessonRegistryService);
  readonly session = inject(StudySessionService);

  readonly shellIcons = SHELL_ICONS;
  readonly lessonIcons = LESSON_ICON_MAP;
  readonly levels = LEARNING_LEVELS;

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.router.url),
      startWith(this.router.url)
    ),
    { initialValue: this.router.url }
  );

  readonly currentLevel = computed(() => learningLevelFromUrl(this.currentUrl()));
  readonly lessons = computed(() => this.registry.getLessons(this.currentLevel()));

  readonly progressPercent = computed(() =>
    this.session.progressPercent(this.currentLevel(), this.lessons().length)
  );

  readonly progressLabel = computed(
    () => `${this.session.completedCount(this.currentLevel())} / ${this.lessons().length} modulos completados`
  );

  iconFor(lesson: LessonDefinition) {
    return this.lessonIcons[lesson.iconKey];
  }

  levelHomeLink(level: LearningLevel): string[] {
    return ['/', level];
  }

  lessonLink(lessonSlug: string): string[] {
    return ['/', this.currentLevel(), 'lessons', lessonSlug];
  }

  levelLabel(level: LearningLevel): string {
    return level === 'basic' ? 'Basico' : 'Medio';
  }
}
