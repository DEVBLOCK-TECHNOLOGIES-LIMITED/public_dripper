import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  removeFromCart,
  deleteCart,
  reset,
} from "../features/cart/cartSlice";
import {
  addAddress,
  removeAddress,
  addCard,
  removeCard,
} from "../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import {
  RiDeleteBinLine,
  RiErrorWarningLine,
  RiCoupon3Fill,
} from "react-icons/ri";
import { IoLocation } from "react-icons/io5";
import {
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaWallet,
  FaGifts,
} from "react-icons/fa";
import { HiOutlineSparkles, HiArrowRight } from "react-icons/hi";
import { getShippingFee } from "../features/shipping/shippingSlice";

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

  const [checkCard, setCheckCard] = useState({
    visa: false,
    mastercard: false,
    amex: false,
  });

  const [gift, setGift] = useState(false);

  // Modal States
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);

  // Form States
  const [addressForm, setAddressForm] = useState({
    address: "",
    city: "",
    state: "",
  });
  const [cardForm, setCardForm] = useState({
    name: "",
    number: "",
    expiry: "",
    cvv: "",
  });

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (addressForm.address && addressForm.city && addressForm.state) {
      dispatch(addAddress({ email, address: addressForm }));
      setIsAddressModalOpen(false);
      setAddressForm({ address: "", city: "", state: "" });
    }
  };

  const handleCardSubmit = (e) => {
    e.preventDefault();
    if (cardForm.name) {
      // Mock card type detection
      dispatch(addCard({ email, card: { ...cardForm, type: "visa" } }));
      setIsCardModalOpen(false);
      setCardForm({ name: "", number: "", expiry: "", cvv: "" });
    }
  };

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
            {/* Address & Payment Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Premium Address Card */}
              <div className="bg-noir-800 p-6 rounded-2xl border border-gold-500/20 shadow-lg shadow-gold-500/5 group hover:border-gold-500/40 transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-noir-700 rounded-full flex items-center justify-center border border-gold-500/30">
                    <IoLocation className="text-2xl text-gold-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-champagne-100">
                      Delivery Address
                    </h3>
                    <p className="text-xs text-champagne-400">
                      Where should we create magic?
                    </p>
                  </div>
                </div>

                <div className="space-y-3 max-h-40 overflow-y-auto pr-2 mb-4 custom-scrollbar">
                  {user?.data?.addresses?.map((addr) => (
                    <div
                      key={addr.id}
                      className="relative flex justify-between items-start bg-noir-900/50 p-3 rounded-xl border border-gold-500/10 group-hover:border-gold-500/20"
                    >
                      <div className="pr-8">
                        <p className="text-sm text-champagne-200">
                          {addr.address}
                        </p>
                        <p className="text-xs text-gold-500/70 uppercase font-bold mt-1">
                          {addr.city}, {addr.state}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          dispatch(removeAddress({ email, id: addr.id }))
                        }
                        className="text-rosegold-500 hover:text-rosegold-400 transition-colors"
                      >
                        <RiDeleteBinLine />
                      </button>
                    </div>
                  ))}
                  {(!user?.data?.addresses ||
                    user?.data?.addresses.length === 0) &&
                    user?.data?.address && (
                      <div className="bg-noir-900/50 p-3 rounded-xl border border-gold-500/10">
                        <p className="text-sm text-champagne-200">
                          {user.data.address}
                        </p>
                      </div>
                    )}
                </div>

                <button
                  onClick={() => setIsAddressModalOpen(true)}
                  className="w-full py-3 bg-noir-700 text-gold-500 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-gold-500 hover:text-noir-900 transition-all border border-gold-500/30"
                >
                  + Add New Address
                </button>
              </div>

              {/* Premium Payment Card */}
              <div className="bg-noir-800 p-6 rounded-2xl border border-gold-500/20 shadow-lg shadow-gold-500/5 hover:border-gold-500/40 transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-noir-700 rounded-full flex items-center justify-center border border-gold-500/30">
                    <FaWallet className="text-2xl text-gold-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-champagne-100">
                      Payment Method
                    </h3>
                    <p className="text-xs text-champagne-400">
                      Secure & Encrypted
                    </p>
                  </div>
                </div>

                <div className="space-y-3 max-h-40 overflow-y-auto pr-2 mb-4 custom-scrollbar">
                  {user?.data?.paymentMethods?.map((card) => (
                    <label
                      key={card.id}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${checkCard[card.id] ? "border-gold-500 bg-gold-500/10" : "border-gold-500/10 bg-noir-900/50"}`}
                    >
                      <div className="flex items-center gap-3">
                        {card.type === "visa" ? (
                          <FaCcVisa className="text-2xl text-white" />
                        ) : (
                          <FaCcMastercard className="text-2xl text-white" />
                        )}
                        <div>
                          <p className="text-sm text-champagne-100 font-bold">
                            {card.name}
                          </p>
                          <p className="text-xs text-champagne-400">
                            ••••{" "}
                            {card.last4 || card.number?.slice(-4) || "0000"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            dispatch(removeCard({ email, id: card.id }));
                          }}
                          className="text-rosegold-500 hover:text-rosegold-400"
                        >
                          <RiDeleteBinLine />
                        </button>
                        <input
                          type="checkbox"
                          className="accent-gold-500"
                          checked={checkCard[card.id]}
                          onChange={(e) =>
                            setCheckCard({
                              visa: false,
                              mastercard: false,
                              amex: false,
                              [card.id]: e.target.checked,
                            })
                          }
                        />
                      </div>
                    </label>
                  ))}
                  {(!user?.data?.paymentMethods ||
                    user?.data?.paymentMethods.length === 0) && (
                    <div className="text-center py-6 text-champagne-500 text-xs italic">
                      No cards saved yet.
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setIsCardModalOpen(true)}
                  className="w-full py-3 bg-noir-700 text-gold-500 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-gold-500 hover:text-noir-900 transition-all border border-gold-500/30"
                >
                  + Add New Card
                </button>
              </div>
            </div>

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

              <div className="flex justify-between items-end mb-8">
                <span className="text-champagne-400 text-sm">Total</span>
                <span className="text-3xl font-display font-bold text-gold-400">
                  $
                  {(
                    cartItems?.reduce(
                      (acc, item) => acc + Number(item.price),
                      0,
                    ) + (shipCost || 0)
                  ).toLocaleString()}
                </span>
              </div>

              <button
                onClick={() => {
                  if (
                    user?.data?.addresses?.length > 0 &&
                    user?.data?.paymentMethods?.length > 0 &&
                    cartItems.length > 0
                  ) {
                    navigate("/checkout");
                  } else if (cartItems.length === 0) {
                    toast.info("Your bag is empty");
                  } else {
                    if (!user?.data?.addresses?.length)
                      setIsAddressModalOpen(true);
                    else setIsCardModalOpen(true);
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

      {/* Address Modal */}
      <Modal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        title="Add Delivery Address"
      >
        <form onSubmit={handleAddressSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gold-500 uppercase tracking-wider block mb-2">
              Street Address
            </label>
            <input
              required
              type="text"
              value={addressForm.address}
              onChange={(e) =>
                setAddressForm({ ...addressForm, address: e.target.value })
              }
              className="w-full p-4 rounded-xl input-luxury text-base bg-noir-800 border-gold-500/30"
              placeholder="123 Luxury Lane"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gold-500 uppercase tracking-wider block mb-2">
                City
              </label>
              <input
                required
                type="text"
                value={addressForm.city}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, city: e.target.value })
                }
                className="w-full p-4 rounded-xl input-luxury text-base bg-noir-800 border-gold-500/30"
                placeholder="New York"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gold-500 uppercase tracking-wider block mb-2">
                State
              </label>
              <input
                required
                type="text"
                value={addressForm.state}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, state: e.target.value })
                }
                className="w-full p-4 rounded-xl input-luxury text-base bg-noir-800 border-gold-500/30"
                placeholder="NY"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 btn-luxury rounded-xl font-bold mt-4"
          >
            Save Address
          </button>
        </form>
      </Modal>

      {/* Card Modal */}
      <Modal
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
        title="Add Payment Method"
      >
        <form onSubmit={handleCardSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gold-500 uppercase tracking-wider block mb-2">
              Cardholder Name
            </label>
            <input
              required
              type="text"
              value={cardForm.name}
              onChange={(e) =>
                setCardForm({ ...cardForm, name: e.target.value })
              }
              className="w-full p-4 rounded-xl input-luxury text-base bg-noir-800 border-gold-500/30"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gold-500 uppercase tracking-wider block mb-2">
              Card Number
            </label>
            <input
              required
              type="text"
              value={cardForm.number}
              onChange={(e) =>
                setCardForm({ ...cardForm, number: e.target.value })
              }
              className="w-full p-4 rounded-xl input-luxury text-base bg-noir-800 border-gold-500/30"
              placeholder="0000 0000 0000 0000"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gold-500 uppercase tracking-wider block mb-2">
                Expiry
              </label>
              <input
                required
                type="text"
                value={cardForm.expiry}
                onChange={(e) =>
                  setCardForm({ ...cardForm, expiry: e.target.value })
                }
                className="w-full p-4 rounded-xl input-luxury text-base bg-noir-800 border-gold-500/30"
                placeholder="MM/YY"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gold-500 uppercase tracking-wider block mb-2">
                CVV
              </label>
              <input
                required
                type="text"
                value={cardForm.cvv}
                onChange={(e) =>
                  setCardForm({ ...cardForm, cvv: e.target.value })
                }
                className="w-full p-4 rounded-xl input-luxury text-base bg-noir-800 border-gold-500/30"
                placeholder="123"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 btn-luxury rounded-xl font-bold mt-4"
          >
            Save Card
          </button>
        </form>
      </Modal>
    </div>
  );
}

export default Cart;
