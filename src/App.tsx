import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
// import { Features } from './components/Features';
// import { HowItWorks } from './components/HowItWorks';
// import { CallToAction } from './components/CallToAction';
import { Footer } from './components/Footer';
import Login from './pages/Login';
import Signup from './pages/Signup';

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
  const navigate = useNavigate();

  useEffect(() => {
    // Handle auth state changes globally
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        navigate("/");
      } else if (event === "SIGNED_OUT") {
        navigate("/login");
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
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
