import React, { useState } from 'react';
import toast from 'react-hot-toast';

function ResetPassword() {
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const handleReset = (e) => {
    e.preventDefault();
    if (newPass.length < 6) return toast.error('Password too short');
    if (newPass !== confirmPass) return toast.error('Passwords do not match');
    // API call to update password
    toast.success('Password has been reset!');
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleReset}
        className="bg-white dark:bg-gray-800 shadow-lg p-6 rounded-lg space-y-4 w-full max-w-md"
      >
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">🔐 Reset Password</h2>
        <input
          type="password"
          placeholder="New Password"
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
          className="w-full px-4 py-2 border rounded"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPass}
          onChange={(e) => setConfirmPass(e.target.value)}
          className="w-full px-4 py-2 border rounded"
        />
        <button
          type="submit"
          className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;