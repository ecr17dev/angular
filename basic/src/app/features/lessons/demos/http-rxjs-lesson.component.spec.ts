import { TestBed } from '@angular/core/testing';
import { HttpRxjsLessonComponent } from './http-rxjs-lesson.component';

describe('HttpRxjsLessonComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpRxjsLessonComponent]
    }).compileComponents();
  });

  it('loads courses from mock service', async () => {
    const fixture = TestBed.createComponent(HttpRxjsLessonComponent);
    fixture.detectChanges();

    await new Promise((resolve) => setTimeout(resolve, 500));
    fixture.detectChanges();

    expect(fixture.componentInstance.courses().length).toBe(3);
    expect(fixture.nativeElement.textContent).toContain('Fundamentos de Angular');
  });

  it('shows error state when request fails', async () => {
    const fixture = TestBed.createComponent(HttpRxjsLessonComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.load(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    fixture.detectChanges();

    expect(component.courses()).toEqual([]);
    expect(component.errorMessage()).toContain('No se pudo cargar');
  });
});
