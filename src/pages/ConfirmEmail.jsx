import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import authService from "../features/auth/authService";
import { useToast } from "../context/ToastContext";
import Loader from "../components/Loader";
import { FaGem, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

function ConfirmEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const verifyEmail = async () => {
    setStatus("verifying");
    try {
      const response = await authService.confirmEmail(token);
      setStatus("success");
      setMessage(response.message || "Email confirmed successfully!");
      toast.success(response.message || "Email confirmed successfully!");
    } catch (error) {
      setStatus("error");
      const errorMsg =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        "Confirmation failed";
      setMessage(errorMsg);
      toast.error(errorMsg);
    }
  };

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid confirmation link.");
    } else {
      // Default state is "ready" now, waiting for user click
      setStatus("ready");
    }
  }, [token]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-noir-900 py-12 px-4 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-gold-500/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>

      <div className="w-full max-w-md luxury-card rounded-3xl p-10 flex flex-col items-center text-center gap-6 relative z-10">
        <div className="w-20 h-20 bg-noir-800 rounded-2xl border border-gold-500/30 flex items-center justify-center mb-4 shadow-lg shadow-gold-500/10">
          <FaGem className="text-4xl text-gold-500" />
        </div>

        {status === "ready" && (
          <>
            <h2 className="font-display text-3xl font-bold text-champagne-100">
              Confirm Your Email
            </h2>
            <p className="text-champagne-400">
              Click the button below to activate your account.
            </p>
            <button
              onClick={verifyEmail}
              className="w-full py-4 mt-4 btn-luxury rounded-xl font-bold"
            >
              Verify My Email
            </button>
          </>
        )}

        {status === "verifying" && (
          <>
            <h2 className="font-display text-3xl font-bold text-champagne-100 italic">
              Verifying Email...
            </h2>
            <div className="my-4">
              <Loader />
            </div>
            <p className="text-champagne-400">
              Please wait while we activate your account.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <FaCheckCircle className="text-6xl text-green-500 mb-2" />
            <h2 className="font-display text-4xl font-bold text-champagne-100">
              Success!
            </h2>
            <p className="text-champagne-400 text-lg">{message}</p>
            <Link
              to="/login"
              className="w-full py-4 mt-4 btn-luxury rounded-xl font-bold"
            >
              Sign In Now
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <FaTimesCircle className="text-6xl text-red-500 mb-2" />
            <h2 className="font-display text-4xl font-bold text-champagne-100">
              Oops!
            </h2>
            <p className="text-champagne-400 text-lg">{message}</p>
            <div className="flex flex-col w-full gap-4 mt-4">
              <Link
                to="/register"
                className="w-full py-4 btn-luxury rounded-xl font-bold"
              >
                Back to Registration
              </Link>
              <Link
                to="/login"
                className="text-gold-500 font-bold hover:text-gold-400 transition-colors"
              >
                Try Logging In
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ConfirmEmail;
