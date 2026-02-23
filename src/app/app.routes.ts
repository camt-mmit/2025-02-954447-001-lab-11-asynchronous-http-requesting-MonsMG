import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'star-wars', pathMatch: 'full' },

  { path: 'star-wars', loadChildren: () => import('./star-wars/routes') },
];
