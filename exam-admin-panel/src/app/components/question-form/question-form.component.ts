import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { QuestionService } from '../../services/question.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Question } from '../../models/exam.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-question-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './question-form.component.html',
  styleUrls: ['./question-form.component.css']
})
export class QuestionFormComponent implements OnInit {
  questionForm: FormGroup;
  questionId: string | null = null;
  examId: string | null = null;
  isLoading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private questionService: QuestionService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.questionForm = this.fb.group({
      examId: ['', Validators.required],
      questionText: ['', Validators.required],
      choices: this.fb.array([this.fb.control('', Validators.required), this.fb.control('', Validators.required)]),
      correctAnswer: [1, [Validators.required, Validators.min(1)]]
    });
  }

  get choices(): FormArray {
    return this.questionForm.get('choices') as FormArray;
  }

  addChoice(): void {
    console.log('Adding new choice');
    this.choices.push(this.fb.control('', Validators.required));
    // تحديث الحد الأقصى لقيمة الإجابة الصحيحة
    this.updateCorrectAnswerValidators();
  }

  removeChoice(index: number): void {
    if (this.choices.length > 2) {
      console.log(`Removing choice at index ${index}`);
      this.choices.removeAt(index);
      // تحديث الحد الأقصى لقيمة الإجابة الصحيحة
      this.updateCorrectAnswerValidators();
    }
  }

  updateCorrectAnswerValidators(): void {
    const correctAnswerControl = this.questionForm.get('correctAnswer');
    if (correctAnswerControl) {
      const maxValue = this.choices.length;
      correctAnswerControl.setValidators([
        Validators.required,
        Validators.min(1),
        Validators.max(maxValue)
      ]);
      correctAnswerControl.updateValueAndValidity();
    }
  }

  ngOnInit(): void {
    this.questionForm = this.fb.group({
      examId: ['', Validators.required],
      questionText: ['', Validators.required],
      choices: this.fb.array([
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required)
      ]),
      correctAnswer: [1, [Validators.required, Validators.min(1), Validators.max(2)]]
    });
    
    // إضافة مستمع للتغييرات في الخيارات
    this.choices.valueChanges.subscribe(() => {
      this.updateCorrectAnswerValidators();
    });
    
    this.examId = this.route.snapshot.paramMap.get('examId');
    this.questionId = this.route.snapshot.paramMap.get('questionId');
    
    if (this.examId) {
      console.log(`Setting examId: ${this.examId}`);
      this.questionForm.patchValue({ examId: this.examId });
    }
    
    if (this.questionId) {
      this.loadQuestion();
    }
  }

  loadQuestion(): void {
    if (!this.questionId) return;
    
    this.isLoading = true;
    console.log(`Loading question with ID: ${this.questionId}`);
    
    this.questionService.getQuestionById(this.questionId).subscribe({
      next: (question) => {
        console.log('Loaded question:', question);
        
        this.questionForm.patchValue({
          examId: question.examId,
          questionText: question.questionText,
          correctAnswer: question.correctAnswer
        });
        
        // مسح الخيارات الموجودة
        while (this.choices.length) {
          this.choices.removeAt(0);
        }
        
        // إضافة الخيارات من السؤال
        if (question.choices && question.choices.length > 0) {
          question.choices.forEach(choice => {
            this.choices.push(this.fb.control(choice, Validators.required));
          });
        }
        
        this.updateCorrectAnswerValidators();
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error fetching question:', err);
        this.error = 'Failed to load question. Please try again.';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.questionForm.valid) {
      this.isLoading = true;
      this.error = null;
      
      // Ensure examId is a string (not undefined)
      const formValue = this.questionForm.value;
      const question: Question = {
        examId: formValue.examId || '',
        questionText: formValue.questionText,
        choices: formValue.choices,
        correctAnswer: formValue.correctAnswer
      };
      
      console.log('Submitting question:', question);
      
      if (this.questionId) {
        this.questionService.editQuestion(this.questionId, question).subscribe({
          next: (response: Question) => {
            console.log('Question updated successfully:', response);
            this.isLoading = false;
            this.router.navigate(['/exams']);
          },
          error: (err: HttpErrorResponse) => {
            console.error('Error updating question:', err);
            this.error = 'Failed to update question. Please try again.';
            this.isLoading = false;
          }
        });
      } else {
        this.questionService.createQuestion(question).subscribe({
          next: (response: Question) => {
            console.log('Question created successfully:', response);
            this.isLoading = false;
            this.router.navigate(['/exams']);
          },
          error: (err: HttpErrorResponse) => {
            console.error('Error creating question:', err);
            this.error = 'Failed to create question. Please try again.';
            this.isLoading = false;
          }
        });
      }
    } else {
      // تحديد الأخطاء في النموذج
      this.markFormGroupTouched(this.questionForm);
      console.error('Form is invalid:', this.questionForm.errors);
    }
  }

  // Mark all form controls as touched to trigger validation
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        for (let i = 0; i < control.length; i++) {
          control.at(i).markAsTouched();
        }
      }
    });
  }
}
