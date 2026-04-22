import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'basic'
  },
  {
    path: 'basic',
    loadComponent: () => import('./features/home/home.page').then((m) => m.HomePageComponent)
  },
  {
    path: 'medium',
    loadComponent: () => import('./features/home/home.page').then((m) => m.HomePageComponent)
  },
  {
    path: 'basic/lessons',
    pathMatch: 'full',
    redirectTo: 'basic/lessons/01-signals'
  },
  {
    path: 'medium/lessons',
    pathMatch: 'full',
    redirectTo: 'medium/lessons/01-feature-architecture'
  },
  {
    path: 'basic/lessons',
    loadChildren: () => import('./features/lessons/lessons.routes').then((m) => m.LESSON_ROUTES)
  },
  {
    path: 'medium/lessons',
    loadChildren: () => import('./features/lessons/lessons.routes').then((m) => m.LESSON_ROUTES)
  },
  {
    path: 'lessons',
    pathMatch: 'full',
    redirectTo: 'basic/lessons/01-signals'
  },
  {
    path: 'lessons/:slug/practice',
    redirectTo: 'basic/lessons/:slug/practice'
  },
  {
    path: 'lessons/:slug',
    redirectTo: 'basic/lessons/:slug'
  },
  {
    path: '**',
    redirectTo: 'basic'
  }
];
