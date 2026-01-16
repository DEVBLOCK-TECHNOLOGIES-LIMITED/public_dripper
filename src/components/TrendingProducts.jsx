import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getTrendingProducts } from "../features/products/productSlice";
import Product from "./Product";
import ProductSkeleton from "./ProductSkeleton";

function TrendingProducts() {
  const dispatch = useDispatch();
  const { trendingProducts, isLoading, isError } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(getTrendingProducts());
  }, [dispatch]);

  if (isError) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 font-bold">Failed to load trending items</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {isLoading ? (
        <>
          {[...Array(4)].map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </>
      ) : (
        trendingProducts?.map((product) => (
          <Product key={product._id} product={product} />
        ))
      )}
    </div>
  );
}

export default TrendingProducts;
