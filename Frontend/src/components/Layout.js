import React from "react";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => (
  <div className="flex min-h-screen">
    {/* Sidebar (left) */}
    <Sidebar />

    {/* Main Content */}
    <main className="flex-1 p-6 bg-gray-100 dark:bg-gray-900 overflow-y-auto">
      {children}
    </main>
  </div>
);

export default Layout;