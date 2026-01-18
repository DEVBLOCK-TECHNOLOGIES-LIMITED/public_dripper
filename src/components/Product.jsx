import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart, reset } from "../features/cart/cartSlice";
import { Link } from "react-router-dom";
import Loader from "./Loader";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Product({ product }) {
  const [isCurrentlyAdding, setIsCurrentlyAdding] = useState(false);
  const [isCurrentlyRemoving, setIsCurrentlyRemoving] = useState(false);
  const [cartItem, setCartItem] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      if (cartItem && cartItem.length > 0) {
        setQuantity(cartItem?.length);
      } else {
        setQuantity(0);
      }
    }
  }, [cartItem, user]);

  useEffect(() => {
    const cartItems = user?.data?.cart || [];
    const foundItems = cartItems.filter((item) => item.code === product.code);
    setCartItem(foundItems);
  }, [user, product]);

  const handleAddToCart = () => {
    if (!user || !user.data?.email) {
      setIsCurrentlyAdding(false);
      toast.info("Please log in to add items to your cart.");
      navigate("/login");
    }
    setIsCurrentlyAdding(true);
    dispatch(addToCart({ email: user.data.email, item: product }))
      .unwrap()
      .finally(() => {
        setIsCurrentlyAdding(false);
      });
    dispatch(reset());
    return;
  };

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
    <div className="flex flex-col items-center justify-between w-full h-full p-4 bg-noir-900 border border-gold-500/20 rounded-3xl shadow-lg hover:shadow-2xl hover:shadow-gold-500/10 hover:-translate-y-2 hover:border-gold-500/40 transition-all duration-500 relative group overflow-hidden">
      {/* Luxury glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

      {/* Header Row */}
      <div className="flex justify-between items-center w-full relative z-10">
        <Link
          to={`/product/${product.code}`}
          className="hover:text-gold-400 transition-colors flex-1"
        >
          <h3 className="text-sm font-bold text-gold-500 group-hover:text-gold-400 transition-colors leading-tight">
            {product.name || product.title}
          </h3>
        </Link>
        <span className="px-2 py-0.5 bg-rosegold-500 rounded-lg text-white font-bold text-[10px] uppercase tracking-wide">
          -50%
        </span>
      </div>

      {/* Image Container */}
      <Link
        to={`/product/${product.code}`}
        className="flex flex-col items-center border-t border-b border-gold-500/10 w-full p-4 my-3 hover:opacity-90 transition-opacity relative z-10"
      >
        <div className="relative overflow-hidden rounded-xl">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 sm:h-64 object-contain transition-all duration-700 group-hover:scale-110"
          />
          {/* Subtle shine effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
      </Link>

      {/* Footer Row */}
      <div className="flex justify-between items-center w-full mt-2 relative z-10">
        <span className="text-champagne-500 line-through text-sm font-medium">
          ${product.price}
        </span>
        {quantity > 0 ? (
          <div className="flex items-center gap-2">
            <button
              onClick={handleDecrement}
              disabled={isCurrentlyRemoving || quantity === 0}
              className="p-2 h-8 w-8 bg-noir-700 border border-gold-500/30 rounded-full text-gold-500 text-sm hover:bg-gold-500 hover:text-noir-900 hover:border-gold-500 disabled:opacity-50 text-center flex items-center justify-center transition-all duration-300"
            >
              {isCurrentlyRemoving ? <Loader size="sm" /> : "-"}
            </button>
            <span className="font-bold text-gold-500 min-w-[20px] text-center">
              {quantity}
            </span>
            <button
              onClick={handleIncrement}
              disabled={isCurrentlyAdding}
              className="p-2 h-8 w-8 bg-noir-700 border border-gold-500/30 rounded-full text-gold-500 text-sm hover:bg-gold-500 hover:text-noir-900 hover:border-gold-500 disabled:opacity-50 text-center flex items-center justify-center transition-all duration-300"
            >
              {isCurrentlyAdding ? <Loader size="sm" /> : "+"}
            </button>
          </div>
        ) : (
          <button
            onClick={handleAddToCart}
            disabled={isCurrentlyAdding}
            className="bg-gradient-to-r from-gold-500 to-gold-600 text-noir-900 px-4 py-2 rounded-xl text-xs font-bold hover:from-gold-400 hover:to-gold-500 transition-all duration-300 active:scale-95 disabled:opacity-50 shadow-lg shadow-gold-500/20 hover:shadow-gold-500/40"
          >
            {isCurrentlyAdding ? <Loader size="sm" /> : "Add to Cart"}
          </button>
        )}
      </div>
    </div>
  );
}

export default Product;
