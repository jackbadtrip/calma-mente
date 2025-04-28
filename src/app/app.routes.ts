import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./modules/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'breathing',
    canActivate: [authGuard],
    loadComponent: () => import('./modules/breathing/breathing.component').then(m => m.BreathingComponent)
  },
  {
    path: 'diary',
    canActivate: [authGuard],
    loadComponent: () => import('./modules/diary/diary.component').then(m => m.DiaryComponent)
  },
  {
    path: 'relaxation',
    canActivate: [authGuard],
    loadComponent: () => import('./modules/relaxation/relaxation.component').then(m => m.RelaxationComponent)
  },
  {
    path: 'professional',
    canActivate: [authGuard],
    loadComponent: () => import('./modules/professional/professional.component').then(m => m.ProfessionalComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./modules/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'emergency',
    loadComponent: () => import('./modules/emergency/emergency.component').then(m => m.EmergencyComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];