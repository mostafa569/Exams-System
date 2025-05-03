import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ExamService } from '../../services/exam.service';
import { QuestionService } from '../../services/question.service';
import { Exam, Question } from '../../models/exam.model';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatOptionModule } from '@angular/material/core';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-exam-form',
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
    MatProgressSpinnerModule,
    MatOptionModule
  ],
  templateUrl: './exam-form.component.html',
  styleUrls: ['./exam-form.component.css']
})
export class ExamFormComponent implements OnInit {
  examForm!: FormGroup;
  examId: string | null = null;
  isLoading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private examService: ExamService,
    private questionService: QuestionService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    
    this.examId = this.route.snapshot.paramMap.get('examId');
    if (this.examId) {
      this.loadExam();
    } else {
      // Add at least one question by default for new exams
      this.addQuestion();
    }
  }

  initForm(): void {
    this.examForm = this.fb.group({
      examTitle: ['', Validators.required],
      examDescription: ['', Validators.required],
      duration: [60, [Validators.required, Validators.min(1)]],
      questions: this.fb.array([])
    });
  }

  loadExam(): void {
    if (!this.examId) return;
    
    this.isLoading = true;
    this.error = null;
    
    this.examService.getExamById(this.examId).subscribe({
      next: (exam) => {
        console.log('Loaded exam:', exam);
        
        // Fill basic exam data
        this.examForm.patchValue({
          examTitle: exam.examTitle,
          examDescription: exam.examDescription,
          duration: exam.duration
        });
        
        // Load questions if they exist
        if (exam.questions && exam.questions.length > 0) {
          // Clear existing questions first
          const questionsArray = this.questions;
          while (questionsArray.length) {
            questionsArray.removeAt(0);
          }
          
          // Add questions to form
          exam.questions.forEach(question => {
            questionsArray.push(this.createQuestionFormGroup({
              _id: question._id,
              examId: question.examId || this.examId || '',
              questionText: question.questionText,
              choices: question.choices || [],
              correctAnswer: question.correctAnswer
            }));
          });
          
          console.log('Questions loaded into form:', this.questions.value);
        } else {
          // Add at least one question by default
          this.addQuestion();
        }
        
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching exam:', err);
        this.error = 'Failed to load exam. Please try again.';
        this.isLoading = false;
      }
    });
  }

  get questions(): FormArray {
    return this.examForm.get('questions') as FormArray;
  }

  // Create question form group
  createQuestionFormGroup(question?: Question): FormGroup {
    return this.fb.group({
      _id: [question?._id || null],
      examId: [question?.examId || this.examId || ''],
      questionText: [question?.questionText || '', Validators.required],
      choices: this.fb.array(
        question?.choices?.map(choice => this.fb.control(choice, Validators.required)) || 
        [this.fb.control('', Validators.required), this.fb.control('', Validators.required)]
      ),
      correctAnswer: [question?.correctAnswer || 1, [Validators.required, Validators.min(1)]]
    });
  }

  // Add new question
  addQuestion(): void {
    this.questions.push(this.createQuestionFormGroup());
    console.log('Question added. Total questions:', this.questions.length);
  }

  // Remove question
  removeQuestion(index: number): void {
    this.questions.removeAt(index);
    console.log('Question removed. Total questions:', this.questions.length);
  }

  // Get choices for a specific question
  getChoices(questionIndex: number): FormArray {
    return this.questions.at(questionIndex).get('choices') as FormArray;
  }

  // Add new choice to a specific question
  addChoice(questionIndex: number): void {
    this.getChoices(questionIndex).push(this.fb.control('', Validators.required));
    
    // Update correctAnswer validator to match the number of choices
    const questionGroup = this.questions.at(questionIndex) as FormGroup;
    const correctAnswerControl = questionGroup.get('correctAnswer');
    if (correctAnswerControl) {
      const maxValue = this.getChoices(questionIndex).length;
      correctAnswerControl.setValidators([
        Validators.required,
        Validators.min(1),
        Validators.max(maxValue)
      ]);
      correctAnswerControl.updateValueAndValidity();
    }
  }

  // Remove choice from a specific question
  removeChoice(questionIndex: number, choiceIndex: number): void {
    const choices = this.getChoices(questionIndex);
    if (choices.length > 2) {
      choices.removeAt(choiceIndex);
      
      // Update correctAnswer validator to match the number of choices
      const questionGroup = this.questions.at(questionIndex) as FormGroup;
      const correctAnswerControl = questionGroup.get('correctAnswer');
      if (correctAnswerControl) {
        const maxValue = choices.length;
        correctAnswerControl.setValidators([
          Validators.required,
          Validators.min(1),
          Validators.max(maxValue)
        ]);
        correctAnswerControl.updateValueAndValidity();
        
        // If correctAnswer is greater than the number of choices, reset it
        if (correctAnswerControl.value > maxValue) {
          correctAnswerControl.setValue(maxValue);
        }
      }
    }
  }

  isFormValid(): boolean {
    const valid = this.examForm.valid;
    console.log('Form validation status:', valid ? 'Valid' : 'Invalid');
    if (!valid) {
      console.log('Form errors:', this.examForm.errors);
      console.log('Questions array valid:', this.questions.valid);
      
      // Log detailed validation errors for each question
      this.questions.controls.forEach((control, index) => {
        console.log(`Question ${index + 1} valid:`, control.valid);
        if (!control.valid) {
          console.log(`Question ${index + 1} errors:`, control.errors);
        }
      });
    }
    return valid;
  }

  onSubmit(): void {
    console.log('Form submitted. Checking validity...');
    if (!this.isFormValid()) {
      console.log('Form is invalid. Marking all fields as touched.');
      this.markFormGroupTouched(this.examForm);
      return;
    }
    
    this.isLoading = true;
    this.error = null;
    
    // Extract exam data from form
    const examData: Exam = {
      examTitle: this.examForm.value.examTitle,
      examDescription: this.examForm.value.examDescription,
      duration: this.examForm.value.duration
    };
    
    console.log('Submitting exam data:', examData);
    
    // Extract questions data from form
    const questionsData: Question[] = this.questions.value;
    console.log('Questions data to submit:', questionsData);
    
    if (this.examId) {
      // Update existing exam
      this.updateExistingExam(examData, questionsData);
    } else {
      // Create new exam
      this.createNewExam(examData, questionsData);
    }
  }
  
  createNewExam(examData: Exam, questionsData: any[]): void {
    console.log('Creating new exam with data:', examData);
    console.log('Questions to create:', questionsData);
    
    this.examService.createExam(examData).subscribe({
      next: (newExam) => {
        console.log('Exam created successfully:', newExam);
        
        if (!questionsData.length) {
          console.log('No questions to create. Redirecting...');
          this.isLoading = false;
          this.router.navigate(['/exams']);
          return;
        }
        
        // Create questions for the new exam
        const questionPromises = questionsData.map(question => {
          // Ensure examId is set to the new exam's ID
          const newQuestion: Question = {
            questionText: question.questionText,
            choices: question.choices,
            correctAnswer: question.correctAnswer,
            examId: newExam._id || ''
          };
          
          console.log('Creating question:', newQuestion);
          return this.questionService.createQuestion(newQuestion).toPromise();
        });
        
        Promise.all(questionPromises)
          .then(results => {
            console.log('All questions created successfully:', results);
            this.isLoading = false;
            this.router.navigate(['/exams']);
          })
          .catch(error => {
            console.error('Error creating questions:', error);
            this.error = 'Some questions could not be created. The exam was saved.';
            this.isLoading = false;
            this.router.navigate(['/exams']);
          });
      },
      error: (err) => {
        console.error('Error creating exam:', err);
        this.error = 'Failed to create exam. Please try again.';
        this.isLoading = false;
      }
    });
  }
  
  updateExistingExam(examData: Exam, questionsData: any[]): void {
    this.examService.editExam(this.examId!, examData).subscribe({
      next: (updatedExam) => {
        console.log('Exam updated successfully:', updatedExam);
        
        if (!questionsData.length) {
          console.log('No questions to update. Redirecting...');
          this.isLoading = false;
          this.router.navigate(['/exams']);
          return;
        }
        
        // Process questions (create new ones, update existing ones)
        const questionPromises = questionsData.map(question => {
          if (question._id) {
            // Update existing question
            const updatedQuestion: Question = {
              _id: question._id,
              examId: question.examId || this.examId || '',
              questionText: question.questionText,
              choices: question.choices,
              correctAnswer: question.correctAnswer
            };
            console.log('Updating question:', updatedQuestion);
            return this.questionService.editQuestion(question._id, updatedQuestion).toPromise();
          } else {
            // Create new question
            const newQuestion: Question = {
              questionText: question.questionText,
              choices: question.choices,
              correctAnswer: question.correctAnswer,
              examId: this.examId || ''
            };
            
            console.log('Creating new question for existing exam:', newQuestion);
            return this.questionService.createQuestion(newQuestion).toPromise();
          }
        });
        
        Promise.all(questionPromises)
          .then(results => {
            console.log('All questions updated/created successfully:', results);
            this.isLoading = false;
            this.router.navigate(['/exams']);
          })
          .catch(error => {
            console.error('Error updating/creating questions:', error);
            this.error = 'Some questions could not be updated. The exam was saved.';
            this.isLoading = false;
            this.router.navigate(['/exams']);
          });
      },
      error: (err) => {
        console.error('Error updating exam:', err);
        this.error = 'Failed to update exam. Please try again.';
        this.isLoading = false;
      }
    });
  }

  // Mark all form controls as touched to trigger validation
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        for (let i = 0; i < control.length; i++) {
          if (control.at(i) instanceof FormGroup) {
            this.markFormGroupTouched(control.at(i) as FormGroup);
          } else {
            control.at(i).markAsTouched();
          }
        }
      }
    });
  }
}
