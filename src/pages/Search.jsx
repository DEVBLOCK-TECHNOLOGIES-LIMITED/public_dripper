import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { filterBySearch } from "../features/products/productSlice";

import Product from "../components/Product";

function Search() {
  const [search, setSearch] = useState("");

  const dispatch = useDispatch();

  const { filteredProducts } = useSelector((state) => state.products);

  useEffect(() => {
    if (search.trim()) {
      dispatch(filterBySearch(search));
    }
  }, [search, dispatch]);

  const onChange = (e) => {
    setSearch(e.target.value);
  };

  return (
    <div className="min-h-screen bg-noir-900 py-12 px-4">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <h1 className="font-display text-4xl font-bold text-champagne-100 mb-8">
          Search the Collection
        </h1>

        <div className="w-full max-w-2xl relative mb-12">
          <input
            className="w-full p-6 pl-8 pr-16 text-lg rounded-2xl input-luxury shadow-xl focus:ring-1 focus:ring-gold-500/50"
            type="text"
            value={search}
            onChange={onChange}
            placeholder="Search by name or style code..."
          />
          <FaSearch className="absolute right-8 top-1/2 -translate-y-1/2 text-gold-500 text-xl" />
        </div>

        {search.trim() && (
          <div className="w-full">
            <p className="text-champagne-400 mb-8 text-center text-lg">
              Found{" "}
              <span className="text-gold-500 font-bold">
                {filteredProducts.length}
              </span>{" "}
              results for "
              <span className="italic text-champagne-200">{search}</span>"
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Product key={product._id} product={product} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-20 luxury-card rounded-3xl">
                <p className="text-xl text-champagne-400 font-medium">
                  No matches found. Try a different term.
                </p>
              </div>
            )}
          </div>
        )}

        {!search.trim() && (
          <div className="text-center py-32 opacity-70">
            <FaSearch className="text-8xl mx-auto mb-6 text-gold-500/20" />
            <p className="text-2xl text-champagne-500 font-display italic">
              What masterpiece are you looking for today?
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
