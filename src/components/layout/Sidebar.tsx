
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Home, User, BookOpen, CalendarCheck, Award, Settings, Users, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarLink {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
}

export const Sidebar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Define navigation links based on user role
  const studentLinks: SidebarLink[] = [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    { icon: User, label: 'Profile', href: '/profile' },
    { icon: BookOpen, label: 'Quizzes', href: '/quizzes' },
    { icon: CalendarCheck, label: 'Attendance', href: '/attendance' },
    { icon: Award, label: 'Results', href: '/results' },
  ];

  const adminLinks: SidebarLink[] = [
    { icon: Home, label: 'Dashboard', href: '/admin' },
    { icon: Users, label: 'Students', href: '/admin/students' },
    { icon: BookOpen, label: 'Quizzes', href: '/admin/quizzes' },
    { icon: CalendarCheck, label: 'Attendance', href: '/admin/attendance' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  return (
    <div className="w-64 bg-sidebar text-sidebar-foreground h-screen flex flex-col">
      <div className="flex items-center justify-center h-20 border-b border-sidebar-border">
        <img 
          src="https://www.alquds.edu/wp-content/uploads/2020/12/logo-alquds-mini.png" 
          alt="Al-Quds University" 
          className="h-12 mr-2"
        />
        <span className="font-bold text-lg">Student Hub</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  location.pathname === link.href && "bg-sidebar-accent text-sidebar-accent-foreground"
                )}
                onClick={() => navigate(link.href)}
              >
                <link.icon className="mr-2 h-5 w-5" />
                {link.label}
              </Button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center mr-3">
            <User className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium truncate">{user.name || (isAdmin ? 'Admin' : user.universityId)}</p>
            <p className="text-xs text-sidebar-foreground/70">
              {isAdmin ? 'Administrator' : `Student ${user.universityId}`}
            </p>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="w-full justify-start text-sidebar-foreground border-sidebar-border hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  );
};
