import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../../app.routes';
import { PracticePlaygroundPageComponent } from './practice-playground.page';

describe('PracticePlaygroundPageComponent', () => {
  beforeEach(async () => {
    window.localStorage.clear();

    await TestBed.configureTestingModule({
      providers: [provideRouter(routes), provideHttpClient()]
    }).compileComponents();
  });

  it('shows correction hints when verification fails', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/basic/lessons/02-templates/practice');

    const component = harness.routeDebugElement?.componentInstance as PracticePlaygroundPageComponent;
    component.verifyCode();
    harness.detectChanges();

    expect(harness.routeNativeElement?.textContent).toContain('Fallo');
    expect(harness.routeNativeElement?.textContent).toContain('Pista');
  });

  it('shows aprobado when verification passes', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/basic/lessons/02-templates/practice');

    const component = harness.routeDebugElement?.componentInstance as PracticePlaygroundPageComponent;
    component.code.set(`const isLoggedIn = true;
@if (isLoggedIn) {
  <p>Bienvenido de nuevo</p>
} @else {
  <p>Inicia sesion</p>
}`);
    component.verifyCode();
    harness.detectChanges();

    expect(harness.routeNativeElement?.textContent).toContain('Aprobado');
    expect(harness.routeNativeElement?.textContent).toContain('Score 100%');
  });

  it('restores persisted code when page is reopened', async () => {
    const keyDraft = 'angular21-lab-practice:draft:basic:02-templates:templates-if-else';
    const keyProgress = 'angular21-lab-practice:progress:basic:02-templates:templates-if-else';

    window.localStorage.setItem(keyDraft, 'codigo restaurado');
    window.localStorage.setItem(keyProgress, JSON.stringify({ attempts: 5, approved: false }));

    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/basic/lessons/02-templates/practice');

    const textarea = harness.routeNativeElement?.querySelector('textarea') as HTMLTextAreaElement;
    expect(textarea.value).toBe('codigo restaurado');
  });

  it('loads medium challenge catalog in medium route', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/medium/lessons/01-feature-architecture/practice');

    expect(harness.routeNativeElement?.textContent).toContain('Feature Architecture por dominios');
  });
});
