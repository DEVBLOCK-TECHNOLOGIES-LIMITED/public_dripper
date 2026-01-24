import React from "react";
import TrendingProducts from "../components/TrendingProducts";
import { Link } from "react-router-dom";
import heroImg from "../assets/hero.png";
import {
  HiOutlineArrowRight,
  HiOutlineLightningBolt,
  HiOutlineShieldCheck,
  HiOutlineTruck,
} from "react-icons/hi";
import { FaGem } from "react-icons/fa";

function Dashboard() {
  return (
    <div className="bg-noir-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-noir-900 py-16 lg:py-24">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 -left-20 w-72 h-72 bg-gold-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
            {/* Text Content - appears second on mobile, first on desktop */}
            <div className="mt-10 lg:mt-0">
              <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-500 text-sm font-bold tracking-wider uppercase mb-6">
                <FaGem className="text-xs" />
                New Arrivals
              </span>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold text-champagne-100 leading-tight mb-6">
                Timeless <br />
                <span className="text-gold-gradient">Luxury Bags.</span>
              </h1>
              <p className="text-xl text-champagne-400 mb-10 max-w-lg leading-relaxed">
                Discover authenticated pre-owned designer handbags from the
                world’s most iconic luxury houses. Curated in limited
                quantities, each piece selected for quality, craftsmanship, and
                enduring style.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/catalog"
                  className="bg-gradient-to-r from-gold-500 to-gold-600 text-noir-900 px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:from-gold-400 hover:to-gold-500 transition-all transform hover:-translate-y-1 shadow-lg shadow-gold-500/20"
                >
                  Explore Collection <HiOutlineArrowRight className="text-xl" />
                </Link>
                <Link
                  to="/catalog"
                  className="bg-transparent text-gold-500 border-2 border-gold-500/50 px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gold-500/10 hover:border-gold-500 transition-all"
                >
                  View All Bags
                </Link>
              </div>
            </div>
            {/* Hero Image - appears first on mobile, second on desktop */}
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-64 h-64 bg-gold-500/10 rounded-full mix-blend-normal filter blur-3xl opacity-50 animate-blob"></div>
              <div className="absolute bottom-10 right-10 w-64 h-64 bg-rosegold-500/10 rounded-full mix-blend-normal filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
              <div className="relative z-10 p-6 bg-gradient-to-br from-gold-500/10 via-champagne-100/5 to-transparent rounded-3xl border border-gold-500/30 shadow-2xl shadow-gold-500/10">
                <img
                  src={heroImg}
                  alt="Luxury Handbags Collection - Hermès Birkin, Chanel, Louis Vuitton"
                  className="w-full rounded-2xl shadow-xl transform hover:scale-[1.02] transition-transform duration-700"
                />
                {/* Elegant frame accent */}
                <div className="absolute inset-0 rounded-3xl border border-gold-500/20 pointer-events-none"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-noir-800/50 py-12 border-y border-gold-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4 p-6 rounded-2xl bg-noir-800/50 border border-gold-500/10 hover:border-gold-500/30 transition group">
              <div className="w-12 h-12 bg-noir-700 rounded-xl shadow-sm flex items-center justify-center text-gold-500 text-2xl group-hover:bg-gold-500 group-hover:text-noir-900 transition-colors">
                <HiOutlineShieldCheck />
              </div>
              <div>
                <h3 className="font-bold text-champagne-100">
                  100% Authenticated
                </h3>
                <p className="text-sm text-champagne-500">Expert verified</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 rounded-2xl bg-noir-800/50 border border-gold-500/10 hover:border-gold-500/30 transition group">
              <div className="w-12 h-12 bg-noir-700 rounded-xl shadow-sm flex items-center justify-center text-gold-500 text-2xl group-hover:bg-gold-500 group-hover:text-noir-900 transition-colors">
                <HiOutlineTruck />
              </div>
              <div>
                <h3 className="font-bold text-champagne-100">
                  White Glove Delivery
                </h3>
                <p className="text-sm text-champagne-500">Insured shipping</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 rounded-2xl bg-noir-800/50 border border-gold-500/10 hover:border-gold-500/30 transition group">
              <div className="w-12 h-12 bg-noir-700 rounded-xl shadow-sm flex items-center justify-center text-gold-500 text-2xl group-hover:bg-gold-500 group-hover:text-noir-900 transition-colors">
                <HiOutlineLightningBolt />
              </div>
              <div>
                <h3 className="font-bold text-champagne-100">VIP Concierge</h3>
                <p className="text-sm text-champagne-500">24/7 support</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories / Luxury Brands */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-display text-3xl font-bold text-champagne-100 mb-2">
                Maison Collection
              </h2>
              <p className="text-champagne-500">
                Explore by your favorite luxury house.
              </p>
            </div>
            <Link
              to="/catalog"
              className="text-gold-500 font-bold hover:underline decoration-gold-500"
            >
              View All
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Hermès", letter: "H" },
              { name: "Chanel", letter: "C" },
              { name: "Louis Vuitton", letter: "LV" },
              { name: "Gucci", letter: "G" },
            ].map((brand, i) => (
              <Link
                key={i}
                to={`/catalog?category=${brand.name}`}
                className="group relative h-64 rounded-2xl overflow-hidden border border-gold-500/20 hover:border-gold-500/50 transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-noir-900 via-noir-900/80 to-noir-800 z-10 transition-opacity group-hover:opacity-90"></div>
                <div className="absolute bottom-6 left-6 z-20">
                  <h3 className="text-champagne-100 font-display font-bold text-xl">
                    {brand.name}
                  </h3>
                  <span className="text-gold-500 text-sm flex items-center gap-1 group-hover:gap-2 transition-all font-bold">
                    Explore <HiOutlineArrowRight />
                  </span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-full bg-noir-800 flex items-center justify-center">
                    <span className="font-display text-6xl font-bold text-gold-500/20 group-hover:text-gold-500/30 group-hover:scale-110 transition-all duration-500">
                      {brand.letter}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Exclusive Product Offer Banner */}
      <section className="py-16 bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NCAwLTE4IDguMDYtMTggMThzOC4wNiAxOCAxOCAxOCAxOC04LjA2IDE4LTE4LTguMDYtMTgtMTgtMTh6bTAgMzJjLTcuNzMyIDAtMTQtNi4yNjgtMTQtMTRzNi4yNjgtMTQgMTQtMTQgMTQgNi4yNjggMTQgMTQtNi4yNjggMTQtMTQgMTR6IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')] opacity-30"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-noir-900/20 backdrop-blur-sm px-4 py-2 rounded-full text-noir-900 text-sm font-bold mb-4">
                <span className="w-2 h-2 bg-noir-900 rounded-full animate-pulse"></span>
                Exclusive Offer
              </div>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-noir-900 mb-3">
                Experience True{" "}
                <span className="underline decoration-wavy decoration-noir-900/50">
                  Luxury
                </span>{" "}
                Today!
              </h2>
              <p className="text-noir-900/80 text-lg max-w-xl font-medium">
                Shop our curated collection of rare and authenticated pieces.
                Elevate your style with timeless elegance.
              </p>
            </div>
            <Link
              to="/catalog"
              className="flex items-center gap-3 bg-noir-900 text-gold-500 px-8 py-4 rounded-2xl font-black text-lg hover:bg-noir-800 transition-all shadow-2xl shadow-noir-900/30 hover:-translate-y-1"
            >
              <FaGem className="text-2xl" />
              Shop Now
              <HiOutlineArrowRight className="text-xl" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-noir-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold text-champagne-100 mb-4">
              Just Arrived
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-gold-500 to-gold-400 mx-auto rounded-full"></div>
          </div>
          <TrendingProducts />
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
