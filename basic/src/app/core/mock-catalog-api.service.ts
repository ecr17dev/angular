import { Injectable } from '@angular/core';
import { Observable, delay, mergeMap, of, throwError, timer } from 'rxjs';

export interface CourseDto {
  id: number;
  title: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  durationHours: number;
}

const MOCK_COURSES: CourseDto[] = [
  { id: 1, title: 'Fundamentos de Angular', level: 'beginner', durationHours: 6 },
  { id: 2, title: 'Componentes y arquitectura', level: 'intermediate', durationHours: 8 },
  { id: 3, title: 'Testing en Angular 21', level: 'advanced', durationHours: 5 }
];

@Injectable({ providedIn: 'root' })
export class MockCatalogApiService {
  getCourses(options?: { fail?: boolean }): Observable<CourseDto[]> {
    if (options?.fail) {
      return timer(450).pipe(mergeMap(() => throwError(() => new Error('Fallo simulado del API mock'))));
    }

    return of(MOCK_COURSES).pipe(delay(450));
  }
}
