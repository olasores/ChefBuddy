export default function Signup() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Create your Chef Buddy account</h1>
        <p className="text-gray-600 mb-6">Sign up quickly using your Google account.</p>

        <button className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-lg px-4 py-3 hover:shadow-md transition">
          <svg width="18" height="18" viewBox="0 0 48 48" className="inline-block" xmlns="http://www.w3.org/2000/svg">
            <path fill="#EA4335" d="M24 9.5c3.9 0 7.1 1.4 9.5 3.3l7-7C36.4 2.2 30.6 0 24 0 14.9 0 6.9 4.8 2.6 12.1l8.1 6.3C12.4 13.4 17.7 9.5 24 9.5z"/>
            <path fill="#34A853" d="M46.5 24.5c0-1.6-.1-2.8-.4-3.9H24v7.4h12.6c-.5 3-2.6 6-6.5 8.1l9 7.1C44.9 39.6 46.5 32.9 46.5 24.5z"/>
            <path fill="#4A90E2" d="M10.7 28.9A14.9 14.9 0 0 1 9.5 24c0-1.2.2-2.4.4-3.5L2 14.2C-.3 18 0 22.4 2.6 26.5l8.1 2.4z"/>
            <path fill="#FBBC05" d="M24 48c6.6 0 12.4-2.2 16.9-6l-9-7c-2.5 1.6-5.6 2.7-7.9 2.7-6.2 0-11.5-3.9-13.3-9.4L2.6 35.9C6.9 43.2 14.9 48 24 48z"/>
          </svg>
          <span className="font-medium">Sign up with Google</span>
        </button>
      </div>
    </div>
  );
}
