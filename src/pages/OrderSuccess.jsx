import React from "react";
import { Link } from "react-router-dom";
import {
  HiCheckCircle,
  HiChevronRight,
  HiOutlineSparkles,
} from "react-icons/hi";
import { FaCoins } from "react-icons/fa";

function OrderSuccess() {
  return (
    <div className="min-h-screen bg-noir-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center relative z-10">
        {/* Decorative Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <HiCheckCircle className="text-8xl text-gold-500 mx-auto mb-6 animate-bounce drop-shadow-2xl shadow-gold-500/50" />
        <h1 className="font-display text-4xl font-bold mb-4 text-champagne-100">
          Order Confirmed
        </h1>
        <p className="text-champagne-400 mb-10 leading-relaxed font-light">
          Thank you for your acquisition. We have received your order and our
          artisans are preparing it for shipment. A confirmation has been sent
          to your email.
        </p>

        <div className="space-y-4">
          <Link
            to="/my-orders"
            className="block w-full bg-gradient-to-r from-gold-500 to-gold-600 text-noir-900 py-4 rounded-xl font-bold hover:from-gold-400 hover:to-gold-500 transition-all shadow-lg shadow-gold-500/20"
          >
            Track Your Order
          </Link>
          <Link
            to="/catalog"
            className="flex items-center justify-center text-champagne-400 font-semibold hover:text-gold-500 hover:gap-2 transition-all group"
          >
            Continue Shopping <HiChevronRight className="transition-all" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;
