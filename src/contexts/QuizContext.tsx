
import React, { createContext, useContext, useState } from 'react';
import { Quiz, Question, QuizResult, QuizSession } from '../types';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

// Mock quizzes
const mockQuizzes: Quiz[] = [
  {
    id: '1',
    title: 'Introduction to Computer Science',
    description: 'Basic concepts of computing, algorithms, and programming.',
    timeLimit: 10, // 10 minutes
    questionCount: 10,
    isActive: true
  },
  {
    id: '2',
    title: 'Data Structures',
    description: 'Fundamental data structures and their applications.',
    timeLimit: 10,
    questionCount: 10,
    isActive: true
  },
  {
    id: '3',
    title: 'Algorithms',
    description: 'Design and analysis of algorithms.',
    timeLimit: 10,
    questionCount: 10,
    isActive: false
  },
  {
    id: '4',
    title: 'Database Systems',
    description: 'Concepts of database design and management.',
    timeLimit: 10,
    questionCount: 10,
    isActive: false
  },
  {
    id: '5',
    title: 'Operating Systems',
    description: 'Principles of operating systems.',
    timeLimit: 10,
    questionCount: 10,
    isActive: false
  },
  {
    id: '6',
    title: 'Computer Networks',
    description: 'Fundamentals of computer networking.',
    timeLimit: 10,
    questionCount: 10,
    isActive: false
  },
  {
    id: '7',
    title: 'Software Engineering',
    description: 'Software development processes and methodologies.',
    timeLimit: 10,
    questionCount: 10,
    isActive: false
  },
  {
    id: '8',
    title: 'Web Development',
    description: 'Principles of web design and development.',
    timeLimit: 10,
    questionCount: 10,
    isActive: false
  },
  {
    id: '9',
    title: 'Artificial Intelligence',
    description: 'Introduction to AI concepts and applications.',
    timeLimit: 10,
    questionCount: 10,
    isActive: false
  },
  {
    id: '10',
    title: 'Machine Learning',
    description: 'Fundamentals of machine learning algorithms.',
    timeLimit: 10,
    questionCount: 10,
    isActive: false
  },
  {
    id: '11',
    title: 'Final Exam',
    description: 'Comprehensive exam covering all topics.',
    timeLimit: 60, // 60 minutes for final exam
    questionCount: 50,
    isActive: false
  }
];

// Mock questions (simplified - in a real app, you'd have 100 questions per quiz)
const generateMockQuestions = (quizId: string, count: number): Question[] => {
  const questions: Question[] = [];
  for (let i = 0; i < count; i++) {
    questions.push({
      id: `${quizId}-q${i}`,
      quizId,
      text: `Sample question ${i + 1} for quiz ${quizId}?`,
      options: [
        { id: `${quizId}-q${i}-o1`, text: 'Option A', isCorrect: i % 4 === 0 },
        { id: `${quizId}-q${i}-o2`, text: 'Option B', isCorrect: i % 4 === 1 },
        { id: `${quizId}-q${i}-o3`, text: 'Option C', isCorrect: i % 4 === 2 },
        { id: `${quizId}-q${i}-o4`, text: 'Option D', isCorrect: i % 4 === 3 }
      ]
    });
  }
  return questions;
};

// Generate 20 questions for each quiz (for demonstration)
const mockQuestions: Record<string, Question[]> = {};
mockQuizzes.forEach(quiz => {
  mockQuestions[quiz.id] = generateMockQuestions(quiz.id, 20);
});

// Mock quiz results
const mockQuizResults: QuizResult[] = [];

