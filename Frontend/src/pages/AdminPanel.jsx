import React, { useEffect, useState } from "react";
import { Users, FileSpreadsheet, ShieldAlert } from "lucide-react";

// ✅ Safe Date Formatter
const formatDate = (date) => {
  if (!date) return "N/A";
  const parsed = new Date(date);
  return isNaN(parsed)
    ? "Invalid Date"
    : new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(parsed);
};

const UserRow = ({ email, role }) => (
  <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-800 transition">
    <td className="p-3">{email}</td>
    <td
      className={`p-3 font-medium ${
        role === "admin" ? "text-red-600" : "text-blue-600"
      }`}
    >
      {role}
    </td>
  </tr>
);

const UploadRow = ({ userEmail, fileName, chartType, uploadDate }) => (
  <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-800 transition">
    <td className="p-3">{userEmail}</td>
    <td className="p-3">{fileName}</td>
    <td className="p-3">{chartType}</td>
    <td className="p-3 text-gray-500">{formatDate(uploadDate)}</td>
  </tr>
);

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [uploads, setUploads] = useState([]);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setError("❌ No token found. Please log in.");
      return;
    }

    const fetchAdminData = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/data`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Unauthorized");

        const { users, uploads } = await res.json();
        setUsers(users || []);
        setUploads(uploads || []);
      } catch (err) {
        console.error(err);
        setError("❌ Failed to load admin data.");
      }
    };

    fetchAdminData();
  }, [token]);

  if (error) {
    return (
      <div className="p-6 text-center text-red-600 font-semibold text-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-10">
      {/* Title */}
      <div className="flex items-center gap-3">
        <ShieldAlert className="text-blue-600 w-8 h-8" />
        <h1 className="text-3xl font-bold text-blue-700">Admin Dashboard</h1>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex items-center gap-4">
          <Users className="w-10 h-10 text-purple-500" />
          <div>
            <p className="text-gray-500 text-sm">Total Users</p>
            <h2 className="text-xl font-semibold">{users.length}</h2>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex items-center gap-4">
          <FileSpreadsheet className="w-10 h-10 text-green-500" />
          <div>
            <p className="text-gray-500 text-sm">Uploads</p>
            <h2 className="text-xl font-semibold">{uploads.length}</h2>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex items-center gap-4">
          <ShieldAlert className="w-10 h-10 text-red-500" />
          <div>
            <p className="text-gray-500 text-sm">Admins</p>
            <h2 className="text-xl font-semibold">
              {users.filter((u) => u.role === "admin").length}
            </h2>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Users className="text-purple-600" /> Registered Users
        </h2>
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
            <tr>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={2} className="p-4 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user, i) => <UserRow key={i} {...user} />)
            )}
          </tbody>
        </table>
      </div>

      {/* Uploads Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FileSpreadsheet className="text-green-600" /> Upload Logs
        </h2>
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
            <tr>
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">File Name</th>
              <th className="p-3 text-left">Chart Type</th>
              <th className="p-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {uploads.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  No uploads recorded.
                </td>
              </tr>
            ) : (
              uploads.map((upload, i) => <UploadRow key={i} {...upload} />)
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminPanel;