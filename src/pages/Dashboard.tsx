import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get the logged-in user
    const getUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        setUser(data.session.user);
      } else {
        // Redirect to login if no session
        navigate("/login");
      }
      setLoading(false);
    };

    getUser();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-amber-50">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-orange-600">Chef Buddy</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Welcome, {user?.user_metadata?.name || user?.email}! 👨‍🍳
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-gradient-to-br from-orange-100 to-amber-100 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Your Profile</h3>
              <div className="space-y-3">
                <p className="text-gray-700">
                  <strong>Email:</strong> {user?.email}
                </p>
                {user?.user_metadata?.picture && (
                  <img
                    src={user.user_metadata.picture}
                    alt="Profile"
                    className="w-16 h-16 rounded-full"
                  />
                )}
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Getting Started</h3>
              <p className="text-gray-700">
                This is your temporary dashboard! More features coming soon.
              </p>
            </div>
          </div>

          <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800">
              ✅ Successfully logged in with Google!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
