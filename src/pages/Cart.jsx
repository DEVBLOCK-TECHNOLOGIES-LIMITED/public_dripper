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
  FaCoins,
} from "react-icons/fa";
import { HiOutlineSparkles, HiArrowRight } from "react-icons/hi";
import { getShippingFee } from "../features/shipping/shippingSlice";

const CartModal = ({ cart }) => {
  return (
    <div className="relative w-full">
      {/* Top fade gradient */}
      <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none rounded-t-xl" />

      {/* Scrollable container with custom scrollbar */}
      <div
        className="flex flex-col gap-4 items-center h-[400px] overflow-y-auto w-full px-5 py-3
          scroll-smooth
          [&::-webkit-scrollbar]:w-2
          [&::-webkit-scrollbar]:rounded-full
          [&::-webkit-scrollbar-track]:bg-gray-100
          [&::-webkit-scrollbar-track]:rounded-full
          [&::-webkit-scrollbar-track]:my-2
          [&::-webkit-scrollbar-thumb]:bg-gradient-to-b
          [&::-webkit-scrollbar-thumb]:from-purple-400
          [&::-webkit-scrollbar-thumb]:to-purple-600
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:border-2
          [&::-webkit-scrollbar-thumb]:border-transparent
          [&::-webkit-scrollbar-thumb]:bg-clip-padding
          hover:[&::-webkit-scrollbar-thumb]:from-purple-500
          hover:[&::-webkit-scrollbar-thumb]:to-purple-700
          active:[&::-webkit-scrollbar-thumb]:from-purple-600
          active:[&::-webkit-scrollbar-thumb]:to-purple-800"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#a855f7 #f3f4f6",
        }}
      >
        {Array.from(new Set(cart.map((item) => item.code))).map((code) => {
          const product = cart.find((item) => item.code === code);
          return <CartProduct key={code} product={product} cart={cart} />;
        })}
      </div>

      {/* Bottom fade gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none rounded-b-xl" />
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
    <div className="flex justify-between items-center w-full border-b border-gray-300 py-3">
      <div className="flex justify-start items-center w-full gap-5">
        <img src="" alt="" className="w-[7rem] h-[7rem]" />

        <div className="flex flex-col justify-start items-start gap-2">
          <span>{product.name}</span>
          <span>description</span>

          <div className="flex justify-start  items-center w-full gap-2">
            <span>size</span>
            <span>{product.color}</span>
          </div>

          <span>${product.price} per item</span>
        </div>
      </div>

      <div className="flex flex-col justify-between items-end gap-5">
        <div className="flex justify-start items-center gap-2">
          <button
            onClick={handleDecrement}
            disabled={isCurrentlyRemoving || quantity === 0}
            className="p-2 h-7  w-7 bg-gray-200 rounded-full text-black text-sm hover:bg-gray-300 disabled:opacity-50 text-center flex items-center justify-center"
          >
            {isCurrentlyRemoving ? <Loader size="sm" /> : "-"}
          </button>
          <span className="font-semibold text-gray-800">{quantity}</span>
          <button
            onClick={handleIncrement}
            disabled={isCurrentlyAdding}
            className="p-2 h-7  w-7 bg-gray-200 rounded-full text-black text-sm hover:bg-gray-300 disabled:opacity-50 text-center flex items-center justify-center"
          >
            {isCurrentlyAdding ? <Loader size="sm" /> : "+"}
          </button>
        </div>
        <div className="flex justify-end items-center w-full">
          <span className="font-bold">+ ${product.price * quantity}</span>
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
  const [useCredit, setUseCredit] = useState(false);
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
  const creditBalance = user?.data?.balance || 0;

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
    <div className=" w-full max-w-7xl mx-auto justify-center items-center rounded-2xl p-8 flex flex-col gap-5 text-xs mt-20">
      <div className="w-full flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="flex flex-col justify-between items-center py-2 w-full gap-5 ">
          <div className="flex flex-col justify-center items-start w-full gap-5 md:flex-row">
            {/* Premium Address Card */}
            <div className="flex flex-col justify-between h-full bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow w-full md:w-[380px]">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center text-purple-600">
                  <IoLocation className="text-3xl" />
                </div>
                <div className="w-full">
                  <h3 className="text-lg font-bold text-gray-900">
                    Delivery Address
                  </h3>

                  {/* List Addresses */}
                  <div className="w-full mt-4 space-y-3 max-h-48 overflow-y-auto pr-1">
                    {user?.data?.addresses?.map((addr) => (
                      <div
                        key={addr.id}
                        className="relative flex justify-between items-start bg-gray-50 p-3 rounded-xl border border-gray-100 hover:border-purple-200 hover:shadow-sm transition-all group"
                      >
                        <div className="flex flex-col items-start gap-1 w-full pr-8">
                          <p className="text-xs font-bold text-gray-800 break-words w-full text-left">
                            {addr.address}
                          </p>
                          <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">
                            {addr.city}, {addr.state}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            dispatch(removeAddress({ email, id: addr.id }))
                          }
                          className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          title="Remove Address"
                        >
                          <RiDeleteBinLine className="text-sm" />
                        </button>
                      </div>
                    ))}

                    {/* Fallback for legacy single address */}
                    {(!user?.data?.addresses ||
                      user?.data?.addresses.length === 0) &&
                      user?.data?.address && (
                        <div className="relative flex justify-between items-start bg-gray-50 p-3 rounded-xl border border-gray-100">
                          <div className="flex flex-col items-start gap-1">
                            <p className="text-xs font-bold text-gray-800">
                              {user.data.address}
                            </p>
                            <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">
                              {user.data.city} (Legacy)
                            </p>
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsAddressModalOpen(true)}
                className="mt-6 w-full py-3 bg-gray-900 text-white text-xs font-bold rounded-xl hover:bg-black transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
              >
                + Add New Address
              </button>
            </div>

            {/* Premium Payment Card */}
            <div className="flex flex-col gap-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow w-full md:w-[380px]">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">
                  Payment Method
                </h3>
                <button
                  onClick={() => setIsCardModalOpen(true)}
                  className="text-xs font-bold text-purple-600 hover:underline"
                >
                  + Add New
                </button>
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {user?.data?.paymentMethods?.map((card) => (
                  <label
                    key={card.id}
                    className={`relative flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all group ${
                      checkCard[card.id]
                        ? "border-purple-600 bg-purple-50/50 shadow-sm"
                        : "border-gray-100 bg-white hover:border-purple-200 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-600">
                        {card.type === "visa" ? (
                          <FaCcVisa className="text-xl text-blue-600" />
                        ) : (
                          <FaCcMastercard className="text-xl text-orange-500" />
                        )}
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-xs font-bold text-gray-800 leading-tight">
                          {card.name}
                        </span>
                        <span className="text-[10px] text-gray-500 font-medium tracking-wider">
                          •••• {card.last4 || card.number?.slice(-4) || "0000"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          dispatch(removeCard({ email, id: card.id }));
                        }}
                        className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        title="Remove Card"
                      >
                        <RiDeleteBinLine className="text-lg" />
                      </button>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          checkCard[card.id]
                            ? "border-purple-600 bg-purple-600"
                            : "border-gray-200"
                        }`}
                      >
                        {checkCard[card.id] && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <input
                        type="checkbox"
                        className="hidden"
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
                  <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
                    <FaWallet className="text-2xl text-gray-300 mb-2" />
                    <p className="text-xs font-medium text-gray-500">
                      No cards saved yet.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center items-center py-4 relative  w-full">
            <div className="flex justify-start items-center w-full bg-gray-200 px-5 py-3 rounded-lg gap-2">
              <RiErrorWarningLine className="text-2xl text-gray-500" />
              <div className="flex flex-col gap-2">
                <span>Check your products before you checkout</span>
                <span>
                  Ensure every detail is perfect before completing your
                  purchase.
                </span>
              </div>
            </div>

            <div className="flex flex-col justify-between items-center shadow-lg w-full gap-10 p-5">
              <div className="flex justify-between items-center w-full">
                <div className="flex justify-center items-center gap-3">
                  <span className="text-lg font-bold">Cart</span>
                  <span className="text-sm font-bold text-gray-500">
                    {cartItems.length} {cartItems.length > 1 ? "items" : "item"}
                  </span>
                </div>
                <div className="flex justify-center items-center gap-1">
                  <button
                    className="font-bold text-red-500 hover:underline"
                    onClick={handleDeleteCart}
                  >
                    {cartItems && cartItems.length > 0 ? (
                      isLoading ? (
                        <Loader size="sm" />
                      ) : (
                        <RiDeleteBinLine className="text-red-500 text-xl" />
                      )
                    ) : (
                      ""
                    )}
                  </button>
                </div>
              </div>
              {cartItems && cartItems.length > 0 ? (
                <CartModal cart={cartItems} />
              ) : (
                <p className="text-center text-gray-500">Your cart is empty.</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex-col justify-between items-center shadow-lg w-full py-3 gap-5 flex md:flex">
          {/* Credits Section - Enhanced */}
          <div className="w-full flex flex-col justify-between items-center border-b border-gray-300 py-4 gap-3 px-6">
            <div className="flex justify-between items-center w-full gap-3">
              <div className="flex justify-center items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-amber-200">
                  <FaCoins className="text-xl" />
                </div>
                <div className="flex flex-col justify-start items-start gap-0.5">
                  <span className="text-sm font-bold text-gray-900">
                    Pay with Store Credits
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-amber-600">
                      {creditBalance.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-500">
                      credits available
                    </span>
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                className="w-5 h-5 accent-amber-500 rounded"
                checked={useCredit}
                onChange={(e) => setUseCredit(e.target.checked)}
              />
            </div>

            {/* Credit Info Message */}
            {creditBalance > 0 ? (
              <div className="w-full bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-3 flex items-center gap-2">
                <HiOutlineSparkles className="text-amber-500" />
                <span className="text-xs text-amber-700">
                  Use your credits at checkout! $1 = 100 credits.
                  {cartItems.length > 0 && (
                    <span className="font-bold ml-1">
                      (Order needs ~
                      {Math.ceil(
                        cartItems.reduce(
                          (acc, item) => acc + Number(item.price),
                          0,
                        ) * 100,
                      ).toLocaleString()}{" "}
                      credits)
                    </span>
                  )}
                </span>
              </div>
            ) : (
              <Link
                to="/credits"
                className="w-full bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-3 flex items-center justify-between hover:from-purple-100 hover:to-indigo-100 transition-all group"
              >
                <div className="flex items-center gap-2">
                  <HiOutlineSparkles className="text-purple-500" />
                  <span className="text-xs text-purple-700">
                    No credits yet! Purchase credits and save on future orders.
                  </span>
                </div>
                <HiArrowRight className="text-purple-500 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>

          <div className="flex flex-col justify-between items-center border-b border-gray-300 py-2 gap-5 px-6 w-full">
            <div className="flex justify-between items-center w-full b">
              <div className="flex justify-center items-center gap-6 w-full">
                <FaGifts className="text-2xl text-purple-500" />
                <div className="flex flex-col justify-center items-start w-full">
                  <span className="text-sm font-semibold">Make it a gift</span>
                  <span className="text-xs">Wrap items for $5</span>
                </div>
              </div>
              <input
                type="checkbox"
                className="w-4 h-4"
                checked={gift}
                onChange={(e) => setGift(e.target.checked)}
              />
            </div>

            <span className="text-gray-500 px-4 mb-3">
              All items will be wrapped in one box
            </span>
          </div>

          <div className="flex flex-col justify-between items-start w-full py-2 px-6 gap-3">
            <span className="font-semibold text-sm">Discount code</span>

            <div className="flex flex-col justify-between items-start gap-1 w-full border-b border-gray-300 pb-3">
              <div className="flex justify-between items-center w-full px-3 border border-gray-200 py-3 rounded-lg">
                <div className="flex justify-between items-center gap-3 w-full">
                  <RiCoupon3Fill className="text-2xl text-purple-500" />
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    className="px-3 py-2 w-full focus:outline-none"
                  />
                </div>
                <span className="text-red-500 font-bold">Remove</span>
              </div>
              <span className="text-purple-500 font-medium">
                coupon code is valid
              </span>
            </div>

            <div className="flex flex-col justify-between items-start gap-5 w-full border-b border-gray-300 pb-3">
              <div className="flex justify-between items-center w-full">
                <span>{`Subtotal (${cartItems.length} items)`}</span>
                <span>
                  $
                  {cartItems?.reduce(
                    (acc, item) => acc + Number(item.price),
                    0,
                  )}
                </span>
              </div>

              <div className="flex justify-between items-center w-full">
                <span>Shipping</span>
                <span className="text-green-500">
                  ${isShippingLoading ? "Loading..." : shipCost || ""}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center w-full py-4 border-b border-gray-300">
              <span>{`Total(with VAT)`}</span>
              <span className="font-bold text-lg">
                $
                {cartItems && cartItems.length > 0
                  ? cartItems?.reduce(
                      (acc, item) => acc + Number(item.price),
                      0,
                    ) + shipCost || 0
                  : 0}
              </span>
            </div>

            <div className="flex justify-center items-center w-full gap-4 py-4">
              <FaCcVisa className="text-3xl" />
              <FaCcMastercard className="text-3xl" />
              <FaCcAmex className="text-3xl" />
            </div>

            <div className="flex justify-center items-center w-full py-4">
              <button
                onClick={() => {
                  if (
                    user?.data?.addresses &&
                    user?.data?.addresses?.length > 0
                  ) {
                    if (
                      user?.data?.paymentMethods &&
                      user?.data?.paymentMethods?.length > 0
                    ) {
                      if (cartItems?.length > 0) {
                        navigate("/checkout");
                      } else {
                        toast("Please add items to cart");
                      }
                    } else {
                      setIsCardModalOpen(true);
                    }
                  } else {
                    setIsAddressModalOpen(true);
                  }
                }}
                disabled={isShippingLoading}
                className="py-4 px-9 bg-purple-500 text-white rounded-lg font-bold w-full"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      <Modal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        title="Add New Address"
      >
        <form onSubmit={handleAddressSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Street Address
            </label>
            <input
              required
              type="text"
              value={addressForm.address}
              onChange={(e) =>
                setAddressForm({ ...addressForm, address: e.target.value })
              }
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="123 Luxury Lane"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                City
              </label>
              <input
                required
                type="text"
                value={addressForm.city}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, city: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="New York"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                State
              </label>
              <input
                required
                type="text"
                value={addressForm.state}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, state: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="NY"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors mt-4"
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
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Cardholder Name
            </label>
            <input
              required
              type="text"
              value={cardForm.name}
              onChange={(e) =>
                setCardForm({ ...cardForm, name: e.target.value })
              }
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Card Number
            </label>
            <input
              required
              type="text"
              value={cardForm.number}
              onChange={(e) =>
                setCardForm({ ...cardForm, number: e.target.value })
              }
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="0000 0000 0000 0000"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Expiry
              </label>
              <input
                required
                type="text"
                value={cardForm.expiry}
                onChange={(e) =>
                  setCardForm({ ...cardForm, expiry: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="MM/YY"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                CVV
              </label>
              <input
                required
                type="text"
                value={cardForm.cvv}
                onChange={(e) =>
                  setCardForm({ ...cardForm, cvv: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="123"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors mt-4"
          >
            Save Card
          </button>
        </form>
      </Modal>
    </div>
  );
}

export default Cart;
