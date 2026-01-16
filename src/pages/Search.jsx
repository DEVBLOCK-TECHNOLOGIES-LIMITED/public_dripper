import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { filterBySearch } from "../features/products/productSlice";
import { Link } from "react-router-dom";
import Product from "../components/Product";

function Search() {
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { filteredProducts, products } = useSelector((state) => state.products);

  useEffect(() => {
    if (search.trim()) {
      dispatch(filterBySearch(search));
    }
  }, [search, dispatch]);

  const onChange = (e) => {
    setSearch(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Search Our Shop
        </h1>

        <div className="w-full max-w-2xl relative mb-12">
          <input
            className="w-full p-4 pl-6 pr-14 text-lg border-2 border-transparent rounded-2xl bg-white shadow-xl focus:outline-none focus:border-purple-500 transition-all duration-300"
            type="text"
            value={search}
            onChange={onChange}
            placeholder="Search by name or product code (e.g. 'Iphone')"
          />
          <FaSearch className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
        </div>

        {search.trim() && (
          <div className="w-full">
            <p className="text-gray-500 mb-8 text-center">
              Found {filteredProducts.length} results for "{search}"
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Product key={product._id} product={product} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                <p className="text-xl text-gray-400 font-medium">
                  No matches found. Try a different term.
                </p>
              </div>
            )}
          </div>
        )}

        {!search.trim() && (
          <div className="text-center py-32 opacity-50 grayscale">
            <FaSearch className="text-9xl mx-auto mb-6 text-gray-200" />
            <p className="text-xl text-gray-400 font-medium italic">
              What are you looking for today?
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
