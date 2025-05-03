import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Question } from '../models/exam.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token || ''}`
    });
  }

  getExamQuestions(examId: string): Observable<Question[]> {
    console.log(`Getting questions for exam ID: ${examId}`);
    return this.http.get<any[]>(`${this.apiUrl}/admin/get-exam-questions/${examId}`, {
      headers: this.getHeaders()
    }).pipe(
      map(questions => questions.map(q => ({
        _id: q._id,
        examId: q.examId || examId,
        questionText: q.questionText,
        choices: q.choices || [],
        correctAnswer: q.correctAnswer
      } as Question))),
      tap(questions => console.log('Retrieved questions:', questions)),
      catchError(this.handleError)
    );
  }

  getQuestionById(questionId: string): Observable<Question> {
    return this.http.get<any>(`${this.apiUrl}/admin/questions/${questionId}`, {
      headers: this.getHeaders()
    }).pipe(
      map(q => ({
        _id: q._id,
        examId: q.examId,
        questionText: q.questionText,
        choices: q.choices || [],
        correctAnswer: q.correctAnswer
      } as Question)),
      tap(question => console.log('Retrieved question:', question)),
      catchError(this.handleError)
    );
  }

  createQuestion(question: Question): Observable<Question> {
    console.log('Creating question with data:', question);
    return this.http.post<any>(`${this.apiUrl}/admin/questions`, question, {
      headers: this.getHeaders()
    }).pipe(
      map(q => ({
        _id: q._id,
        examId: q.examId,
        questionText: q.questionText,
        choices: q.choices || [],
        correctAnswer: q.correctAnswer
      } as Question)),
      tap(createdQuestion => console.log('Created question:', createdQuestion)),
      catchError(this.handleError)
    );
  }

  editQuestion(questionId: string, question: Question): Observable<Question> {
    return this.http.put<any>(`${this.apiUrl}/admin/questions/${questionId}`, question, {
      headers: this.getHeaders()
    }).pipe(
      map(q => ({
        _id: q._id,
        examId: q.examId,
        questionText: q.questionText,
        choices: q.choices || [],
        correctAnswer: q.correctAnswer
      } as Question)),
      tap(updatedQuestion => console.log('Updated question:', updatedQuestion)),
      catchError(this.handleError)
    );
  }

  deleteQuestion(questionId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/questions/${questionId}`, {
      headers: this.getHeaders()
    }).pipe(
      tap(() => console.log('Deleted question:', questionId)),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.error && error.error.message) {
        errorMessage += `\nDetails: ${error.error.message}`;
      }
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
