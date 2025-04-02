
export interface User {
  id: string;
  role: 'student' | 'admin';
  name?: string;
  email?: string;
  universityId?: string;
  profilePicture?: string;
  createdAt: Date;
}

export interface Student extends User {
  role: 'student';
  universityId: string;
  attendance: AttendanceRecord[];
  quizAccess: string[];
  quizResults: QuizResult[];
}

export interface Admin extends User {
  role: 'admin';
}

export interface AttendanceRecord {
  id: string;
  date: Date;
  present: boolean;
  note?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  timeLimit: number; // in minutes
  questionCount: number;
  availableFrom?: Date;
  availableTo?: Date;
  isActive: boolean;
}

export interface Question {
  id: string;
  quizId: string;
  text: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
}

export interface QuizResult {
  id: string;
  quizId: string;
  studentId: string;
  score: number;
  passed: boolean;
  completedAt: Date;
  approved: boolean;
}

export interface QuizSession {
  quizId: string;
  questions: Question[];
  currentQuestionIndex: number;
  answers: {
    questionId: string;
    selectedOptionId: string;
  }[];
  startTime: Date;
  timeRemaining: number; // in seconds
}
