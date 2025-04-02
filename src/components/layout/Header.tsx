
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const Header = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navigateToProfile = () => {
    navigate(isAdmin ? '/admin/profile' : '/profile');
  };

  return (
    <header className="bg-quds-green text-white shadow-md">
      <div className="quds-container py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img
              src="https://media-hosting.imagekit.io/5f4743c5fa72480e/download.png?Expires=1838240974&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=Ev6z8~RCVHUhfSvNNORRz5~FuWIkdG8HzsoiG09dGWP4GV8AUkIsMyggFdu7llNIv6I6vOtz~avAeescg06bJMvvQNeyVqygZ2XBmhVvPuB~fiwIr9Ugr3v1fuhih8I1q~FS3WVPrkPWYH-p1IGOaIQDTyRLEij7-YUJ5CGzS1tnkMbgh3X4wCZJ1UXD7cJFQCcaZzhMxzuclXtd2fqCZVDta1PGkE0JaF7b5YgZmeraaceIWsGLgEU-B4Vk4Hsw0hnBM8zhJ9ePPPL-hIOpf3db0tXyPQKvzI1Svr6n6kza8~LmWkZ3PGPnAFzYM74BVvjY7pUpK~OYEJ6CQV9MFA__"
              alt="Al-Quds University"
              className="h-10"
            />
            <h1 className="text-xl font-bold hidden sm:block">Al-Quds University Student Hub</h1>
          </div>

          {user && (
            <div className="flex items-center space-x-4">
              <span className="hidden md:block">Welcome, {user.name || (isAdmin ? 'Admin' : user.universityId)}</span>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-full h-10 w-10 p-0 hover:bg-quds-darkgreen">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={navigateToProfile}>Profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
