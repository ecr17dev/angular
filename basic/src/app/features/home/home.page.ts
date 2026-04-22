import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
import { TablerIconComponent } from '../../shared/tabler-icon.component';
import { LessonRegistryService } from '../../core/lesson-registry.service';
import { StudySessionService } from '../../core/study-session.service';
import { HOME_ICONS, LESSON_ICON_MAP } from '../../shared/lesson-icons';
import { LessonDefinition } from '../../core/lesson-definition';
import { LEARNING_LEVELS, LearningLevel, learningLevelFromUrl } from '../../core/learning-level';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, TablerIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="home">
      <header class="hero">
        <p class="eyebrow">
          <tabler-icon [icon]="homeIcons.angular" [size]="16" [stroke]="2" aria-hidden="true" />
          Angular 21 + enfoque para experto en Vue
        </p>
        <h1>
          <tabler-icon [icon]="homeIcons.hero" [size]="26" [stroke]="2" aria-hidden="true" />
          Laboratorio {{ levelLabel(currentLevel()) }}
        </h1>
        <p>
          Ruta guiada para aprender Angular con enfoque practico y comparacion directa contra Vue.
        </p>

        <div class="level-switch" aria-label="Selector de nivel en home">
          @for (level of levels; track level) {
            <a
              class="level-link"
              [class.level-link-active]="currentLevel() === level"
              [routerLink]="['/', level]"
            >
              {{ levelLabel(level) }}
            </a>
          }
        </div>
      </header>

      <section class="progress" aria-label="Progreso total">
        <p>
          <tabler-icon [icon]="homeIcons.done" [size]="16" [stroke]="2" aria-hidden="true" />
          Lecciones completadas: <strong>{{ completedSummary() }}</strong>
        </p>
        <p>
          <tabler-icon [icon]="homeIcons.route" [size]="16" [stroke]="2" aria-hidden="true" />
          Tiempo de estudio registrado: <strong>{{ session.minutes(currentLevel()) }} min</strong>
        </p>
      </section>

      <section class="lesson-map" aria-label="Ruta recomendada">
        <h2>Ruta {{ levelLabel(currentLevel()) }} ({{ lessons().length }} modulos)</h2>
        <div class="cards">
          @for (lesson of lessons(); track lesson.slug) {
            <article class="lesson-card" [class.done]="session.isCompleted(currentLevel(), lesson.slug)">
              <p class="order">Modulo {{ lesson.order }}</p>
              <h3>
                <tabler-icon [icon]="iconFor(lesson)" [size]="18" [stroke]="2" aria-hidden="true" />
                {{ lesson.title }}
              </h3>

              <p class="goal">{{ lesson.goal }}</p>
              <p class="bridge">Equivalencia en Vue: {{ lesson.vueEquivalent }}</p>

              <p class="status" [class.status-done]="session.isCompleted(currentLevel(), lesson.slug)">
                <tabler-icon
                  [icon]="session.isCompleted(currentLevel(), lesson.slug) ? homeIcons.done : homeIcons.pending"
                  [size]="15"
                  [stroke]="2"
                  aria-hidden="true"
                />
                {{ session.isCompleted(currentLevel(), lesson.slug) ? 'Completado' : 'Pendiente' }}
              </p>

              <a [routerLink]="['/', currentLevel(), 'lessons', lesson.slug]">Abrir modulo</a>
            </article>
          }
        </div>
      </section>
    </section>
  `,
  styles: `
    .home {
      display: grid;
      gap: 1.2rem;
      animation: fade-up 220ms ease;
    }

    .hero {
      display: grid;
      gap: 0.6rem;
      background:
        radial-gradient(circle at 0% 0%, color-mix(in srgb, var(--brand-soft) 72%, transparent) 0%, transparent 50%),
        linear-gradient(120deg, color-mix(in srgb, var(--brand) 12%, white 88%), color-mix(in srgb, var(--accent) 14%, white 86%));
      border: 1px solid color-mix(in srgb, var(--brand) 20%, var(--border-soft) 80%);
      border-radius: var(--radius-xl);
      padding: clamp(1rem, 2vw, 1.35rem);
      box-shadow: var(--shadow-sm);
    }

    .hero h1 {
      margin: 0;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-size: clamp(1.5rem, 2.5vw, 1.95rem);
    }

    .eyebrow,
    .hero p {
      margin: 0;
      color: var(--text-secondary);
    }

    .eyebrow {
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-size: 0.76rem;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      color: var(--brand-strong);
      font-weight: 700;
    }

    .level-switch {
      display: grid;
      grid-template-columns: repeat(2, minmax(120px, 180px));
      gap: 0.35rem;
      margin-top: 0.2rem;
    }

    .level-link {
      text-decoration: none;
      text-align: center;
      border-radius: 999px;
      border: 1px solid var(--border-soft);
      background: #ffffff;
      color: var(--text-secondary);
      padding: 0.3rem 0.55rem;
      font-weight: 600;
      font-size: 0.84rem;
    }

    .level-link-active {
      border-color: var(--brand);
      background: var(--brand);
      color: #ffffff;
    }

    .progress {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 0.65rem;
    }

    .progress p {
      margin: 0;
      border: 1px solid var(--border-soft);
      border-radius: var(--radius-lg);
      padding: 0.65rem 0.75rem;
      background: var(--surface-card);
      color: var(--text-secondary);
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
    }

    .lesson-map h2 {
      margin: 0 0 0.65rem;
      font-size: 1.2rem;
    }

    .cards {
      display: grid;
      gap: 0.75rem;
      grid-template-columns: repeat(auto-fit, minmax(245px, 1fr));
    }

    .lesson-card {
      border: 1px solid var(--border-soft);
      border-radius: var(--radius-lg);
      padding: 0.9rem;
      display: grid;
      gap: 0.5rem;
      background: var(--surface-card);
      box-shadow: var(--shadow-xs);
    }

    .lesson-card h3,
    .lesson-card p {
      margin: 0;
    }

    .lesson-card h3 {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 1rem;
    }

    .order {
      font-size: 0.76rem;
      color: var(--brand-strong);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .goal {
      color: var(--text-primary);
      font-size: 0.92rem;
      line-height: 1.45;
    }

    .bridge {
      color: var(--text-muted);
      font-size: 0.86rem;
    }

    .status {
      justify-self: start;
      border-radius: 999px;
      padding: 0.2rem 0.55rem;
      font-size: 0.76rem;
      color: color-mix(in srgb, var(--warn) 92%, black 8%);
      background: color-mix(in srgb, var(--warn) 14%, white 86%);
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
    }

    .status-done {
      color: var(--ok-strong);
      background: color-mix(in srgb, var(--ok) 16%, white 84%);
    }

    .done {
      border-color: color-mix(in srgb, var(--ok) 35%, var(--border-soft) 65%);
    }

    a {
      justify-self: start;
      text-decoration: none;
      border-radius: 999px;
      border: 1px solid var(--brand);
      background: var(--brand);
      color: #ffffff;
      padding: 0.34rem 0.72rem;
      font-size: 0.86rem;
      font-weight: 600;
    }

    @keyframes fade-up {
      from {
        opacity: 0;
        transform: translateY(6px);
      }

      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `
})
export class HomePageComponent {
  private readonly router = inject(Router);
  private readonly registry = inject(LessonRegistryService);
  readonly session = inject(StudySessionService);

  readonly homeIcons = HOME_ICONS;
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

  readonly completedSummary = computed(
    () =>
      `${this.session.completedCount(this.currentLevel())} / ${this.lessons().length} (${this.session.progressPercent(this.currentLevel(), this.lessons().length)}%)`
  );

  iconFor(lesson: LessonDefinition) {
    return this.lessonIcons[lesson.iconKey];
  }

  levelLabel(level: LearningLevel): string {
    return level === 'basic' ? 'Basico' : 'Medio';
  }
}
