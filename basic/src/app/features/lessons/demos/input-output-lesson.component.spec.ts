import { TestBed } from '@angular/core/testing';
import { InputOutputLessonComponent } from './input-output-lesson.component';

describe('InputOutputLessonComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputOutputLessonComponent]
    }).compileComponents();
  });

  it('updates parent state when child emits scoreChange', () => {
    const fixture = TestBed.createComponent(InputOutputLessonComponent);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('[data-testid="add-score"]') as HTMLButtonElement;
    button.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.players()[0]?.score).toBe(1);
    expect(fixture.nativeElement.textContent).toContain('Ada Lovelace (1)');
  });
});
