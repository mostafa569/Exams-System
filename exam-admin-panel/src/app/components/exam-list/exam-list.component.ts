import { Component, OnInit } from '@angular/core';
import { ExamService } from '../../services/exam.service';
import { QuestionService } from '../../services/question.service';
import { Exam, Question } from '../../models/exam.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { forkJoin, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-exam-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    RouterLink,
    MatProgressSpinnerModule,
    MatCardModule
  ],
  templateUrl: './exam-list.component.html',
  styleUrls: ['./exam-list.component.css']
})
export class ExamListComponent implements OnInit {
  exams: Exam[] = [];
  loading = true;
  error: string | null = null;
  displayedColumns: string[] = ['title', 'description', 'duration', 'actions'];

  constructor(
    private examService: ExamService, 
    private questionService: QuestionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadExams();
  }

  loadExams(): void {
    this.loading = true;
    this.examService.getExams().pipe(
      switchMap(exams => {
        if (exams.length === 0) {
          return of([]);
        }
        
        // Create an array of observables for each exam's questions
        const questionObservables = exams.map(exam => 
          this.questionService.getExamQuestions(exam._id || '').pipe(
            map(questions => {
              // Attach questions to the exam
              return {
                ...exam,
                questions: questions as Question[]
              } as Exam;
            }),
            catchError(error => {
              console.error(`Error fetching questions for exam ${exam._id}:`, error);
              return of({
                ...exam,
                questions: [] as Question[]
              } as Exam);
            })
          )
        );
        
        // Wait for all question requests to complete
        return forkJoin(questionObservables);
      })
    ).subscribe({
      next: (examsWithQuestions) => {
        console.log('Received exams with questions:', examsWithQuestions);
        this.exams = examsWithQuestions as Exam[];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching exams:', err);
        this.error = 'Failed to load exams. Please try again.';
        this.loading = false;
      }
    });
  }

  editExam(examId: string): void {
    this.router.navigate([`/edit-exam/${examId}`]);
  }

  deleteExam(examId: string): void {
    if (!examId) {
      console.error('Cannot delete exam: No exam ID provided');
      return;
    }
    
    if (confirm('Are you sure you want to delete this exam?')) {
      this.examService.deleteExam(examId).subscribe({
        next: () => {
          console.log('Exam deleted successfully:', examId);
          this.exams = this.exams.filter(exam => exam._id !== examId);
        },
        error: (err: any) => {
          console.error('Error deleting exam:', err);
          alert('Failed to delete exam. Please try again.');
        }
      });
    }
  }
}
