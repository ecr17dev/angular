import { TestBed } from '@angular/core/testing';
import { ReactiveFormsLessonComponent } from './reactive-forms-lesson.component';

describe('ReactiveFormsLessonComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsLessonComponent]
    }).compileComponents();
  });

  it('does not submit invalid form', () => {
    const fixture = TestBed.createComponent(ReactiveFormsLessonComponent);
    const component = fixture.componentInstance;

    component.submit();

    expect(component.lastPayload()).toBeNull();
    expect(component.form.invalid).toBe(true);
  });

  it('submits valid form payload', () => {
    const fixture = TestBed.createComponent(ReactiveFormsLessonComponent);
    const component = fixture.componentInstance;

    component.form.setValue({
      name: 'Evan You',
      email: 'evan@example.com',
      experienceLevel: 'senior'
    });
    component.submit();

    expect(component.lastPayload()).toEqual({
      name: 'Evan You',
      email: 'evan@example.com',
      experienceLevel: 'senior'
    });
  });
});
