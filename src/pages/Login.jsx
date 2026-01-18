import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  login,
  reset,
  loginWithGoogle,
  loginWithApple,
} from "../features/auth/authSlice";
import { GoogleLogin } from "@react-oauth/google";
import AppleLogin from "react-apple-signin-auth";
import { useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import { FaGem } from "react-icons/fa";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;
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
    dispatch(login(formData));
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
          Welcome Back
        </h2>
        <p className="text-champagne-400">Sign in to access your collection</p>
      </div>

      <form
        className="w-full max-w-md luxury-card rounded-3xl p-8 sm:p-10 flex flex-col gap-6 relative z-10"
        onSubmit={onSubmit}
      >
        <div className="flex flex-col gap-5 w-full">
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
              placeholder="Enter your password"
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
          {isLoading ? <Loader /> : "Sign In"}
        </button>

        <div className="flex flex-col gap-4 mt-2">
          <div className="flex items-center gap-4">
            <div className="h-px bg-gold-500/20 flex-1" />
            <span className="text-champagne-500 text-sm">OR</span>
            <div className="h-px bg-gold-500/20 flex-1" />
          </div>

          <div className="flex justify-center flex-col gap-3 items-center w-full">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                dispatch(loginWithGoogle(credentialResponse.credential));
              }}
              onError={() => {
                toast.error("Google Login Failed");
              }}
              theme="filled_black"
              shape="pill"
            />

            <AppleLogin
              clientId={process.env.REACT_APP_APPLE_CLIENT_ID}
              redirectURI={process.env.REACT_APP_APPLE_REDIRECT_URI}
              usePopup={true}
              callback={(response) => {
                if (!response.error) {
                  dispatch(loginWithApple(response));
                } else {
                  toast.error("Apple Sign In Failed");
                }
              }}
              scope="email name"
              responseMode="query"
              render={(renderProps) => (
                <button
                  onClick={renderProps.onClick}
                  className="px-6 py-2.5 bg-black text-white rounded-full flex items-center gap-3 hover:bg-gray-900 transition-colors w-full sm:w-auto min-w-[200px] justify-center"
                >
                  <i className="fa fa-apple text-xl"></i>
                  <span className="font-medium">Sign in with Apple</span>
                </button>
              )}
            />
          </div>
        </div>

        <div className="mt-4 flex flex-col items-center gap-4 text-sm text-champagne-400">
          <div className="flex items-center gap-2">
            <span>New to generic?</span>
            <Link
              to="/register"
              className="text-gold-500 font-bold hover:text-gold-400 hover-underline-gold transition-colors"
            >
              Create an account
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;
