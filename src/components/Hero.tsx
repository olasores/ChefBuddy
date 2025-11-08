import { ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
       

          <h1 className="text-6xl font-bold text-gray-900 leading-tight">
            Your Personal
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500"> Recipe Maker</span>
          </h1>

          <p className="text-xl text-gray-600 leading-relaxed">
            Turn your ingredients into delicious recipes instantly. Chef Buddy understands what you have and creates personalized recipes just for you.
          </p>

          <div className="flex items-center gap-4">
            <a href="/signup" className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2">
              Get Started
              <ArrowRight className="w-5 h-5" />
            </a>
            <a href="/login" className="bg-white text-gray-700 px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg transition-all border-2 border-gray-200">
             Log In
            </a>
          </div>

         
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-amber-500 rounded-3xl rotate-3 opacity-10"></div>
          <div className="relative bg-white rounded-3xl shadow-2xl p-8">
            <img
              src="/Gemini_Generated_Image_crhvupcrhvupcrhv.png"
              alt="Chef Buddy Logo"
              className="w-full h-auto rounded-2xl"
            />
            <div className="mt-6 space-y-4">
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-xl">
                <div className="text-sm text-gray-600 mb-2">Try it now:</div>
                <div className="bg-white p-3 rounded-lg text-gray-700 border-2 border-orange-200">
                  "I have chicken, tomatoes, and garlic..."
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
