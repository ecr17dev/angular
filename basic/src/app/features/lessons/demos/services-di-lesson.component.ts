import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { LearningLevel } from '../../../core/learning-level';
import { StudySessionService } from '../../../core/study-session.service';

@Component({
  selector: 'app-services-di-lesson',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="lesson-demo">
      <p class="lesson-demo-intro">
        Este bloque usa <code>StudySessionService</code> como singleton inyectado con
        <code>inject()</code>.
      </p>

      <div class="stats">
        <p>Lecciones completadas: <strong>{{ session.completedCount(level()) }}</strong></p>
        <p>Minutos acumulados: <strong>{{ session.minutes(level()) }}</strong></p>
      </div>

      <div class="lesson-demo-actions">
        <button type="button" class="lesson-btn" (click)="session.addMinutes(level(), 15)">Agregar 15 min</button>
        <button type="button" class="lesson-btn lesson-btn-primary" (click)="session.addMinutes(level(), 30)">
          Agregar 30 min
        </button>
      </div>

      <p class="note">
        Equivalencia mental desde Vue: seria similar a un composable compartido,
        pero aqui lo resuelve el inyector de Angular.
      </p>
    </section>
  `,
  styles: `
    .stats {
      display: grid;
      gap: 0.35rem;
      background: color-mix(in srgb, var(--surface-page) 46%, white 54%);
      border: 1px solid var(--border-soft);
      border-radius: 10px;
      padding: 0.75rem;
    }

    p {
      margin: 0;
    }

    .note {
      color: var(--text-muted);
      font-size: 0.92rem;
    }
  `
})
export class ServicesDiLessonComponent {
  readonly level = input<LearningLevel>('basic');
  readonly session = inject(StudySessionService);
}
