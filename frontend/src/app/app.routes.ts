import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard';
import { LoginComponent } from './components/login/login';
import { ProfileComponent } from './components/profile/profile';
import { RegisterComponent } from './components/register/register';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] }, // <-- Add this
  { path: '**', redirectTo: 'dashboard' },
];
