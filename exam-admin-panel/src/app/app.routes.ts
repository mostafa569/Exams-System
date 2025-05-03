import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
  { path: 'dashboard', loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent), canActivate: [authGuard] },
  { path: 'exams', loadComponent: () => import('./components/exam-list/exam-list.component').then(m => m.ExamListComponent), canActivate: [authGuard] },
  { path: 'create-exam', loadComponent: () => import('./components/exam-form/exam-form.component').then(m => m.ExamFormComponent), canActivate: [authGuard] },
  { path: 'edit-exam/:examId', loadComponent: () => import('./components/exam-form/exam-form.component').then(m => m.ExamFormComponent), canActivate: [authGuard] },
  { path: 'view-exam/:examId', loadComponent: () => import('./components/exam-view/exam-view.component').then(m => m.ExamViewComponent), canActivate: [authGuard] },
  { path: 'create-question/:examId', loadComponent: () => import('./components/question-form/question-form.component').then(m => m.QuestionFormComponent), canActivate: [authGuard] },
  { path: 'edit-question/:questionId', loadComponent: () => import('./components/question-form/question-form.component').then(m => m.QuestionFormComponent), canActivate: [authGuard] },
  { path: 'exam-results/:examId', loadComponent: () => import('./components/exam-results/exam-results.component').then(m => m.ExamResultsComponent), canActivate: [authGuard] }
];
