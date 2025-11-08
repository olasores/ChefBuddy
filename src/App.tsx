import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
// import { Features } from './components/Features';
// import { HowItWorks } from './components/HowItWorks';
// import { CallToAction } from './components/CallToAction';
import { Footer } from './components/Footer';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <Navbar />
      <main className="pt-32 pb-20">
        <Hero />
        {/* <Features /> */}
        {/* <HowItWorks /> */}
        {/* <CallToAction /> */}
      </main>
      <Footer />
    </div>
  );
}

function AppRoutes() {
  const location = useLocation();

  useEffect(() => {
    // Handle OAuth callback - check for access token in URL hash
    const handleAuthCallback = async () => {
      // Supabase will automatically handle the hash, but let's ensure the session is set
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        // Clean up the URL by removing the hash
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    };

    if (location.hash.includes('access_token')) {
      handleAuthCallback();
    }
  }, [location.hash]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
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
