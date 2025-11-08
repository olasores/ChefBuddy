import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
// import { Features } from './components/Features';
// import { HowItWorks } from './components/HowItWorks';
// import { CallToAction } from './components/CallToAction';
import { Footer } from './components/Footer';
import Login from './pages/Login';
import Signup from './pages/Signup';

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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
