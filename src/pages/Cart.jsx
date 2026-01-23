import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  removeFromCart,
  deleteCart,
  reset,
} from "../features/cart/cartSlice";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import {
  RiDeleteBinLine,
  RiErrorWarningLine,
  RiErrorWarningLine,
} from "react-icons/ri";
import { HiArrowRight } from "react-icons/hi";
import { getShippingFee } from "../features/shipping/shippingSlice";
import axios from "axios";
import uri from "../features/config";

const CartModal = ({ cart }) => {
  return (
    <div className="relative w-full">
      {/* Top fade gradient */}
      <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-noir-800 to-transparent z-10 pointer-events-none rounded-t-xl" />

      {/* Scrollable container with custom scrollbar */}
      <div
        className="flex flex-col gap-4 items-center h-[400px] overflow-y-auto w-full px-5 py-3
          scroll-smooth
          [&::-webkit-scrollbar]:w-2
          [&::-webkit-scrollbar]:rounded-full
          [&::-webkit-scrollbar-track]:bg-noir-700
          [&::-webkit-scrollbar-track]:rounded-full
          [&::-webkit-scrollbar-track]:my-2
          [&::-webkit-scrollbar-thumb]:bg-gradient-to-b
          [&::-webkit-scrollbar-thumb]:from-gold-400
          [&::-webkit-scrollbar-thumb]:to-gold-600
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:border-2
          [&::-webkit-scrollbar-thumb]:border-transparent
          [&::-webkit-scrollbar-thumb]:bg-clip-padding"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#d4af37 #262626",
        }}
      >
        {Array.from(new Set(cart.map((item) => item.code))).map((code) => {
          const product = cart.find((item) => item.code === code);
          return <CartProduct key={code} product={product} cart={cart} />;
        })}
      </div>

      {/* Bottom fade gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-noir-800 to-transparent z-10 pointer-events-none rounded-b-xl" />
    </div>
  );
};

const CartProduct = ({ product, cart }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const [isCurrentlyAdding, setIsCurrentlyAdding] = useState(false);
  const [isCurrentlyRemoving, setIsCurrentlyRemoving] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [foundItems, setFoundItems] = useState([]);

  useEffect(() => {
    setFoundItems(cart.filter((item) => item.code === product.code));
  }, [cart, product]);

  useEffect(() => {
    setQuantity(foundItems?.length || 0);
  }, [foundItems]);

  const handleIncrement = () => {
    if (!user || !user.data?.email) {
      toast.info("Please log in to add items to your cart.");
      navigate("/login");
      return;
    }
    setIsCurrentlyAdding(true);
    dispatch(addToCart({ email: user.data.email, item: product }))
      .unwrap()
      .finally(() => {
        setIsCurrentlyAdding(false);
      });
    dispatch(reset());
  };

  const handleDecrement = () => {
    if (!user || !user.data?.email) {
      toast.info("Please log in to update your cart.");
      navigate("/login");
      return;
    }
    setIsCurrentlyRemoving(true);
    dispatch(removeFromCart({ code: product.code, email: user.data.email }))
      .unwrap()
      .finally(() => {
        setIsCurrentlyRemoving(false);
      });
    dispatch(reset());
  };
  return (
    <div className="flex justify-between items-center w-full border-b border-gold-500/20 py-4 last:border-none">
      <div className="flex justify-start items-center w-full gap-5">
        <div className="w-[7rem] h-[7rem] bg-noir-700/50 rounded-lg flex items-center justify-center border border-gold-500/10">
          <img
            src={product.image || product.images?.[0]}
            alt={product.name}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        <div className="flex flex-col justify-start items-start gap-1">
          <span className="text-champagne-100 font-display text-lg font-bold">
            {product.name}
          </span>
          <div className="flex justify-start items-center w-full gap-2 text-champagne-400 text-xs uppercase tracking-wider">
            <span>{product.color}</span>
            <span>•</span>
            <span>Size {product.size || "STD"}</span>
          </div>
          <span className="text-gold-400 font-bold mt-1">${product.price}</span>
        </div>
      </div>

      <div className="flex flex-col justify-between items-end gap-5">
        <div className="flex justify-start items-center gap-2">
          <button
            onClick={handleDecrement}
            disabled={isCurrentlyRemoving || quantity === 0}
            className="w-8 h-8 rounded-full border border-gold-500/30 text-gold-500 hover:bg-gold-500/10 flex items-center justify-center transition-all disabled:opacity-50"
          >
            {isCurrentlyRemoving ? <Loader size="sm" /> : "-"}
          </button>
          <span className="font-bold text-champagne-100 w-6 text-center">
            {quantity}
          </span>
          <button
            onClick={handleIncrement}
            disabled={isCurrentlyAdding}
            className="w-8 h-8 rounded-full bg-gold-500 text-noir-900 hover:bg-gold-400 flex items-center justify-center transition-all disabled:opacity-50"
          >
            {isCurrentlyAdding ? <Loader size="sm" /> : "+"}
          </button>
        </div>
        <div className="flex justify-end items-center w-full">
          <span className="font-bold text-champagne-100 text-lg">
            + ${product.price * quantity}
          </span>
        </div>
      </div>
    </div>
  );
};

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [discountLoading, setDiscountLoading] = useState(false);

  const handleApplyDiscount = async () => {
    if (!discountCode) return;
    setDiscountLoading(true);
    try {
      const response = await axios.post(`${uri}/api/discounts/validate`, {
        code: discountCode,
      });
      setAppliedDiscount(response.data.data);
      toast.success("Discount applied!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid discount code");
      setAppliedDiscount(null);
    } finally {
      setDiscountLoading(false);
    }
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
    setDiscountCode("");
    toast.info("Discount removed");
  };

  // Form States were removed as they are no longer used in Cart

  const { user } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.cart);
  const cartItems = user?.data?.cart || [];
  const { shippingFee, isLoading: isShippingLoading } = useSelector(
    (state) => state.shippingFee,
  );

  const email = user?.data?.email;
  const shipCost = shippingFee?.data?.shippingFee;

  const handleDeleteCart = () => {
    dispatch(deleteCart({ email }))
      .unwrap()
      .then(() => {
        toast.success("Cart cleared successfully!", { autoClose: 2000 });
      })
      .catch(() => {
        toast.error("Failed to clear cart.", { autoClose: 2000 });
      });
  };

  useEffect(() => {
    if (!user || !user.data?.email) {
      toast.info("Please log in to add items to your cart.");
      navigate("/login");
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    // Only fetch shipping fee if there are items in the cart
    if (cartItems.length > 0) {
      // Use the first saved address state if available, otherwise default to a reasonable fallback
      const destinationState =
        user?.data?.addresses?.[0]?.state || user?.data?.state || "lagos";

      dispatch(
        getShippingFee({
          originState: "ogun",
          destinationState: destinationState,
          itemsCount: cartItems.length,
        }),
      );
    }
  }, [cartItems.length, dispatch, user?.data?.addresses, user?.data?.state]);

  return (
    <div className="min-h-screen bg-noir-900 py-12 px-4">
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-display text-4xl font-bold text-champagne-100">
            Your Bag
          </h1>
          <span className="text-gold-500 font-bold tracking-widest uppercase text-sm">
            {cartItems.length} {cartItems.length === 1 ? "Item" : "Items"}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* Main Content - Left Column */}
          <div className="w-full lg:w-2/3 flex flex-col gap-6">
            {/* Cart Items Section */}
            <div className="bg-noir-800 rounded-3xl p-6 border border-gold-500/20 shadow-2xl shadow-black/50">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gold-500/20">
                <h2 className="text-xl font-bold text-champagne-100">
                  Selected Pieces
                </h2>
                {cartItems.length > 0 && (
                  <button
                    onClick={handleDeleteCart}
                    className="text-rosegold-500 text-sm hover:text-rosegold-400 flex items-center gap-1 font-bold"
                  >
                    <RiDeleteBinLine /> Clear Bag
                  </button>
                )}
              </div>

              {cartItems && cartItems.length > 0 ? (
                <CartModal cart={cartItems} />
              ) : (
                <div className="text-center py-12">
                  <p className="text-champagne-400 text-lg">
                    Your shopping bag is empty.
                  </p>
                  <Link
                    to="/catalog"
                    className="text-gold-500 hover:underline mt-2 inline-block"
                  >
                    Explore the Collection
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Right Column */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            {/* Order Summary */}
            <div className="bg-noir-800 rounded-3xl p-6 border border-gold-500/20 sticky top-24">
              <h3 className="font-display text-2xl text-champagne-100 mb-6">
                Order Summary
              </h3>

              <div className="space-y-4 mb-6 pb-6 border-b border-gold-500/10">
                <div className="flex justify-between text-champagne-300">
                  <span>Subtotal</span>
                  <span>
                    $
                    {cartItems
                      ?.reduce((acc, item) => acc + Number(item.price), 0)
                      .toLocaleString()}
                  </span>
                </div>
                {appliedDiscount && (
                  <div className="flex justify-between text-gold-500 font-bold">
                    <span>Discount ({appliedDiscount.code})</span>
                    <span>
                      - $
                      {(appliedDiscount.type === "percent"
                        ? (cartItems?.reduce(
                            (acc, item) => acc + Number(item.price),
                            0,
                          ) *
                            appliedDiscount.value) /
                          100
                        : appliedDiscount.value
                      ).toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-champagne-300">
                  <span>Shipping</span>
                  <span
                    className={
                      isShippingLoading
                        ? "text-gold-500 animate-pulse"
                        : "text-champagne-100"
                    }
                  >
                    ${shipCost || "0"}
                  </span>
                </div>
              </div>

              {/* Discount Input */}
              <div className="mb-6">
                {!appliedDiscount ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo Code"
                      className="w-full p-3 bg-noir-900 border border-gold-500/20 rounded-xl text-champagne-100 placeholder:text-champagne-500/50 outline-none focus:border-gold-500 transition-all uppercase"
                      value={discountCode}
                      onChange={(e) =>
                        setDiscountCode(e.target.value.toUpperCase())
                      }
                    />
                    <button
                      onClick={handleApplyDiscount}
                      disabled={!discountCode || discountLoading}
                      className="px-4 bg-gold-500/10 text-gold-500 border border-gold-500/20 rounded-xl hover:bg-gold-500 hover:text-noir-900 transition-all font-bold disabled:opacity-50"
                    >
                      {discountLoading ? <Loader size="sm" /> : "Apply"}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleRemoveDiscount}
                    className="w-full py-2 bg-rosegold-500/10 text-rosegold-500 border border-rosegold-500/20 rounded-xl hover:bg-rosegold-500 hover:text-white transition-all text-sm font-bold flex items-center justify-center gap-2"
                  >
                    <RiDeleteBinLine /> Remove Discount ({appliedDiscount.code})
                  </button>
                )}
              </div>

              <div className="flex justify-between items-end mb-8">
                <span className="text-champagne-400 text-sm">Total</span>
                <span className="text-3xl font-display font-bold text-gold-400">
                  $
                  {(
                    cartItems?.reduce(
                      (acc, item) => acc + Number(item.price),
                      0,
                    ) +
                    (shipCost || 0) -
                    (appliedDiscount
                      ? appliedDiscount.type === "percent"
                        ? (cartItems?.reduce(
                            (acc, item) => acc + Number(item.price),
                            0,
                          ) *
                            appliedDiscount.value) /
                          100
                        : appliedDiscount.value
                      : 0)
                  ).toLocaleString()}
                </span>
              </div>

              <button
                onClick={() => {
                  if (cartItems.length > 0) {
                    navigate("/checkout");
                  } else {
                    toast.info("Your bag is empty");
                  }
                }}
                disabled={isShippingLoading}
                className="w-full py-4 btn-luxury rounded-xl flex items-center justify-center gap-2 font-bold text-noir-900 text-lg shadow-lg shadow-gold-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isShippingLoading ? <Loader /> : "Secure Checkout"}{" "}
                <HiArrowRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
