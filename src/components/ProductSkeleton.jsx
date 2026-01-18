import React from "react";

function ProductSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center w-full p-3 border border-gray-100 rounded-lg animate-pulse gap-3">
      <div className="flex justify-between items-center w-full">
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
        <div className="h-4 w-8 bg-gray-200 rounded"></div>
      </div>
      <div className="w-full aspect-[4/5] bg-gray-100 rounded-lg"></div>
      <div className="flex justify-between items-center w-full">
        <div className="h-4 w-12 bg-gray-200 rounded"></div>
        <div className="h-8 w-24 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );
}

export default ProductSkeleton;
