import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/exams', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
  { path: 'exams', loadComponent: () => import('./components/exam-list/exam-list.component').then(m => m.ExamListComponent) },
  { path: 'create-exam', loadComponent: () => import('./components/exam-form/exam-form.component').then(m => m.ExamFormComponent) },
  { path: 'edit-exam/:examId', loadComponent: () => import('./components/exam-form/exam-form.component').then(m => m.ExamFormComponent) },
  { path: 'view-exam/:examId', loadComponent: () => import('./components/exam-view/exam-view.component').then(m => m.ExamViewComponent) },
  { path: 'create-question/:examId', loadComponent: () => import('./components/question-form/question-form.component').then(m => m.QuestionFormComponent) },
  { path: 'edit-question/:questionId', loadComponent: () => import('./components/question-form/question-form.component').then(m => m.QuestionFormComponent) }
];
