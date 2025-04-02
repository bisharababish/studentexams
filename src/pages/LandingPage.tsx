
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-quds-green text-white shadow-md">
        <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img 
                src="https://www.alquds.edu/wp-content/uploads/2020/12/logo-alquds-mini.png" 
                alt="Al-Quds University" 
                className="h-10"
              />
              <h1 className="text-xl font-bold hidden sm:block">Al-Quds University Student Hub</h1>
            </div>
            <div>
              <Button 
                variant="outline" 
                className="bg-transparent border-white text-white hover:bg-white hover:text-quds-green"
                onClick={() => navigate('/login')}
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-quds-green via-quds-green to-quds-darkgreen text-white py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Al-Quds Student Hub</h1>
                <p className="text-lg mb-6">Your central platform for quizzes, attendance tracking, and academic progress.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    className="bg-quds-gold text-quds-dark hover:bg-quds-lightgold"
                    onClick={() => navigate('/register')}
                  >
                    Register Now
                  </Button>
                  <Button 
                    variant="outline"
                    className="bg-transparent border-white text-white hover:bg-white hover:text-quds-green"
                    onClick={() => navigate('/login')}
                  >
                    Login
                  </Button>
                </div>
              </div>
              <div className="md:w-1/2">
                <img 
                  src="https://www.alquds.edu/wp-content/uploads/2021/07/banner-1-1024x512.png" 
                  alt="Al-Quds University Campus" 
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Platform Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="quds-card">
                <div className="mb-4 text-quds-green">
                  <BookOpen className="w-10 h-10 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center">Interactive Quizzes</h3>
                <p className="text-gray-600 text-center">
                  Access 10 subject-specific quizzes with randomized questions to test your knowledge and prepare for exams.
                </p>
              </div>
              
              <div className="quds-card">
                <div className="mb-4 text-quds-green">
                  <CalendarCheck className="w-10 h-10 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center">Attendance Tracking</h3>
                <p className="text-gray-600 text-center">
                  Monitor your class attendance record, which contributes to your overall course performance.
                </p>
              </div>
              
              <div className="quds-card">
                <div className="mb-4 text-quds-green">
                  <Award className="w-10 h-10 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center">Performance Analytics</h3>
                <p className="text-gray-600 text-center">
                  View your quiz results and overall academic progress to identify strengths and areas for improvement.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-quds-darkgreen text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <img 
            src="https://www.alquds.edu/wp-content/uploads/2020/12/logo-alquds-mini.png" 
            alt="Al-Quds University" 
            className="h-12 mx-auto mb-4"
          />
          <p>© {new Date().getFullYear()} Al-Quds University. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

// Import the icons used in the component
import { BookOpen, CalendarCheck, Award } from 'lucide-react';

export default LandingPage;
