import React, { createContext, useContext, useState } from 'react';
import { AttendanceRecord } from '../types';
import { useAuth } from '@/hooks/useAuth';

interface AttendanceContextType {
  markAttendance: (studentId: string, present: boolean, note?: string) => void;
  getStudentAttendance: (studentId: string) => AttendanceRecord[];
  getAllAttendance: () => Record<string, AttendanceRecord[]>;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

// Mock attendance data
const mockAttendance: Record<string, AttendanceRecord[]> = {
  '1': [
    {
      id: '1',
      date: new Date('2023-09-10'),
      present: true,
      note: 'On time'
    },
    {
      id: '2',
      date: new Date('2023-09-11'),
      present: true,
      note: 'Participated in class discussion'
    },
    {
      id: '3',
      date: new Date('2023-09-12'),
      present: false,
      note: 'Absent without notification'
    }
  ],
  '2': [
    {
      id: '4',
      date: new Date('2023-09-10'),
      present: true,
      note: 'On time'
    },
    {
      id: '5',
      date: new Date('2023-09-11'),
      present: true,
      note: 'Active participation'
    },
    {
      id: '6',
      date: new Date('2023-09-12'),
      present: true,
      note: 'Asked good questions'
    }
  ]
};

export const AttendanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [attendance, setAttendance] = useState<Record<string, AttendanceRecord[]>>(mockAttendance);
  const { user } = useAuth();

  const markAttendance = (studentId: string, present: boolean, note?: string) => {
    if (!user || user.role !== 'admin') {
      throw new Error('Only admin can mark attendance');
    }

    const newRecord: AttendanceRecord = {
      id: Date.now().toString(),
      date: new Date(),
      present,
      note
    };

    setAttendance(prev => {
      const studentAttendance = prev[studentId] || [];
      return {
        ...prev,
        [studentId]: [...studentAttendance, newRecord]
      };
    });
  };

  const getStudentAttendance = (studentId: string): AttendanceRecord[] => {
    return attendance[studentId] || [];
  };

  const getAllAttendance = (): Record<string, AttendanceRecord[]> => {
    return attendance;
  };

  const value = {
    markAttendance,
    getStudentAttendance,
    getAllAttendance
  };

  return <AttendanceContext.Provider value={value}>{children}</AttendanceContext.Provider>;
};

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (context === undefined) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};
