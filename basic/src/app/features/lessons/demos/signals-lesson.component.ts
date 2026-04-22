import { ChangeDetectionStrategy, Component, computed, effect, signal } from '@angular/core';

@Component({
  selector: 'app-signals-lesson',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="lesson-demo">
      <p class="lesson-demo-intro">
        Usa botones para mutar una signal y observa como <code>computed()</code> y
        <code>effect()</code> reaccionan de inmediato.
      </p>

      <p>
        Estado base: <strong>{{ count() }}</strong>
      </p>
      <p>
        Derivado con computed(): <strong>{{ doubledCount() }}</strong>
      </p>

      <div class="lesson-demo-actions">
        <button type="button" class="lesson-btn" (click)="decrement()">-1</button>
        <button type="button" class="lesson-btn lesson-btn-primary" (click)="increment()">+1</button>
      </div>

      <h4>Historial effect()</h4>
      <ul>
        @for (entry of history(); track entry) {
          <li>{{ entry }}</li>
        }
      </ul>
    </section>
  `,
  styles: `
    h4,
    p,
    ul {
      margin: 0;
    }

    ul {
      padding-left: 1.2rem;
      display: grid;
      gap: 0.25rem;
      color: var(--text-secondary);
    }
  `
})
export class SignalsLessonComponent {
  readonly count = signal(0);
  readonly doubledCount = computed(() => this.count() * 2);
  readonly history = signal<string[]>([]);

  private readonly logEffect = effect(() => {
    const currentCount = this.count();
    this.history.update((entries) => [`count = ${currentCount}`, ...entries].slice(0, 5));
  });

  increment(): void {
    this.count.update((value) => value + 1);
  }

  decrement(): void {
    this.count.update((value) => value - 1);
  }
}
