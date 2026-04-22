import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TablerIconComponent } from './tabler-icon.component';
import { HOME_ICONS, LESSON_PAGE_ICONS } from './lesson-icons';

@Component({
  selector: 'app-vue-comparison-panel',
  imports: [TablerIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="comparison-panel" aria-label="Comparacion Angular y Vue">
      <h3>
        <tabler-icon [icon]="lessonIcons.compare" [size]="18" [stroke]="2" aria-hidden="true" />
        Angular vs Vue
      </h3>

      <div class="snippet-grid">
        <article>
          <h4>
            <tabler-icon [icon]="homeIcons.angular" [size]="16" [stroke]="2" aria-hidden="true" />
            Angular
          </h4>
          <pre><code>{{ angularSnippet() }}</code></pre>
        </article>

        <article>
          <h4>
            <tabler-icon [icon]="homeIcons.vue" [size]="16" [stroke]="2" aria-hidden="true" />
            Vue
          </h4>
          <pre><code>{{ vueSnippet() }}</code></pre>
        </article>
      </div>

      <h4 class="differences-title">Diferencias clave</h4>
      <ul>
        @for (difference of keyDifferences(); track difference) {
          <li>{{ difference }}</li>
        }
      </ul>
    </section>
  `,
  styles: `
    .comparison-panel {
      border: 1px solid var(--border-soft);
      border-radius: var(--radius-lg);
      padding: 1rem;
      background: var(--surface-card);
      display: grid;
      gap: 0.8rem;
      box-shadow: var(--shadow-xs);
    }

    h3,
    h4,
    ul {
      margin: 0;
    }

    h3,
    h4 {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
    }

    h3 {
      font-size: 1.02rem;
    }

    h4 {
      font-size: 0.9rem;
      color: var(--text-secondary);
      margin-bottom: 0.45rem;
    }

    .differences-title {
      margin-top: 0.1rem;
      color: var(--text-primary);
    }

    .snippet-grid {
      display: grid;
      gap: 0.75rem;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    }

    article {
      border: 1px solid var(--border-soft);
      border-radius: var(--radius-md);
      padding: 0.65rem;
      background: color-mix(in srgb, var(--surface-page) 40%, white 60%);
    }

    pre {
      margin: 0;
      padding: 0.75rem;
      border-radius: 10px;
      border: 1px solid color-mix(in srgb, var(--brand-soft) 40%, var(--border-soft) 60%);
      background: #111827;
      color: #e2e8f0;
      overflow-x: auto;
      font-size: 0.83rem;
      line-height: 1.45;
    }

    ul {
      padding-left: 1.15rem;
      display: grid;
      gap: 0.3rem;
      color: var(--text-secondary);
    }
  `
})
export class VueComparisonPanelComponent {
  readonly angularSnippet = input.required<string>();
  readonly vueSnippet = input.required<string>();
  readonly keyDifferences = input.required<string[]>();

  readonly lessonIcons = LESSON_PAGE_ICONS;
  readonly homeIcons = HOME_ICONS;
}
