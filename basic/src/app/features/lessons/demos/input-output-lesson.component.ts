import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { ScoreCardComponent } from './score-card.component';

type Player = {
  id: number;
  name: string;
  score: number;
};

@Component({
  selector: 'app-input-output-lesson',
  imports: [ScoreCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="lesson-demo">
      <p class="lesson-demo-intro">
        El padre conserva la fuente de verdad y cada hijo emite su score con
        <code>output()</code>.
      </p>

      <div class="cards">
        @for (player of players(); track player.id) {
          <app-score-card
            [name]="player.name"
            [score]="player.score"
            (scoreChange)="updateScore(player.id, $event)"
          />
        }
      </div>

      <p class="winner">Lider: {{ winnerName() }}</p>
    </section>
  `,
  styles: `
    .cards {
      display: grid;
      gap: 0.75rem;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    }

    p {
      margin: 0;
    }

    .winner {
      font-weight: 700;
      color: var(--brand-strong);
    }
  `
})
export class InputOutputLessonComponent {
  readonly players = signal<Player[]>([
    { id: 1, name: 'Ada Lovelace', score: 0 },
    { id: 2, name: 'Evan You', score: 0 }
  ]);

  readonly winnerName = computed(() => {
    const [leader] = [...this.players()].sort((a, b) => b.score - a.score);
    return leader ? `${leader.name} (${leader.score})` : 'Sin datos';
  });

  updateScore(playerId: number, newScore: number): void {
    this.players.update((players) =>
      players.map((player) => (player.id === playerId ? { ...player, score: newScore } : player))
    );
  }
}
