import { Heart } from 'lucide-react';

export function CallToAction() {
  return (
    <section className="max-w-5xl mx-auto px-6 mt-32">
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-12 text-center text-white shadow-2xl">
        <Heart className="w-16 h-16 mx-auto mb-6" />
        <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Cooking?</h2>
        <p className="text-xl mb-8 opacity-90">
          Join thousands of home cooks who are creating delicious meals effortlessly with Chef Buddy
        </p>
        <button className="bg-white text-orange-600 px-10 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all">
          Start Your Culinary Journey
        </button>
      </div>
    </section>
  );
}
