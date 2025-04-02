
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useQuiz } from '@/contexts/QuizContext';
import { useAttendance } from '@/contexts/AttendanceContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, CalendarCheck, Award, ChevronRight } from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { getAccessibleQuizzes, getStudentResults } = useQuiz();
  const { getStudentAttendance } = useAttendance();
  const navigate = useNavigate();

  if (!user || user.role !== 'student') {
    return <div>Loading...</div>;
  }

  const accessibleQuizzes = getAccessibleQuizzes(user.id);
  const quizResults = getStudentResults(user.id);
  const attendance = getStudentAttendance(user.id);

  const completedQuizzes = quizResults.length;
  const totalQuizzes = accessibleQuizzes.length;
  const quizProgress = totalQuizzes > 0 ? (completedQuizzes / totalQuizzes) * 100 : 0;

  const attendanceCount = attendance.filter(a => a.present).length;
  const totalAttendance = attendance.length;
  const attendanceRate = totalAttendance > 0 ? (attendanceCount / totalAttendance) * 100 : 0;

  const passedQuizzes = quizResults.filter(r => r.passed).length;
  const passRate = completedQuizzes > 0 ? (passedQuizzes / completedQuizzes) * 100 : 0;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Welcome, {user.name || user.universityId}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Quizzes Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-lg font-medium">Quizzes</CardTitle>
            <BookOpen className="h-5 w-5 text-quds-green" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completedQuizzes} / {totalQuizzes}</div>
            <Progress className="mt-2" value={quizProgress} />
            <p className="text-sm text-muted-foreground mt-2">Completed quizzes</p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full" onClick={() => navigate('/quizzes')}>
              <span>View Quizzes</span>
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </CardFooter>
        </Card>
        
        {/* Attendance Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-lg font-medium">Attendance</CardTitle>
            <CalendarCheck className="h-5 w-5 text-quds-green" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{attendanceCount} / {totalAttendance}</div>
            <Progress className="mt-2" value={attendanceRate} />
            <p className="text-sm text-muted-foreground mt-2">Classes attended</p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full" onClick={() => navigate('/attendance')}>
              <span>View Attendance</span>
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </CardFooter>
        </Card>
        
        {/* Performance Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-lg font-medium">Performance</CardTitle>
            <Award className="h-5 w-5 text-quds-green" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{passedQuizzes} / {completedQuizzes}</div>
            <Progress className="mt-2" value={passRate} />
            <p className="text-sm text-muted-foreground mt-2">Passed quizzes</p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full" onClick={() => navigate('/results')}>
              <span>View Results</span>
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {/* Available Quizzes */}
      <h2 className="text-xl font-semibold mb-4">Available Quizzes</h2>
      {accessibleQuizzes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accessibleQuizzes.map((quiz) => (
            <Card key={quiz.id} className="quiz-card">
              <CardHeader>
                <CardTitle>{quiz.title}</CardTitle>
                <CardDescription>{quiz.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Time limit:</span>
                  <span className="font-medium">{quiz.timeLimit} minutes</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Questions:</span>
                  <span className="font-medium">{quiz.questionCount}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-quds-green hover:bg-quds-darkgreen" onClick={() => navigate(`/quizzes/${quiz.id}`)}>
                  Start Quiz
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <p className="text-muted-foreground mb-4">No quizzes available yet. Your instructor will assign quizzes soon.</p>
        </div>
      )}
      
      {/* Recent Attendance */}
      <h2 className="text-xl font-semibold mt-8 mb-4">Recent Attendance</h2>
      {attendance.length > 0 ? (
        <div className="space-y-3">
          {attendance.slice(0, 3).map((record) => (
            <div key={record.id} className={`attendance-card ${record.present ? 'border-green-500' : 'border-red-500'}`}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{record.date.toLocaleDateString()}</p>
                  <p className="text-sm text-muted-foreground">{record.note || 'No notes'}</p>
                </div>
                <span className={`px-2 py-1 rounded text-sm ${record.present ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {record.present ? 'Present' : 'Absent'}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <p className="text-muted-foreground">No attendance records yet.</p>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
