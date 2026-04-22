import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type TablerIconNode = [elementName: string, attrs: Record<string, string>];

export type TablerIconData = {
  name: string;
  type: 'outline' | 'filled';
  nodes: TablerIconNode[];
};

@Component({
  selector: 'tabler-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (resolvedIcon(); as icon) {
      <svg
        [attr.class]="svgClassAttr()"
        xmlns="http://www.w3.org/2000/svg"
        [attr.width]="size()"
        [attr.height]="size()"
        viewBox="0 0 24 24"
        [attr.fill]="fillColor()"
        [attr.stroke]="strokeColor()"
        [attr.stroke-width]="strokeWidth()"
        stroke-linecap="round"
        stroke-linejoin="round"
        [innerHTML]="innerNodes()"
      ></svg>
    }
  `
})
export class TablerIconComponent {
  readonly icon = input.required<TablerIconData | null>();
  readonly size = input(24);
  readonly color = input('currentColor');
  readonly stroke = input(2);
  readonly svgClass = input<string | undefined>(undefined);

  readonly resolvedIcon = computed(() => this.icon());

  readonly svgClassAttr = computed(() => {
    const icon = this.resolvedIcon();
    const base = icon ? `tabler-icon tabler-icon-${icon.name}` : 'tabler-icon';
    const extra = this.svgClass()?.trim();
    return extra ? `${base} ${extra}` : base;
  });

  readonly fillColor = computed(() => (this.resolvedIcon()?.type === 'filled' ? this.color() : 'none'));

  readonly strokeColor = computed(() => (this.resolvedIcon()?.type === 'filled' ? 'none' : this.color()));

  readonly strokeWidth = computed(() => (this.resolvedIcon()?.type === 'filled' ? undefined : this.stroke()));

  readonly innerNodes = computed(() => {
    const icon = this.resolvedIcon();
    if (!icon) {
      return '';
    }

    return icon.nodes
      .map(([tag, attrs]) => {
        const attrsText = Object.entries(attrs)
          .map(([key, value]) => ` ${key}="${this.escapeAttribute(value)}"`)
          .join('');

        return `<${tag}${attrsText}></${tag}>`;
      })
      .join('');
  });

  private escapeAttribute(value: string): string {
    return value
      .replaceAll('&', '&amp;')
      .replaceAll('"', '&quot;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;');
  }
}
