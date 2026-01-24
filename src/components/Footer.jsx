import { useState, useEffect, useRef } from "react";
import { FaArrowRight, FaGem } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useToast } from "../context/ToastContext";
import { subscribe, reset } from "../features/subscription/subscrptionSlice";
import Loader from "./Loader";

const Footer = () => {
  const { toast } = useToast();
  const form = useRef();
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
      }),
    );
  };

  return (
    <>
      <footer className="w-full bg-noir-900 border-t border-gold-500/20 pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Brand Column */}
            <div className="flex flex-col gap-6">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-11 h-11 bg-gradient-to-tr from-gold-500 via-gold-400 to-gold-600 rounded-xl flex items-center justify-center text-noir-900 shadow-lg shadow-gold-500/30 group-hover:rotate-12 transition-transform duration-300">
                  <FaGem className="text-lg" />
                </div>
                <div className="flex flex-col">
                  <span className="font-display font-bold text-2xl text-champagne-100 tracking-tight leading-none">
                    Public
                    <span className="text-gold-500">Dripper</span>
                  </span>
                  <span className="text-[9px] font-bold text-gold-500/70 uppercase tracking-[0.25em]">
                    Luxury Redefined
                  </span>
                </div>
              </Link>
              <p className="text-champagne-400 text-sm leading-relaxed max-w-xs">
                Your exclusive destination for authenticated pre-owned luxury
                handbags. We curate only the finest pieces from the world's most
                prestigious maisons.
              </p>
            </div>

            {/* Shop Links */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-black text-gold-500 uppercase tracking-widest">
                The Collection
              </h3>
              <div className="flex flex-col gap-3">
                <Link
                  to="/catalog"
                  className="text-champagne-300 hover:text-gold-500 font-bold transition-all hover:translate-x-1"
                >
                  All Handbags
                </Link>
                <Link
                  to="/search"
                  className="text-champagne-300 hover:text-gold-500 font-bold transition-all hover:translate-x-1"
                >
                  Search Collection
                </Link>
              </div>
            </div>

            {/* Support Links */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-black text-gold-500 uppercase tracking-widest">
                Concierge
              </h3>
              <div className="flex flex-col gap-3">
                <Link
                  to="/contact"
                  className="text-champagne-300 hover:text-gold-500 font-bold transition-all hover:translate-x-1"
                >
                  Contact Us
                </Link>
                <span className="text-champagne-300 font-bold cursor-pointer hover:text-gold-500 transition-all hover:translate-x-1">
                  Authentication
                </span>
              </div>
            </div>

            {/* Newsletter */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <h3 className="text-xs font-black text-gold-500 uppercase tracking-widest">
                  VIP Access
                </h3>
                <p className="text-sm text-champagne-400 font-medium leading-relaxed">
                  Subscribe for exclusive drops and members-only pricing.
                </p>
              </div>
              <form onSubmit={onSubmit} className="relative group">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={onChange}
                  className="w-full pl-5 pr-14 py-4 bg-noir-800 border border-gold-500/30 rounded-2xl focus:bg-noir-700 focus:border-gold-500 transition-all outline-none text-sm font-bold text-champagne-100 placeholder:text-champagne-500"
                />
                <button
                  disabled={isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-r from-gold-500 to-gold-600 text-noir-900 rounded-xl flex items-center justify-center hover:from-gold-400 hover:to-gold-500 transition-all shadow-lg hover:rotate-12 disabled:opacity-50"
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
          <div className="pt-10 border-t border-gold-500/20 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-black text-champagne-500 uppercase tracking-[0.2em]">
              © 2026 PublicDripper. All rights reserved.
            </p>
            <div className="flex gap-8 text-[10px] font-black text-champagne-500 uppercase tracking-[0.2em]">
              <span className="cursor-pointer hover:text-gold-500 transition-colors">
                Privacy Policy
              </span>
              <span className="cursor-pointer hover:text-gold-500 transition-colors">
                Terms of Service
              </span>
              <span className="cursor-pointer hover:text-gold-500 transition-colors">
                Authentication
              </span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
