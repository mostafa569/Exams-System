import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Exam } from '../models/exam.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getExams(): Observable<Exam[]> {
    return this.http.get<Exam[]>(`${this.apiUrl}/admin/exams`, {
      headers: this.getHeaders()
    });
  }

  getExamById(examId: string): Observable<Exam> {
    return this.http.get<Exam>(`${this.apiUrl}/admin/exams/${examId}`, {
      headers: this.getHeaders()
    });
  }

  createExam(examData: Exam): Observable<Exam> {
    return this.http.post<Exam>(`${this.apiUrl}/admin/exams`, examData, {
      headers: this.getHeaders()
    });
  }

  editExam(examId: string, examData: Exam): Observable<Exam> {
    return this.http.put<Exam>(`${this.apiUrl}/admin/exams/${examId}`, examData, {
      headers: this.getHeaders()
    });
  }

  deleteExam(examId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/admin/exams/${examId}`, {
      headers: this.getHeaders()
    });
  }

  getExamResults(examId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/exams/${examId}/results`, {
      headers: this.getHeaders()
    });
  }
}
