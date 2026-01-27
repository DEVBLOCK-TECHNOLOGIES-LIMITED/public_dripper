import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { FaEnvelope } from "react-icons/fa";

function VerifyEmail() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const email = state?.email;

  const checkStatus = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URI || "http://localhost:3001"}/api/user/status`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        },
      );
      const data = await response.json();

      if (data.isEmailConfirmed) {
        toast.success("Email verified! Logging you in...");
        navigate("/login");
      } else {
        toast.info("Email not yet verified. Please check your inbox.");
      }
    } catch (error) {
      console.error("Verification check failed", error);
      toast.error("Failed to check status. Please try again.");
    }
  };

  useEffect(() => {
    if (!email) {
      navigate("/login");
    }
  }, [email, navigate]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-noir-900 py-12 px-4 relative overflow-hidden">
      {/* Decorative Elements matching Login.jsx */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-gold-500/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>

      <div className="w-full max-w-md luxury-card rounded-3xl p-8 sm:p-10 flex flex-col gap-6 relative z-10 text-center">
        <div className="mx-auto inline-flex items-center justify-center p-4 bg-noir-800 rounded-full border border-gold-500/30 mb-2 shadow-lg shadow-gold-500/10">
          <FaEnvelope className="text-4xl text-gold-500" />
        </div>

        <h2 className="font-display text-3xl font-bold text-champagne-100">
          Verify Your Email
        </h2>

        <p className="text-champagne-400">
          We've sent a verification link to <br />
          <span className="text-gold-500 font-semibold">{email}</span>
        </p>

        <div className="bg-noir-800/50 p-4 rounded-xl border border-gold-500/20">
          <p className="text-sm text-champagne-300">
            Please check your inbox and click the link to verify your account.
            This page will automatically update once verified.
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={checkStatus}
            className="w-full py-3 btn-luxury rounded-xl flex justify-center items-center gap-2 cursor-pointer font-bold"
          >
            I've Verified My Email
          </button>

          <button
            onClick={() => navigate("/login")}
            className="w-full py-3 bg-transparent border border-gold-500/30 text-gold-500 rounded-xl hover:bg-gold-500/10 transition-colors cursor-pointer"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;
