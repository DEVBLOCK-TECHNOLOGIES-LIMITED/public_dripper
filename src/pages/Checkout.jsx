import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { generateUUID } from "../utils/idempotency";
import {
  createOrder,
  reset as resetOrder,
} from "../features/orders/orderSlice";
import { addAddress } from "../features/auth/authSlice";
import { getCart } from "../features/cart/cartSlice";
import { getShippingFee } from "../features/shipping/shippingSlice";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
  ExpressCheckoutElement,
} from "@stripe/react-stripe-js";

import axios from "axios";
import uri from "../features/config";

import Loader from "../components/Loader";
import { useToast } from "../context/ToastContext";
import { formatPrice } from "../utils/formatPrice";
import {
  HiOutlineLocationMarker,
  HiOutlineCreditCard,
  HiOutlineLockClosed,
  HiOutlineShieldCheck,
  HiCheckCircle,
  HiOutlineTruck,
} from "react-icons/hi";

// Delivery options configuration
const DELIVERY_OPTIONS = [
  {
    id: "standard",
    name: "Standard Delivery",
    description: "5 working days from purchase date",
    price: 0,
    icon: "📦",
  },
  {
    id: "premium",
    name: "Premium Delivery",
    description: "1-3 working days",
    price: 10,
    icon: "🚀",
  },
];

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

