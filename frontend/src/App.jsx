import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { SignedIn, SignedOut, RedirectToSignIn, SignIn, SignUp, useAuth } from '@clerk/clerk-react';
import { setTokenGetter } from './api/client';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import QuizSession from './pages/QuizSession';
import QuizPreview from './pages/QuizPreview';
import Results from './pages/Results';
import NotFound from './pages/NotFound';

/** Wrap a component so unauthenticated users are redirected to Clerk sign-in. */
function ProtectedRoute({ children }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut><RedirectToSignIn /></SignedOut>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  );
}

function AppRoutes() {
  const { getToken } = useAuth();

  // ── Inject Clerk token into the API client exactly once ───────
  // Centralized here so Dashboard and History don't each call setTokenGetter.
  useEffect(() => { setTokenGetter(getToken); }, [getToken]);

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route
        path="/sign-in/*"
        element={<SignIn routing="path" path="/sign-in" />}
      />
      <Route
        path="/sign-up/*"
        element={<SignUp routing="path" path="/sign-up" />}
      />

      {/* Protected */}
      <Route path="/dashboard" element={
        <ProtectedRoute><Dashboard /></ProtectedRoute>
      } />
      <Route path="/history" element={
        <ProtectedRoute><History /></ProtectedRoute>
      } />
      <Route path="/quiz/:quizId" element={
        <ProtectedRoute><QuizSession /></ProtectedRoute>
      } />
      {/* description: Route xem trước quiz trước khi bắt đầu làm bài */}
      {/* input: quizId từ URL, quiz data từ location.state hoặc fetch API */}
      {/* output: render trang QuizPreview với nút Start Quiz */}
      <Route path="/quiz-preview/:quizId" element={
        <ProtectedRoute><QuizPreview /></ProtectedRoute>
      } />
      <Route path="/results/:sessionId" element={
        <ProtectedRoute><Results /></ProtectedRoute>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
