import { TestBed } from '@angular/core/testing';
import { SignalsLessonComponent } from './signals-lesson.component';

describe('SignalsLessonComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignalsLessonComponent]
    }).compileComponents();
  });

  it('updates computed value when count changes', () => {
    const fixture = TestBed.createComponent(SignalsLessonComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.increment();
    component.increment();
    fixture.detectChanges();

    expect(component.count()).toBe(2);
    expect(component.doubledCount()).toBe(4);
    expect(component.history()).toContain('count = 2');
  });
});
