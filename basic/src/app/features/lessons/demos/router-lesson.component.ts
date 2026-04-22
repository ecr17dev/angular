import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { learningLevelFromUrl } from '../../../core/learning-level';

@Component({
  selector: 'app-router-lesson',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="lesson-demo">
      <p class="lesson-demo-intro">
        Lee params y query params en vivo para comprender como Angular Router maneja estado de navegacion.
      </p>

      <p>
        Parametro de ruta actual (<code>:slug</code>): <strong>{{ slug() }}</strong>
      </p>
      <p>
        Query param <code>section</code>: <strong>{{ section() }}</strong>
      </p>

      <div class="lesson-demo-actions">
        <button type="button" class="lesson-btn" (click)="setSection('params')">section=params</button>
        <button type="button" class="lesson-btn" (click)="setSection('query')">section=query</button>
        <button type="button" class="lesson-btn" (click)="setSection('navigation')">section=navigation</button>
      </div>

      <button type="button" class="lesson-btn lesson-btn-primary" (click)="goToFormsLesson()">
        Navegar programaticamente a Reactive Forms
      </button>
    </section>
  `,
  styles: `
    p {
      margin: 0;
    }

    button {
      justify-self: start;
    }
  `
})
export class RouterLessonComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly slug = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('slug') ?? 'sin-slug')),
    { initialValue: 'sin-slug' }
  );

  readonly section = toSignal(
    this.route.queryParamMap.pipe(map((query) => query.get('section') ?? 'overview')),
    { initialValue: 'overview' }
  );

  setSection(section: string): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { section },
      queryParamsHandling: 'merge'
    });
  }

  goToFormsLesson(): void {
    const level = learningLevelFromUrl(this.router.url);
    this.router.navigate(['/', level, 'lessons', '06-reactive-forms'], {
      queryParams: { from: '05-router' }
    });
  }
}
