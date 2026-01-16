import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HiOutlineChartBar,
  HiOutlineCube,
  HiOutlineShoppingBag,
  HiOutlineUsers,
  HiOutlineCash,
  HiOutlineMenuAlt2,
  HiOutlineX,
} from "react-icons/hi";

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    {
      title: "Dashboard",
      path: "/admin",
      icon: <HiOutlineChartBar size={20} />,
    },
    {
      title: "Products",
      path: "/admin/products",
      icon: <HiOutlineCube size={20} />,
    },
    {
      title: "Orders",
      path: "/admin/orders",
      icon: <HiOutlineShoppingBag size={20} />,
    },
    {
      title: "Users",
      path: "/admin/users",
      icon: <HiOutlineUsers size={20} />,
    },
    {
      title: "Credits",
      path: "/admin/credits",
      icon: <HiOutlineCash size={20} />,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col z-20`}
      >
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          {isSidebarOpen && (
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Admin Panel
            </span>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isSidebarOpen ? (
              <HiOutlineX size={20} />
            ) : (
              <HiOutlineMenuAlt2 size={20} />
            )}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center p-3 rounded-xl transition-all duration-200 group ${
                location.pathname === item.path
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
              }`}
            >
              <span
                className={`${
                  location.pathname === item.path
                    ? "text-blue-600"
                    : "text-gray-400 group-hover:text-blue-600"
                }`}
              >
                {item.icon}
              </span>
              {isSidebarOpen && (
                <span className="ml-3 font-medium truncate">{item.title}</span>
              )}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <Link
            to="/"
            className="flex items-center p-3 text-sm text-gray-500 hover:text-blue-600 transition-colors"
          >
            <HiOutlineMenuAlt2 size={18} />
            {isSidebarOpen && (
              <span className="ml-2 font-medium">Back to Shop</span>
            )}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative p-6">
        <div className="max-w-7xl mx-auto uppercase">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
