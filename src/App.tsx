
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { QuizProvider } from "./contexts/QuizContext";
import { AttendanceProvider } from "./contexts/AttendanceContext";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import QuizListPage from "./pages/quiz/QuizList";
import QuizSessionPage from "./pages/quiz/QuizSession";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./pages/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <QuizProvider>
          <AttendanceProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                {/* Student Routes */}
                <Route path="/dashboard" element={<ProtectedRoute element={<StudentDashboard />} />} />
                <Route path="/quizzes" element={<ProtectedRoute element={<QuizListPage />} />} />
                <Route path="/quiz-session/:quizId" element={<ProtectedRoute element={<QuizSessionPage />} />} />
                
                {/* Admin Routes */}
                <Route path="/admin" element={<ProtectedRoute element={<AdminDashboard />} requireAdmin={true} />} />
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AttendanceProvider>
        </QuizProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
