import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

type WorkItem = {
  id: number;
  task: string;
  area: 'frontend' | 'backend';
  priority: 'alta' | 'media' | 'baja';
  active: boolean;
};

@Component({
  selector: 'app-templates-lesson',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="lesson-demo">
      <p class="lesson-demo-intro">
        Filtra una lista con <code>&#64;if</code>, <code>&#64;for</code> y destaca prioridad con
        <code>&#64;switch</code>.
      </p>

      <label>
        Area
        <select class="lesson-select" [value]="selectedArea()" (change)="onAreaChange($event)">
          <option value="all">Todas</option>
          <option value="frontend">Frontend</option>
          <option value="backend">Backend</option>
        </select>
      </label>

      <label>
        Prioridad destacada
        <select class="lesson-select" [value]="selectedPriority()" (change)="onPriorityChange($event)">
          <option value="alta">Alta</option>
          <option value="media">Media</option>
          <option value="baja">Baja</option>
        </select>
      </label>

      @switch (selectedPriority()) {
        @case ('alta') {
          <p class="lesson-chip lesson-chip-warn">Foco: tareas de impacto inmediato.</p>
        }
        @case ('media') {
          <p class="lesson-chip">Foco: consolidacion de features.</p>
        }
        @default {
          <p class="lesson-chip lesson-chip-ok">Foco: mejoras de calidad y deuda tecnica.</p>
        }
      }

      @if (filteredItems().length > 0) {
        <ul>
          @for (item of filteredItems(); track item.id) {
            <li
              [class.active]="item.active"
              [class.inactive]="!item.active"
              [style.border-left-color]="item.active ? 'var(--ok)' : 'var(--border-soft)'"
            >
              <strong>{{ item.task }}</strong>
              <span>{{ item.area }} | prioridad {{ item.priority }}</span>
            </li>
          }
        </ul>
      } @else {
        <p>No hay tareas para el filtro actual.</p>
      }
    </section>
  `,
  styles: `
    label {
      display: grid;
      gap: 0.22rem;
      max-width: 320px;
      font-size: 0.92rem;
      color: var(--text-secondary);
    }

    p,
    ul {
      margin: 0;
    }

    ul {
      padding: 0;
      list-style: none;
      display: grid;
      gap: 0.5rem;
    }

    li {
      display: grid;
      gap: 0.15rem;
      border-left: 4px solid transparent;
      border-radius: 8px;
      padding: 0.6rem 0.75rem;
      background: color-mix(in srgb, var(--surface-page) 40%, white 60%);
      border: 1px solid var(--border-soft);
    }

    .active {
      color: var(--text-primary);
    }

    .inactive {
      color: var(--text-muted);
      opacity: 0.9;
    }

    .lesson-chip {
      color: var(--text-secondary);
      background: color-mix(in srgb, var(--brand-soft) 26%, white 74%);
    }
  `
})
export class TemplatesLessonComponent {
  readonly selectedArea = signal<'all' | WorkItem['area']>('all');
  readonly selectedPriority = signal<WorkItem['priority']>('alta');
  readonly items = signal<WorkItem[]>([
    { id: 1, task: 'Configurar layout principal', area: 'frontend', priority: 'alta', active: true },
    { id: 2, task: 'Definir contrato del API mock', area: 'backend', priority: 'media', active: true },
    { id: 3, task: 'Documentar estrategia de testing', area: 'frontend', priority: 'baja', active: false }
  ]);

  readonly filteredItems = computed(() => {
    const area = this.selectedArea();
    const allItems = this.items();

    if (area === 'all') {
      return allItems;
    }

    return allItems.filter((item) => item.area === area);
  });

  onAreaChange(event: Event): void {
    const area = (event.target as HTMLSelectElement | null)?.value;

    if (area === 'frontend' || area === 'backend' || area === 'all') {
      this.selectedArea.set(area);
    }
  }

  onPriorityChange(event: Event): void {
    const priority = (event.target as HTMLSelectElement | null)?.value;

    if (priority === 'alta' || priority === 'media' || priority === 'baja') {
      this.selectedPriority.set(priority);
    }
  }
}
