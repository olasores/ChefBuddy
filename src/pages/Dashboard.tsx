import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LogOut } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (data?.user) {
          setUser(data.user);
        } else {
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

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Welcome, {user?.user_metadata?.name || 'User'}!</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="space-y-6">
            {user?.user_metadata?.picture && (
              <div className="flex justify-center">
                <img 
                  src={user.user_metadata.picture} 
                  alt="Profile" 
                  className="w-24 h-24 rounded-full border-4 border-orange-400"
                />
              </div>
            )}
            
            <div className="text-center">
              <p className="text-gray-600 text-lg">
                <span className="font-semibold text-gray-900">{user?.email}</span>
              </p>
              {user?.user_metadata?.full_name && (
                <p className="text-gray-500 text-sm mt-2">
                  {user.user_metadata.full_name}
                </p>
              )}
            </div>

            <div className="border-t pt-6 text-center">
              <button
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
