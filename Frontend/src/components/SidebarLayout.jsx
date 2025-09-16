// src/components/SidebarLayout.jsx
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard, Upload, History, Shield, User, Menu, LogOut
} from 'lucide-react';
import SidebarItem from './SidebarItem';

export default function SidebarLayout() {
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 768);
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // ✅ Redirect if not logged in
  useEffect(() => {
    if (!token || !user.email) {
      navigate("/"); // login page is "/"
    }
  }, [token, user, navigate]);

  // ✅ Force dark mode
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  // ✅ Responsive collapse
  useEffect(() => {
    const handleResize = () => setIsOpen(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Navigation items
  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Upload", path: "/upload", icon: Upload },
    { name: "History", path: "/history", icon: History },
  ];

  // ✅ Show Admin only for admins
  if (user?.isAdmin) {
    navItems.push({ name: "Admin", path: "/admin", icon: Shield });
  }

  const handleNavClick = () => {
    if (window.innerWidth < 768) setIsOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsOpen(false);
    navigate("/");
  };

  return (
    <div className="dark">
      <div className="flex min-h-screen bg-gray-900 text-white">
        
        {/* Sidebar */}
        <aside
          className={`bg-gray-800 text-white py-6 px-3 transition-all duration-300 ease-in-out
          ${isOpen ? "w-64" : "w-16"} fixed md:static z-20 h-screen`}
        >
          {/* User Info */}
          <div className="flex items-center space-x-3 px-2 mb-4">
            <User className="w-6 h-6" />
            {isOpen && (
              <div>
                <p className="font-semibold">{user?.name || "Guest"}</p>
                <p className="text-sm text-gray-400">
                  {user?.isAdmin ? "Admin" : "User"}
                </p>
              </div>
            )}
          </div>

          {/* Nav Items */}
          <nav className="space-y-2">
            {navItems.map((item) => (
              <SidebarItem
                key={item.path}
                path={item.path}
                name={item.name}
                Icon={item.icon}
                isOpen={isOpen}
                active={location.pathname === item.path}
                onClick={handleNavClick}
              />
            ))}
          </nav>

          <hr className="my-4 border-gray-700" />

          {/* Bottom Buttons */}
          <div className="absolute bottom-4 left-2 space-y-2 w-full">
            <button
              onClick={handleLogout}
              className="flex items-center text-red-300 hover:text-white px-2"
            >
              <LogOut className="w-4 h-4" />
              {isOpen && <span className="ml-2">Logout</span>}
            </button>
          </div>
        </aside>

        {/* Main Content Wrapper */}
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            isOpen ? "ml-64" : "ml-16"
          } md:ml-0`}
        >
          {/* Mobile Header */}
          <header className="md:hidden flex items-center justify-between bg-gray-800 text-white px-4 py-3 sticky top-0 z-10">
            <h1 className="text-lg font-bold">📊 Excel Analytics</h1>
            <button onClick={() => setIsOpen(!isOpen)}>
              <Menu className="w-6 h-6" />
            </button>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}