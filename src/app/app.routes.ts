import { Routes } from '@angular/router';
import { APP_ROUTES } from './constants/constants';
import { AdminGuard } from './guards/admin.guard';

// Lazy loading keeps route-specific page code out of the initial app bundle.
export const routes: Routes = [
  {
    path: APP_ROUTES.home,
    pathMatch: 'full',
    redirectTo: APP_ROUTES.characterList,
  },
  {
    path: APP_ROUTES.characterList,
    loadComponent: () =>
      import('./components/character-list/character-list.component').then(
        (module) => module.CharacterListComponent,
      ),
  },
  {
    path: APP_ROUTES.characterDetails,
    canActivate: [AdminGuard],
    loadComponent: () =>
      import('./components/character-detail/character-detail.component').then(
        (module) => module.CharacterDetailComponent,
      ),
  },
  {
    path: APP_ROUTES.accessDenied,
    loadComponent: () =>
      import('./components/access-denied/access-denied.component').then(
        (module) => module.AccessDeniedComponent,
      ),
  },
  {
    path: APP_ROUTES.fallback,
    redirectTo: APP_ROUTES.characterList,
  },
];
