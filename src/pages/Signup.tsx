import { ChefHat } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// FIX: Explicitly specifying the file extension (.ts) to resolve module path issue
import { supabase } from "../lib/supabase.ts"; 

// The Signup page component for handling both email/password and Google OAuth signup.
export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otherInfo, setOtherInfo] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  /**
   * Handles the standard email/password sign-up process.
   * It relies on a PostgreSQL trigger in Supabase to automatically
   * create the corresponding profile in the 'profiles' table.
   */
  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    // 1. Attempt to create the user in Supabase Auth.
    // We pass 'full_name' and 'other_info' as metadata, which the database trigger
    // can access to populate the 'profiles' table.
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name, other_info: otherInfo } },
    });

    setIsLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    // 2. Success path: Notify the user about the confirmation email.
    setMessage("Success! Please check your email for the confirmation link before logging in.");
    // Optionally, navigate the user to the login page after a short delay
    setTimeout(() => {
        navigate("/login");
    }, 3000);
  };

  /**
   * Initiates the Google OAuth sign-in flow.
   * Supabase handles the redirection to Google and then back to the AuthCallback.
   */
  const handleGoogleSignup = async () => {
    setIsLoading(true);
    setError(null);

    // The 'redirectTo' path must match the AuthCallback route in App.js
    const { error: googleError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { 
        redirectTo: `${window.location.origin}/auth/callback`,
        // Pass metadata if needed, though often captured automatically by OAuth provider
        // data: { full_name: name } 
      },
    });

    if (googleError) {
      setError(googleError.message);
      setIsLoading(false);
    }
    // If successful, Supabase redirects the browser, so no further action needed here.
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-gradient-to-br from-orange-400 to-amber-500 p-4 rounded-2xl mb-4 shadow-lg">
            <ChefHat className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Join Chef Buddy</h1>
          <p className="text-gray-600">Create your account and start cooking amazing meals</p>
        </div>

        {/* Signup Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Error and Success Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
              Error: {error}
            </div>
          )}
          {message && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm font-medium">
              {message}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-5">
            <input
              type="text"
              placeholder="Full Name (for your profile)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition duration-150 shadow-sm"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition duration-150 shadow-sm"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition duration-150 shadow-sm"
            />
            <input
              type="text"
              placeholder="Other Info (Optional)"
              value={otherInfo}
              onChange={(e) => setOtherInfo(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition duration-150 shadow-sm"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold text-lg shadow-md hover:bg-orange-600 transition duration-200 ease-in-out transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-200" />
            <span className="px-3 text-gray-500 text-sm">or</span>
            <div className="flex-grow h-px bg-gray-200" />
          </div>

          {/* Google Signup */}
          <button
            onClick={handleGoogleSignup}
            disabled={isLoading}
            className="w-full bg-white border-2 border-gray-300 text-gray-700 px-6 py-4 rounded-xl font-semibold text-lg shadow-md hover:bg-gray-50 hover:border-orange-400 transition duration-200 ease-in-out flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {/* Simple Google SVG Icon */}
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          {/* Login link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <button
                type="button" // Use type="button" to prevent form submission
                onClick={() => navigate("/login")}
                className="text-orange-600 font-semibold hover:text-orange-700 transition-colors"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Back to home
          </button>
        </div>
      </div>
    </div>
  );
}