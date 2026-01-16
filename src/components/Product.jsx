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
    <div className="flex flex-col items-center justify-between w-full h-full p-4 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group">
      <div className="flex justify-between items-center w-full">
        <Link
          to={`/product/${product.code}`}
          className="hover:text-purple-600 transition-colors"
        >
          <h3 className="text-[12px] font-semibold text-gray-900">
            {product.name || product.title}
          </h3>
        </Link>
        <span className="px-1 bg-red-500 rounded-lg text-white font-bold text-xs">
          -50%
        </span>
      </div>
      <Link
        to={`/product/${product.code}`}
        className="flex flex-col items-center border-t border-b border-gray-200 w-full p-3 hover:opacity-80 transition-opacity"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 sm:h-64 object-contain transition-transform duration-500 group-hover:scale-110"
        />
      </Link>
      <div className="flex justify-between items-center w-full mt-3">
        <span className="text-gray-500 line-through text-sm ml-2">
          ${product.price}
        </span>
        {quantity > 0 ? (
          <div className="flex items-center gap-2 ">
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
        ) : (
          <button
            onClick={handleAddToCart}
            disabled={isCurrentlyAdding}
            className="bg-black text-white p-2  rounded-xl text-xs font-bold hover:bg-gray-800 transition active:scale-95 disabled:opacity-50"
          >
            {isCurrentlyAdding ? <Loader size="sm" /> : "Add to Cart"}
          </button>
        )}
      </div>

      {/* Removed local ToastContainer for central management in Header */}
    </div>
  );
}

export default Product;