// --- Inner Component: Handles UI and Submission ---
function CheckoutForm({
  formData,
  setFormData,
  selectedAddressIndex,
  setSelectedAddressIndex,
  selectedCardIndex,
  setSelectedCardIndex,
  saveAddress,
  setSaveAddress,
  saveCard,
  setSaveCard,
  cartItems,
  cartSubtotal,
  shippingCost,
  deliveryOption,
  setDeliveryOption,
  deliveryFee,
  finalTotal,
  isShippingLoading,
  isLoadingOrder,
  user,
  clientSecret,
  // [NEW]
  stripeCards,
  selectedStripeCard,
  setSelectedStripeCard,
}) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const dispatch = useDispatch();
  const [isProcessing, setIsProcessing] = useState(false); // Local loading for Stripe

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
        zipCode: saved.zipCode || "",
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
    if (selectedStripeCard) {
      const card = stripeCards.find((c) => c.id === selectedStripeCard);
      return card ? `Saved Card (** ${card.last4})` : "Saved Card";
    }
    return "Stripe";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (cartItems?.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const shippingAddress = getShippingAddress();
    const idempotencyKey = generateUUID();
    let paymentIntentId = null;

    // --- STRIPE PAYMENT REQUIRED ---
    if (!stripe || !elements) {
      toast.error("Payment system not loaded. Please refresh the page.");
      return;
    }

    setIsProcessing(true);

    let paymentIntentObj = null;

    // Retrieve intent status first
    const { paymentIntent: retrievedIntent, error: retrieveError } =
      await stripe.retrievePaymentIntent(clientSecret);

    if (retrieveError) {
      toast.error(retrieveError.message);
      setIsProcessing(false);
      return;
    }

    if (retrievedIntent.status === "succeeded") {
      // Already done (rare scenario)
      paymentIntentObj = retrievedIntent;
    } else {
      // Needs confirmation (New Card OR Saved Card requiring 3DS)
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-success`,
        },
        redirect: "if_required",
      });

      if (error) {
        toast.error(error.message);
        setIsProcessing(false);
        return;
      }
      paymentIntentObj = paymentIntent;
    }

    if (!paymentIntentObj || paymentIntentObj.status !== "succeeded") {
      toast.error(
        "Payment not completed. Status: " +
          (paymentIntentObj?.status || "unknown"),
      );
      setIsProcessing(false);
      return;
    }

    paymentIntentId = paymentIntentObj.id;

    // --- SAVE DATA (Address) ---
    if (selectedAddressIndex === -1 && saveAddress) {
      dispatch(
        addAddress({
          email: user.data.email,
          address: shippingAddress,
        }),
      );
    }

    // --- CREATE ORDER (only after successful payment) ---
    const orderData = {
      email: user.data.email,
      items: cartItems,
      total: finalTotal,
      shippingAddress,
      paymentMethod: getPaymentMethod(),
      paymentIntentId,
    };

    dispatch(createOrder({ orderData, idempotencyKey }));
    setIsProcessing(false);
  };

  const isLoading = isLoadingOrder || isProcessing;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2 space-y-8">
        {/* Step 1: Shipping */}
        <div className="bg-noir-800/50 p-8 rounded-3xl border border-gold-500/10 shadow-lg backdrop-blur-sm animate-fade-in-up">
          {/* ... (Shipping Section Unchanged) ... */}
          {/* Note: I will need to be careful with replacement to not delete Shipping UI */}
          {/* I will only replace Step 2: Payment */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 bg-gold-500 text-noir-900 rounded-xl flex items-center justify-center font-bold shadow-lg shadow-gold-500/20">
              1
            </div>
            <h2 className="font-display text-xl font-bold flex items-center gap-2 text-champagne-100">
              <HiOutlineLocationMarker className="text-gold-500" /> Shipping
              Destination
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 mb-6">
            {/* Existing Addresses */}
            {user?.data?.addresses?.map((addr, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedAddressIndex(idx)}
                className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                  selectedAddressIndex === idx
                    ? "border-gold-500 bg-gold-500/10 shadow-[0_0_15px_rgba(234,179,8,0.1)]"
                    : "border-gold-500/20 hover:border-gold-500/50 bg-noir-900/50"
                }`}
              >
                <div className="space-y-1">
                  <p className="font-bold text-sm text-champagne-100">
                    {user.data.firstName || "User"}'s Location {idx + 1}
                  </p>
                  <p className="text-xs text-champagne-400">
                    {addr.address}, {addr.city}, {addr.state} {addr.zipCode}
                  </p>
                </div>
                {selectedAddressIndex === idx && (
                  <HiCheckCircle className="text-2xl text-gold-500" />
                )}
              </div>
            ))}

            {/* New Address Option */}
            <div
              onClick={() => setSelectedAddressIndex(-1)}
              className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                selectedAddressIndex === -1
                  ? "border-gold-500 bg-gold-500/10 shadow-[0_0_15px_rgba(234,179,8,0.1)]"
                  : "border-gold-500/20 hover:border-gold-500/50 bg-noir-900/50"
              }`}
            >
              <p className="font-bold text-sm text-champagne-100">
                + Deliver to a new address
              </p>
              {selectedAddressIndex === -1 && (
                <HiCheckCircle className="text-2xl text-gold-500" />
              )}
            </div>
          </div>

          {/* New Address Form */}
          {selectedAddressIndex === -1 && (
            <div className="space-y-4 animate-fade-in-up">
              <div>
                <label className="text-xs font-bold text-gold-500 uppercase tracking-wider block mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={onChange}
                  className="w-full p-4 rounded-xl input-luxury text-base bg-noir-800 border-gold-500/30 text-champagne-100 placeholder:text-champagne-500/50"
                  placeholder="123 Luxury Lane"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gold-500 uppercase tracking-wider block mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={onChange}
                    className="w-full p-4 rounded-xl input-luxury text-base bg-noir-800 border-gold-500/30 text-champagne-100 placeholder:text-champagne-500/50"
                    placeholder="New York"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gold-500 uppercase tracking-wider block mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={onChange}
                    className="w-full p-4 rounded-xl input-luxury text-base bg-noir-800 border-gold-500/30 text-champagne-100 placeholder:text-champagne-500/50"
                    placeholder="NY"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gold-500 uppercase tracking-wider block mb-2">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={onChange}
                    className="w-full p-4 rounded-xl input-luxury text-base bg-noir-800 border-gold-500/30 text-champagne-100 placeholder:text-champagne-500/50"
                    placeholder="10001"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gold-500 uppercase tracking-wider block mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={onChange}
                    className="w-full p-4 rounded-xl input-luxury text-base bg-noir-800 border-gold-500/30 text-champagne-100 placeholder:text-champagne-500/50"
                    placeholder="+1 (555) 000-0000"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
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
                  Save this address for future use
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Step 2: Delivery Options */}
        <div className="bg-noir-800/50 p-8 rounded-3xl border border-gold-500/10 shadow-lg backdrop-blur-sm animate-fade-in-up delay-[100ms]">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 bg-gold-500 text-noir-900 rounded-xl flex items-center justify-center font-bold shadow-lg shadow-gold-500/20">
              2
            </div>
            <h2 className="font-display text-xl font-bold flex items-center gap-2 text-champagne-100">
              <HiOutlineTruck className="text-gold-500" /> Delivery Options
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {DELIVERY_OPTIONS.map((option) => (
              <div
                key={option.id}
                onClick={() => setDeliveryOption(option.id)}
                className={`p-5 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                  deliveryOption === option.id
                    ? "border-gold-500 bg-gold-500/10 shadow-[0_0_15px_rgba(234,179,8,0.1)]"
                    : "border-gold-500/20 hover:border-gold-500/50 bg-noir-900/50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{option.icon}</span>
                  <div>
                    <p className="font-bold text-champagne-100">
                      {option.name}
                    </p>
                    <p className="text-xs text-champagne-400">
                      {option.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`font-bold ${option.price === 0 ? "text-green-400" : "text-gold-500"}`}
                  >
                    {option.price === 0 ? "FREE" : formatPrice(option.price)}
                  </span>
                  {deliveryOption === option.id && (
                    <HiCheckCircle className="text-2xl text-gold-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step 3: Payment */}
        <div className="bg-noir-800/50 p-8 rounded-3xl border border-gold-500/10 shadow-lg backdrop-blur-sm animate-fade-in-up delay-[200ms]">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 bg-gold-500 text-noir-900 rounded-xl flex items-center justify-center font-bold shadow-lg shadow-gold-500/20">
              3
            </div>
            <h2 className="font-display text-xl font-bold flex items-center gap-2 text-champagne-100">
              <HiOutlineCreditCard className="text-gold-500" /> Payment Method
            </h2>
          </div>

          {/* Stripe Saved Cards List */}
          {stripeCards?.length > 0 && (
            <div className="grid grid-cols-1 gap-4 mb-6">
              {stripeCards.map((card) => (
                <div
                  key={card.id}
                  onClick={() => setSelectedStripeCard(card.id)}
                  className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                    selectedStripeCard === card.id
                      ? "border-gold-500 bg-gold-500/10 shadow-[0_0_15px_rgba(234,179,8,0.1)]"
                      : "border-gold-500/20 hover:border-gold-500/50 bg-noir-900/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-5 bg-champagne-200 rounded flex items-center justify-center text-[10px] font-bold text-noir-900">
                      {card.brand.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-champagne-100">
                        Saved Card
                      </p>
                      <p className="text-xs text-champagne-400">
                        •••• •••• •••• {card.last4} | Exp: {card.exp_month}/
                        {card.exp_year}
                      </p>
                    </div>
                  </div>
                  {selectedStripeCard === card.id && (
                    <HiCheckCircle className="text-2xl text-gold-500" />
                  )}
                </div>
              ))}

              {/* Option to use new card */}
              <div
                onClick={() => setSelectedStripeCard(null)}
                className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                  selectedStripeCard === null
                    ? "border-gold-500 bg-gold-500/10 shadow-[0_0_15px_rgba(234,179,8,0.1)]"
                    : "border-gold-500/20 hover:border-gold-500/50 bg-noir-900/50"
                }`}
              >
                <p className="font-bold text-sm text-champagne-100">
                  + Pay with a new card
                </p>
                {selectedStripeCard === null && (
                  <HiCheckCircle className="text-2xl text-gold-500" />
                )}
              </div>
            </div>
          )}

          {/* Payment Section - Stripe Elements */}
          {/* Show if no saved card selected OR if no saved cards exist */}
          {(stripeCards.length === 0 || selectedStripeCard === null) && (
            <div className="space-y-6 animate-fade-in-up">
              <ExpressCheckoutElement />
              <div className="relative flex py-5 items-center">
                <div className="flex-grow border-t border-gold-500/20"></div>
                <span className="flex-shrink-0 mx-4 text-champagne-400 text-xs uppercase font-bold tracking-widest">
                  Or pay with card
                </span>
                <div className="flex-grow border-t border-gold-500/20"></div>
              </div>

              <PaymentElement
                id="payment-element"
                options={{ layout: "tabs" }}
              />
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="saveCard"
                  checked={saveCard}
                  onChange={(e) => setSaveCard(e.target.checked)}
                  className="w-5 h-5 accent-gold-500 rounded-lg cursor-pointer bg-noir-900 border-gold-500/30"
                />
                <label
                  htmlFor="saveCard"
                  className="text-sm font-bold text-champagne-300 cursor-pointer"
                >
                  Save this card for future purchases
                </label>
              </div>
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
                    {formatPrice(item.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3 border-t border-gold-500/10 pt-6">
            <div className="flex justify-between text-champagne-400 text-sm">
              <span>Subtotal</span>
              <span className="font-bold text-champagne-100">
                {formatPrice(cartSubtotal)}
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
                  {shippingCost === 0 ? "FREE" : formatPrice(shippingCost)}
                </span>
              )}
            </div>

            <div className="flex justify-between text-champagne-400 text-sm">
              <span>
                Delivery (
                {DELIVERY_OPTIONS.find((o) => o.id === deliveryOption)?.name})
              </span>
              <span
                className={`font-bold ${deliveryFee === 0 ? "text-green-400" : "text-champagne-100"}`}
              >
                {deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 pt-6 border-t border-gold-500/10 mt-4">
              <div className="flex flex-col">
                <span className="text-2xl font-display font-bold text-champagne-100">
                  Total
                </span>
                <span className="text-2xl font-black font-opensans text-gold-500">
                  {formatPrice(finalTotal)}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onSubmit}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-gold-500 to-gold-600 text-noir-900 py-5 rounded-2xl font-black mt-10 hover:from-gold-400 hover:to-gold-500 transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 shadow-lg shadow-gold-500/20 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader size="sm" />
            ) : (
              <>
                Complete Purchase <HiOutlineLockClosed className="text-xl" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Main Wrapper Component ---
function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const cartItems = user?.data?.cart || [];
  const { isLoading, isSuccess } = useSelector((state) => state.orders);
  const { shippingFee: backendShippingFee, isLoading: isShippingLoading } =
    useSelector((state) => state.shippingFee);

  // -- Lifted State --
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    state: "",
    zipCode: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    cardName: "",
    phoneNumber: "",
  });

  const [selectedAddressIndex, setSelectedAddressIndex] = useState(-1);
  const [selectedCardIndex, setSelectedCardIndex] = useState(-1);
  const [saveAddress, setSaveAddress] = useState(false);
  const [saveCard, setSaveCard] = useState(false);
  const [shippingCost, setShippingCost] = useState(0);
  const [clientSecret, setClientSecret] = useState("");
  const [deliveryOption, setDeliveryOption] = useState("standard"); // 'standard' or 'premium'
  // [NEW] Stripe Saved Cards State
  const [stripeCards, setStripeCards] = useState([]);
  const [selectedStripeCard, setSelectedStripeCard] = useState(null); // ID of selected Stripe card

  // -- Effects --
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user?.data?.addresses?.length > 0) {
      setSelectedAddressIndex(0);
    } else {
      setSelectedAddressIndex(-1);
    }
    // Legacy cards (deprecated or simulated)
    if (user?.data?.paymentMethods?.length > 0) {
      setSelectedCardIndex(0);
    } else {
      setSelectedCardIndex(-1);
    }

    // Fetch Stripe Saved Cards
    if (user?.data?.email) {
      axios
        .get(`${uri}/api/payment-methods/${user.data.email}`)
        .then((res) => {
          if (res.data && res.data.data) {
            // Adjusted response structure
            setStripeCards(res.data.data);
          } else if (Array.isArray(res.data)) {
            // Fallback if array returned directly
            setStripeCards(res.data);
          }
        })
        .catch((err) => console.error("Error fetching saved cards", err));
    }
  }, [user, navigate]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(resetOrder());
      navigate("/order-success");
      dispatch(getCart({ email: user?.data?.email }));
    }
  }, [isSuccess, navigate, dispatch, user]);

  useEffect(() => {
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

  const cartSubtotal =
    cartItems?.reduce((total, item) => total + parseFloat(item.price), 0) || 0;

  // Calculate delivery fee based on selected option
  const deliveryFee =
    DELIVERY_OPTIONS.find((o) => o.id === deliveryOption)?.price || 0;
  const finalTotal = cartSubtotal + shippingCost + deliveryFee;

  // -- Stripe Intent Fetching --
  useEffect(() => {
    if (finalTotal > 0) {
      const payload = {
        amount: finalTotal,
        currency: "gbp",
        email: user?.data?.email,
        saveCard: saveCard, // User wants to save this new card
      };

      if (selectedStripeCard) {
        payload.paymentMethodId = selectedStripeCard; // User chose a saved card
      }

      axios
        .post(`${uri}/api/create-payment-intent`, payload)
        .then((res) => setClientSecret(res.data.clientSecret))
        .catch((err) => console.error("Error creating payment intent", err));
    }
  }, [finalTotal, saveCard, selectedStripeCard, user?.data?.email]);

  // -- Render Logic --
  // We need to wait for clientSecret if we want to show Stripe elements.
  // However, we want to show the form immediately.
  // We will wrap the inner form in Elements ONLY if clientSecret is available.
  // If not available, we can either show a Loader or show the form but disable Stripe parts.
  // Disabling Stripe parts is hard because Elements must wrap the hooks.
  // So we show a full page loader if clientSecret is fetching?
  // Or we only render Elements when ready.

  // Best UX: Show the checkout. If Stripe is selected (or default), show a spinner in the Stripe area if secret not ready.
  // ALWAYS wrap in Elements? Elements requires clientSecret.
  // So we wait for clientSecret.

  if (!clientSecret && cartItems.length > 0) {
    return (
      <div className="min-h-screen bg-noir-900 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  // Handle empty cart
  if (cartItems.length === 0 && !isSuccess) {
    // Render empty cart state or redirect
    // Allowing render to proceed, inner form checks empty cart
  }

  const options = {
    clientSecret,
    appearance: { theme: "night", labels: "floating" },
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

        {clientSecret ? (
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm
              formData={formData}
              setFormData={setFormData}
              selectedAddressIndex={selectedAddressIndex}
              setSelectedAddressIndex={setSelectedAddressIndex}
              selectedCardIndex={selectedCardIndex}
              setSelectedCardIndex={setSelectedCardIndex}
              saveAddress={saveAddress}
              setSaveAddress={setSaveAddress}
              saveCard={saveCard}
              setSaveCard={setSaveCard}
              cartItems={cartItems}
              cartSubtotal={cartSubtotal}
              shippingCost={shippingCost}
              deliveryOption={deliveryOption}
              setDeliveryOption={setDeliveryOption}
              deliveryFee={deliveryFee}
              finalTotal={finalTotal}
              isShippingLoading={isShippingLoading}
              isLoadingOrder={isLoading}
              user={user}
              clientSecret={clientSecret}
              // [NEW] Props
              stripeCards={stripeCards}
              selectedStripeCard={selectedStripeCard}
              setSelectedStripeCard={setSelectedStripeCard}
            />
          </Elements>
        ) : (
          // Should be covered by loading state above, but failsafe
          <Loader />
        )}
      </div>
    </div>
  );
}

export default Checkout;
