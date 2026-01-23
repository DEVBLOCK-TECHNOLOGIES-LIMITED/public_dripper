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
import { loadStripe } from "@stripe/stripe-js"; // [NEW]
import { Elements } from "@stripe/react-stripe-js"; // [NEW]
import StripePaymentForm from "../components/StripePaymentForm"; // [NEW]
import axios from "axios"; // [NEW]

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

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY); // [NEW]

function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const cartItems = user?.data?.cart || [];
  const creditBalance = 0;
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

  // [NEW] Stripe Logic
  const [clientSecret, setClientSecret] = useState("");

  const cartSubtotal =
    cartItems?.reduce((total, item) => total + parseFloat(item.price), 0) || 0;

  // Dynamic calculations including shipping cost
  const finalTotal = cartSubtotal + shippingCost;

  useEffect(() => {
    if (finalTotal > 0) {
      // Create PaymentIntent as soon as we have a valid total
      axios
        .post(
          `${process.env.REACT_APP_API_URL || "http://localhost:3001"}/api/create-payment-intent`,
          {
            amount: finalTotal,
            currency: "usd",
          },
        )
        .then((res) => setClientSecret(res.data.clientSecret))
        .catch((err) => console.error("Error creating payment intent", err));
    }
  }, [finalTotal]);

  const handleStripeSuccess = async (paymentIntent) => {
    // Replicate onSubmit logic but using the confirmed payment
    const shippingAddress = getShippingAddress();
    const orderData = {
      email: user.data.email,
      items: cartItems,
      total: finalTotal,
      shippingAddress,
      paymentMethod: "Stripe", // updated
      paymentIntentId: paymentIntent.id,
    };

    const idempotencyKey = generateUUID();

    // Save address if needed
    if (selectedAddressIndex === -1 && saveAddress) {
      dispatch(
        addAddress({
          email: user.data.email,
          address: shippingAddress,
        }),
      );
    }

    dispatch(createOrder({ orderData, idempotencyKey }));
  };

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
    const finalTotal = totalWithShipping;

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

    dispatch(createOrder({ orderData, idempotencyKey }));
  };

  return (
    <div className="min-h-screen bg-noir-900 py-12 px-4 selection:bg-gold-500/30">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-display text-4xl font-bold text-champagne-100">
              Secure Checkout
            </h1>
            <p className="text-champagne-400 text-sm mt-1 flex items-center gap-1">
              <HiOutlineLockClosed className="text-gold-500" /> Encrypted &
              Authenticated
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-gold-600 font-bold text-sm bg-gold-500/10 px-4 py-2 rounded-full border border-gold-500/20">
            <HiOutlineShieldCheck className="text-xl" /> Guaranteed Authenticity
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-10"
        >
          <div className="lg:col-span-2 space-y-8">
            {/* Step 1: Shipping */}
            <div className="bg-noir-800/50 p-8 rounded-3xl border border-gold-500/10 shadow-lg backdrop-blur-sm animate-fade-in-up">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 bg-gold-500 text-noir-900 rounded-xl flex items-center justify-center font-bold shadow-lg shadow-gold-500/20">
                  1
                </div>
                <h2 className="font-display text-xl font-bold flex items-center gap-2 text-champagne-100">
                  <HiOutlineLocationMarker className="text-gold-500" /> Shipping
                  Destination
                </h2>
              </div>

              {/* Saved Addresses List */}
              {user?.data?.addresses?.length > 0 && (
                <div className="grid grid-cols-1 gap-4 mb-6">
                  {user.data.addresses.map((addr, idx) => (
                    <div
                      key={addr.id || idx}
                      onClick={() => setSelectedAddressIndex(idx)}
                      className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                        selectedAddressIndex === idx
                          ? "border-gold-500 bg-gold-500/10 shadow-[0_0_15px_rgba(234,179,8,0.1)]"
                          : "border-gold-500/20 hover:border-gold-500/50 bg-noir-900/50"
                      }`}
                    >
                      <div>
                        <p className="font-bold text-sm text-champagne-100">
                          {addr.address}
                        </p>
                        <p className="text-xs text-champagne-400">
                          {addr.city}, {addr.state} {addr.zipCode}
                        </p>
                      </div>
                      {selectedAddressIndex === idx && (
                        <HiCheckCircle className="text-2xl text-gold-500" />
                      )}
                    </div>
                  ))}

                  {/* Option to use new address */}
                  <div
                    onClick={() => setSelectedAddressIndex(-1)}
                    className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                      selectedAddressIndex === -1
                        ? "border-gold-500 bg-gold-500/10 shadow-[0_0_15px_rgba(234,179,8,0.1)]"
                        : "border-gold-500/20 hover:border-gold-500/50 bg-noir-900/50"
                    }`}
                  >
                    <p className="font-bold text-sm text-champagne-100">
                      + Use a different address
                    </p>
                    {selectedAddressIndex === -1 && (
                      <HiCheckCircle className="text-2xl text-gold-500" />
                    )}
                  </div>
                </div>
              )}

              {/* New Address Form */}
              {selectedAddressIndex === -1 && (
                <div className="space-y-6 animate-fade-in-up">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="text-xs font-black uppercase text-gold-500/70 tracking-widest mb-2 block">
                        Street Address
                      </label>
                      <input
                        required={selectedAddressIndex === -1}
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={onChange}
                        placeholder="e.g. 24 Luxury Avenue"
                        className="w-full px-5 py-4 bg-noir-900/50 border border-gold-500/20 rounded-2xl focus:border-gold-500 focus:ring-1 focus:ring-gold-500/50 transition-all outline-none text-sm font-medium text-champagne-100 placeholder:text-champagne-500/50"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-black uppercase text-gold-500/70 tracking-widest mb-2 block">
                        City / Town
                      </label>
                      <input
                        required={selectedAddressIndex === -1}
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={onChange}
                        className="w-full px-5 py-4 bg-noir-900/50 border border-gold-500/20 rounded-2xl focus:border-gold-500 focus:ring-1 focus:ring-gold-500/50 transition-all outline-none text-sm font-medium text-champagne-100 placeholder:text-champagne-500/50"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-black uppercase text-gold-500/70 tracking-widest mb-2 block">
                          State
                        </label>
                        <input
                          required={selectedAddressIndex === -1}
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={onChange}
                          className="w-full px-5 py-4 bg-noir-900/50 border border-gold-500/20 rounded-2xl focus:border-gold-500 focus:ring-1 focus:ring-gold-500/50 transition-all outline-none text-sm font-medium text-champagne-100 placeholder:text-champagne-500/50"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-black uppercase text-gold-500/70 tracking-widest mb-2 block">
                          ZIP
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={onChange}
                          className="w-full px-5 py-4 bg-noir-900/50 border border-gold-500/20 rounded-2xl focus:border-gold-500 focus:ring-1 focus:ring-gold-500/50 transition-all outline-none text-sm font-medium text-champagne-100 placeholder:text-champagne-500/50"
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
                      className="w-5 h-5 accent-gold-500 rounded-lg cursor-pointer bg-noir-900 border-gold-500/30"
                    />
                    <label
                      htmlFor="saveAddress"
                      className="text-sm font-bold text-champagne-300 cursor-pointer"
                    >
                      Save this address for later
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: Payment */}
            <div className="bg-noir-800/50 p-8 rounded-3xl border border-gold-500/10 shadow-lg backdrop-blur-sm animate-fade-in-up delay-[200ms]">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 bg-gold-500 text-noir-900 rounded-xl flex items-center justify-center font-bold shadow-lg shadow-gold-500/20">
                  2
                </div>
                <h2 className="font-display text-xl font-bold flex items-center gap-2 text-champagne-100">
                  <HiOutlineCreditCard className="text-gold-500" /> Payment
                  Method
                </h2>
              </div>
              {/* Saved Cards List */}
              {user?.data?.paymentMethods?.length > 0 && (
                <div className="grid grid-cols-1 gap-4 mb-6">
                  {user.data.paymentMethods.map((card, idx) => (
                    <div
                      key={card.id || idx}
                      onClick={() => setSelectedCardIndex(idx)}
                      className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                        selectedCardIndex === idx
                          ? "border-gold-500 bg-gold-500/10 shadow-[0_0_15px_rgba(234,179,8,0.1)]"
                          : "border-gold-500/20 hover:border-gold-500/50 bg-noir-900/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-5 bg-champagne-200 rounded flex items-center justify-center text-[10px] font-bold text-noir-900">
                          {card.type === "visa" ? "VISA" : "CARD"}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-champagne-100">
                            {card.name}
                          </p>
                          <p className="text-xs text-champagne-400">
                            •••• •••• •••• {card.last4 || card.number.slice(-4)}
                          </p>
                        </div>
                      </div>
                      {selectedCardIndex === idx && (
                        <HiCheckCircle className="text-2xl text-gold-500" />
                      )}
                    </div>
                  ))}

                  {/* Option to use new card */}
                  <div
                    onClick={() => setSelectedCardIndex(-1)}
                    className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                      selectedCardIndex === -1
                        ? "border-gold-500 bg-gold-500/10 shadow-[0_0_15px_rgba(234,179,8,0.1)]"
                        : "border-gold-500/20 hover:border-gold-500/50 bg-noir-900/50"
                    }`}
                  >
                    <p className="font-bold text-sm text-champagne-100">
                      + Add a new card
                    </p>
                    {selectedCardIndex === -1 && (
                      <HiCheckCircle className="text-2xl text-gold-500" />
                    )}
                  </div>
                </div>
              )}

              {/* Payment Section - Replaced with Stripe */}
              {selectedCardIndex === -1 && (
                <div className="space-y-6 animate-fade-in-up">
                  {clientSecret && (
                    <Elements
                      options={{
                        clientSecret,
                        appearance: { theme: "night", labels: "floating" },
                      }}
                      stripe={stripePromise}
                    >
                      <StripePaymentForm
                        amount={finalTotal}
                        onSuccess={handleStripeSuccess}
                      />
                    </Elements>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-noir-800/50 p-8 rounded-3xl border border-gold-500/10 shadow-xl h-fit sticky top-28 backdrop-blur-sm animate-fade-in-up delay-[300ms]">
              <h2 className="font-display text-xl font-bold mb-6 text-champagne-100">
                Order Summary
              </h2>
              <div className="space-y-4 mb-8 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                {cartItems?.map((item, idx) => (
                  <div key={idx} className="flex gap-4 group">
                    <div className="w-16 h-16 bg-noir-900 rounded-2xl flex items-center justify-center p-2 border border-gold-500/10 group-hover:border-gold-500/30 transition-all">
                      <img
                        src={item.image}
                        className="max-w-full max-h-full object-contain"
                        alt=""
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <p className="font-bold text-sm text-champagne-100 leading-tight mb-1 truncate w-40">
                        {item.name}
                      </p>
                      <p className="text-gold-500 font-bold text-xs">
                        ${item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-gold-500/10 pt-6">
                <div className="flex justify-between text-champagne-400 text-sm">
                  <span>Subtotal</span>
                  <span className="font-bold text-champagne-100">
                    ${cartSubtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-champagne-400 text-sm">
                  <span>Shipping</span>
                  {isShippingLoading ? (
                    <span className="text-champagne-500 italic">
                      Calculating...
                    </span>
                  ) : (
                    <span className="text-champagne-100 font-bold">
                      {shippingCost === 0
                        ? "FREE"
                        : `$${shippingCost.toFixed(2)}`}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between gap-4 pt-6 border-t border-gold-500/10 mt-4">
                  <div className="flex flex-col">
                    <span className="text-2xl font-display font-bold text-champagne-100">
                      Total
                    </span>
                    <span className="text-2xl font-black text-gold-500">
                      ${finalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Only show default submit button if NOT using Stripe (e.g. using saved card) */}
              {selectedCardIndex !== -1 && (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-gold-500 to-gold-600 text-noir-900 py-5 rounded-2xl font-black mt-10 hover:from-gold-400 hover:to-gold-500 transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 shadow-lg shadow-gold-500/20 disabled:opacity-50"
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
              )}

              {selectedCardIndex === -1 && (
                <p className="text-center text-champagne-400 mt-6 text-sm">
                  Please enter your card details in the Payment section above to
                  complete your purchase.
                </p>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Checkout;
