import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MockCatalogApiService } from '../../../core/mock-catalog-api.service';

type UiCourse = {
  id: number;
  title: string;
  label: string;
  durationHours: number;
};

@Component({
  selector: 'app-http-rxjs-lesson',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="lesson-demo">
      <p class="lesson-demo-intro">
        Este ejemplo consume un API mock local para practicar transformaciones con
        <code>map()</code> y manejo de errores en RxJS.
      </p>

      <div class="lesson-demo-actions">
        <button type="button" class="lesson-btn lesson-btn-primary" (click)="load(false)">
          Cargar cursos
        </button>
        <button type="button" class="lesson-btn" (click)="load(true)">Simular error</button>
      </div>

      @if (loading()) {
        <p class="lesson-chip">Cargando...</p>
      }

      @if (errorMessage(); as error) {
        <p class="error">{{ error }}</p>
      }

      @if (!loading() && courses().length > 0) {
        <ul>
          @for (course of courses(); track course.id) {
            <li>
              <strong>{{ course.title }}</strong>
              <span>{{ course.label }} | {{ course.durationHours }} horas</span>
            </li>
          }
        </ul>
      }
    </section>
  `,
  styles: `
    p {
      margin: 0;
    }

    ul {
      margin: 0;
      padding: 0;
      list-style: none;
      display: grid;
      gap: 0.5rem;
    }

    li {
      display: grid;
      gap: 0.1rem;
      border: 1px solid var(--border-soft);
      border-radius: 8px;
      padding: 0.65rem;
      background: color-mix(in srgb, var(--surface-page) 46%, white 54%);
    }

    .error {
      color: var(--danger-strong);
      font-weight: 500;
    }

    .lesson-chip {
      background: color-mix(in srgb, var(--brand-soft) 24%, white 76%);
      color: var(--brand-strong);
    }
  `
})
export class HttpRxjsLessonComponent {
  private readonly api = inject(MockCatalogApiService);
  private readonly destroyRef = inject(DestroyRef);
  private requestId = 0;

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly courses = signal<UiCourse[]>([]);

  constructor() {
    this.load(false);
  }

  load(simulateError: boolean): void {
    const currentRequestId = ++this.requestId;
    this.loading.set(true);
    this.errorMessage.set(null);

    this.api
      .getCourses({ fail: simulateError })
      .pipe(
        map((courses) =>
          courses.map((course) => ({
            id: course.id,
            title: course.title,
            durationHours: course.durationHours,
            label: `nivel ${course.level}`
          }))
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (courses) => {
          if (currentRequestId !== this.requestId) {
            return;
          }

          this.courses.set(courses);
          this.loading.set(false);
        },
        error: () => {
          if (currentRequestId !== this.requestId) {
            return;
          }

          this.courses.set([]);
          this.errorMessage.set('No se pudo cargar el catalogo (error simulado).');
          this.loading.set(false);
        }
      });
  }
}
