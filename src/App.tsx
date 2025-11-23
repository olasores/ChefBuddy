import { useEffect } from 'react';
// 💡 Corrected imports: Removed useLocation as it's no longer needed in AppRoutes
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'; 
import { supabase } from './lib/supabase';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Footer } from './components/Footer';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <Navbar />
      <main className="pt-32 pb-20">
        <Hero />
      </main>
      <Footer />
    </div>
  );
}

// 🚀 FIX: Uses Supabase's listener for reliable post-login redirect.
function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // This listener reliably detects when Supabase has processed the OAuth hash
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          // 1. Clean up the URL hash (removes the token from the browser address bar)
          window.history.replaceState({}, document.title, window.location.pathname);
          // 2. Navigate reliably
          navigate('/dashboard');
        } else if (event === 'SIGNED_OUT') {
          navigate('/login');
        }
      }
    );
    
    // Ensure the listener is active and process any initial hash
    supabase.auth.getSession(); 

    // Cleanup the listener when the component unmounts
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-600">Processing login...</p>
    </div>
  );
}

// 🧹 Cleaned: Removed the unused useLocation hook
function AppRoutes() {
  
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;