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
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <HiCheckCircle className="text-8xl text-green-500 mx-auto mb-6 animate-bounce" />
        <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for your purchase. We've received your order and are
          preparing it for shipment. You'll receive a confirmation email
          shortly.
        </p>

        {/* Credits Promo */}
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center text-white">
              <FaCoins className="text-lg" />
            </div>
            <div className="text-left">
              <p className="font-bold text-gray-900 text-sm">
                Save on your next order!
              </p>
              <p className="text-xs text-amber-700">
                Get up to 30% bonus credits
              </p>
            </div>
          </div>
          <Link
            to="/credits"
            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white py-3 rounded-xl font-bold hover:from-amber-600 hover:to-yellow-600 transition-all shadow-lg shadow-amber-200"
          >
            <HiOutlineSparkles /> Buy Credits & Save
          </Link>
        </div>

        <div className="space-y-3">
          <Link
            to="/my-orders"
            className="block w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition flex items-center justify-center gap-2"
          >
            Track Your Order
          </Link>
          <Link
            to="/catalog"
            className="flex items-center justify-center text-purple-600 font-semibold hover:gap-2 transition-all group"
          >
            Continue Shopping <HiChevronRight className="transition-all" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;
