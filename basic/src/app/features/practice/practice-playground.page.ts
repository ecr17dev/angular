import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, ActivatedRoute } from '@angular/router';
import { map, filter, startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { TablerIconComponent } from '../../shared/tabler-icon.component';
import {
  IconAlertTriangle,
  IconCheck,
  IconChecklist,
  IconCode,
  IconDeviceLaptop,
  IconPlayerPlay,
  IconRefresh,
  IconSparkles,
  IconTarget
} from '@tabler/icons-angular';
import { learningLevelFromUrl } from '../../core/learning-level';
import { PracticeTestResult } from '../../practice/practice-challenge';
import { PracticeEngineService } from '../../practice/practice-engine.service';
import { PracticeRegistryService } from '../../practice/practice-registry.service';
import { PracticeStorageService } from '../../practice/practice-storage.service';

@Component({
  selector: 'app-practice-playground-page',
  imports: [RouterLink, TablerIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isUnavailable()) {
      <section class="unavailable">
        <p class="eyebrow">Practice Lab · {{ currentLevel() }}</p>
        <h1>Proximamente</h1>
        <p>Esta leccion aun no tiene retos activos en el playground.</p>
        <a [routerLink]="['/', currentLevel(), 'lessons', slug()]">Volver a la leccion</a>
      </section>
    } @else {
      @if (currentChallenge(); as challenge) {
        <section class="playground">
          <header>
            <p class="eyebrow">Practice Lab · {{ currentLevel() }} · {{ slug() }}</p>
            <h1>
              <tabler-icon [icon]="icons.target" [size]="24" [stroke]="2" aria-hidden="true" />
              {{ challenge.title }}
            </h1>
            <p>{{ challenge.instructions }}</p>
            <div class="header-actions">
              <label>
                Reto
                <select [value]="challenge.id" (change)="onChallengeChange($event)">
                  @for (item of challenges(); track item.id) {
                    <option [value]="item.id">{{ item.title }}</option>
                  }
                </select>
              </label>
              <label>
                Escenario
                <select [value]="selectedScenarioId()" (change)="onScenarioChange($event)">
                  @for (scenario of challenge.scenarios; track scenario.id) {
                    <option [value]="scenario.id">{{ scenario.title }}</option>
                  }
                </select>
              </label>
            </div>
            <p class="status" [class.approved]="approved()" [class.pending]="!approved()">
              <tabler-icon
                [icon]="approved() ? icons.check : icons.alert"
                [size]="15"
                [stroke]="2"
                aria-hidden="true"
              />
              {{ approved() ? 'Aprobado' : 'Pendiente' }} · Score {{ score() }}%
            </p>
          </header>

          <div class="grid">
            <section class="panel checklist-panel">
              <h2>
                <tabler-icon [icon]="icons.checklist" [size]="18" [stroke]="2" aria-hidden="true" />
                Checklist
              </h2>
              <ul>
                @for (concept of challenge.expectedConcepts; track concept) {
                  <li>{{ concept }}</li>
                }
              </ul>
            </section>

            <section class="panel">
              <h2>
                <tabler-icon [icon]="icons.code" [size]="18" [stroke]="2" aria-hidden="true" />
                Editor
              </h2>
              <textarea
                [value]="code()"
                (input)="onCodeInput($event)"
                rows="16"
                spellcheck="false"
                aria-label="Editor de codigo"
              ></textarea>
              <div class="actions">
                <button type="button" (click)="runCode()">
                  <tabler-icon [icon]="icons.run" [size]="15" [stroke]="2" aria-hidden="true" />
                  Ejecutar
                </button>
                <button type="button" class="primary" (click)="verifyCode()">
                  <tabler-icon [icon]="icons.sparkles" [size]="15" [stroke]="2" aria-hidden="true" />
                  Verificar
                </button>
                <button type="button" (click)="resetChallenge()">
                  <tabler-icon [icon]="icons.reset" [size]="15" [stroke]="2" aria-hidden="true" />
                  Reiniciar
                </button>
              </div>
            </section>

            <section class="panel output-panel">
              <h2>
                <tabler-icon [icon]="icons.preview" [size]="18" [stroke]="2" aria-hidden="true" />
                Salida y validacion
              </h2>
              <pre>{{ preview() }}</pre>

              <h3>Resultados</h3>
              <ul class="results">
                @for (result of results(); track result.testId) {
                  <li [class.pass]="result.passed" [class.fail]="!result.passed">
                    <strong>{{ result.passed ? 'OK' : 'Fallo' }}</strong>
                    <span>{{ result.message }}</span>
                    @if (!result.passed && result.hint; as hint) {
                      <em>Pista (nivel {{ result.hintLevel }}): {{ hint }}</em>
                    }
                  </li>
                }
              </ul>
            </section>
          </div>
        </section>
      }
    }
  `,
  styles: `
    .playground,
    .unavailable {
      display: grid;
      gap: 1rem;
      animation: fade-up 220ms ease;
    }

    h1,
    h2,
    h3,
    p {
      margin: 0;
    }

    header {
      display: grid;
      gap: 0.6rem;
      border: 1px solid color-mix(in srgb, var(--brand) 18%, var(--border-soft) 82%);
      border-radius: var(--radius-xl);
      background: var(--surface-card);
      box-shadow: var(--shadow-xs);
      padding: 0.9rem;
    }

    .eyebrow {
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-size: 0.76rem;
      color: var(--brand-strong);
      font-weight: 700;
    }

    h1 {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-size: clamp(1.2rem, 2vw, 1.6rem);
    }

    .header-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    label {
      display: grid;
      gap: 0.25rem;
      font-size: 0.9rem;
      color: var(--text-secondary);
    }

    select {
      border: 1px solid var(--border-soft);
      border-radius: 10px;
      background: #ffffff;
      padding: 0.42rem 0.55rem;
      min-width: 220px;
    }

    .status {
      justify-self: start;
      border-radius: 999px;
      padding: 0.28rem 0.68rem;
      font-size: 0.83rem;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
    }

    .approved {
      background: color-mix(in srgb, var(--ok) 16%, white 84%);
      color: var(--ok-strong);
    }

    .pending {
      background: color-mix(in srgb, var(--warn) 14%, white 86%);
      color: color-mix(in srgb, var(--warn) 90%, black 10%);
    }

    .grid {
      display: grid;
      gap: 0.8rem;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    }

    .panel {
      border: 1px solid var(--border-soft);
      border-radius: var(--radius-lg);
      padding: 0.9rem;
      background: var(--surface-card);
      display: grid;
      gap: 0.7rem;
      align-content: start;
      box-shadow: var(--shadow-xs);
    }

    h2 {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 1rem;
    }

    h3 {
      font-size: 0.93rem;
    }

    ul {
      margin: 0;
      padding-left: 1.2rem;
      display: grid;
      gap: 0.3rem;
    }

    textarea {
      width: 100%;
      border-radius: 11px;
      border: 1px solid color-mix(in srgb, var(--brand-soft) 46%, var(--border-soft) 54%);
      padding: 0.75rem;
      font-family: 'JetBrains Mono', 'SFMono-Regular', Consolas, monospace;
      font-size: 0.88rem;
      line-height: 1.45;
      resize: vertical;
      background: #111827;
      color: #f8fafc;
      min-height: 280px;
    }

    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    button,
    .unavailable a {
      border: 1px solid var(--border-soft);
      border-radius: 10px;
      background: color-mix(in srgb, var(--surface-page) 42%, white 58%);
      color: var(--text-primary);
      padding: 0.38rem 0.7rem;
      cursor: pointer;
      text-decoration: none;
      justify-self: start;
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      font-weight: 600;
    }

    button.primary {
      border-color: var(--brand);
      background: var(--brand);
      color: #ffffff;
    }

    pre {
      margin: 0;
      border-radius: 9px;
      border: 1px solid var(--border-soft);
      background: color-mix(in srgb, var(--surface-page) 45%, white 55%);
      padding: 0.75rem;
      white-space: pre-wrap;
      min-height: 96px;
    }

    .results {
      padding-left: 0;
      list-style: none;
    }

    .results li {
      display: grid;
      gap: 0.2rem;
      border-radius: 8px;
      padding: 0.55rem 0.65rem;
      border: 1px solid var(--border-soft);
    }

    .results .pass {
      border-color: color-mix(in srgb, var(--ok) 50%, var(--border-soft) 50%);
      background: color-mix(in srgb, var(--ok) 12%, white 88%);
      color: var(--ok-strong);
    }

    .results .fail {
      border-color: color-mix(in srgb, var(--danger) 45%, var(--border-soft) 55%);
      background: color-mix(in srgb, var(--danger) 10%, white 90%);
      color: var(--danger-strong);
    }

    .results em {
      color: color-mix(in srgb, var(--danger-strong) 88%, black 12%);
      font-style: normal;
      font-size: 0.86rem;
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
export class PracticePlaygroundPageComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly engine = inject(PracticeEngineService);
  private readonly registry = inject(PracticeRegistryService);
  private readonly storage = inject(PracticeStorageService);

  readonly icons = {
    target: IconTarget,
    checklist: IconChecklist,
    code: IconCode,
    run: IconPlayerPlay,
    sparkles: IconSparkles,
    reset: IconRefresh,
    preview: IconDeviceLaptop,
    check: IconCheck,
    alert: IconAlertTriangle
  } as const;

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.router.url),
      startWith(this.router.url)
    ),
    { initialValue: this.router.url }
  );

  readonly currentLevel = computed(() => learningLevelFromUrl(this.currentUrl()));

  readonly slug = toSignal(this.route.paramMap.pipe(map((params) => params.get('slug') ?? '')), {
    initialValue: ''
  });

  readonly challenges = computed(() => this.registry.getByLesson(this.currentLevel(), this.slug()));
  readonly isUnavailable = computed(() => this.challenges().length === 0);

  readonly selectedChallengeId = signal('');
  readonly selectedScenarioId = signal('');
  readonly code = signal('');
  readonly preview = signal('Ejecuta o verifica para ver salida.');
  readonly results = signal<PracticeTestResult[]>([]);
  readonly attempts = signal(0);
  readonly approved = signal(false);
  readonly score = signal(0);

  private readonly loadedKey = signal('');

  readonly currentChallenge = computed(() => {
    const list = this.challenges();
    if (list.length === 0) {
      return undefined;
    }

    return list.find((item) => item.id === this.selectedChallengeId()) ?? list[0];
  });

  private readonly stateSync = effect(() => {
    const level = this.currentLevel();
    const lessonSlug = this.slug();
    const challenge = this.currentChallenge();

    if (!lessonSlug || !challenge) {
      this.loadedKey.set('');
      return;
    }

    if (this.selectedChallengeId() !== challenge.id) {
      this.selectedChallengeId.set(challenge.id);
      return;
    }

    const key = `${level}:${lessonSlug}:${challenge.id}`;
    if (this.loadedKey() === key) {
      return;
    }

    this.loadedKey.set(key);

    const savedDraft = this.storage.loadDraft(level, lessonSlug, challenge.id);
    const savedProgress = this.storage.loadProgress(level, lessonSlug, challenge.id);

    this.code.set(savedDraft ?? challenge.starterCode);
    this.selectedScenarioId.set(challenge.scenarios[0]?.id ?? '');
    this.attempts.set(savedProgress.attempts);
    this.approved.set(savedProgress.approved);

    const runResult = this.engine.run(challenge, this.code(), this.selectedScenarioId());
    this.preview.set(runResult.preview);
    this.results.set([]);
    this.score.set(savedProgress.approved ? 100 : runResult.score);
  });

  onChallengeChange(event: Event): void {
    const challengeId = (event.target as HTMLSelectElement | null)?.value;
    if (!challengeId) {
      return;
    }

    this.selectedChallengeId.set(challengeId);
    this.loadedKey.set('');
  }

  onScenarioChange(event: Event): void {
    const scenarioId = (event.target as HTMLSelectElement | null)?.value;
    if (!scenarioId) {
      return;
    }

    this.selectedScenarioId.set(scenarioId);
  }

  onCodeInput(event: Event): void {
    const value = (event.target as HTMLTextAreaElement | null)?.value ?? '';
    this.code.set(value);

    const challenge = this.currentChallenge();
    if (!challenge) {
      return;
    }

    this.storage.saveDraft(this.currentLevel(), this.slug(), challenge.id, value);
  }

  runCode(): void {
    const challenge = this.currentChallenge();
    if (!challenge) {
      return;
    }

    const runResult = this.engine.run(challenge, this.code(), this.selectedScenarioId());
    this.preview.set(runResult.preview);
    this.score.set(runResult.score);
  }

  verifyCode(): void {
    const challenge = this.currentChallenge();
    if (!challenge) {
      return;
    }

    const nextAttempts = this.attempts() + 1;
    this.attempts.set(nextAttempts);

    const result = this.engine.verify(challenge, this.code(), nextAttempts);
    const approved = result.approved && result.score === 100;
    const runResult = this.engine.run(challenge, this.code(), this.selectedScenarioId());

    this.results.set(result.results);
    this.approved.set(approved);
    this.preview.set(runResult.preview);
    this.score.set(result.score);

    this.storage.saveDraft(this.currentLevel(), this.slug(), challenge.id, this.code());
    this.storage.saveProgress(this.currentLevel(), this.slug(), challenge.id, {
      attempts: nextAttempts,
      approved
    });
  }

  resetChallenge(): void {
    const challenge = this.currentChallenge();
    if (!challenge) {
      return;
    }

    this.storage.resetChallenge(this.currentLevel(), this.slug(), challenge.id);
    this.code.set(challenge.starterCode);
    this.attempts.set(0);
    this.approved.set(false);
    this.results.set([]);

    const runResult = this.engine.run(challenge, this.code(), this.selectedScenarioId());
    this.preview.set(runResult.preview);
    this.score.set(runResult.score);
  }
}
