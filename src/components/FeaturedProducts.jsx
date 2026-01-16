import React from "react";
import { useSelector } from "react-redux";
import Product from "./Product";
import ProductSkeleton from "./ProductSkeleton";

function FeaturedProducts() {
  const { products, isLoading, isError } = useSelector(
    (state) => state.products
  );

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {isLoading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </>
        ) : (
          products.data
            ?.slice(0, 4)
            .map((product) => <Product key={product._id} product={product} />)
        )}
      </div>

      {isError && (
        <p className="text-center text-red-500 mt-4">
          Failed to load featured products.
        </p>
      )}
    </div>
  );
}

export default FeaturedProducts;
