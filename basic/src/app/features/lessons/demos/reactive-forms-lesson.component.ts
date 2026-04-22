import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

type RegistrationForm = FormGroup<{
  name: FormControl<string>;
  email: FormControl<string>;
  experienceLevel: FormControl<'junior' | 'mid' | 'senior'>;
}>;

@Component({
  selector: 'app-reactive-forms-lesson',
  imports: [ReactiveFormsModule, JsonPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="lesson-demo">
      <p class="lesson-demo-intro">
        Completa el formulario para ver validaciones tipadas y payload final controlado por
        <code>FormGroup</code>.
      </p>

      <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
        <label>
          Nombre
          <input class="lesson-input" formControlName="name" placeholder="Tu nombre" />
        </label>
        @if (form.controls.name.touched && form.controls.name.invalid) {
          <p class="error">Nombre obligatorio (minimo 3 caracteres).</p>
        }

        <label>
          Email
          <input class="lesson-input" formControlName="email" placeholder="tu@email.com" />
        </label>
        @if (form.controls.email.touched && form.controls.email.invalid) {
          <p class="error">Ingresa un email valido.</p>
        }

        <label>
          Nivel
          <select class="lesson-select" formControlName="experienceLevel">
            <option value="junior">Junior</option>
            <option value="mid">Mid</option>
            <option value="senior">Senior</option>
          </select>
        </label>

        <button type="submit" class="lesson-btn lesson-btn-primary">Enviar formulario</button>
      </form>

      @if (lastPayload(); as payload) {
        <pre>Payload enviado: {{ payload | json }}</pre>
      }
    </section>
  `,
  styles: `
    form {
      display: grid;
      gap: 0.75rem;
      max-width: 420px;
    }

    label {
      display: grid;
      gap: 0.25rem;
      font-size: 0.92rem;
      color: var(--text-secondary);
    }

    button {
      justify-self: start;
    }

    .error {
      margin: 0;
      color: var(--danger-strong);
      font-size: 0.84rem;
    }

    pre {
      margin: 0;
      padding: 0.75rem;
      border-radius: 8px;
      background: color-mix(in srgb, var(--surface-page) 44%, white 56%);
      border: 1px solid var(--border-soft);
      overflow-x: auto;
      font-size: 0.86rem;
    }
  `
})
export class ReactiveFormsLessonComponent {
  readonly form: RegistrationForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)]
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    }),
    experienceLevel: new FormControl<'junior' | 'mid' | 'senior'>('junior', {
      nonNullable: true,
      validators: [Validators.required]
    })
  });

  readonly lastPayload = signal<{
    name: string;
    email: string;
    experienceLevel: 'junior' | 'mid' | 'senior';
  } | null>(null);

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.lastPayload.set(this.form.getRawValue());
  }
}
