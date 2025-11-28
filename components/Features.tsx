import { Sparkles, Clock, BookOpen } from 'lucide-react';

export function Features() {
  return (
    <section id="features" className="max-w-7xl mx-auto px-6 mt-32">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Chef Buddy?</h2>
        <p className="text-xl text-gray-600">Your intelligent kitchen companion that makes cooking effortless</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="bg-gradient-to-br from-orange-400 to-amber-500 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart AI Chat</h3>
          <p className="text-gray-600 leading-relaxed">
            Simply tell Chef Buddy what ingredients you have, and get instant recipe suggestions tailored to your pantry.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="bg-gradient-to-br from-orange-400 to-amber-500 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
            <Clock className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Save Time</h3>
          <p className="text-gray-600 leading-relaxed">
            No more endless scrolling through recipe sites. Get personalized recipes in seconds, not hours.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="bg-gradient-to-br from-orange-400 to-amber-500 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Learn & Grow</h3>
          <p className="text-gray-600 leading-relaxed">
            Expand your cooking skills with detailed instructions, tips, and variations for every recipe.
          </p>
        </div>
      </div>
    </section>
  );
}
