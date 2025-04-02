
import React, { createContext, useEffect, useState } from 'react';
import { User, Student, Admin } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (universityId: string, password: string) => Promise<void>;
  adminLogin: (username: string, password: string) => Promise<void>;
  register: (universityId: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

const mockStudents: Student[] = [
  {
    id: '1',
    role: 'student',
    name: 'Ahmed Khalid',
    email: 'ahmed.k@student.alquds.edu',
    universityId: 'S2011173',
    profilePicture: '',
    createdAt: new Date('2022-09-01'),
    attendance: [],
    quizAccess: ['1', '2'],
    quizResults: []
  },
  {
    id: '2',
    role: 'student',
    name: 'Sara Mohammad',
    email: 'sara.m@student.alquds.edu',
    universityId: 'S2011174',
    profilePicture: '',
    createdAt: new Date('2022-09-01'),
    attendance: [],
    quizAccess: ['1'],
    quizResults: []
  }
];

const mockAdmin: Admin = {
  id: 'admin1',
  role: 'admin',
  name: 'Dr. Mahmoud Abbas',
  email: 'dr.mahmoud@alquds.edu',
  createdAt: new Date('2020-01-01')
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('qudsUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (universityId: string, password: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (!universityId.startsWith('S')) {
        throw new Error('Invalid University ID format. It should start with "S"');
      }

      const student = mockStudents.find(s => s.universityId === universityId);
      
      if (!student) {
        throw new Error('Student not found');
      }

      localStorage.setItem('qudsUser', JSON.stringify(student));
      setUser(student);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const adminLogin = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
        throw new Error('Invalid admin credentials');
      }

      localStorage.setItem('qudsUser', JSON.stringify(mockAdmin));
      setUser(mockAdmin);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Admin login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (universityId: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (!universityId.startsWith('S')) {
        throw new Error('Invalid University ID format. It should start with "S"');
      }

      if (mockStudents.some(s => s.universityId === universityId)) {
        throw new Error('Student with this University ID already exists');
      }

      const newStudent: Student = {
        id: Date.now().toString(),
        role: 'student',
        name,
        universityId,
        profilePicture: '',
        createdAt: new Date(),
        attendance: [],
        quizAccess: [],
        quizResults: []
      };

      localStorage.setItem('qudsUser', JSON.stringify(newStudent));
      setUser(newStudent);
      
      mockStudents.push(newStudent);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('qudsUser');
    setUser(null);
  };

  const value = {
    user,
    isLoading,
    login,
    adminLogin,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
