import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { createSessionManager, checkTokenExpiry, WARNING_TIME } from "@/utils/sessionManager";
import SessionWarningDialog from "@/components/SessionWarningDialog";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Treatments from "./pages/Treatments";
import BookAppointment from "./pages/BookAppointment";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Consultant from "./pages/Consultant";
import AuthCallback from "./pages/AuthCallback";
import OAuthVerification from "./pages/OAuthVerification";
import SignupVerification from "./pages/SignupVerification";
import ForgotPassword from "./pages/ForgotPassword";
import PasswordSetup from "./pages/PasswordSetup";

const queryClient = new QueryClient();

function RequireAuth({ children }: { children: JSX.Element }) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (!token || !checkTokenExpiry()) return <Navigate to="/signin" replace />;
  return children;
}

function RequireProfile({ children }: { children: JSX.Element }) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const profileComplete = typeof window !== "undefined" ? localStorage.getItem("profileComplete") : null;
  if (!token || !checkTokenExpiry()) return <Navigate to="/signin" replace />;
  if (profileComplete !== "true") return <Navigate to="/profile" replace />;
  return children;
}

function SessionProvider({ children }: { children: React.ReactNode }) {
  const [showWarning, setShowWarning] = useState(false);
  const [sessionManager, setSessionManager] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const manager = createSessionManager(() => {
      setShowWarning(true);
    });

    setSessionManager(manager);

    return () => {
      manager?.cleanup();
    };
  }, []);

  const handleExtendSession = () => {
    sessionManager?.extendSession();
    setShowWarning(false);
  };

  const handleLogout = () => {
    sessionManager?.cleanup();
    setShowWarning(false);
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    localStorage.removeItem('profileComplete');
    window.location.href = '/signin?message=session_expired';
  };

  return (
    <>
      {children}
      <SessionWarningDialog
        isOpen={showWarning}
        onExtendSession={handleExtendSession}
        onLogout={handleLogout}
        remainingTime={WARNING_TIME}
      />
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <SessionProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/treatments" element={<Treatments />} />
              <Route path="/book-appointment" element={<RequireProfile><BookAppointment /></RequireProfile>} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogPost />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/auth/verify-oauth" element={<OAuthVerification />} />
              <Route path="/auth/verify-signup" element={<SignupVerification />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/auth/setup-password" element={<RequireAuth><PasswordSetup /></RequireAuth>} />
              <Route
                path="/dashboard"
                element={
                  <RequireAuth>
                    <Dashboard />
                  </RequireAuth>
                }
              />
              <Route
                path="/profile"
                element={
                  <RequireAuth>
                    <Profile />
                  </RequireAuth>
                }
              />
              <Route
                path="/consultant"
                element={<Consultant />}
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </div>
        </BrowserRouter>
        </SessionProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
