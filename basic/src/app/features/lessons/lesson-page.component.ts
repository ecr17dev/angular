import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { map, filter, startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { TablerIconComponent } from '../../shared/tabler-icon.component';
import { LessonRegistryService } from '../../core/lesson-registry.service';
import { StudySessionService } from '../../core/study-session.service';
import { LessonDefinition } from '../../core/lesson-definition';
import { learningLevelFromUrl } from '../../core/learning-level';
import { LESSON_ICON_MAP, LESSON_PAGE_ICONS } from '../../shared/lesson-icons';
import { VueComparisonPanelComponent } from '../../shared/vue-comparison-panel.component';
import { HttpRxjsLessonComponent } from './demos/http-rxjs-lesson.component';
import { InputOutputLessonComponent } from './demos/input-output-lesson.component';
import { ReactiveFormsLessonComponent } from './demos/reactive-forms-lesson.component';
import { RouterLessonComponent } from './demos/router-lesson.component';
import { ServicesDiLessonComponent } from './demos/services-di-lesson.component';
import { SignalsLessonComponent } from './demos/signals-lesson.component';
import { TemplatesLessonComponent } from './demos/templates-lesson.component';
import { TestingBasicsLessonComponent } from './demos/testing-basics-lesson.component';
import { MediumTaskBoardDemoComponent } from './demos/medium-task-board-demo.component';

@Component({
  selector: 'app-lesson-page',
  imports: [
    RouterLink,
    TablerIconComponent,
    VueComparisonPanelComponent,
    SignalsLessonComponent,
    TemplatesLessonComponent,
    InputOutputLessonComponent,
    ServicesDiLessonComponent,
    RouterLessonComponent,
    ReactiveFormsLessonComponent,
    HttpRxjsLessonComponent,
    TestingBasicsLessonComponent,
    MediumTaskBoardDemoComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (lesson(); as currentLesson) {
      <section class="lesson-page">
        <header class="lesson-hero">
          <p class="eyebrow">Nivel {{ currentLevel() }} · Modulo {{ currentLesson.order }} de 8</p>
          <h1>
            <tabler-icon [icon]="iconFor(currentLesson)" [size]="24" [stroke]="2" aria-hidden="true" />
            {{ currentLesson.title }}
          </h1>
          <p class="goal">{{ currentLesson.goal }}</p>
          <p class="bridge">
            <tabler-icon [icon]="lessonIcons.compare" [size]="16" [stroke]="2" aria-hidden="true" />
            Equivalencia Vue: {{ currentLesson.vueEquivalent }}
          </p>

          <div class="hero-actions">
            <p class="status-pill" [class.status-pill-done]="session.isCompleted(currentLevel(), currentLesson.slug)">
              <tabler-icon
                [icon]="session.isCompleted(currentLevel(), currentLesson.slug) ? lessonIcons.done : lessonIcons.progress"
                [size]="16"
                [stroke]="2"
                aria-hidden="true"
              />
              {{ session.isCompleted(currentLevel(), currentLesson.slug) ? 'Modulo completado' : 'Modulo en progreso' }}
            </p>

            <a class="practice-link" [routerLink]="['/', currentLevel(), 'lessons', currentLesson.slug, 'practice']">
              <tabler-icon [icon]="lessonIcons.practice" [size]="16" [stroke]="2" aria-hidden="true" />
              Practicar en playground
            </a>
          </div>
        </header>

        <section class="flow-card">
          <h2>
            <tabler-icon [icon]="lessonIcons.foundation" [size]="18" [stroke]="2" aria-hidden="true" />
            Fundamento
          </h2>
          <p>{{ currentLesson.foundation }}</p>
          <p class="bridge-note">Puente Vue -> Angular: {{ currentLesson.vueBridge }}</p>
        </section>

        <section class="flow-card">
          <h2>
            <tabler-icon [icon]="lessonIcons.example" [size]="18" [stroke]="2" aria-hidden="true" />
            Ejemplo guiado
          </h2>
          <p>{{ currentLesson.guidedExample }}</p>

          <section class="demo-box" aria-label="Demo practica">
            <h3>Demo interactiva</h3>
            @switch (currentLesson.slug) {
              @case ('01-signals') {
                <app-signals-lesson />
              }
              @case ('02-templates') {
                <app-templates-lesson />
              }
              @case ('03-input-output') {
                <app-input-output-lesson />
              }
              @case ('04-services-di') {
                <app-services-di-lesson [level]="currentLevel()" />
              }
              @case ('05-router') {
                <app-router-lesson />
              }
              @case ('06-reactive-forms') {
                <app-reactive-forms-lesson />
              }
              @case ('07-http-rxjs') {
                <app-http-rxjs-lesson />
              }
              @case ('08-testing-basics') {
                <app-testing-basics-lesson />
              }
              @default {
                <app-medium-task-board-demo />
              }
            }
          </section>
        </section>

        <section class="flow-card">
          <h2>
            <tabler-icon [icon]="lessonIcons.compare" [size]="18" [stroke]="2" aria-hidden="true" />
            Comparacion Angular vs Vue
          </h2>
          <app-vue-comparison-panel
            [angularSnippet]="currentLesson.angularSnippet"
            [vueSnippet]="currentLesson.vueSnippet"
            [keyDifferences]="currentLesson.keyDifferences"
          />
        </section>

        <section class="flow-card">
          <h2>
            <tabler-icon [icon]="lessonIcons.practice" [size]="18" [stroke]="2" aria-hidden="true" />
            Practica rapida
          </h2>
          <p>{{ currentLesson.funPrompt }}</p>

          <div class="digest-grid">
            <section>
              <h3>Que dominar en 10 min</h3>
              <ul>
                @for (item of currentLesson.quickWins; track item) {
                  <li>{{ item }}</li>
                }
              </ul>
            </section>

            <section>
              <h3>Checkpoints del modulo</h3>
              <ul>
                @for (checkpoint of currentLesson.checkpoints; track checkpoint) {
                  <li>{{ checkpoint }}</li>
                }
              </ul>
            </section>
          </div>

          <button
            type="button"
            class="complete-btn"
            [disabled]="session.isCompleted(currentLevel(), currentLesson.slug)"
            (click)="markLessonComplete(currentLesson.slug)"
          >
            <tabler-icon [icon]="lessonIcons.done" [size]="15" [stroke]="2" aria-hidden="true" />
            {{ session.isCompleted(currentLevel(), currentLesson.slug) ? 'Completada' : 'Marcar como completada' }}
          </button>
        </section>

        <nav class="lesson-nav" aria-label="Navegacion de lecciones">
          @if (adjacentLessons().previous; as previous) {
            <a [routerLink]="['/', currentLevel(), 'lessons', previous.slug]">
              <tabler-icon [icon]="lessonIcons.previous" [size]="16" [stroke]="2" aria-hidden="true" />
              {{ previous.title }}
            </a>
          }
          @if (adjacentLessons().next; as next) {
            <a [routerLink]="['/', currentLevel(), 'lessons', next.slug]">
              {{ next.title }}
              <tabler-icon [icon]="lessonIcons.next" [size]="16" [stroke]="2" aria-hidden="true" />
            </a>
          }
        </nav>
      </section>
    } @else {
      <section class="not-found">
        <h1>Leccion no encontrada</h1>
        <a [routerLink]="['/', currentLevel()]">Volver al mapa del laboratorio</a>
      </section>
    }
  `,
  styles: `
    .lesson-page {
      display: grid;
      gap: 1rem;
      animation: fade-up 220ms ease;
    }

    h1,
    h2,
    h3,
    p,
    ul {
      margin: 0;
    }

    .lesson-hero,
    .flow-card {
      border: 1px solid var(--border-soft);
      border-radius: var(--radius-lg);
      background: var(--surface-card);
      box-shadow: var(--shadow-xs);
      padding: 0.95rem;
      display: grid;
      gap: 0.65rem;
    }

    h1 {
      display: inline-flex;
      align-items: center;
      gap: 0.55rem;
      font-size: clamp(1.3rem, 2vw, 1.85rem);
      line-height: 1.2;
    }

    .eyebrow {
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--brand-strong);
      font-size: 0.76rem;
      font-weight: 700;
    }

    .goal {
      color: var(--text-primary);
      line-height: 1.5;
    }

    .bridge {
      color: var(--text-secondary);
      font-size: 0.91rem;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
    }

    .hero-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.55rem;
      align-items: center;
    }

    .status-pill {
      border-radius: 999px;
      background: color-mix(in srgb, var(--warn) 15%, white 85%);
      color: color-mix(in srgb, var(--warn) 85%, black 15%);
      padding: 0.28rem 0.65rem;
      font-size: 0.8rem;
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      border: 1px solid color-mix(in srgb, var(--warn) 22%, transparent 78%);
    }

    .status-pill-done {
      background: color-mix(in srgb, var(--ok) 16%, white 84%);
      color: var(--ok-strong);
      border-color: color-mix(in srgb, var(--ok) 32%, transparent 68%);
    }

    .practice-link {
      border-radius: 999px;
      border: 1px solid var(--brand);
      background: var(--brand);
      color: #f8fafc;
      padding: 0.36rem 0.75rem;
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
    }

    h2,
    h3 {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
    }

    .bridge-note {
      color: var(--text-muted);
      font-size: 0.9rem;
    }

    .demo-box {
      border: 1px solid var(--border-soft);
      border-radius: var(--radius-md);
      background: color-mix(in srgb, var(--surface-page) 38%, white 62%);
      padding: 0.75rem;
      display: grid;
      gap: 0.6rem;
    }

    .digest-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
      gap: 0.6rem;
    }

    .digest-grid section {
      border: 1px solid var(--border-soft);
      border-radius: var(--radius-md);
      padding: 0.65rem;
      background: color-mix(in srgb, var(--surface-page) 36%, white 64%);
      display: grid;
      gap: 0.45rem;
    }

    ul {
      padding-left: 1.15rem;
      display: grid;
      gap: 0.3rem;
      color: var(--text-secondary);
    }

    .complete-btn {
      justify-self: start;
      border: 1px solid var(--text-primary);
      border-radius: 10px;
      background: var(--text-primary);
      color: #ffffff;
      padding: 0.4rem 0.75rem;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      font-weight: 600;
    }

    .complete-btn:disabled {
      border-color: color-mix(in srgb, var(--text-muted) 25%, transparent 75%);
      background: color-mix(in srgb, var(--text-muted) 74%, white 26%);
      cursor: not-allowed;
    }

    .lesson-nav {
      display: flex;
      justify-content: space-between;
      gap: 0.7rem;
      flex-wrap: wrap;
    }

    .lesson-nav a,
    .not-found a {
      color: var(--brand-strong);
      text-decoration: none;
      font-weight: 600;
      border: 1px solid var(--border-soft);
      border-radius: var(--radius-md);
      padding: 0.38rem 0.65rem;
      background: var(--surface-card);
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
    }

    .not-found {
      display: grid;
      gap: 0.75rem;
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
export class LessonPageComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly registry = inject(LessonRegistryService);
  readonly session = inject(StudySessionService);

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.router.url),
      startWith(this.router.url)
    ),
    { initialValue: this.router.url }
  );

  readonly currentLevel = computed(() => learningLevelFromUrl(this.currentUrl()));

  private readonly slug = toSignal(this.route.paramMap.pipe(map((params) => params.get('slug') ?? '')), {
    initialValue: ''
  });

  readonly lesson = computed(() => this.registry.getBySlug(this.currentLevel(), this.slug()));
  readonly adjacentLessons = computed(() => this.registry.getAdjacent(this.currentLevel(), this.slug()));
  readonly lessonIcons = LESSON_PAGE_ICONS;
  private readonly iconMap = LESSON_ICON_MAP;

  iconFor(lesson: LessonDefinition) {
    return this.iconMap[lesson.iconKey];
  }

  markLessonComplete(slug: string): void {
    this.session.markCompleted(this.currentLevel(), slug);
    this.session.addMinutes(this.currentLevel(), 20);
  }
}
