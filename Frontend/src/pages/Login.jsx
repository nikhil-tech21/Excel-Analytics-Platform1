import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import { auth, provider, signInWithPopup } from '../firebase';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.includes('@')) return toast.error('Invalid email');
    if (password.length < 6) return toast.error('Password too short');

    setIsLoading(true);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let data = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      console.log("🔑 Backend Response:", data);

      if (res.ok && data.token) {
        // ✅ Save token
        localStorage.setItem("token", data.token);

        // ✅ Build user object from backend response
        const userObj = {
          name: data.name,
          email: data.email,
          role: data.role,
          isAdmin: data.isAdmin,
        };
        localStorage.setItem("user", JSON.stringify(userObj));

        toast.success(`Welcome, ${userObj.name || "User"}!`);

        // ✅ Redirect based on role
        if (userObj.isAdmin || userObj.role === "admin") {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      toast.error("Server error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const googleUser = {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        role: "user",
        isAdmin: false,
      };

      const googleToken = await user.getIdToken();
      localStorage.setItem("token", googleToken);
      localStorage.setItem("user", JSON.stringify(googleUser));

      toast.success(`Welcome, ${googleUser.name}!`);
      navigate('/dashboard');
    } catch (error) {
      console.error("❌ Google login error:", error);
      toast.error('Google login failed');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-tr from-blue-200 via-purple-300 to-pink-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      <div className="text-center py-6">
        <h1 className="text-4xl font-extrabold text-black dark:text-white drop-shadow-md">
          🚀 Excel Analytics Platform
        </h1>
        <p className="text-lg mt-1 text-gray-800 dark:text-gray-300">
          Visualize. Analyze. Discover Insights.
        </p>
      </div>

      <div className="flex flex-1">
        {/* Left Side */}
        <div className="hidden md:flex relative w-1/2 items-center justify-center p-10">
          <img src="/images/Bar.png" alt="Bar Chart" className="absolute top-8 right-10 w-[250px] h-[250px] rounded-lg border-4 border-blue-500 shadow-xl transition duration-300 ease-in-out hover:scale-105 hover:rotate-1" />
          <img src="/images/Pie.png" alt="Pie Chart" className="absolute bottom-11 right-10 w-[250px] h-[250px] rounded-full ring-4 ring-purple-500 shadow-lg transition duration-300 ease-in-out hover:scale-110 hover:-rotate-1" />
          <img src="/images/Line.png" alt="Line Chart" className="absolute top-1/2 left-16 transform -translate-y-1/2 w-[250px] h-[250px] rounded-md border-2 border-pink-400 shadow-md transition duration-300 ease-in-out hover:scale-105 hover:rotate-2" />
        </div>

        {/* Right Side: Login Form */}
        <div className="flex items-center justify-center w-full md:w-1/2 p-6">
          <form
            onSubmit={handleSubmit}
            className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-2xl rounded-2xl p-8 w-full max-w-md space-y-6 border border-white/20"
          >
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
              🔐 Login to your account
            </h2>

            {/* Email */}
            <div className="w-full space-y-1">
              <label htmlFor="email" className="block text-sm text-gray-700 dark:text-gray-300">
                Email address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Password */}
            <div className="w-full space-y-1 relative">
              <label htmlFor="password" className="block text-sm text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                type={showPass ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-9 text-gray-500 dark:text-gray-300"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Forgot Password */}
            <div className="text-right -mt-2">
              <a href="/forgot-password" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
                Forgot password?
              </a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 rounded-lg text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all font-medium shadow-md"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>

            {/* Register */}
            <p className="text-sm text-center text-gray-600 dark:text-gray-400">
              Don’t have an account?{' '}
              <a href="/register" className="text-blue-600 hover:underline">Register here</a>
            </p>

            {/* Divider */}
            <div className="text-center text-gray-500 text-sm mt-2">or login with</div>

            {/* Social Buttons */}
            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="border border-gray-300 rounded shadow-sm hover:shadow-md transition"
              >
                <img src="/icons/google.jpg" alt="Google" className="w-44 h-12" />
              </button>
              <button
                type="button"
                className="border border-gray-300 rounded shadow-sm hover:shadow-md transition"
              >
                <img src="/icons/facebook.jpg" alt="Facebook" className="w-44 h-12" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;