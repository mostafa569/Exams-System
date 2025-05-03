export interface Exam {
  _id?: string;
  examTitle: string;
  examDescription: string;
  duration: number;
  questions?: any[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Question {
  _id?: string;
  examId: string;
  questionText: string;
  choices: string[];
  correctAnswer: number;
}
