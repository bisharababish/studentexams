
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuiz } from '@/contexts/QuizContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Clock, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Custom hook to prevent screenshots
const usePreventScreenshots = () => {
  useEffect(() => {
    const preventCapture = (e: KeyboardEvent) => {
      // Prevent Print Screen, Ctrl+P, Ctrl+S, Ctrl+Shift+I
      if (
        e.key === 'PrintScreen' ||
        (e.ctrlKey && e.key === 'p') ||
        (e.ctrlKey && e.key === 's') ||
        (e.ctrlKey && e.shiftKey && e.key === 'i')
      ) {
        e.preventDefault();
        return false;
      }
    };

    // Handle right-click
    const preventContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener('keydown', preventCapture);
    document.addEventListener('contextmenu', preventContextMenu);

    return () => {
      document.removeEventListener('keydown', preventCapture);
      document.removeEventListener('contextmenu', preventContextMenu);
    };
  }, []);
};

// Format time function (converts seconds to mm:ss)
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const QuizSessionPage = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const { activeQuizSession, startQuiz, answerQuestion, nextQuestion, prevQuestion, submitQuiz } = useQuiz();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showTimeUpDialog, setShowTimeUpDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Prevent screenshots and copying
  usePreventScreenshots();

  // Initialize quiz session
  useEffect(() => {
    const initQuiz = async () => {
      if (!quizId) return;
      
      try {
        // Only start quiz if there's no active session or different quiz
        if (!activeQuizSession || activeQuizSession.quizId !== quizId) {
          await startQuiz(quizId);
        }
        setIsLoading(false);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to start quiz');
        setIsLoading(false);
      }
    };

    initQuiz();
  }, [quizId, activeQuizSession, startQuiz]);

  // Timer effect
  useEffect(() => {
    if (!activeQuizSession) return;

    setTimeRemaining(activeQuizSession.timeRemaining);

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowTimeUpDialog(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeQuizSession]);

  // Handle time up
  const handleTimeUp = async () => {
    try {
      const result = await submitQuiz();
      navigate('/results', { state: { lastResult: result } });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit quiz",
        variant: "destructive"
      });
      navigate('/quizzes');
    }
  };

  // Handle submit quiz
  const handleSubmitQuiz = async () => {
    setShowSubmitDialog(false);
    try {
      const result = await submitQuiz();
      navigate('/results', { state: { lastResult: result } });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit quiz",
        variant: "destructive"
      });
    }
  };

  // Handle option selection
  const handleOptionSelect = (optionId: string) => {
    if (!activeQuizSession) return;
    
    const currentQuestion = activeQuizSession.questions[activeQuizSession.currentQuestionIndex];
    answerQuestion(currentQuestion.id, optionId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-quds-green"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center text-red-600">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
              Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">{error}</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => navigate('/quizzes')}>
              Back to Quizzes
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!activeQuizSession) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center">No Active Quiz</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">There is no active quiz session.</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => navigate('/quizzes')}>
              Back to Quizzes
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const currentQuestion = activeQuizSession.questions[activeQuizSession.currentQuestionIndex];
  const currentAnswer = activeQuizSession.answers.find(a => a.questionId === currentQuestion.id);
  const progress = ((activeQuizSession.currentQuestionIndex + 1) / activeQuizSession.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Card className="mb-4">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">
                  Question {activeQuizSession.currentQuestionIndex + 1} of {activeQuizSession.questions.length}
                </p>
                <Progress value={progress} className="mt-2" />
              </div>
              <div className="flex items-center text-quds-green">
                <Clock className="mr-1 h-5 w-5" />
                <span className="text-lg font-medium">{formatTime(timeRemaining)}</span>
              </div>
            </div>
          </CardHeader>
        </Card>
        
        <Card className="mb-4">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-6">{currentQuestion.text}</h2>
            
            <RadioGroup 
              value={currentAnswer?.selectedOptionId} 
              onValueChange={handleOptionSelect}
              className="space-y-4"
            >
              {currentQuestion.options.map((option) => (
                <div key={option.id} className="flex items-center space-x-2 border p-4 rounded-md hover:bg-gray-50">
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id} className="flex-grow cursor-pointer">
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
        
        <div className="flex justify-between">
          <Button
            variant="outline"
            disabled={activeQuizSession.currentQuestionIndex === 0}
            onClick={prevQuestion}
          >
            Previous
          </Button>
          
          {activeQuizSession.currentQuestionIndex === activeQuizSession.questions.length - 1 ? (
            <Button 
              className="bg-quds-green hover:bg-quds-darkgreen" 
              onClick={() => setShowSubmitDialog(true)}
            >
              Submit Quiz
            </Button>
          ) : (
            <Button 
              className="bg-quds-green hover:bg-quds-darkgreen"
              onClick={nextQuestion}
            >
              Next
            </Button>
          )}
        </div>
      </div>
      
      {/* Submit Confirmation Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Quiz</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to submit this quiz? You cannot change your answers after submission.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-quds-green hover:bg-quds-darkgreen" onClick={handleSubmitQuiz}>
              Submit
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Time Up Dialog */}
      <AlertDialog open={showTimeUpDialog} onOpenChange={setShowTimeUpDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Time's Up!</AlertDialogTitle>
            <AlertDialogDescription>
              Your time for this quiz has expired. Your answers will be submitted automatically.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button className="bg-quds-green hover:bg-quds-darkgreen" onClick={handleTimeUp}>
              Continue
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default QuizSessionPage;
