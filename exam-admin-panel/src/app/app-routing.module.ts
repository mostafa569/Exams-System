import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ExamListComponent } from './components/exam-list/exam-list.component';
import { ExamFormComponent } from './components/exam-form/exam-form.component';
import { QuestionFormComponent } from './components/question-form/question-form.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'exams', component: ExamListComponent, canActivate: [AuthGuard] },
  { path: 'create-exam', component: ExamFormComponent, canActivate: [AuthGuard] },
  { path: 'edit-exam/:examId', component: ExamFormComponent, canActivate: [AuthGuard] },
  { path: 'create-question/:examId', component: QuestionFormComponent, canActivate: [AuthGuard] },
  { path: 'edit-question/:questionId', component: QuestionFormComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/exams', pathMatch: 'full' },
  { path: '**', redirectTo: '/exams' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
