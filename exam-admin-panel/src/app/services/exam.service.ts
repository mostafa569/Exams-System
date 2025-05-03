import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Exam } from '../models/exam.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token || ''}`
    });
  }

  getExams(): Observable<Exam[]> {
    console.log('Fetching exams from:', `${this.apiUrl}/admin/exams`);
    return this.http.get<Exam[]>(`${this.apiUrl}/admin/exams`, {
      headers: this.getHeaders()
    });
  }

  getExamById(examId: string): Observable<Exam> {
    return this.http.get<Exam>(`${this.apiUrl}/admin/exams/${examId}`, {
      headers: this.getHeaders()
    });
  }

  createExam(exam: Exam): Observable<Exam> {
    return this.http.post<Exam>(`${this.apiUrl}/admin/exams`, exam, {
      headers: this.getHeaders()
    });
  }

  editExam(examId: string, exam: Exam): Observable<Exam> {
    return this.http.put<Exam>(`${this.apiUrl}/admin/exams/${examId}`, exam, {
      headers: this.getHeaders()
    });
  }

  deleteExam(examId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/exams/${examId}`, {
      headers: this.getHeaders()
    });
  }
}
