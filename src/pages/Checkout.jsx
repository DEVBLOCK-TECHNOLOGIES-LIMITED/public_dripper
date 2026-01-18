import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { generateUUID } from "../utils/idempotency";
import {
  createOrder,
  reset as resetOrder,
} from "../features/orders/orderSlice";
import { addAddress, addCard } from "../features/auth/authSlice";
import { getCart } from "../features/cart/cartSlice";
import { getShippingFee } from "../features/shipping/shippingSlice";
import { spendCredits, rewardCredits } from "../features/credits/creditsSlice";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import {
  HiOutlineLocationMarker,
  HiOutlineCreditCard,
  HiOutlineCalendar,
  HiOutlineLockClosed,
  HiOutlineShieldCheck,
  HiCheckCircle,
  HiOutlineSparkles,
} from "react-icons/hi";
import { FaCoins } from "react-icons/fa";
import {
  dollarToCredits,
  calculateCreditDiscount,
  calculateEarnedCredits,
  formatCredits,
} from "../utils/creditConfig";

function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const cartItems = user?.data?.cart || [];
  const creditBalance = user?.data?.balance || 0;
  const { isLoading, isSuccess } = useSelector((state) => state.orders);
  const { shippingFee: backendShippingFee, isLoading: isShippingLoading } =
    useSelector((state) => state.shippingFee);

  // Form Data for NEW entries
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    state: "",
    zipCode: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    cardName: "",
  });

  // Logic States
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(-1); // -1 means "New Address"
  const [selectedCardIndex, setSelectedCardIndex] = useState(-1); // -1 means "New Card"
  const [saveAddress, setSaveAddress] = useState(false);
  const [saveCard, setSaveCard] = useState(false);
  const [payWithCredits, setPayWithCredits] = useState(false);
  const [shippingCost, setShippingCost] = useState(0);

  // Initialize selection based on existing user data
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Default to first saved address if available
    if (user?.data?.addresses?.length > 0) {
      setSelectedAddressIndex(0);
    } else {
      setSelectedAddressIndex(-1);
    }

    // Default to first saved card if available
    if (user?.data?.paymentMethods?.length > 0) {
      setSelectedCardIndex(0);
    } else {
      setSelectedCardIndex(-1);
    }
  }, [user, navigate]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(resetOrder());
      navigate("/order-success");
      dispatch(getCart({ email: user?.data?.email }));
    }
  }, [isSuccess, navigate, dispatch, user]);

  // Dynamic Shipping Fee Fetching
  useEffect(() => {
    // Logic inlined to avoid adding getShippingAddress to dependencies
    let currentState = formData.state;
    if (
      selectedAddressIndex !== -1 &&
      user?.data?.addresses?.[selectedAddressIndex]
    ) {
      currentState = user.data.addresses[selectedAddressIndex].state;
    }

    if (currentState && cartItems?.length > 0) {
      dispatch(
        getShippingFee({
          originState: "ogun",
          destinationState: currentState,
          itemsCount: cartItems.length,
        }),
      );
    }
  }, [selectedAddressIndex, formData.state, user, cartItems?.length, dispatch]);

  useEffect(() => {
    if (backendShippingFee?.data?.shippingFee !== undefined) {
      setShippingCost(backendShippingFee.data.shippingFee);
    }
  }, [backendShippingFee]);

  const onChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const getShippingAddress = () => {
    if (
      selectedAddressIndex !== -1 &&
      user?.data?.addresses?.[selectedAddressIndex]
    ) {
      const saved = user.data.addresses[selectedAddressIndex];
      return {
        address: saved.address,
        city: saved.city,
        state: saved.state,
        zipCode: saved.zipCode || "", // Handle missing zip if legacy data
      };
    }
    return {
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
    };
  };

  const getPaymentMethod = () => {
    if (payWithCredits) {
      return "Store Credits";
    }
    if (
      selectedCardIndex !== -1 &&
      user?.data?.paymentMethods?.[selectedCardIndex]
    ) {
      const card = user.data.paymentMethods[selectedCardIndex];
      return `Saved Card: ${card.name} ending in ${
        card.last4 || card.number.slice(-4)
      }`;
    }
    return "Card (Simulated)";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (cartItems?.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    // Calculate totals using dynamic credit config
    const subtotal =
      cartItems?.reduce((t, i) => t + parseFloat(i.price), 0) || 0;
    const totalWithShipping = subtotal + shippingCost;
    const creditDiscount = payWithCredits
      ? calculateCreditDiscount(subtotal, true)
      : 0;
    const finalTotal = totalWithShipping - creditDiscount;
    const creditsNeeded = dollarToCredits(finalTotal);

    if (payWithCredits && creditBalance < creditsNeeded) {
      toast.error(
        `Insufficient credits. You need ${formatCredits(
          creditsNeeded,
        )} credits but have ${formatCredits(creditBalance)}.`,
      );
      return;
    }

    const shippingAddress = getShippingAddress();
    const orderData = {
      email: user.data.email,
      items: cartItems,
      total: finalTotal,
      shippingAddress,
      paymentMethod: getPaymentMethod(),
    };

    const idempotencyKey = generateUUID();

    // Handle "Save for later" Logic
    if (selectedAddressIndex === -1 && saveAddress) {
      dispatch(
        addAddress({
          email: user.data.email,
          address: shippingAddress,
        }),
      );
    }

    if (selectedCardIndex === -1 && saveCard) {
      dispatch(
        addCard({
          email: user.data.email,
          card: {
            name: formData.cardName || "My Card",
            number: formData.cardNumber,
            expiry: formData.expiry,
            cvv: formData.cvv,
            type: "visa", // simplified
          },
        }),
      );
    }

    // Spend credits if paying with credits
    if (payWithCredits) {
      try {
        await dispatch(
          spendCredits({
            email: user.data.email,
            amount: creditsNeeded,
            description: `Order payment - ${cartItems.length} items`,
          }),
        ).unwrap();
      } catch (error) {
        toast.error("Failed to process credits payment");
        return;
      }
    } else {
      // Award loyalty credits if paying with money
      try {
        dispatch(
          rewardCredits({
            email: user.data.email,
            amount: creditsToEarn,
            description: `Loyalty reward - Order with ${cartItems.length} items`,
          }),
        );
      } catch (error) {
        console.error("Failed to award loyalty credits", error);
      }
    }

    dispatch(createOrder({ orderData, idempotencyKey }));
  };

  const cartSubtotal =
    cartItems?.reduce((total, item) => total + parseFloat(item.price), 0) || 0;

  // Dynamic calculations including shipping cost
  const creditDiscount = payWithCredits
    ? calculateCreditDiscount(cartSubtotal, true)
    : 0;
  const finalTotal = cartSubtotal + shippingCost - creditDiscount;
  const creditsNeeded = dollarToCredits(finalTotal);
  const creditsToEarn = calculateEarnedCredits(cartSubtotal);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 selection:bg-purple-100">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Checkout</h1>
            <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
              <HiOutlineLockClosed /> Secure encrypted payment
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-green-600 font-bold text-sm bg-green-50 px-4 py-2 rounded-full">
            <HiOutlineShieldCheck className="text-xl" /> Guaranteed Safe
            Checkout
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-10"
        >
          <div className="lg:col-span-2 space-y-8">
            {/* Step 1: Shipping */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 bg-purple-600 text-white rounded-xl flex items-center justify-center font-bold shadow-lg shadow-purple-200">
                  1
                </div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <HiOutlineLocationMarker className="text-purple-600" />{" "}
                  Shipping Information
                </h2>
              </div>

              {/* Saved Addresses List */}
              {user?.data?.addresses?.length > 0 && (
                <div className="grid grid-cols-1 gap-4 mb-6">
                  {user.data.addresses.map((addr, idx) => (
                    <div
                      key={addr.id || idx}
                      onClick={() => setSelectedAddressIndex(idx)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                        selectedAddressIndex === idx
                          ? "border-purple-600 bg-purple-50"
                          : "border-gray-100 hover:border-purple-200"
                      }`}
                    >
                      <div>
                        <p className="font-bold text-sm text-gray-900">
                          {addr.address}
                        </p>
                        <p className="text-xs text-gray-500">
                          {addr.city}, {addr.state} {addr.zipCode}
                        </p>
                      </div>
                      {selectedAddressIndex === idx && (
                        <HiCheckCircle className="text-2xl text-purple-600" />
                      )}
                    </div>
                  ))}

                  {/* Option to use new address */}
                  <div
                    onClick={() => setSelectedAddressIndex(-1)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                      selectedAddressIndex === -1
                        ? "border-purple-600 bg-purple-50"
                        : "border-gray-100 hover:border-purple-200"
                    }`}
                  >
                    <p className="font-bold text-sm text-gray-900">
                      + Use a different address
                    </p>
                    {selectedAddressIndex === -1 && (
                      <HiCheckCircle className="text-2xl text-purple-600" />
                    )}
                  </div>
                </div>
              )}

              {/* New Address Form - Only show if "Use different address" or no saved addresses */}
              {selectedAddressIndex === -1 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="text-xs font-black uppercase text-gray-400 tracking-widest mb-2 block">
                        Street Address
                      </label>
                      <input
                        required={selectedAddressIndex === -1}
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={onChange}
                        placeholder="e.g. 24 Luxury Avenue"
                        className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all outline-none text-sm font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-black uppercase text-gray-400 tracking-widest mb-2 block">
                        City / Town
                      </label>
                      <input
                        required={selectedAddressIndex === -1}
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={onChange}
                        className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all outline-none text-sm font-medium"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-black uppercase text-gray-400 tracking-widest mb-2 block">
                          State
                        </label>
                        <input
                          required={selectedAddressIndex === -1}
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={onChange}
                          className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all outline-none text-sm font-medium"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-black uppercase text-gray-400 tracking-widest mb-2 block">
                          ZIP
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={onChange}
                          className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all outline-none text-sm font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-4">
                    <input
                      type="checkbox"
                      id="saveAddress"
                      checked={saveAddress}
                      onChange={(e) => setSaveAddress(e.target.checked)}
                      className="w-5 h-5 accent-purple-600 rounded-lg cursor-pointer"
                    />
                    <label
                      htmlFor="saveAddress"
                      className="text-sm font-bold text-gray-700 cursor-pointer"
                    >
                      Save this address for later
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: Payment */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 bg-purple-600 text-white rounded-xl flex items-center justify-center font-bold shadow-lg shadow-purple-200">
                  2
                </div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <HiOutlineCreditCard className="text-purple-600" /> Payment
                  Method
                </h2>
              </div>

              {/* Pay with Credits Option */}
              <div className="mb-6">
                <div
                  onClick={() => setPayWithCredits(!payWithCredits)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    payWithCredits
                      ? "border-amber-500 bg-gradient-to-r from-amber-50 to-yellow-50"
                      : "border-gray-100 hover:border-amber-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          payWithCredits
                            ? "bg-amber-500 text-white"
                            : "bg-amber-100 text-amber-600"
                        }`}
                      >
                        <FaCoins className="text-lg" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 flex items-center gap-2">
                          Pay with Credits
                          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                            {formatCredits(creditBalance)} available
                          </span>
                        </p>
                        <p className="text-xs text-gray-500">
                          Use your store credits for this purchase (
                          {formatCredits(creditsNeeded)} credits needed)
                          {payWithCredits && (
                            <span className="ml-1 text-green-600 font-bold">
                              (5% discount applied)
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    {payWithCredits && (
                      <HiCheckCircle className="text-2xl text-amber-500" />
                    )}
                  </div>
                  {payWithCredits && creditBalance < creditsNeeded && (
                    <div className="mt-3 p-3 bg-red-50 rounded-xl border border-red-100">
                      <p className="text-red-600 text-sm font-medium flex items-center gap-2">
                        <HiOutlineSparkles /> Insufficient credits! You need{" "}
                        {formatCredits(creditsNeeded - creditBalance)} more
                        credits.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {!payWithCredits && (
                <>
                  {/* Saved Cards List */}
                  {user?.data?.paymentMethods?.length > 0 && (
                    <div className="grid grid-cols-1 gap-4 mb-6">
                      {user.data.paymentMethods.map((card, idx) => (
                        <div
                          key={card.id || idx}
                          onClick={() => setSelectedCardIndex(idx)}
                          className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                            selectedCardIndex === idx
                              ? "border-purple-600 bg-purple-50"
                              : "border-gray-100 hover:border-purple-200"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-5 bg-gray-200 rounded flex items-center justify-center text-[10px] font-bold text-gray-500">
                              {card.type === "visa" ? "VISA" : "CARD"}
                            </div>
                            <div>
                              <p className="font-bold text-sm text-gray-900">
                                {card.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                •••• •••• ••••{" "}
                                {card.last4 || card.number.slice(-4)}
                              </p>
                            </div>
                          </div>
                          {selectedCardIndex === idx && (
                            <HiCheckCircle className="text-2xl text-purple-600" />
                          )}
                        </div>
                      ))}

                      {/* Option to use new card */}
                      <div
                        onClick={() => setSelectedCardIndex(-1)}
                        className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                          selectedCardIndex === -1
                            ? "border-purple-600 bg-purple-50"
                            : "border-gray-100 hover:border-purple-200"
                        }`}
                      >
                        <p className="font-bold text-sm text-gray-900">
                          + Add a new card
                        </p>
                        {selectedCardIndex === -1 && (
                          <HiCheckCircle className="text-2xl text-purple-600" />
                        )}
                      </div>
                    </div>
                  )}

                  {selectedCardIndex === -1 && (
                    <div className="space-y-6 animate-fadeIn">
                      <div className="relative">
                        <label className="text-xs font-black uppercase text-gray-400 tracking-widest mb-2 block">
                          Name on Card
                        </label>
                        <input
                          required={selectedCardIndex === -1}
                          type="text"
                          name="cardName"
                          value={formData.cardName}
                          onChange={onChange}
                          placeholder="e.g. John Doe"
                          className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all outline-none text-sm font-medium"
                        />
                      </div>

                      <div className="relative">
                        <label className="text-xs font-black uppercase text-gray-400 tracking-widest mb-2 block">
                          Card Number
                        </label>
                        <div className="relative">
                          <input
                            required={selectedCardIndex === -1}
                            type="text"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={onChange}
                            placeholder="0000 0000 0000 0000"
                            className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all outline-none text-sm font-medium pr-14"
                          />
                          <HiOutlineCreditCard className="absolute right-5 top-1/2 -translate-y-1/2 text-2xl text-gray-400" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="relative">
                          <label className="text-xs font-black uppercase text-gray-400 tracking-widest mb-2 block">
                            Expiration
                          </label>
                          <div className="relative">
                            <input
                              required={selectedCardIndex === -1}
                              type="text"
                              name="expiry"
                              value={formData.expiry}
                              onChange={onChange}
                              placeholder="MM/YY"
                              className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all outline-none text-sm font-medium pr-12"
                            />
                            <HiOutlineCalendar className="absolute right-5 top-1/2 -translate-y-1/2 text-xl text-gray-400" />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-black uppercase text-gray-400 tracking-widest mb-2 block">
                            CVV
                          </label>
                          <input
                            required={selectedCardIndex === -1}
                            type="password"
                            name="cvv"
                            value={formData.cvv}
                            onChange={onChange}
                            placeholder="***"
                            className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all outline-none text-sm font-medium"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-4">
                        <input
                          type="checkbox"
                          id="saveCard"
                          checked={saveCard}
                          onChange={(e) => setSaveCard(e.target.checked)}
                          className="w-5 h-5 accent-purple-600 rounded-lg cursor-pointer"
                        />
                        <label
                          htmlFor="saveCard"
                          className="text-sm font-bold text-gray-700 cursor-pointer"
                        >
                          Save this card for later
                        </label>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl h-fit sticky top-28">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              <div className="space-y-4 mb-8 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                {cartItems?.map((item, idx) => (
                  <div key={idx} className="flex gap-4 group">
                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center p-2 border border-transparent group-hover:border-purple-100 transition-all">
                      <img
                        src={item.image}
                        className="max-w-full max-h-full object-contain mix-blend-multiply"
                        alt=""
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <p className="font-bold text-sm text-gray-900 leading-tight mb-1 truncate w-40">
                        {item.name}
                      </p>
                      <p className="text-purple-600 font-bold text-xs">
                        ${item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t pt-6">
                <div className="flex justify-between text-gray-500 text-sm">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">
                    ${cartSubtotal.toFixed(2)}
                  </span>
                </div>
                {payWithCredits && (
                  <div className="flex justify-between text-green-600 text-sm font-bold">
                    <span>Credit Discount (5%)</span>
                    <span>-${creditDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-500 text-sm">
                  <span>Shipping</span>
                  {isShippingLoading ? (
                    <span className="text-gray-400 italic">Calculating...</span>
                  ) : (
                    <span className="text-gray-900 font-bold">
                      {shippingCost === 0
                        ? "FREE"
                        : `$${shippingCost.toFixed(2)}`}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between gap-4 pt-6 border-t mt-4">
                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-gray-900">
                      Total
                    </span>
                    {!payWithCredits && (
                      <span className="text-[10px] text-amber-600 font-bold flex items-center gap-1">
                        <HiOutlineSparkles /> Earn{" "}
                        {formatCredits(creditsToEarn)} credits
                      </span>
                    )}
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="text-2xl font-black text-purple-600">
                      {payWithCredits
                        ? `${formatCredits(creditsNeeded)}`
                        : `$${finalTotal.toFixed(2)}`}
                    </span>
                    {payWithCredits && (
                      <span className="text-xs font-bold text-gray-400">
                        Credits
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white py-5 rounded-2xl font-black mt-10 hover:bg-gray-800 transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 shadow-2xl shadow-black/10 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader size="sm" />
                ) : (
                  <>
                    Complete Purchase{" "}
                    <HiOutlineLockClosed className="text-xl" />
                  </>
                )}
              </button>

              <p className="text-[10px] text-gray-400 text-center mt-6 selection:bg-none">
                By completing your purchase you agree to our Terms of Service.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Checkout;
