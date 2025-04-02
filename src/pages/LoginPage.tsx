
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '@/components/auth/LoginForm';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="py-4 px-6">
        <Button 
          variant="ghost" 
          className="text-quds-green hover:text-quds-darkgreen" 
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img 
              src="https://www.alquds.edu/wp-content/uploads/2020/12/logo-alquds-mini.png" 
              alt="Al-Quds University" 
              className="h-20 mx-auto mb-4"
            />
            <h1 className="text-3xl font-bold text-quds-green">Al-Quds Student Hub</h1>
          </div>
          
          <LoginForm />
        </div>
      </div>
      
      <footer className="p-4 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Al-Quds University. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LoginPage;
