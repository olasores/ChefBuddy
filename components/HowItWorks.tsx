export function HowItWorks() {
  return (
    <section id="how-it-works" className="max-w-7xl mx-auto px-6 mt-32">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
        <p className="text-xl text-gray-600">Three simple steps to delicious meals</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {[1, 2, 3].map((step) => (
          <div key={step} className="text-center">
            <div className="bg-gradient-to-br from-orange-400 to-amber-500 w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
              {step}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              {step === 1 && 'Tell Us Your Ingredients'}
              {step === 2 && 'Get Instant Recipes'}
              {step === 3 && 'Start Cooking'}
            </h3>
            <p className="text-gray-600">
              {step === 1 && 'List what you have in your kitchen, and Chef Buddy will understand exactly what you can make.'}
              {step === 2 && 'Receive personalized recipe suggestions with step-by-step instructions tailored to your ingredients.'}
              {step === 3 && 'Follow along with clear instructions and create amazing dishes your whole family will love.'}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
