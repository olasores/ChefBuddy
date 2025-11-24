import { useState } from 'react';
import { Navbar } from '../components/Navbar';

export default function Chatbot() {
  const [input, setInput] = useState('');
  const handleSubmit = () => {
    // temporary submit handler — replace with API call later
    console.log('Chatbot submit:', input);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <Navbar />

      <main className="pt-32 pb-20 flex items-center justify-center">
        <div className="max-w-3xl w-full px-6">
          <div className="text-center mb-8">
            <h1 className="text-6xl font-bold text-gray-900 leading-tight">
              Create Personal
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500"> Recipes</span>
            </h1>
          </div>

          <div className="mx-auto mt-6 bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-2xl max-w-2xl">
            <div className="text-sm text-gray-600 mb-3 text-left">Type your ingredients here:</div>
            <div className="bg-white p-4 rounded-lg text-gray-700 border-2 border-orange-200">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='e.g. chicken, tomatoes, garlic'
                className="w-full h-32 resize-none p-3 rounded-md border outline-none focus:ring-2 focus:ring-orange-200"
              />
            </div>

            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
