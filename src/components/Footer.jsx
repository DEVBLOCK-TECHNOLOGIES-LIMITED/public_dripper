import { useState, useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { subscribe, reset } from "../features/subscription/subscrptionSlice";
import "react-toastify/dist/ReactToastify.css";
import Loader from "./Loader";

function Footer() {
  const [email, setEmail] = useState("");

  const dispatch = useDispatch();

  const { isError, isLoading, isSuccess, message } = useSelector((state) => {
    return state.subscribe;
  });

  useEffect(() => {
    if (isError) {
      toast.error(message);
      setEmail("");
    }

    if (isSuccess) {
      toast.success(message);
      setEmail("");
    }

    dispatch(reset());
  }, [isError, isSuccess, email, message, dispatch]);

  const onChange = (e) => {
    setEmail(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(
      subscribe({
        email: email,
      })
    );
  };

  return (
    <>
      <footer className="w-full bg-white border-t border-gray-100 pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Brand Column */}
            <div className="flex flex-col gap-6">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-200 group-hover:rotate-12 transition-transform duration-300">
                  <span className="font-black text-xl">S</span>
                </div>
                <span className="font-black text-2xl text-gray-900 tracking-tighter">
                  Shop
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                    Buddy
                  </span>
                </span>
              </Link>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                Premium tech and gadgets curated for the modern lifestyle. We
                bring you the future of commerce with quality guaranteed.
              </p>
            </div>

            {/* Shop Links */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">
                Quick Shop
              </h3>
              <div className="flex flex-col gap-3">
                <Link
                  to="/catalog"
                  className="text-gray-600 hover:text-purple-600 font-bold transition-all hover:translate-x-1"
                >
                  All Products
                </Link>
                <Link
                  to="/search"
                  className="text-gray-600 hover:text-purple-600 font-bold transition-all hover:translate-x-1"
                >
                  Search Shop
                </Link>
                <Link
                  to="/credits"
                  className="text-gray-600 hover:text-purple-600 font-bold transition-all hover:translate-x-1"
                >
                  Credit Store
                </Link>
              </div>
            </div>

            {/* Support Links */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">
                Support
              </h3>
              <div className="flex flex-col gap-3">
                <Link
                  to="/contact"
                  className="text-gray-600 hover:text-purple-600 font-bold transition-all hover:translate-x-1"
                >
                  Contact Us
                </Link>
                <Link
                  to="/my-orders"
                  className="text-gray-600 hover:text-purple-600 font-bold transition-all hover:translate-x-1"
                >
                  Track My Order
                </Link>
                <span className="text-gray-600 font-bold cursor-pointer hover:text-purple-600 transition-all hover:translate-x-1">
                  FAQs
                </span>
              </div>
            </div>

            {/* Newsletter */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  Newsletter
                </h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                  Join our newsletter for exclusive deals and tech updates.
                </p>
              </div>
              <form onSubmit={onSubmit} className="relative group">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={onChange}
                  className="w-full pl-5 pr-14 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-purple-500 transition-all outline-none text-sm font-bold shadow-sm"
                />
                <button
                  disabled={isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center hover:bg-purple-600 transition-all shadow-lg hover:rotate-12 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader size="sm" />
                  ) : (
                    <FaArrowRight className="text-sm" />
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
              © 2026 ShopBuddy Inc. All rights reserved.
            </p>
            <div className="flex gap-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
              <span className="cursor-pointer hover:text-purple-600 transition-colors">
                Privacy Policy
              </span>
              <span className="cursor-pointer hover:text-purple-600 transition-colors">
                Terms of Service
              </span>
              <span className="cursor-pointer hover:text-purple-600 transition-colors">
                Cookies
              </span>
            </div>
          </div>
        </div>
      </footer>
      {/* Centralized ToastContainer in Header */}
    </>
  );
}

export default Footer;
