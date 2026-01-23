import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProduct, reset } from "../features/products/productSlice";
import { addToCart } from "../features/cart/cartSlice";
import Loader from "../components/Loader";
import { useToast } from "../context/ToastContext";
import { formatPrice } from "../utils/formatPrice";
import { HiArrowLeft, HiOutlineShoppingBag } from "react-icons/hi";

function ProductDetail() {
  const { code } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();

  const [quantity, setQuantity] = useState(1);

  const { product, isLoading, isError, message } = useSelector(
    (state) => state.products,
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
      // Use logic to determine real price
      const finalPrice = product.salePrice || product.price;
      const productToAdd = { ...product, price: finalPrice };
      dispatch(addToCart({ email: user.data.email, item: productToAdd }));
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
    <div className="min-h-screen bg-noir-900 text-champagne-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-champagne-400 hover:text-gold-500 transition-colors mb-8 group"
        >
          <HiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Collection
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Image Section */}
          <div className="relative group animate-fade-in-up">
            <div className="absolute inset-0 bg-gold-500/5 rounded-3xl blur-2xl transform rotate-3 group-hover:rotate-0 transition-transform duration-700"></div>
            <div className="relative bg-noir-800/50 rounded-3xl p-10 border border-gold-500/10 flex items-center justify-center h-[500px] lg:h-[600px] hover:border-gold-500/30 transition-all shadow-2xl shadow-black/50">
              <img
                src={product.image}
                alt={product.name || product.title}
                className="max-h-full max-w-full object-contain drop-shadow-2xl transform group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-gold-500/20 rounded-tl-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-gold-500/20 rounded-br-3xl pointer-events-none"></div>
          </div>

          {/* Details Section */}
          <div className="flex flex-col justify-center animate-fade-in-up delay-[100ms]">
            <div className="mb-8">
              <span className="inline-block px-3 py-1 bg-gold-500/10 border border-gold-500/20 rounded-full text-gold-500 text-xs font-bold tracking-widest uppercase mb-4">
                {product.category || "Authentic Luxury"}
              </span>
              <h1 className="font-display text-4xl lg:text-5xl font-bold text-champagne-100 mb-4 leading-tight">
                {product.name || product.title}
              </h1>
              <p className="text-sm text-champagne-400/80 font-medium tracking-wide uppercase flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-gold-500"></span>
                {product.color
                  ? `${product.color} Edition`
                  : "Premium Collection"}
              </p>
            </div>

            <div className="mb-8 p-6 bg-noir-800/30 rounded-2xl border border-gold-500/10 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-champagne-500 text-sm mb-1 uppercase tracking-widest">
                  Price
                </span>
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl font-sans font-bold text-gold-400">
                    ${formatPrice(product.salePrice || product.price)}
                  </span>
                  {product.salePrice && (
                    <span className="text-lg text-champagne-500/50 line-through decoration-gold-500/30">
                      ${formatPrice(product.price)}
                    </span>
                  )}
                  {!product.salePrice && (
                    <span className="text-lg text-champagne-500/50 line-through decoration-gold-500/30">
                      ${formatPrice(product.price * 1.5)}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <span className="inline-block px-3 py-1 bg-rosegold-500/10 text-rosegold-400 border border-rosegold-500/20 rounded-lg text-xs font-bold uppercase tracking-wider">
                  Limited Availability
                </span>
              </div>
            </div>

            <div className="mb-10">
              <h3 className="text-xs font-bold text-gold-500 uppercase tracking-widest mb-4">
                Craftsmanship Details
              </h3>
              <p className="text-champagne-300/80 leading-relaxed font-light text-lg">
                Experience excellence with our {product.name}. Designed for
                style and performance, this piece features high-quality
                materials and a sleek finish. Verified by our expert team for
                100% authenticity.
              </p>
            </div>

            <div className="flex flex-col gap-6 mt-auto">
              <div className="flex items-center gap-6">
                {/* Quantity Control */}
                <div className="flex items-center bg-noir-800 rounded-xl border border-gold-500/20">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center text-champagne-400 hover:text-gold-500 transition border-r border-gold-500/10"
                  >
                    -
                  </button>
                  <span className="w-14 text-center font-bold text-champagne-100">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center text-champagne-400 hover:text-gold-500 transition border-l border-gold-500/10"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-champagne-500">
                  Select Quantity
                </span>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full bg-gradient-to-r from-gold-500 to-gold-600 text-noir-900 py-5 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:from-gold-400 hover:to-gold-500 transition-all shadow-lg shadow-gold-500/20 transform hover:-translate-y-1 active:scale-[0.98]"
              >
                <HiOutlineShoppingBag className="text-2xl" />
                Add to Collection
              </button>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4">
              <div className="p-4 bg-noir-800/30 rounded-xl border border-gold-500/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-gold-500/70 uppercase">
                    Authenticity
                  </p>
                  <p className="text-sm font-medium text-champagne-200">
                    Guaranteed 100%
                  </p>
                </div>
              </div>
              <div className="p-4 bg-noir-800/30 rounded-xl border border-gold-500/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-gold-500/70 uppercase">
                    Shipping
                  </p>
                  <p className="text-sm font-medium text-champagne-200">
                    Express Available
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
