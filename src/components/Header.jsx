import React, { useState, useEffect } from "react";
import Welcome from "./Welcome";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaShoppingBag,
  FaBars,
  FaTimes,
  FaHome,
  FaStore,
  FaEnvelope,
  FaBoxOpen,
  FaSignOutAlt,
  FaUser,
  FaCoins,
} from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { ToastContainer } from "react-toastify";

function Header() {
  const { user } = useSelector((state) => state.auth);
  const cartItems = user?.data?.cart || [];
  const balance = user?.data?.balance || 0;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [mobileMenuOpen]);

  const onLogOut = () => {
    dispatch(logout());
    setMobileMenuOpen(false);
    setTimeout(() => {
      navigate("login");
    }, 200);
  };

  const navLinks = [
    { name: "Home", path: "/", icon: <FaHome /> },
    { name: "Catalog", path: "/catalog", icon: <FaStore /> },
    { name: "Contact", path: "/contact", icon: <FaEnvelope /> },
  ];

  if (user) {
    navLinks.push({
      name: "My Orders",
      path: "/my-orders",
      icon: <FaBoxOpen />,
    });
    navLinks.push({
      name: "Credits",
      path: "/credits",
      icon: <FaCoins />,
    });
  }

  return (
    <>
      <Welcome />
      <header
        className={`w-full sticky top-0 z-40 transition-all duration-300 border-b ${
          scrolled || location.pathname !== "/"
            ? "bg-white/90 backdrop-blur-md border-gray-100 shadow-sm py-3"
            : "bg-transparent border-transparent py-5"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group relative z-50">
            <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-200 group-hover:scale-110 transition-transform duration-300">
              <FaShoppingBag className="text-lg" />
            </div>
            <span className="font-black text-2xl text-gray-900 tracking-tighter">
              Shop
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                Buddy
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8 bg-gray-50/50 px-6 py-2 rounded-full border border-gray-100/50 backdrop-blur-sm">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm font-bold uppercase tracking-widest transition-colors relative group py-1 ${
                  location.pathname === item.path
                    ? "text-purple-600"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {item.name}
                <span
                  className={`absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 transform origin-left transition-transform duration-300 ${
                    location.pathname === item.path
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                ></span>
              </Link>
            ))}
          </div>

          {/* Icons & Actions */}
          <div className="flex items-center gap-3 z-50">
            <Link
              to="/search"
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-600 hover:text-purple-600"
            >
              <FaSearch className="text-lg" />
            </Link>

            <Link
              to="/cart"
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-600 hover:text-purple-600 relative"
            >
              <FaShoppingBag className="text-lg" />
              {cartItems?.length > 0 && (
                <span className="absolute top-1 right-0 bg-purple-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center ring-2 ring-white">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {/* Credits Balance */}
            {user && (
              <Link
                to="/credits"
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-full hover:from-amber-100 hover:to-yellow-100 transition-all"
              >
                <FaCoins className="text-amber-500" />
                <span className="text-sm font-bold text-amber-700">
                  {balance.toLocaleString()}
                </span>
              </Link>
            )}

            <div className="h-6 w-[1px] bg-gray-200 mx-1 hidden sm:block"></div>

            {user ? (
              <div className="hidden sm:flex items-center gap-3 pl-2">
                <div className="flex flex-col items-end">
                  <span className="text-xs font-bold text-gray-900 leading-none">
                    {user?.data?.name || "User"}
                  </span>
                  <button
                    onClick={onLogOut}
                    className="text-[10px] font-bold text-red-500 uppercase tracking-tight hover:underline flex items-center gap-1 mt-1"
                  >
                    Log Out <FaSignOutAlt />
                  </button>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 border-2 border-white shadow-sm flex items-center justify-center text-purple-700 font-bold">
                  {(user?.data?.name?.[0] || "U").toUpperCase()}
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:flex bg-black text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-gray-800 transition-all shadow-lg shadow-black/10 items-center gap-2"
              >
                <FaUser className="text-xs" /> Sign In
              </Link>
            )}

            {/* Mobile Menu Button - Replaced standard button with more stylized trigger */}
            <button
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-900 transition-colors"
              onClick={() => setMobileMenuOpen(true)}
            >
              <FaBars className="text-xl" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[900000] lg:hidden transition-opacity duration-300 ${
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        ></div>

        {/* Drawer */}
        <div
          className={`absolute top-0 right-0 w-[300px] h-full bg-white shadow-2xl transform transition-transform duration-300 flex flex-col  ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Drawer Header */}
          <div className="p-6 flex items-center justify-between border-b border-gray-100">
            <span className="font-black text-xl text-gray-900 tracking-tighter">
              Menu
            </span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-red-500 transition-colors"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-2">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
                  location.pathname === item.path
                    ? "bg-purple-50 text-purple-700 font-bold shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium"
                }`}
              >
                <span
                  className={`text-xl ${
                    location.pathname === item.path
                      ? "text-purple-600"
                      : "text-gray-400"
                  }`}
                >
                  {item.icon}
                </span>
                {item.name}
              </Link>
            ))}
          </div>

          {/* Drawer Footer */}
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            {user ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold">
                    {(user?.data?.name?.[0] || "U").toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">
                      {user?.data?.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate max-w-[150px]">
                      {user?.data?.email}
                    </p>
                  </div>
                </div>
                <Link
                  to="/credits"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between w-full bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 text-amber-700 font-bold py-3 px-4 rounded-xl hover:from-amber-100 hover:to-yellow-100 transition-all"
                >
                  <span className="flex items-center gap-2">
                    <FaCoins /> My Credits
                  </span>
                  <span className="bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full text-sm">
                    {balance.toLocaleString()}
                  </span>
                </Link>
                <button
                  onClick={onLogOut}
                  className="w-full bg-white border border-gray-200 text-red-500 font-bold py-3 rounded-xl hover:bg-red-50 hover:border-red-100 transition-all flex items-center justify-center gap-2"
                >
                  <FaSignOutAlt /> Log Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/10"
              >
                <FaUser /> Sign In / Register
              </Link>
            )}
          </div>
        </div>
      </div>

      <ToastContainer />
    </>
  );
}

export default Header;
