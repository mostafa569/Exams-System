import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ExamService } from '../../services/exam.service';
import { Exam } from '../../models/exam.model';
import { forkJoin, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  exams: Exam[] = [];
  examResults: { [key: string]: any[] } = {};
  loading = true;
  error: string | null = null;

  constructor(private examService: ExamService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.error = null;
    
    this.examService.getExams().pipe(
      switchMap((exams: Exam[]) => {
        this.exams = exams;
        
        if (exams.length === 0) {
          return of([]);
        }
        
        // Create an array of observables for each exam's results
        const resultObservables = exams.map(exam => {
          if (!exam._id) return of([]);
          
          return this.examService.getExamResults(exam._id).pipe(
            map(results => {
              // Store results in the examResults object
              this.examResults[exam._id!] = results;
              return results;
            }),
            catchError(error => {
              console.error(`Error fetching results for exam ${exam._id}:`, error);
              this.examResults[exam._id!] = [];
              return of([]);
            })
          );
        });
        
        // Wait for all result requests to complete
        return forkJoin(resultObservables);
      })
    ).subscribe({
      next: () => {
        console.log('Dashboard data loaded:', this.exams, this.examResults);
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading dashboard data:', err);
        this.error = 'Failed to load dashboard data. Please try again.';
        this.loading = false;
      }
    });
  }

  getAverageScore(results: any[]): number {
    if (!results || results.length === 0) return 0;
    
    const totalScore = results.reduce((sum, result) => sum + (result.score || 0), 0);
    return Math.round(totalScore / results.length);
  }
}
