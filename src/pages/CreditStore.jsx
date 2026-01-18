import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { generateUUID } from "../utils/idempotency";
import {
  getCredits,
  getPackages,
  purchaseCredits,
  getHistory,
  reset,
} from "../features/credits/creditsSlice";
import { toast } from "react-toastify";
import {
  HiOutlineCreditCard,
  HiOutlineSparkles,
  HiOutlineLightningBolt,
  HiOutlineGift,
  HiOutlineClock,
  HiOutlineArrowUp,
  HiOutlineArrowDown,
  HiCheckCircle,
  HiOutlineShieldCheck,
  HiOutlineStar,
} from "react-icons/hi";

function CreditStore() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { packages, transactions, isLoading, isSuccess, isError, message } =
    useSelector((state) => state.credits);
  const balance = user?.data?.balance || 0;

  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const email = user?.data?.email;

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    dispatch(getCredits(email));
    dispatch(getPackages());
    dispatch(getHistory({ email, limit: 10 }));
  }, [user, email, dispatch, navigate]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess && isPurchasing) {
      toast.success("Credits purchased successfully!");
      setSelectedPackage(null);
      setIsPurchasing(false);
    }
    dispatch(reset());
  }, [isError, isSuccess, message, isPurchasing, dispatch]);

  const handlePurchase = (pkg) => {
    setSelectedPackage(pkg);
  };

  const confirmPurchase = () => {
    if (!selectedPackage) return;

    const idempotencyKey = generateUUID();

    setIsPurchasing(true);
    dispatch(
      purchaseCredits({
        email,
        packageId: selectedPackage.id,
        paymentMethod: "card",
        idempotencyKey,
      }),
    );
  };

  const getPackageIcon = (id) => {
    switch (id) {
      case "starter":
        return <HiOutlineSparkles className="text-2xl" />;
      case "popular":
        return <HiOutlineLightningBolt className="text-2xl" />;
      case "bestvalue":
        return <HiOutlineGift className="text-2xl" />;
      case "premium":
        return <HiOutlineStar className="text-2xl" />;
      default:
        return <HiOutlineCreditCard className="text-2xl" />;
    }
  };

  const getPackageColor = (id) => {
    switch (id) {
      case "starter":
        return "from-blue-500 to-blue-600";
      case "popular":
        return "from-purple-500 to-purple-600";
      case "bestvalue":
        return "from-emerald-500 to-emerald-600";
      case "premium":
        return "from-amber-500 to-amber-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-bold mb-4">
            <HiOutlineSparkles /> Store Credits
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Credit Store
          </h1>
          <p className="text-gray-500 max-w-lg mx-auto">
            Purchase credits to use for your orders. Get bonus credits on larger
            packages!
          </p>
        </div>

        {/* Credit Balance Card */}
        <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 rounded-3xl p-8 md:p-10 mb-12 shadow-2xl shadow-purple-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <p className="text-purple-200 text-sm font-bold uppercase tracking-wider mb-2">
                  Your Credit Balance
                </p>
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl md:text-6xl font-black text-white">
                    {balance.toLocaleString()}
                  </span>
                  <span className="text-purple-200 font-bold text-xl">
                    credits
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 flex items-center gap-3">
                  <HiOutlineShieldCheck className="text-3xl text-green-400" />
                  <div>
                    <p className="text-white/80 text-xs">Secured</p>
                    <p className="text-white font-bold">Balance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Credit Packages */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
            <HiOutlineGift className="text-purple-600" />
            Credit Packages
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                onClick={() => handlePurchase(pkg)}
                className={`relative bg-white rounded-3xl p-6 border-2 transition-all cursor-pointer hover:shadow-xl hover:-translate-y-1 ${
                  selectedPackage?.id === pkg.id
                    ? "border-purple-500 shadow-lg shadow-purple-500/10"
                    : "border-gray-100 hover:border-purple-200"
                }`}
              >
                {pkg.id === "bestvalue" && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                    BEST VALUE
                  </div>
                )}
                {pkg.id === "popular" && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                    POPULAR
                  </div>
                )}

                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getPackageColor(
                    pkg.id,
                  )} flex items-center justify-center text-white mb-4 shadow-lg`}
                >
                  {getPackageIcon(pkg.id)}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {pkg.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-black text-gray-900">
                    ${pkg.price}
                  </span>
                  <span className="text-gray-400 text-sm">USD</span>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <HiCheckCircle className="text-green-500" />
                    <span className="font-bold text-gray-900">
                      {pkg.credits.toLocaleString()} credits
                    </span>
                  </div>
                  {pkg.bonus > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      <HiCheckCircle className="text-purple-500" />
                      <span className="text-purple-600 font-bold">
                        +{pkg.bonus}% bonus included
                      </span>
                    </div>
                  )}
                </div>

                <button
                  className={`w-full py-3 rounded-xl font-bold transition-all ${
                    selectedPackage?.id === pkg.id
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-purple-100 hover:text-purple-700"
                  }`}
                >
                  {selectedPackage?.id === pkg.id ? "Selected" : "Select"}
                </button>
              </div>
            ))}
          </div>

          {/* Purchase Confirmation */}
          {selectedPackage && (
            <div className="mt-8 bg-white rounded-3xl p-8 border border-gray-100 shadow-xl animate-fadeIn">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <p className="text-gray-500 text-sm mb-1">
                    You're purchasing:
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {selectedPackage.name} Package
                  </p>
                  <p className="text-purple-600 font-bold">
                    {selectedPackage.credits.toLocaleString()} credits for $
                    {selectedPackage.price}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedPackage(null)}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmPurchase}
                    disabled={isLoading}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-bold hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isLoading ? (
                      <span className="animate-pulse">Processing...</span>
                    ) : (
                      <>
                        <HiOutlineCreditCard /> Confirm Purchase
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Transaction History */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
            <HiOutlineClock className="text-purple-600" />
            Recent Transactions
          </h2>

          {transactions.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiOutlineClock className="text-3xl text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No transactions yet</p>
              <p className="text-gray-400 text-sm">
                Your credit activity will appear here
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
              <div className="divide-y divide-gray-50">
                {transactions.map((tx, idx) => (
                  <div
                    key={tx.id || idx}
                    className="p-5 flex items-center justify-between hover:bg-gray-50 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          tx.type === "credit"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {tx.type === "credit" ? (
                          <HiOutlineArrowUp className="text-xl" />
                        ) : (
                          <HiOutlineArrowDown className="text-xl" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">
                          {tx.description}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {formatDate(tx.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`text-lg font-bold ${
                        tx.type === "credit" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {tx.type === "credit" ? "+" : "-"}
                      {tx.amount.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreditStore;
