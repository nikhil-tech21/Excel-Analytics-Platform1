import React, { useState } from 'react';
import toast from 'react-hot-toast';

function ForgotPassword() {
  const [email, setEmail] = useState('');

  const handleForgot = (e) => {
    e.preventDefault();
    if (!email.includes('@')) return toast.error('Enter a valid email');
    // API call to send reset link / OTP
    toast.success('Reset link sent to your email!');
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleForgot}
        className="bg-white dark:bg-gray-800 shadow-lg p-6 rounded-lg space-y-4 w-full max-w-md"
      >
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">🔄 Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded focus:outline-none"
        />
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Send Reset Link
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;