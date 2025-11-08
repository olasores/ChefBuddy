import { ChefHat } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-32 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ChefHat className="w-6 h-6" />
              <span className="text-xl font-bold">Chef Buddy</span>
            </div>
            <p className="text-gray-400 text-sm">
              Your intelligent kitchen companion for effortless recipe creation.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
            </ul>
          </div>


        
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2025 Chef Buddy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
