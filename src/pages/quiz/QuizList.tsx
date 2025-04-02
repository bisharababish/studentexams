
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useQuiz } from '@/contexts/QuizContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { QuizCard } from '@/components/quiz/QuizCard';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Quiz } from '@/types';

const QuizListPage = () => {
  const { user } = useAuth();
  const { getAccessibleQuizzes, startQuiz } = useQuiz();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  if (!user) return null;
  
  const accessibleQuizzes = getAccessibleQuizzes(user.id);
  
  const handleStartQuiz = async (quiz: Quiz) => {
    try {
      await startQuiz(quiz.id);
      navigate(`/quiz-session/${quiz.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to start quiz",
        variant: "destructive"
      });
    }
  };
  
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Available Quizzes</h1>
        
        {accessibleQuizzes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accessibleQuizzes.map((quiz) => (
              <QuizCard 
                key={quiz.id} 
                quiz={quiz} 
                onStart={() => handleStartQuiz(quiz)} 
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h3 className="text-lg font-medium mb-2">No quizzes available</h3>
            <p className="text-muted-foreground">
              Your instructor hasn't assigned any quizzes to you yet. Check back later!
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default QuizListPage;
