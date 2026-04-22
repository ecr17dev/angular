import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-score-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="score-card">
      <p class="name">{{ name() }}</p>
      <p class="score">Puntaje: {{ score() }}</p>
      <button type="button" class="lesson-btn lesson-btn-primary" data-testid="add-score" (click)="addPoint()">
        Sumar 1
      </button>
    </article>
  `,
  styles: `
    .score-card {
      border: 1px solid var(--border-soft);
      border-radius: 10px;
      padding: 0.75rem;
      display: grid;
      gap: 0.35rem;
      background: color-mix(in srgb, var(--surface-page) 44%, white 56%);
    }

    .name,
    .score {
      margin: 0;
    }

    .name {
      font-weight: 700;
    }

    button {
      justify-self: start;
    }
  `
})
export class ScoreCardComponent {
  readonly name = input.required<string>();
  readonly score = input(0);
  readonly scoreChange = output<number>();

  addPoint(): void {
    this.scoreChange.emit(this.score() + 1);
  }
}
