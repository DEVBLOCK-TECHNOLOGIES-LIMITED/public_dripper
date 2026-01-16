import React, { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BsFilterLeft, BsX } from "react-icons/bs";
import { HiOutlineArrowRight } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../features/products/productSlice";
import Product from "../components/Product";
import ProductSkeleton from "../components/ProductSkeleton";

function Catalog() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";

  const [sortBy, setSortBy] = React.useState("title-ascending");
  const [activeCategory, setActiveCategory] = React.useState(initialCategory);
  const [visibleProducts, setVisibleProducts] = React.useState(6);
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);

  const { products, isError, message, isLoading } = useSelector(
    (state) => state.products
  );

  const { cart } = useSelector((state) => {
    return state.cart;
  });
  // Calculate items per row based on screen size
  const getItemsPerRow = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth >= 1024) return 3; // lg and up
      if (window.innerWidth >= 640) return 2; // sm and up
      return 2; // mobile
    }
    return 3;
  };

  // Calculate how many products to show initially
  const getInitialVisibleCount = () => {
    return getItemsPerRow() * 4; // Show 4 rows initially
  };

  useEffect(() => {
    setVisibleProducts(getInitialVisibleCount());
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const categories = [
    "All",
    "Smartphones",
    "Apparel",
    "Accessories",
    "Footwear",
  ];

  const filteredAndSortedProducts = React.useMemo(() => {
    if (!products?.data) return [];

    let items = [...products.data];

    // Category Filter
    if (activeCategory !== "All") {
      items = items.filter(
        (product) =>
          (product.category || product.categoryName || "").toLowerCase() ===
          activeCategory.toLowerCase()
      );
    }

    // Sort
    if (sortBy === "title-ascending" || sortBy === "manual") {
      items.sort((a, b) =>
        (a.name || a.title || "").localeCompare(b.name || b.title || "")
      );
    } else if (sortBy === "title-descending") {
      items.sort((a, b) =>
        (b.name || b.title || "").localeCompare(a.name || a.title || "")
      );
    } else if (sortBy === "price-ascending") {
      items.sort((a, b) => parseFloat(a.price || 0) - parseFloat(b.price || 0));
    } else if (sortBy === "price-descending") {
      items.sort((a, b) => parseFloat(b.price || 0) - parseFloat(a.price || 0));
    } else if (sortBy === "created-ascending") {
      items.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === "created-descending") {
      items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return items;
  }, [products?.data, sortBy, activeCategory]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto w-full">
        <div className="product-header text-3xl font-bold text-gray-900 mb-8">
          Products
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10 w-full">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm hover:bg-gray-50 transition font-bold"
            >
              <BsFilterLeft className="text-2xl text-purple-600" />
              <span>Filter</span>
            </button>
            <div className="hidden lg:flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    activeCategory === cat
                      ? "bg-white text-purple-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">
                Sort by
              </span>
              <select
                name="sort_by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-2xl bg-white text-gray-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all cursor-pointer shadow-sm"
              >
                <option value="manual">Featured</option>
                <option value="title-ascending">Alphabetically, A-Z</option>
                <option value="title-descending">Alphabetically, Z-A</option>
                <option value="price-ascending">Price, low to high</option>
                <option value="price-descending">Price, high to low</option>
              </select>
            </div>
            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest sm:border-l sm:pl-4 sm:ml-4 border-gray-200">
              {filteredAndSortedProducts.length} Results
            </p>
          </div>
        </div>
        <div className="w-full py-8">
          <div className="w-full grid grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {isLoading && (
              <>
                {[...Array(6)].map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </>
            )}
            {isError && <span className="text-red-500">{message}</span>}
            {!isLoading && !isError && filteredAndSortedProducts.length > 0
              ? filteredAndSortedProducts
                  .slice(0, visibleProducts)
                  .map((product) => (
                    <Product
                      key={product._id || product.id}
                      product={product}
                      cart={cart}
                    />
                  ))
              : !isLoading &&
                !isError && (
                  <span className="text-lg text-gray-700 text-center col-span-full">
                    No products found <br /> Use fewer filters or{" "}
                    <Link
                      to="/catalog"
                      className="text-purple-600 hover:underline"
                    >
                      remove all
                    </Link>
                  </span>
                )}
          </div>
          {!isLoading &&
            !isError &&
            filteredAndSortedProducts &&
            visibleProducts < filteredAndSortedProducts.length && (
              <button
                onClick={() =>
                  setVisibleProducts(visibleProducts + getItemsPerRow() * 2)
                }
                className="mt-12 px-10 py-4 bg-black text-white font-black rounded-2xl hover:bg-gray-800 transition-all transform active:scale-95 shadow-2xl shadow-black/10 flex items-center justify-center gap-2"
              >
                Show More Results <HiOutlineArrowRight />
              </button>
            )}
        </div>
      </div>

      {/* Mobile Filter Sidebar */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsFilterOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[40px] p-10 transform transition-transform animate-slide-up">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black">Categories</h3>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="p-2 bg-gray-100 rounded-full"
              >
                <BsX className="text-3xl" />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setIsFilterOpen(false);
                  }}
                  className={`w-full text-left py-4 px-6 rounded-2xl font-bold transition-all ${
                    activeCategory === cat
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-200"
                      : "bg-gray-50 text-gray-500"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Catalog;
