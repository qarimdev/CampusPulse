import { Routes } from '@angular/router';
import { CoursePlannerComponent } from './components/course-planner/course-planner';
import { DashboardComponent } from './components/dashboard/dashboard';
import { GpaCalculatorComponent } from './components/gpa-calculator/gpa-calculator';
import { LoginComponent } from './components/login/login';
import { ProfileComponent } from './components/profile/profile';
import { RegisterComponent } from './components/register/register';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'planner', component: CoursePlannerComponent, canActivate: [authGuard] },
  { path: 'gpa-calculator', component: GpaCalculatorComponent, canActivate: [authGuard] },
];
