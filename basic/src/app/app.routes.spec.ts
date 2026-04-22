import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';

describe('App routes', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter(routes), provideHttpClient()]
    }).compileComponents();
  });

  it('navigates to canonical basic lesson route', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/basic/lessons/01-signals');
    expect(harness.routeNativeElement?.textContent).toContain('Signals y estado local');
  });

  it('navigates to canonical medium lesson route', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/medium/lessons/01-feature-architecture');
    expect(harness.routeNativeElement?.textContent).toContain('Feature Architecture para SaaS');
  });

  it('navigates from lesson to practice route in same level', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/basic/lessons/02-templates');

    const link = harness.routeNativeElement?.querySelector('.practice-link') as HTMLAnchorElement;
    expect(link.getAttribute('href')).toContain('/basic/lessons/02-templates/practice');

    await harness.navigateByUrl('/basic/lessons/02-templates/practice');
    expect(harness.routeNativeElement?.textContent).toContain('Practice Lab');
  });

  it('shows fallback for lessons without active practice challenges', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/basic/lessons/01-signals/practice');
    expect(harness.routeNativeElement?.textContent).toContain('Proximamente');
  });

  it('keeps compatibility for legacy basic lesson route', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/lessons/02-templates');
    expect(harness.routeNativeElement?.textContent).toContain('Templates y control flow');
  });
});
