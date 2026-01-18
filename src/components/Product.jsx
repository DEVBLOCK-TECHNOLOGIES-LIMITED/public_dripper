import { Link } from "react-router-dom";

function Product({ product }) {
  return (
    <div className="flex flex-col items-center justify-between w-full h-full min-h-[320px] p-4 bg-noir-900 border border-gold-500/20 rounded-lg shadow-lg hover:shadow-2xl hover:shadow-gold-500/10 hover:-translate-y-2 hover:border-gold-500/40 transition-all duration-500 relative group overflow-hidden">
      {/* Luxury glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

      {/* Header Row */}
      <div className="flex justify-between items-center w-full relative z-10 mb-2">
        <Link
          to={`/product/${product.code}`}
          className="hover:text-gold-400 transition-colors flex-1"
        >
          <h3 className="text-sm font-bold text-gold-500 group-hover:text-gold-400 transition-colors leading-tight line-clamp-1">
            {product.name || product.title}
          </h3>
        </Link>
        <span className="px-2 py-0.5 bg-rosegold-500 rounded-lg text-white font-bold text-[10px] uppercase tracking-wide shrink-0 ml-2">
          -50%
        </span>
      </div>

      {/* Image Container */}
      <Link
        to={`/product/${product.code}`}
        className="flex flex-col items-center w-full my-auto transition-opacity relative z-10 group-img"
      >
        <div className="relative overflow-hidden rounded-xl w-full aspect-[4/5] bg-noir-800/30 flex items-center justify-center group-hover:bg-noir-800/50 transition-all">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain p-4 transition-all duration-700 group-hover:scale-110"
          />
          {/* Subtle shine effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
      </Link>

      {/* Footer Row */}
      <div className="flex flex-col w-full mt-3 relative z-10">
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-display font-bold text-champagne-100">
            ${product.price}
          </span>
          <span className="text-xs text-champagne-500/50 line-through decoration-gold-500/30">
            ${(product.price * 2).toFixed(2)}
          </span>
        </div>
        <p className="text-[10px] text-gold-500/80 uppercase tracking-widest font-bold mt-1">
          In Stock
        </p>
      </div>
    </div>
  );
}

export default Product;
