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
  FaGem,
  FaCog,
} from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";

function Header() {
  const { user } = useSelector((state) => state.auth);
  const cartItems = user?.data?.cart || [];

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
    { name: "Collection", path: "/catalog", icon: <FaStore /> },
    { name: "Contact", path: "/contact", icon: <FaEnvelope /> },
  ];

  if (user) {
    navLinks.push({
      name: "My Orders",
      path: "/my-orders",
      icon: <FaBoxOpen />,
    });
  }

  if (user?.data?.role === "admin") {
    navLinks.push({
      name: "Admin",
      path: "/admin",
      icon: <FaCog />,
    });
  }

  return (
    <>
      <Welcome />
      <header
        className={`w-full sticky top-0 z-40 transition-all duration-500 border-b bg-noir-900 border-gold-500/20 ${
          scrolled || location.pathname !== "/"
            ? "shadow-lg shadow-black/30 py-3"
            : "py-4"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 md:gap-3 group relative z-50"
          >
            <div className="w-9 h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-gradient-to-tr from-gold-500 via-gold-400 to-gold-600 rounded-xl flex items-center justify-center text-noir-900 shadow-lg shadow-gold-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <FaGem className="text-sm md:text-base lg:text-xl" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg md:text-xl lg:text-2xl text-champagne-100 tracking-tight leading-none">
                Public
                <span className="text-gold-500">Dripper</span>
              </span>
              <span className="text-[7px] md:text-[8px] lg:text-[9px] font-bold text-gold-500/70 uppercase tracking-[0.25em]">
                Luxury Redefined
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8 bg-noir-800/50 px-8 py-2.5 rounded-full border border-gold-500/20 backdrop-blur-sm">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm font-bold uppercase tracking-widest transition-all relative group py-1 ${
                  location.pathname === item.path
                    ? "text-gold-500"
                    : "text-champagne-300 hover:text-gold-400"
                }`}
              >
                {item.name}
                <span
                  className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-gold-500 to-gold-300 transform origin-left transition-transform duration-300 ${
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
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gold-500/10 transition-colors text-champagne-300 hover:text-gold-500"
            >
              <FaSearch className="text-lg" />
            </Link>

            <Link
              to="/cart"
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gold-500/10 transition-colors text-champagne-300 hover:text-gold-500 relative"
            >
              <FaShoppingBag className="text-lg" />
              {cartItems?.length > 0 && (
                <span className="absolute top-1 right-0 bg-gold-500 text-noir-900 text-[10px] font-black h-4 w-4 rounded-full flex items-center justify-center ring-2 ring-noir-900">
                  {cartItems.length}
                </span>
              )}
            </Link>

            <div className="h-6 w-[1px] bg-gold-500/20 mx-1 hidden sm:block"></div>

            {user ? (
              <div className="hidden sm:flex items-center gap-3 pl-2">
                <div className="flex flex-col items-end">
                  <span className="text-xs font-bold text-champagne-200 leading-none">
                    {user?.data?.name || "User"}
                  </span>
                  <button
                    onClick={onLogOut}
                    className="text-[10px] font-bold text-rosegold-500 uppercase tracking-tight hover:underline flex items-center gap-1 mt-1"
                  >
                    Log Out <FaSignOutAlt />
                  </button>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-500/20 to-gold-400/10 border-2 border-gold-500/30 shadow-sm flex items-center justify-center text-gold-500 font-bold">
                  {(user?.data?.name?.[0] || "U").toUpperCase()}
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:flex bg-gradient-to-r from-gold-500 to-gold-600 text-noir-900 px-6 py-2.5 rounded-full text-sm font-bold hover:from-gold-400 hover:to-gold-500 transition-all shadow-lg shadow-gold-500/20 items-center gap-2"
              >
                <FaUser className="text-xs" /> Sign In
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-gold-500/10 text-champagne-200 transition-colors"
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
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        ></div>

        {/* Drawer */}
        <div
          className={`absolute top-0 right-0 w-[300px] h-full bg-noir-900 shadow-2xl transform transition-transform duration-300 flex flex-col border-l border-gold-500/20 ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Drawer Header */}
          <div className="p-6 flex items-center justify-between border-b border-gold-500/20">
            <span className="font-display font-bold text-xl text-champagne-100 tracking-tight">
              Menu
            </span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-noir-800 hover:bg-gold-500/20 text-champagne-400 hover:text-gold-500 transition-colors"
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
                    ? "bg-gold-500/10 text-gold-500 font-bold shadow-sm border border-gold-500/20"
                    : "text-champagne-300 hover:bg-noir-800 hover:text-gold-400 font-medium"
                }`}
              >
                <span
                  className={`text-xl ${
                    location.pathname === item.path
                      ? "text-gold-500"
                      : "text-champagne-500"
                  }`}
                >
                  {item.icon}
                </span>
                {item.name}
              </Link>
            ))}
          </div>

          {/* Drawer Footer */}
          <div className="p-6 border-t border-gold-500/20 bg-noir-800/50">
            {user ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-500 font-bold border border-gold-500/30">
                    {(user?.data?.name?.[0] || "U").toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-champagne-100 text-sm">
                      {user?.data?.name}
                    </p>
                    <p className="text-xs text-champagne-400 truncate max-w-[150px]">
                      {user?.data?.email}
                    </p>
                  </div>
                </div>

                <button
                  onClick={onLogOut}
                  className="w-full bg-noir-700 border border-rosegold-500/30 text-rosegold-400 font-bold py-3 rounded-xl hover:bg-rosegold-500/10 hover:border-rosegold-500/50 transition-all flex items-center justify-center gap-2"
                >
                  <FaSignOutAlt /> Log Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full bg-gradient-to-r from-gold-500 to-gold-600 text-noir-900 font-bold py-4 rounded-xl hover:from-gold-400 hover:to-gold-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-gold-500/20"
              >
                <FaUser /> Sign In / Register
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
