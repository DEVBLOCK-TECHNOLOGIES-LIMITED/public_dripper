import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register, reset } from "../features/auth/authSlice";
import { useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import { FaGem } from "react-icons/fa";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const { name, email, password, password2 } = formData;
  const { user, isError, message, isLoading } = useSelector((state) => {
    return state.auth;
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => {
      return {
        ...prevState,
        [e.target.name]: e.target.value,
      };
    });
  };

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (user) {
      navigate("/");
    }

    dispatch(reset());
  }, [message, isError, dispatch, user, navigate]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== password2) {
      toast.error("Password does not Match", { autoClose: 5000 });
    } else {
      dispatch(register({ name, email, password }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-noir-900 py-12 px-4 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-gold-500/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>

      <div className="text-center mb-10 relative z-10">
        <div className="inline-flex items-center justify-center p-4 bg-noir-800 rounded-2xl border border-gold-500/30 mb-6 shadow-lg shadow-gold-500/10">
          <FaGem className="text-3xl text-gold-500" />
        </div>
        <h2 className="font-display text-4xl font-bold text-champagne-100 mb-2">
          Join the Elite
        </h2>
        <p className="text-champagne-400">
          Create an account to start your collection
        </p>
      </div>

      <form
        className="w-full max-w-md luxury-card rounded-3xl p-8 sm:p-10 flex flex-col gap-6 relative z-10"
        onSubmit={onSubmit}
      >
        <div className="flex flex-col gap-5 w-full">
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-bold text-gold-500 uppercase tracking-wider mb-2"
            >
              Full Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              className="w-full p-4 rounded-xl input-luxury text-base"
              value={name}
              placeholder="Enter your name"
              autoComplete="off"
              onChange={onChange}
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-bold text-gold-500 uppercase tracking-wider mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="w-full p-4 rounded-xl input-luxury text-base"
              value={email}
              placeholder="Enter your email"
              autoComplete="off"
              onChange={onChange}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-bold text-gold-500 uppercase tracking-wider mb-2"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="w-full p-4 rounded-xl input-luxury text-base"
              value={password}
              placeholder="Enter password"
              autoComplete="off"
              onChange={onChange}
            />
          </div>
          <div>
            <label
              htmlFor="password2"
              className="block text-xs font-bold text-gold-500 uppercase tracking-wider mb-2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              name="password2"
              id="password2"
              className="w-full p-4 rounded-xl input-luxury text-base"
              value={password2}
              placeholder="Confirm password"
              autoComplete="off"
              onChange={onChange}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 mt-2 btn-luxury rounded-xl flex justify-center items-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? <Loader /> : "Create Account"}
        </button>

        <div className="mt-4 flex flex-col items-center gap-4 text-sm text-champagne-400">
          <div className="flex items-center gap-2">
            <span>Already have an account?</span>
            <Link
              to="/login"
              className="text-gold-500 font-bold hover:text-gold-400 hover-underline-gold transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Register;
