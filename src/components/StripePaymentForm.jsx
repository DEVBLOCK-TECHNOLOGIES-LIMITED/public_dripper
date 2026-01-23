import React, { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import Loader from "./Loader";
import { HiOutlineLockClosed } from "react-icons/hi";

const StripePaymentForm = ({ onSuccess, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Return URL is not strictly needed if we handle redirect: 'if_required'
        // or if we simple await the result for non-redirecting methods.
        // For this implementation, we will assume we handle success locally
        // or redirect to order-success.
        return_url: `${window.location.origin}/order-success`,
      },
      redirect: "if_required",
    });

    if (error) {
      setMessage(error.message);
      toast.error(error.message);
      setIsLoading(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setMessage("Payment succeeded!");
      onSuccess(paymentIntent);
      setIsLoading(false);
    } else {
      setMessage("Unexpected state.");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement id="payment-element" />
      {message && <div className="text-red-500 text-sm mt-2">{message}</div>}
      <button
        type="submit"
        disabled={isLoading || !stripe || !elements}
        className="w-full bg-gradient-to-r from-gold-500 to-gold-600 text-noir-900 py-4 rounded-xl font-black mt-4 hover:from-gold-400 hover:to-gold-500 transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 shadow-lg shadow-gold-500/20 disabled:opacity-50"
      >
        {isLoading ? (
          <Loader size="sm" />
        ) : (
          <>
            Pay ${amount?.toFixed(2)}{" "}
            <HiOutlineLockClosed className="text-xl" />
          </>
        )}
      </button>
    </form>
  );
};

export default StripePaymentForm;
