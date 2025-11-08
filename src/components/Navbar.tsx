import { ChefHat } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-orange-400 to-amber-500 p-2 rounded-xl">
            <ChefHat className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-gray-800">Chef Buddy</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#features" className="text-gray-600 hover:text-orange-500 transition-colors font-medium">Features</a>
          <a href="#how-it-works" className="text-gray-600 hover:text-orange-500 transition-colors font-medium">How It Works</a>
          <a href="/login" className="text-gray-600 hover:text-orange-500 transition-colors font-medium">Log In</a>
          <a href="/signup" className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-2.5 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all">Get Started</a>
        </div>
      </div>
    </nav>
  );
}
