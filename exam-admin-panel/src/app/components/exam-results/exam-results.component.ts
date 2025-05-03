import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ExamService } from '../../services/exam.service';
import { Exam } from '../../models/exam.model';

@Component({
  selector: 'app-exam-results',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './exam-results.component.html',
  styleUrls: ['./exam-results.component.css']
})
export class ExamResultsComponent implements OnInit {
  examId: string | null = null;
  exam: Exam | null = null;
  results: any[] = [];
  loading = true;
  error: string | null = null;
  displayedColumns: string[] = ['user', 'score', 'dateTaken', 'timeTaken'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private examService: ExamService
  ) {}

  ngOnInit(): void {
    this.examId = this.route.snapshot.paramMap.get('examId');
    if (this.examId) {
      this.loadExamDetails();
      this.loadExamResults();
    } else {
      this.error = 'No exam ID provided';
      this.loading = false;
    }
  }

  loadExamDetails(): void {
    if (!this.examId) return;
    
    this.examService.getExamById(this.examId).subscribe({
      next: (exam: Exam) => {
        this.exam = exam;
      },
      error: (err: any) => {
        console.error('Error fetching exam details:', err);
        this.error = 'Failed to load exam details';
      }
    });
  }

  loadExamResults(): void {
    if (!this.examId) return;
    
    this.examService.getExamResults(this.examId).subscribe({
      next: (results: any[]) => {
        this.results = results;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error fetching exam results:', err);
        this.error = 'Failed to load exam results';
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  formatDuration(seconds: number): string {
    if (!seconds) return 'N/A';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    return `${minutes}m ${remainingSeconds}s`;
  }
}

