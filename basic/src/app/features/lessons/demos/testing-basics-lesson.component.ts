import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-testing-basics-lesson',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="lesson-demo">
      <p class="lesson-demo-intro">
        En Angular 21 puedes probar componentes standalone y servicios con Vitest + TestBed
        siguiendo un flujo repetible.
      </p>

      <ol>
        <li>Crear componente o servicio con TestBed.</li>
        <li>Ejecutar acciones de usuario/estado.</li>
        <li>Validar DOM, signals o metodos esperados.</li>
      </ol>

      <pre><code>npm test
ng test</code></pre>

      <p class="note">
        Revisa los specs del laboratorio: incluyen rutas, forms, input/output y flujo HTTP mock.
      </p>
    </section>
  `,
  styles: `
    p,
    ol {
      margin: 0;
    }

    ol {
      padding-left: 1.2rem;
      display: grid;
      gap: 0.3rem;
      color: var(--text-secondary);
    }

    pre {
      margin: 0;
      padding: 0.7rem;
      border-radius: 8px;
      border: 1px solid var(--border-soft);
      background: color-mix(in srgb, var(--surface-page) 48%, white 52%);
      font-size: 0.9rem;
    }

    .note {
      color: var(--text-muted);
    }
  `
})
export class TestingBasicsLessonComponent {}
