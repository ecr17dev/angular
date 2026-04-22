import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-medium-task-board-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="lesson-demo">
      <p class="lesson-demo-intro">
        Demo de nivel medio en dominio <strong>Panel SaaS de tareas</strong>. Simula filtro operativo
        y metricas derivadas de un tablero real.
      </p>

      <label>
        Estado
        <select [value]="statusFilter()" (change)="onStatusChange($event)">
          <option value="all">Todos</option>
          <option value="todo">Pendiente</option>
          <option value="doing">En progreso</option>
          <option value="done">Completado</option>
        </select>
      </label>

      <div class="stats">
        <p>Total filtrado: <strong>{{ filteredTasks().length }}</strong></p>
        <p>Alta prioridad: <strong>{{ highPriorityCount() }}</strong></p>
      </div>

      <ul>
        @for (task of filteredTasks(); track task.id) {
          <li>
            <strong>{{ task.title }}</strong>
            <span>{{ task.status }} | prioridad {{ task.priority }}</span>
          </li>
        }
      </ul>
    </section>
  `,
  styles: `
    .lesson-demo {
      display: grid;
      gap: 0.75rem;
    }

    p {
      margin: 0;
    }

    label {
      display: grid;
      gap: 0.25rem;
      max-width: 260px;
      font-size: 0.9rem;
    }

    select {
      border: 1px solid var(--border-soft);
      border-radius: 8px;
      padding: 0.35rem 0.55rem;
      background: #ffffff;
    }

    .stats {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      border: 1px solid var(--border-soft);
      border-radius: 8px;
      background: color-mix(in srgb, var(--surface-page) 46%, white 54%);
      padding: 0.6rem;
    }

    ul {
      margin: 0;
      padding: 0;
      list-style: none;
      display: grid;
      gap: 0.45rem;
    }

    li {
      border: 1px solid var(--border-soft);
      border-radius: 8px;
      padding: 0.55rem 0.65rem;
      display: grid;
      gap: 0.15rem;
      background: var(--surface-card);
    }

    li span {
      color: var(--text-muted);
      font-size: 0.86rem;
    }
  `
})
export class MediumTaskBoardDemoComponent {
  readonly statusFilter = signal<'all' | 'todo' | 'doing' | 'done'>('all');

  readonly tasks = signal([
    { id: 1, title: 'Definir arquitectura por feature', status: 'todo', priority: 'alta' },
    { id: 2, title: 'Implementar interceptor de auth mock', status: 'doing', priority: 'alta' },
    { id: 3, title: 'Optimizar tablero con @defer', status: 'done', priority: 'media' }
  ]);

  readonly filteredTasks = computed(() => {
    if (this.statusFilter() === 'all') {
      return this.tasks();
    }

    return this.tasks().filter((task) => task.status === this.statusFilter());
  });

  readonly highPriorityCount = computed(
    () => this.filteredTasks().filter((task) => task.priority === 'alta').length
  );

  onStatusChange(event: Event): void {
    const status = (event.target as HTMLSelectElement | null)?.value;
    if (status === 'all' || status === 'todo' || status === 'doing' || status === 'done') {
      this.statusFilter.set(status);
    }
  }
}
