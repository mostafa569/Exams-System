import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ExamService } from '../../services/exam.service';
import { QuestionService } from '../../services/question.service';
import { Exam } from '../../models/exam.model';
import { Question } from '../../models/question.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-exam-view',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatListModule
  ],
  templateUrl: './exam-view.component.html',
  styleUrls: ['./exam-view.component.css']
})
export class ExamViewComponent implements OnInit {
  exam: Exam | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private examService: ExamService,
    private questionService: QuestionService
  ) {}

  ngOnInit(): void {
    const examId = this.route.snapshot.paramMap.get('examId');
    if (examId) {
      this.loading = true;
      this.examService.getExamById(examId).subscribe({
        next: (exam) => {
          console.log('Loaded exam:', exam); // Debug log
          this.exam = exam;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load exam details';
          this.loading = false;
          console.error('Error fetching exam:', err);
        }
      });
    } else {
      this.error = 'No exam ID provided';
      this.loading = false;
    }
  }

  goBack(): void {
    this.router.navigate(['/exams']);
  }

  editExam(): void {
    if (this.exam && this.exam._id) {
      this.router.navigate(['/edit-exam', this.exam._id]);
    }
  }

  deleteQuestion(questionId: string): void {
    if (confirm('Are you sure you want to delete this question?')) {
      this.questionService.deleteQuestion(questionId).subscribe({
        next: () => {
          console.log('Question deleted successfully');
          // تحديث قائمة الأسئلة بعد الحذف
          if (this.exam && this.exam.questions) {
            this.exam.questions = this.exam.questions.filter(q => q._id !== questionId);
          }
        },
        error: (err) => {
          console.error('Error deleting question:', err);
          alert('Failed to delete question. Please try again.');
        }
      });
    }
  }
}







