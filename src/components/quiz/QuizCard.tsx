
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Quiz } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, FileText } from 'lucide-react';

interface QuizCardProps {
  quiz: Quiz;
  onStart?: () => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({ quiz, onStart }) => {
  const navigate = useNavigate();
  
  const handleStart = () => {
    if (onStart) {
      onStart();
    } else {
      navigate(`/quizzes/${quiz.id}`);
    }
  };
  
  return (
    <Card className="quiz-card h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl">{quiz.title}</CardTitle>
        <CardDescription>{quiz.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <Clock className="mr-2 h-4 w-4 text-quds-green" />
            <span>Time limit: {quiz.timeLimit} minutes</span>
          </div>
          <div className="flex items-center text-sm">
            <FileText className="mr-2 h-4 w-4 text-quds-green" />
            <span>Questions: {quiz.questionCount}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full bg-quds-green hover:bg-quds-darkgreen" 
          onClick={handleStart}
        >
          Start Quiz
        </Button>
      </CardFooter>
    </Card>
  );
};
