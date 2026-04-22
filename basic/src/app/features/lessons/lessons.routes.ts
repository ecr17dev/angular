import { Routes } from '@angular/router';

export const LESSON_ROUTES: Routes = [
  {
    path: ':slug/practice',
    loadComponent: () =>
      import('../practice/practice-playground.page').then((m) => m.PracticePlaygroundPageComponent)
  },
  {
    path: ':slug',
    loadComponent: () => import('./lesson-page.component').then((m) => m.LessonPageComponent)
  }
];
