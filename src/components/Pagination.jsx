import React from "react";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}) => {
  if (totalPages <= 1) return null;

  const pages = [];
  // Simple pagination logic: show all pages if small number, otherwise could be complex
  // For this v1, we'll just show all pages or a simple range if needed.
  // Given we are doing client side pagination and likely < 10 pages for luxury items, showing all is standard.
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className={`flex justify-center items-center gap-2 ${className}`}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-3 rounded-xl border border-gold-500/20 text-champagne-400 hover:text-gold-500 hover:border-gold-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gold-500/20 disabled:hover:text-champagne-400 transition-all"
        aria-label="Previous Page"
      >
        <HiOutlineChevronLeft size={20} />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 rounded-xl font-bold flex items-center justify-center transition-all ${
            currentPage === page
              ? "bg-gradient-to-r from-gold-500 to-gold-600 text-noir-900 shadow-lg shadow-gold-500/20"
              : "border border-gold-500/20 text-champagne-400 hover:border-gold-500/50 hover:text-gold-500"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-3 rounded-xl border border-gold-500/20 text-champagne-400 hover:text-gold-500 hover:border-gold-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gold-500/20 disabled:hover:text-champagne-400 transition-all"
        aria-label="Next Page"
      >
        <HiOutlineChevronRight size={20} />
      </button>
    </div>
  );
};

export default Pagination;