interface QuizContextType {
  quizzes: Quiz[];
  activeQuizSession: QuizSession | null;
  startQuiz: (quizId: string) => Promise<void>;
  answerQuestion: (questionId: string, optionId: string) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  submitQuiz: () => Promise<QuizResult>;
  getStudentResults: (studentId: string) => QuizResult[];
  getAllResults: () => QuizResult[];
  approveResult: (resultId: string) => void;
  getQuizById: (quizId: string) => Quiz | undefined;
  toggleQuizAccess: (studentId: string, quizId: string) => void;
  getAccessibleQuizzes: (studentId: string) => Quiz[];
  activateQuiz: (quizId: string, isActive: boolean) => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>(mockQuizzes);
  const [activeQuizSession, setActiveQuizSession] = useState<QuizSession | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const getRandomQuestions = (quizId: string, count: number): Question[] => {
    const quizQuestions = mockQuestions[quizId];
    if (!quizQuestions || quizQuestions.length === 0) {
      return [];
    }

    // Shuffle and get random questions
    const shuffled = [...quizQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const startQuiz = async (quizId: string): Promise<void> => {
    if (!user || user.role !== 'student') {
      throw new Error('Only students can take quizzes');
    }

    const quiz = quizzes.find(q => q.id === quizId);
    if (!quiz) {
      throw new Error('Quiz not found');
    }

    if (!quiz.isActive) {
      throw new Error('This quiz is not active');
    }

    // Check if student has access
    const student = user as any;
    if (!student.quizAccess || !student.quizAccess.includes(quizId)) {
      throw new Error('You do not have access to this quiz');
    }

    // Check if student has already completed this quiz
    const existingResult = mockQuizResults.find(
      result => result.quizId === quizId && result.studentId === user.id
    );
    
    if (existingResult) {
      throw new Error('You have already completed this quiz');
    }

    // Get random questions for this quiz
    const questions = getRandomQuestions(quizId, quiz.questionCount);
    
    if (questions.length === 0) {
      throw new Error('No questions available for this quiz');
    }

    // Create a new quiz session
    const newSession: QuizSession = {
      quizId,
      questions,
      currentQuestionIndex: 0,
      answers: [],
      startTime: new Date(),
      timeRemaining: quiz.timeLimit * 60 // Convert minutes to seconds
    };

    setActiveQuizSession(newSession);
  };

  const answerQuestion = (questionId: string, optionId: string) => {
    if (!activeQuizSession) {
      return;
    }

    setActiveQuizSession(prev => {
      if (!prev) return null;

      // Check if already answered
      const existingAnswerIndex = prev.answers.findIndex(a => a.questionId === questionId);
      
      let newAnswers;
      if (existingAnswerIndex >= 0) {
        // Update existing answer
        newAnswers = [...prev.answers];
        newAnswers[existingAnswerIndex] = { questionId, selectedOptionId: optionId };
      } else {
        // Add new answer
        newAnswers = [...prev.answers, { questionId, selectedOptionId: optionId }];
      }

      return {
        ...prev,
        answers: newAnswers
      };
    });
  };

  const nextQuestion = () => {
    if (!activeQuizSession) {
      return;
    }

    setActiveQuizSession(prev => {
      if (!prev) return null;
      if (prev.currentQuestionIndex >= prev.questions.length - 1) {
        return prev; // Already at the last question
      }
      return {
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      };
    });
  };

  const prevQuestion = () => {
    if (!activeQuizSession) {
      return;
    }

    setActiveQuizSession(prev => {
      if (!prev) return null;
      if (prev.currentQuestionIndex <= 0) {
        return prev; // Already at the first question
      }
      return {
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1
      };
    });
  };

  const submitQuiz = async (): Promise<QuizResult> => {
    if (!activeQuizSession || !user) {
      throw new Error('No active quiz session');
    }

    // Calculate score
    let correctCount = 0;
    activeQuizSession.answers.forEach(answer => {
      const question = activeQuizSession.questions.find(q => q.id === answer.questionId);
      if (question) {
        const correctOption = question.options.find(o => o.isCorrect);
        if (correctOption && correctOption.id === answer.selectedOptionId) {
          correctCount++;
        }
      }
    });

    const totalQuestions = activeQuizSession.questions.length;
    const scorePercentage = (correctCount / totalQuestions) * 100;
    const passed = scorePercentage >= 60; // Pass threshold is 60%

    // Create quiz result
    const quizResult: QuizResult = {
      id: Date.now().toString(),
      quizId: activeQuizSession.quizId,
      studentId: user.id,
      score: scorePercentage,
      passed,
      completedAt: new Date(),
      approved: false // Requires admin approval
    };

    // In a real app, save to database
    mockQuizResults.push(quizResult);

    // Clear the active session
    setActiveQuizSession(null);

    // Show toast notification
    toast({
      title: passed ? 'Quiz Passed!' : 'Quiz Failed',
      description: `You scored ${scorePercentage.toFixed(1)}%. ${passed ? 'Congratulations!' : 'Try again later.'}`,
      variant: passed ? 'default' : 'destructive'
    });

    return quizResult;
  };

  const getStudentResults = (studentId: string): QuizResult[] => {
    return mockQuizResults.filter(
      result => result.studentId === studentId && result.approved
    );
  };

  const getAllResults = (): QuizResult[] => {
    return mockQuizResults;
  };

  const approveResult = (resultId: string) => {
    const resultIndex = mockQuizResults.findIndex(result => result.id === resultId);
    if (resultIndex >= 0) {
      mockQuizResults[resultIndex] = {
        ...mockQuizResults[resultIndex],
        approved: true
      };
    }
  };

  const getQuizById = (quizId: string): Quiz | undefined => {
    return quizzes.find(quiz => quiz.id === quizId);
  };

  const toggleQuizAccess = (studentId: string, quizId: string) => {
    // In a real app, this would update the database
    // For demo, we'll just update the user if it's the current user
    if (user && user.id === studentId && user.role === 'student') {
      const student = user as any;
      if (student.quizAccess.includes(quizId)) {
        student.quizAccess = student.quizAccess.filter((id: string) => id !== quizId);
      } else {
        student.quizAccess.push(quizId);
      }
      localStorage.setItem('qudsUser', JSON.stringify(student));
    }
  };

  const getAccessibleQuizzes = (studentId: string): Quiz[] => {
    if (!user || user.id !== studentId || user.role !== 'student') {
      return [];
    }
    
    const student = user as any;
    return quizzes.filter(quiz => 
      quiz.isActive && student.quizAccess && student.quizAccess.includes(quiz.id)
    );
  };

  const activateQuiz = (quizId: string, isActive: boolean) => {
    setQuizzes(prev => 
      prev.map(quiz => 
        quiz.id === quizId ? { ...quiz, isActive } : quiz
      )
    );
  };

  const value = {
    quizzes,
    activeQuizSession,
    startQuiz,
    answerQuestion,
    nextQuestion,
    prevQuestion,
    submitQuiz,
    getStudentResults,
    getAllResults,
    approveResult,
    getQuizById,
    toggleQuizAccess,
    getAccessibleQuizzes,
    activateQuiz
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};
