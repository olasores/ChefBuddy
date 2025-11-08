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
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Welcome back!</h2>
            <div className="space-y-3">
              <p className="text-gray-700">
                <span className="font-semibold">Email:</span> {user?.email}
              </p>
              {user?.user_metadata?.name && (
                <p className="text-gray-700">
                  <span className="font-semibold">Name:</span> {user.user_metadata.name}
                </p>
              )}
              <p className="text-gray-700">
                <span className="font-semibold">User ID:</span> {user?.id}
              </p>
            </div>
          </div>

          <div className="border-t pt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Details</h3>
            <div className="bg-gray-50 rounded-lg p-6">
              <pre className="text-sm text-gray-600 overflow-auto">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
          </div>

          <div className="border-t mt-8 pt-8">
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
  );
}
