import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProduct, reset } from "../features/products/productSlice";
import { addToCart } from "../features/cart/cartSlice";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import { HiArrowLeft, HiOutlineShoppingBag } from "react-icons/hi";

function ProductDetail() {
  const { code } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [quantity, setQuantity] = useState(1);

  const { product, isLoading, isError, message } = useSelector(
    (state) => state.products
  );
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getProduct(code));
    return () => {
      dispatch(reset());
    };
  }, [dispatch, code]);

  const handleAddToCart = () => {
    if (!user) {
      toast.info("Please login to add to cart");
      navigate("/login");
      return;
    }

    // Adding multiple times if quantity > 1 (Simple implementation for now)
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart({ email: user.data.email, item: product }));
    }
    toast.success(`${product.name || product.title} added to cart!`);
  };

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  if (isError)
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        {message}
      </div>
    );
  if (!product) return null;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-black transition-colors mb-8"
        >
          <HiArrowLeft className="mr-2" /> Back to Catalog
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image Section */}
          <div className="bg-gray-50 rounded-2xl p-8 flex items-center justify-center border border-gray-100 shadow-sm">
            <img
              src={product.image}
              alt={product.name || product.title}
              className="max-h-[500px] object-contain hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Details Section */}
          <div className="flex flex-col">
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {product.name || product.title}
              </h1>
              <p className="text-sm text-purple-600 font-medium tracking-wide uppercase">
                {product.color
                  ? `${product.color} Edition`
                  : "Premium Collection"}
              </p>
            </div>

            <div className="mb-8 border-b border-gray-100 pb-6">
              <div className="flex items-baseline gap-4">
                <span className="text-3xl font-bold text-gray-900">
                  ${product.price}
                </span>
                <span className="text-lg text-gray-400 line-through">
                  ${(product.price * 1.5).toFixed(2)}
                </span>
                <span className="text-sm font-bold text-red-500 bg-red-50 px-2 py-1 rounded">
                  SAVE 33%
                </span>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-sm font-bold text-gray-900 uppercase mb-4">
                Description
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Experience excellence with our {product.name}. Designed for
                style and performance, this piece features high-quality
                materials and a sleek finish. Perfect for everyday use or
                special occasions.
              </p>
            </div>

            <div className="flex flex-col gap-4 mt-auto">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-50 transition"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-semibold min-w-[40px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-gray-50 transition"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition transform active:scale-[0.98]"
              >
                <HiOutlineShoppingBag className="text-xl" />
                Add to Bag
              </button>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">
                  Shipping
                </p>
                <p className="text-sm font-medium">Free Express Delivery</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">
                  Returns
                </p>
                <p className="text-sm font-medium">30-Day Guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Centralized ToastContainer in Header */}
    </div>
  );
}

export default ProductDetail;
