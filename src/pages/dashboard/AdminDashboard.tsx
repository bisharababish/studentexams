
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useQuiz } from '@/contexts/QuizContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, Users, BookOpen, CalendarCheck, Award } from 'lucide-react';

// Mock data
const mockStudents = [
  {
    id: '1',
    name: 'Ahmed Khalid',
    universityId: 'S2011173',
  },
  {
    id: '2',
    name: 'Sara Mohammad',
    universityId: 'S2011174',
  },
  {
    id: '3',
    name: 'Mahmoud Ali',
    universityId: 'S2011175',
  }
];

const AdminDashboard = () => {
  const { user } = useAuth();
  const { quizzes, getAllResults } = useQuiz();
  const navigate = useNavigate();

  if (!user || user.role !== 'admin') {
    return <div>Loading...</div>;
  }

  const activeQuizzes = quizzes.filter(q => q.isActive);
  const pendingResults = getAllResults().filter(r => !r.approved);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Students Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-lg font-medium">Students</CardTitle>
            <Users className="h-5 w-5 text-quds-green" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{mockStudents.length}</div>
            <p className="text-sm text-muted-foreground mt-2">Registered students</p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full" onClick={() => navigate('/admin/students')}>
              <span>Manage Students</span>
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </CardFooter>
        </Card>
        
        {/* Quizzes Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-lg font-medium">Active Quizzes</CardTitle>
            <BookOpen className="h-5 w-5 text-quds-green" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeQuizzes.length}</div>
            <p className="text-sm text-muted-foreground mt-2">Quizzes available to students</p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full" onClick={() => navigate('/admin/quizzes')}>
              <span>Manage Quizzes</span>
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
            <div className="text-3xl font-bold">Today</div>
            <p className="text-sm text-muted-foreground mt-2">Mark class attendance</p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full" onClick={() => navigate('/admin/attendance')}>
              <span>Manage Attendance</span>
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </CardFooter>
        </Card>
        
        {/* Results Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-lg font-medium">Pending Results</CardTitle>
            <Award className="h-5 w-5 text-quds-green" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingResults.length}</div>
            <p className="text-sm text-muted-foreground mt-2">Results awaiting approval</p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full" onClick={() => navigate('/admin/results')}>
              <span>Manage Results</span>
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {/* Recent Students */}
      <h2 className="text-xl font-semibold mb-4">Recent Students</h2>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">University ID</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockStudents.map((student) => (
              <tr key={student.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.universityId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button variant="ghost" className="text-quds-green hover:text-quds-darkgreen" onClick={() => navigate(`/admin/students/${student.id}`)}>
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pending Results */}
      <h2 className="text-xl font-semibold mt-8 mb-4">Pending Results</h2>
      {pendingResults.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quiz</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pendingResults.map((result) => {
                const student = mockStudents.find(s => s.id === result.studentId);
                const quiz = quizzes.find(q => q.id === result.quizId);
                
                return (
                  <tr key={result.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student ? student.name : result.studentId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {quiz ? quiz.title : result.quizId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {result.score.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        result.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {result.passed ? 'Pass' : 'Fail'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button 
                        variant="outline" 
                        className="border-quds-green text-quds-green hover:bg-quds-green hover:text-white"
                        onClick={() => navigate('/admin/results')}
                      >
                        Approve
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <p className="text-muted-foreground">No pending results to approve.</p>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
