import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// FIX: Changing the import path back to the explicit .js extension.
// This is the most robust solution when the bundler struggles with implicit resolution.
import { supabase } from '../lib/supabase.js';
import { LogOut } from 'lucide-react';
// The type import is causing a compilation error in a pure .jsx environment.
// Since we are generating .jsx, we remove the TypeScript-specific type import and annotation.
// import type { User } from '@supabase/supabase-js'; 

export default function Dashboard() {
  // Use 'any' or simply omit the explicit type annotation for User in a pure .jsx context
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      try {
        // Fetch the current authenticated user's session data
        const { data } = await supabase.auth.getUser();
        if (data?.user) {
          setUser(data.user);
        } else {
          // If no user is found, redirect to login
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [navigate]);

  /**
   * Handles user logout via Supabase.
   */
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      // Redirect to login page after successful sign out
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
        <p className="text-xl font-semibold text-gray-700 animate-pulse">Loading Chef Buddy Dashboard...</p>
      </div>
    );
  }

  // Fallback for user metadata if not present (e.g., if using email/password login without profile data)
  const displayName = user?.user_metadata?.full_name || user?.email || 'Authenticated User';
  const profilePicture = user?.user_metadata?.picture;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Header and Logout Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 bg-white p-6 rounded-2xl shadow-lg border-t-4 border-orange-500">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 sm:mb-0">
            Welcome, {displayName.split(' ')[0]}!
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-red-700 transition duration-150 ease-in-out transform hover:scale-[1.02]"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>

        {/* Dashboard Content Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 border-b-8 border-amber-400">
          <div className="space-y-8">
            
            {/* Profile Image */}
            {profilePicture && (
              <div className="flex justify-center">
                <img 
                  src={profilePicture} 
                  alt="Profile" 
                  // Added onerror to provide a fallback image/behavior if the URL is broken
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/128x128/f97316/ffffff?text=C+B'; e.target.alt = 'Default Profile Icon'; }}
                  className="w-32 h-32 rounded-full object-cover border-6 border-orange-400 ring-4 ring-orange-100 shadow-xl"
                />
              </div>
            )}
            
            {/* User Details */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">
                {user?.user_metadata?.full_name || 'No Full Name Available'}
              </h2>
              <p className="text-gray-600 text-md">
                <span className="font-medium text-orange-600">{user?.email}</span>
              </p>
              {user?.user_metadata?.other_info && (
                <p className="text-gray-500 text-sm italic pt-2">
                  Info: {user.user_metadata.other_info}
                </p>
              )}
            </div>

            {/* Chatbot CTA Section */}
            <div className="border-t border-gray-100 pt-8">
              <button 
                onClick={() => navigate('/chatbot')}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-2xl p-8 transition duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                <div className="flex flex-col items-center text-center">
                  <p className="text-2xl font-bold mb-2">✨ Generate Your Perfect Recipe</p>
                  <p className="text-orange-50">What's in your kitchen? Let's create something delicious!</p>
                </div>
              </button>
            </div>

            {/* Application Section */}
            <div className="border-t border-gray-100 pt-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Chef Buddy Tools</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                  onClick={() => console.log('Navigate to Recipes')} // Placeholder
                  className="p-4 bg-orange-50 hover:bg-orange-100 rounded-xl transition duration-150 text-left"
                >
                  <p className="font-semibold text-orange-700">Manage Recipes</p>
                  <p className="text-sm text-gray-500">Create, edit, and discover new dishes.</p>
                </button>
                <button 
                  onClick={() => console.log('Navigate to Meal Planner')} // Placeholder
                  className="p-4 bg-orange-50 hover:bg-orange-100 rounded-xl transition duration-150 text-left"
                >
                  <p className="font-semibold text-orange-700">Meal Planner</p>
                  <p className="text-sm text-gray-500">Plan your week of meals efficiently.</p>
                </button>
              </div>
            </div>

            {/* Back to Home */}
            <div className="border-t border-gray-100 pt-6 text-center">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="text-orange-600 font-semibold hover:text-orange-700 transition-colors"
              >
                ← Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}