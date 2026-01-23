// ... keep existing imports
import React, { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BsFilterLeft, BsX } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../features/products/productSlice";
import Product from "../components/Product";
import ProductSkeleton from "../components/ProductSkeleton";
import Pagination from "../components/Pagination"; // Import Pagination
import { FaGem } from "react-icons/fa";

function Catalog() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";

  const [sortBy, setSortBy] = React.useState("title-ascending");
  const [activeCategory, setActiveCategory] = React.useState(initialCategory);
  const [currentPage, setCurrentPage] = React.useState(1); // Added currentPage
  const [itemsPerPage] = React.useState(12); // Added itemsPerPage, fixed to 12
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);

  const { products, isError, message, isLoading } = useSelector(
    (state) => state.products,
  );

  const { cart } = useSelector((state) => {
    return state.cart;
  });

  useEffect(() => {
    // Scroll to top on page change
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  // Luxury handbag categories
  const categories = [
    "All",
    "Hermès",
    "Chanel",
    "Louis Vuitton",
    "Gucci",
    "Dior",
  ];

  const filteredAndSortedProducts = React.useMemo(() => {
    if (!products?.data) return [];

    let items = [...products.data];

    // Category Filter
    if (activeCategory !== "All") {
      items = items.filter(
        (product) =>
          (product.category || product.categoryName || "").toLowerCase() ===
          activeCategory.toLowerCase(),
      );
    }

    // Sort
    if (sortBy === "title-ascending" || sortBy === "manual") {
      items.sort((a, b) =>
        (a.name || a.title || "").localeCompare(b.name || b.title || ""),
      );
    } else if (sortBy === "title-descending") {
      items.sort((a, b) =>
        (b.name || b.title || "").localeCompare(a.name || a.title || ""),
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

  // Reset page when category or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, sortBy]);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredAndSortedProducts.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-noir-900 py-12 px-4">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-0 w-72 h-72 bg-gold-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto w-full relative z-10">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <FaGem className="text-gold-500" />
            <span className="text-gold-500 text-sm font-bold uppercase tracking-widest">
              The Collection
            </span>
          </div>
          <h1 className="font-display text-4xl font-bold text-champagne-100">
            Luxury Handbags
          </h1>
        </div>

        {/* Filters Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10 w-full">
          <div className="flex items-center gap-4">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-6 py-3 bg-noir-800 border border-gold-500/20 rounded-2xl hover:border-gold-500/40 transition font-bold text-champagne-200"
            >
              <BsFilterLeft className="text-2xl text-gold-500" />
              <span>Filter</span>
            </button>

            {/* Desktop Category Pills */}
            <div className="hidden lg:flex items-center gap-2 bg-noir-800/50 p-1.5 rounded-xl border border-gold-500/10">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    activeCategory === cat
                      ? "bg-gradient-to-r from-gold-500 to-gold-600 text-noir-900 shadow-sm"
                      : "text-champagne-400 hover:text-gold-500"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Sort & Results Count */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="text-gold-500/70 font-bold text-[10px] uppercase tracking-widest">
                Sort by
              </span>
              <select
                name="sort_by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gold-500/20 rounded-xl bg-noir-800 text-champagne-100 font-bold text-sm focus:outline-none focus:border-gold-500 transition-all cursor-pointer"
              >
                <option value="manual">Featured</option>
                <option value="title-ascending">Alphabetically, A-Z</option>
                <option value="title-descending">Alphabetically, Z-A</option>
                <option value="price-ascending">Price, low to high</option>
                <option value="price-descending">Price, high to low</option>
              </select>
            </div>
            <p className="text-gold-500/70 font-bold text-[10px] uppercase tracking-widest sm:border-l sm:pl-4 sm:ml-4 border-gold-500/20">
              {filteredAndSortedProducts.length} Pieces
            </p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="w-full py-8">
          <div className="w-full grid grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {isLoading && (
              <>
                {[...Array(6)].map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </>
            )}
            {isError && <span className="text-rosegold-500">{message}</span>}
            {!isLoading && !isError && currentProducts.length > 0
              ? currentProducts.map((product) => (
                  <Product
                    key={product._id || product.id}
                    product={product}
                    cart={cart}
                  />
                ))
              : !isLoading &&
                !isError && (
                  <span className="text-lg text-champagne-400 text-center col-span-full">
                    No handbags found <br />
                    <Link
                      to="/catalog"
                      className="text-gold-500 hover:underline"
                    >
                      View all collection
                    </Link>
                  </span>
                )}
          </div>

          {/* Pagination */}
          {!isLoading && !isError && filteredAndSortedProducts.length > 0 && (
            <div className="mt-12">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Sidebar */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsFilterOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-noir-900 border-t border-gold-500/20 rounded-t-[40px] p-10 transform transition-transform animate-slide-up">
            <div className="flex justify-between items-center mb-10">
              <h3 className="font-display text-2xl font-bold text-champagne-100">
                Maisons
              </h3>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="p-2 bg-noir-800 border border-gold-500/20 rounded-full text-champagne-400 hover:text-gold-500 transition"
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
                      ? "bg-gradient-to-r from-gold-500 to-gold-600 text-noir-900 shadow-lg shadow-gold-500/20"
                      : "bg-noir-800 text-champagne-400 border border-gold-500/10 hover:border-gold-500/30"
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
