import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
// import { Features } from './components/Features';
// import { HowItWorks } from './components/HowItWorks';
// import { CallToAction } from './components/CallToAction';
import { Footer } from './components/Footer';

function App() {
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

export default App;
